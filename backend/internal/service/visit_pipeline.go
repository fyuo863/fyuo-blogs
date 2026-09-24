package service

import (
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"os"
	"regexp"
	"strconv"
	"strings"
	"sync"
	"sync/atomic"
	"time"

	"github.com/redis/go-redis/v9"
	"gorm.io/gorm"
	"myblog/internal/database"
	"myblog/log"
)

const visitStream = "blog:visits:v2"
const visitGroup = "postgres-v2"
const visitMaintenance = "blog:visits:maintenance"
const liveViewKey = "blog:views:v2:%d"

var ErrVisitFull = errors.New("visit queue full")
var ErrVisitRate = errors.New("visit rate exceeded")
var ErrVisitInvalid = errors.New("invalid visit event")
var Visits *VisitPipeline
var eventPattern = regexp.MustCompile(`^[0-9]{13}-[a-f0-9]{32}$`)

type VisitOptions struct {
	Workers, Batch, Capacity, Rate, IPRate, MaxRetries int
	Block, ClaimIdle, Backoff                          time.Duration
}

func DefaultVisitOptions() VisitOptions {
	return VisitOptions{2, 100, 50000, 60, 10000, 5, time.Second, 30 * time.Second, time.Second}
}
func VisitOptionsFromEnv() (VisitOptions, error) {
	o := DefaultVisitOptions()
	for name, p := range map[string]*int{"VISIT_WORKERS": &o.Workers, "VISIT_BATCH": &o.Batch, "VISIT_CAPACITY": &o.Capacity, "VISIT_RATE": &o.Rate, "VISIT_IP_RATE": &o.IPRate, "VISIT_MAX_RETRIES": &o.MaxRetries} {
		if v := os.Getenv(name); v != "" {
			n, e := strconv.Atoi(v)
			if e != nil || n < 1 || n > 1000000 {
				return o, fmt.Errorf("invalid %s", name)
			}
			*p = n
		}
	}
	for name, p := range map[string]*time.Duration{"VISIT_BLOCK": &o.Block, "VISIT_CLAIM_IDLE": &o.ClaimIdle, "VISIT_BACKOFF": &o.Backoff} {
		if v := os.Getenv(name); v != "" {
			d, e := time.ParseDuration(v)
			if e != nil || d < time.Millisecond || d > time.Minute {
				return o, fmt.Errorf("invalid %s", name)
			}
			*p = d
		}
	}
	if o.Workers > 16 || o.Batch > 1000 {
		return o, errors.New("visit workers/batch exceed safe bounds")
	}
	return o, nil
}

type visitRetryKey struct{}

type VisitEvent struct {
	EventID    string    `json:"event_id"`
	ArticleID  uint      `json:"article_id"`
	OccurredAt time.Time `json:"occurred_at"`
	VisitorID  string    `json:"visitor_id"`
	IPAddress  string    `json:"ip_address"`
}
type VisitReceipt struct {
	CountSnapshot
	EventID   string `json:"event_id"`
	Accepted  bool   `json:"accepted"`
	Duplicate bool   `json:"duplicate"`
	Persisted bool   `json:"persisted"`
}
type VisitPipeline struct {
	Options                                         VisitOptions
	wg                                              sync.WaitGroup
	Accepted, Duplicates, Persisted, Failures, Dead atomic.Uint64
	needsReconcile                                  atomic.Bool
}

func NewEventID() string { return fmt.Sprintf("%d-%s", time.Now().UnixMilli(), randomID()) }
func validateEvent(e VisitEvent, admission bool) error {
	if !eventPattern.MatchString(e.EventID) || e.ArticleID == 0 || len(e.VisitorID) > 80 || len(e.IPAddress) > 64 {
		return ErrVisitInvalid
	}
	ms, _ := strconv.ParseInt(e.EventID[:13], 10, 64)
	if e.OccurredAt.UnixMilli() != ms {
		return ErrVisitInvalid
	}
	if admission && (time.Since(e.OccurredAt) > 10*time.Minute || time.Until(e.OccurredAt) > time.Minute) {
		return ErrVisitInvalid
	}
	return nil
}

// Validate every key/number BEFORE the first mutation. No MAXLEN: XLEN is the
// count of all unacknowledged work, including pending. XADD happens before INCR.
const acceptVisitScript = `
local expected={'stream','string','string','string','string','string','string'}
for i=1,#KEYS do local t=redis.call('TYPE',KEYS[i]).ok; if t~='none' and t~=expected[i] then return redis.error_reply('invalid key type') end end
local capacity=tonumber(ARGV[1]);local base=tonumber(ARGV[2]);local rate=tonumber(ARGV[5]);local iprate=tonumber(ARGV[6])
if not capacity or capacity<1 or not base or base<0 or base>9007199254740000 or not rate or not iprate then return redis.error_reply('invalid arguments') end
local count=tonumber(redis.call('GET',KEYS[3]) or ARGV[2])
local r=tonumber(redis.call('GET',KEYS[4]) or '0');local ip=tonumber(redis.call('GET',KEYS[5]) or '0')
if not count or count<0 or count>=9007199254740000 or count~=math.floor(count) or not r or not ip or r<0 or ip<0 or r~=math.floor(r) or ip~=math.floor(ip) or r>1000000000 or ip>1000000000 then return redis.error_reply('invalid counter') end
if redis.call('EXISTS',KEYS[6])==1 then return {-3,count} end
if redis.call('EXISTS',KEYS[3])==0 then return {-5,count} end
if #KEYS>=7 then local boot=string.match(redis.call('INFO','server'),'run_id:([^%s]+)'); if not boot or redis.call('GET',KEYS[7])~=boot then return {-5,count} end end
local prior=redis.call('GET',KEYS[2])
if prior then if prior~=ARGV[7] then return {-4,count} end; return {0,count} end
if redis.call('XLEN',KEYS[1])>=capacity then return {-1,count} end
if r>=rate or ip>=iprate then return {-2,count} end
redis.call('XADD',KEYS[1],'*','event',ARGV[3])
redis.call('SET',KEYS[2],ARGV[7],'EX',1200)
redis.call('SET',KEYS[3],count+1)
redis.call('SET',KEYS[4],r+1,'EX',60)
redis.call('SET',KEYS[5],ip+1,'EX',60)
return {1,count+1}
`

func (p *VisitPipeline) Accept(ctx context.Context, e VisitEvent) (VisitReceipt, error) {
	ctx, cancel := context.WithTimeout(ctx, 2*time.Second)
	defer cancel()
	var out VisitReceipt
	if err := validateEvent(e, true); err != nil {
		return out, err
	}
	a, err := cachedArticle(ctx, e.ArticleID)
	if err != nil {
		return out, err
	}
	raw, _ := json.Marshal(e)
	// IP + visitor share a bucket; a generous IP ceiling limits random-ID abuse
	// without treating a NAT address as one visitor. Fixed UTC minute windows.
	window := strconv.FormatInt(time.Now().Unix()/60, 10)
	vals, err := database.RDB.Eval(ctx, acceptVisitScript, []string{visitStream, "blog:visit:dedup:" + e.EventID, fmt.Sprintf(liveViewKey, e.ArticleID), "blog:visit:rate:" + HashIP(e.IPAddress+"|"+e.VisitorID) + ":" + window, "blog:visit:ip:" + HashIP(e.IPAddress) + ":" + window, visitMaintenance, "blog:visits:boot"}, p.Options.Capacity, a.ViewCount, string(raw), e.EventID, p.Options.Rate, p.Options.IPRate, strconv.FormatUint(uint64(e.ArticleID), 10)).Int64Slice()
	if err != nil {
		return out, err
	}
	if vals[0] == -5 {
		p.needsReconcile.Store(true)
		if err = p.Reconcile(ctx); err != nil {
			return out, ErrCounterUnavailable
		}
		if ctx.Value(visitRetryKey{}) != nil {
			return out, ErrCounterUnavailable
		}
		return p.Accept(context.WithValue(ctx, visitRetryKey{}, true), e)
	}
	switch vals[0] {
	case -1:
		return out, ErrVisitFull
	case -2:
		return out, ErrVisitRate
	case -3:
		return out, ErrCounterUnavailable
	case -4:
		return out, ErrVisitInvalid
	}
	out = VisitReceipt{CountSnapshot: CountSnapshot{ViewCount: int(vals[1]), LikeCount: currentLikeCount(ctx, e.ArticleID, a.LikeCount)}, EventID: e.EventID, Accepted: true, Duplicate: vals[0] == 0}
	if out.Duplicate {
		p.Duplicates.Add(1)
	} else {
		p.Accepted.Add(1)
	}
	return out, nil
}

func (p *VisitPipeline) Start(ctx context.Context) error {
	var migrated int64
	if !database.DB.Migrator().HasTable("visit_migrations") {
		return errors.New("explicit baseline migration required")
	}
	if err := database.DB.WithContext(ctx).Table("visit_migrations").Where("name = ?", "stream-v2").Count(&migrated).Error; err != nil {
		return err
	}
	if migrated != 1 {
		return errors.New("explicit stream-v2 baseline marker required")
	}

	if !database.DB.Migrator().HasTable("visit_events") {
		return errors.New("apply migrations/001_visit_events.sql before enabling streams")
	}
	if err := database.RDB.XGroupCreateMkStream(ctx, visitStream, visitGroup, "0").Err(); err != nil && !strings.Contains(err.Error(), "BUSYGROUP") {
		return err
	}
	// An empty stream can be calibrated before serving traffic. Pending work
	// keeps its existing counters until consumers drain it.
	if n, e := database.RDB.XLen(ctx, visitStream).Result(); e != nil {
		return e
	} else if n == 0 {
		if e = p.Reconcile(ctx); e != nil {
			return e
		}
	}
	for i := 0; i < p.Options.Workers; i++ {
		p.wg.Add(1)
		go p.consume(ctx, randomID())
	}
	p.wg.Add(1)
	go p.observe(ctx)
	return nil
}
func (p *VisitPipeline) Wait() { p.wg.Wait() }
func sleepContext(ctx context.Context, d time.Duration) bool {
	t := time.NewTimer(d)
	defer t.Stop()
	select {
	case <-ctx.Done():
		return false
	case <-t.C:
		return true
	}
}

func (p *VisitPipeline) consume(ctx context.Context, consumer string) {
	defer p.wg.Done()
	backoff := p.Options.Backoff
	cursor := "0-0"
	for ctx.Err() == nil {
		messages, next, err := database.RDB.XAutoClaim(ctx, &redis.XAutoClaimArgs{Stream: visitStream, Group: visitGroup, Consumer: consumer, MinIdle: p.Options.ClaimIdle, Start: cursor, Count: int64(p.Options.Batch)}).Result()
		cursor = next
		if cursor == "" {
			cursor = "0-0"
		}
		if err == nil && len(messages) == 0 {
			var streams []redis.XStream
			streams, err = database.RDB.XReadGroup(ctx, &redis.XReadGroupArgs{Group: visitGroup, Consumer: consumer, Streams: []string{visitStream, ">"}, Count: int64(p.Options.Batch), Block: p.Options.Block}).Result()
			for _, s := range streams {
				messages = append(messages, s.Messages...)
			}
		}
		if err != nil && strings.Contains(err.Error(), "NOGROUP") {
			_ = database.RDB.XGroupCreateMkStream(ctx, visitStream, visitGroup, "0").Err()
		}
		if errors.Is(err, redis.Nil) {
			continue
		}
		if err == nil && len(messages) > 0 {
			err = p.process(ctx, messages)
		}
		if err != nil {
			p.Failures.Add(1)
			log.Logger.Warn("visit consumer backing off", "delay", backoff, "error", err)
			if !sleepContext(ctx, backoff) {
				return
			}
			backoff = min(backoff*2, 30*time.Second)
		} else {
			backoff = p.Options.Backoff
		}
	}
}

// PersistBatch is safe to replay after a commit but before ACK, and across
// consumers. The unique event ledger, visit records and increments commit together.
func (p *VisitPipeline) PersistBatch(ctx context.Context, events []VisitEvent) (int64, error) {
	raw, _ := json.Marshal(events)
	var inserted int64
	err := database.DB.WithContext(ctx).Transaction(func(tx *gorm.DB) error {
		// Serialize batches only in PostgreSQL (not HTTP admission), preventing
		// opposite article update orders from deadlocking across consumers.
		if err := tx.Exec("SELECT pg_advisory_xact_lock(74190321)").Error; err != nil {
			return err
		}
		return tx.Raw(`WITH incoming AS (
   SELECT DISTINCT ON (event_id) * FROM jsonb_to_recordset(?::jsonb) AS x(event_id text,article_id bigint,occurred_at timestamptz,visitor_id text,ip_address text)
  ), fresh AS (
   INSERT INTO visit_events(event_id,article_id,occurred_at,received_at)
   SELECT event_id,article_id,occurred_at,now() FROM incoming ON CONFLICT(event_id) DO NOTHING RETURNING event_id,article_id
  ), records AS (
   INSERT INTO visit_records(visitor_id,ip_address,city,content_title,article_id,created_at)
   SELECT i.visitor_id,i.ip_address,'',a.title,a.id,i.occurred_at FROM incoming i JOIN fresh f USING(event_id) JOIN articles a ON a.id=f.article_id
  ), counts AS (
   UPDATE articles a SET view_count=a.view_count+f.n FROM (SELECT article_id,count(*) AS n FROM fresh GROUP BY article_id) f WHERE a.id=f.article_id
  ) SELECT count(*) FROM fresh`, string(raw)).Scan(&inserted).Error
	})
	return inserted, err
}

func (p *VisitPipeline) process(ctx context.Context, messages []redis.XMessage) error {
	ctx, cancel := context.WithTimeout(ctx, 5*time.Second)
	defer cancel()
	events := make([]VisitEvent, 0, len(messages))
	ids := make([]string, 0, len(messages))
	for _, m := range messages {
		var event VisitEvent
		raw, ok := m.Values["event"].(string)
		err := json.Unmarshal([]byte(raw), &event)
		if !ok || err != nil || validateEvent(event, false) != nil {
			if err = p.deadLetter(ctx, m, "invalid event"); err != nil {
				return err
			}
			continue
		}
		// A batch could contain duplicate IDs from external writers. SQL input must
		// itself be unique or joining fresh would create duplicate access records.
		duplicate := false
		for _, e := range events {
			if e.EventID == event.EventID {
				duplicate = true
				break
			}
		}
		if !duplicate {
			events = append(events, event)
		}
		ids = append(ids, m.ID)
	}
	if len(ids) == 0 {
		return nil
	}
	n, err := p.PersistBatch(ctx, events)
	if err != nil {
		// Database outages stay pending, never exhaust into a lossy dead letter.
		// Only permanent SQL data/constraint errors have a finite retry budget.
		if strings.Contains(err.Error(), "SQLSTATE 22") || strings.Contains(err.Error(), "SQLSTATE 23") {
			for _, m := range messages {
				pending, e := database.RDB.XPendingExt(ctx, &redis.XPendingExtArgs{Stream: visitStream, Group: visitGroup, Start: m.ID, End: m.ID, Count: 1}).Result()
				if e == nil && len(pending) == 1 && pending[0].RetryCount >= int64(p.Options.MaxRetries) {
					if e = p.deadLetter(ctx, m, "permanent SQL error"); e != nil {
						return e
					}
				}
			}
		}
		return err
	}
	p.Persisted.Add(uint64(n))
	return ackVisits(ctx, ids)
}

func ackVisits(ctx context.Context, ids []string) error {
	args := make([]any, 0, len(ids)+1)
	args = append(args, visitGroup)
	for _, id := range ids {
		args = append(args, id)
	}
	return database.RDB.Eval(ctx, `local n=redis.call('XACK',KEYS[1],ARGV[1],unpack(ARGV,2));redis.call('XDEL',KEYS[1],unpack(ARGV,2));return n`, []string{visitStream}, args...).Err()
}
func (p *VisitPipeline) deadLetter(ctx context.Context, m redis.XMessage, reason string) error {
	raw, _ := json.Marshal(m.Values)
	// Save durably before removing the source. A failing DB retains the pending item.
	if err := database.DB.WithContext(ctx).Exec(`INSERT INTO visit_failures(stream_id,payload,reason) VALUES (?,?::jsonb,?) ON CONFLICT(stream_id) DO NOTHING`, m.ID, string(raw), reason).Error; err != nil {
		return err
	}
	if err := ackVisits(ctx, []string{m.ID}); err != nil {
		return err
	}
	p.Dead.Add(1)
	p.needsReconcile.Store(true)
	return nil
}

// Reconciliation only runs with admission fenced and the entire stream empty.
// Thus a SQL snapshot can never overwrite a concurrently accepted increment.
func (p *VisitPipeline) Reconcile(ctx context.Context) error {
	token := randomID()
	ok, err := database.RDB.SetNX(ctx, visitMaintenance, token, 0).Result()
	if err != nil {
		return err
	}
	if !ok {
		return ErrReadBusy
	}
	defer database.RDB.Eval(context.WithoutCancel(ctx), `if redis.call('GET',KEYS[1])==ARGV[1] then return redis.call('DEL',KEYS[1]) end return 0`, []string{visitMaintenance}, token)
	n, err := database.RDB.XLen(ctx, visitStream).Result()
	if err != nil {
		return err
	}
	if n != 0 {
		return ErrReadBusy
	}
	info, err := database.RDB.Info(ctx, "server").Result()
	if err != nil {
		return err
	}
	var boot string
	for _, line := range strings.Split(info, "\n") {
		if strings.HasPrefix(line, "run_id:") {
			boot = strings.TrimSpace(strings.TrimPrefix(line, "run_id:"))
		}
	}
	if boot == "" {
		return ErrCounterUnavailable
	}
	var counts []struct {
		ID        uint
		ViewCount int
	}
	if err = database.DB.WithContext(ctx).Table("articles").Select("id,view_count").Find(&counts).Error; err != nil {
		return err
	}
	// The admission window is 10 minutes; 20 minute TTL exceeds it. Rebuild
	// dedup from the durable ledger when Redis loses state, in bounded pages.
	var last string
	for {
		var events []struct {
			EventID   string
			ArticleID uint
		}
		if err = database.DB.WithContext(ctx).Table("visit_events").Select("event_id,article_id").Where("occurred_at >= ? AND event_id > ?", time.Now().Add(-20*time.Minute), last).Order("event_id").Limit(1000).Find(&events).Error; err != nil {
			return err
		}
		if len(events) == 0 {
			break
		}
		pipe := database.RDB.Pipeline()
		for _, e := range events {
			pipe.Set(ctx, "blog:visit:dedup:"+e.EventID, strconv.FormatUint(uint64(e.ArticleID), 10), 20*time.Minute)
		}
		if _, err = pipe.Exec(ctx); err != nil {
			return err
		}
		last = events[len(events)-1].EventID
	}
	pipe := database.RDB.Pipeline()
	for _, a := range counts {
		pipe.Set(ctx, fmt.Sprintf(liveViewKey, a.ID), a.ViewCount, 0)
	}
	pipe.Set(ctx, "blog:visits:boot", boot, 0)
	_, err = pipe.Exec(ctx)
	if err == nil {
		p.needsReconcile.Store(false)
	}
	return err
}
func (p *VisitPipeline) observe(ctx context.Context) {
	defer p.wg.Done()
	ticker := time.NewTicker(15 * time.Second)
	rounds := 0
	defer ticker.Stop()
	for {
		select {
		case <-ctx.Done():
			return
		case <-ticker.C:
			rounds++
			c, cancel := context.WithTimeout(ctx, 4*time.Second)
			n, _ := database.RDB.XLen(c, visitStream).Result()
			pending, _ := database.RDB.XPending(c, visitStream, visitGroup).Result()
			oldest, _ := database.RDB.XRangeN(c, visitStream, "-", "+", 1).Result()
			var age int64
			if len(oldest) > 0 {
				ms, _ := strconv.ParseInt(strings.Split(oldest[0].ID, "-")[0], 10, 64)
				age = time.Now().UnixMilli() - ms
			}
			sql, _ := database.DB.DB()
			var pend int64
			if pending != nil {
				pend = pending.Count
			}
			log.Logger.Info("visitor pipeline", "backlog", n, "oldest_ms", age, "pending", pend, "accepted", p.Accepted.Load(), "duplicates", p.Duplicates.Load(), "persisted", p.Persisted.Load(), "failures", p.Failures.Load(), "dead", p.Dead.Load(), "cache_hits", cacheHits.Load(), "cache_misses", cacheMisses.Load(), "origin_rejected", originRejected.Load(), "db_pool", sql.Stats())
			if n == 0 && p.needsReconcile.Load() {
				_ = p.Reconcile(c)
			}
			if n == 0 && rounds%4 == 0 {
				info, e := database.RDB.XInfoStream(c, visitStream).Result()
				idle := false
				if e == nil {
					ms, _ := strconv.ParseInt(strings.Split(info.LastGeneratedID, "-")[0], 10, 64)
					idle = time.Since(time.UnixMilli(ms)) > time.Minute
				}
				if idle {
					if e := p.Prune(c); e != nil {
						log.Logger.Warn("visit retention deferred", "error", e)
					}
				}
			}
			cancel()
		}
	}
}
