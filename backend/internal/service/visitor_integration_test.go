package service

import (
	"context"
	"fmt"
	"os"
	"sync"
	"testing"
	"time"

	charmlog "charm.land/log/v2"
	"github.com/redis/go-redis/v9"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"io"
	"myblog/internal/database"
	"myblog/internal/model"
	"myblog/internal/repository"
	"myblog/log"
)

func integrationSetup(t *testing.T) (*VisitPipeline, uint) {
	t.Helper()
	log.Logger = charmlog.New(io.Discard)
	if os.Getenv("BLOG_VISITOR_INTEGRATION") != "1" {
		t.Skip("requires isolated bench/compose.verify.yaml")
	}
	// Intentionally fixed disposable credentials and loopback ports; no production env.
	db, err := gorm.Open(postgres.Open("host=127.0.0.1 port=15439 user=bench password=bench-local-only dbname=bench sslmode=disable statement_timeout=2000"), &gorm.Config{})
	if err != nil {
		t.Fatal(err)
	}
	schema := "verify_" + randomID()
	if err = db.Exec("CREATE SCHEMA " + schema).Error; err != nil {
		t.Fatal(err)
	}
	scoped, err := gorm.Open(postgres.Open("host=127.0.0.1 port=15439 user=bench password=bench-local-only dbname=bench sslmode=disable statement_timeout=2000 search_path="+schema), &gorm.Config{})
	if err != nil {
		t.Fatal(err)
	}
	database.DB = scoped
	sql, _ := scoped.DB()
	sql.SetMaxOpenConns(8)
	sql.SetMaxIdleConns(4)
	database.RDB = redis.NewClient(&redis.Options{Addr: "127.0.0.1:16389", DB: 15, MaxRetries: -1, ReadTimeout: time.Second, WriteTimeout: time.Second})
	if err = database.RDB.FlushDB(context.Background()).Err(); err != nil {
		t.Fatal(err)
	}
	t.Cleanup(func() {
		sql.Close()
		db.Exec("DROP SCHEMA " + schema + " CASCADE")
		root, _ := db.DB()
		root.Close()
		database.RDB.Close()
		database.RDB = nil
		database.DB = nil
		Visits = nil
	})
	if err = scoped.AutoMigrate(&model.User{}, &model.Article{}, &model.VisitRecord{}); err != nil {
		t.Fatal(err)
	}
	migration, err := os.ReadFile("../../migrations/001_visit_events.sql")
	if err != nil {
		t.Fatal(err)
	}
	if err = scoped.Exec(string(migration)).Error; err != nil {
		t.Fatal(err)
	}
	if err = scoped.Exec("INSERT INTO visit_migrations(name) VALUES ('stream-v2')").Error; err != nil {
		t.Fatal(err)
	}
	user := model.User{Name: "verify", Role: "admin"}
	if err = scoped.Create(&user).Error; err != nil {
		t.Fatal(err)
	}
	a := model.Article{Title: "test", AuthorID: user.ID, Stage: "published", ViewCount: 41, LikeCount: 3}
	if err = scoped.Create(&a).Error; err != nil {
		t.Fatal(err)
	}
	p := &VisitPipeline{Options: DefaultVisitOptions()}
	p.Options.ClaimIdle = 20 * time.Millisecond
	p.Options.Block = 100 * time.Millisecond
	Visits = p
	return p, a.ID
}
func testEvent(id uint) VisitEvent {
	now := time.Now().Truncate(time.Millisecond)
	return VisitEvent{EventID: fmt.Sprintf("%d-%s", now.UnixMilli(), randomID()), ArticleID: id, OccurredAt: now, VisitorID: "test", IPAddress: "127.0.0.1"}
}
func TestIntegrationCommitBeforeACKReplay(t *testing.T) {
	p, id := integrationSetup(t)
	ctx := context.Background()
	event := testEvent(id)
	receipt, err := p.Accept(ctx, event)
	if err != nil || !receipt.Accepted {
		t.Fatalf("accept %v %v", receipt, err)
	}
	database.RDB.XGroupCreate(ctx, visitStream, visitGroup, "0")
	streams, err := database.RDB.XReadGroup(ctx, &redis.XReadGroupArgs{Group: visitGroup, Consumer: "crashed", Streams: []string{visitStream, ">"}, Count: 1}).Result()
	if err != nil {
		t.Fatal(err)
	}
	messages := streams[0].Messages
	// Commit durable state and deliberately omit ACK (the crash boundary).
	if n, e := p.PersistBatch(ctx, []VisitEvent{event}); e != nil || n != 1 {
		t.Fatalf("persist %d %v", n, e)
	}
	time.Sleep(30 * time.Millisecond)
	reclaimed, _, err := database.RDB.XAutoClaim(ctx, &redis.XAutoClaimArgs{Stream: visitStream, Group: visitGroup, Consumer: "recovered", MinIdle: 20 * time.Millisecond, Start: "0-0", Count: 10}).Result()
	if err != nil || len(reclaimed) != 1 {
		t.Fatalf("reclaim %d %v", len(reclaimed), err)
	}
	if err = p.process(ctx, reclaimed); err != nil {
		t.Fatal(err)
	}
	if err = p.process(ctx, messages); err != nil {
		t.Fatal(err)
	}
	var a model.Article
	database.DB.First(&a, id)
	if a.ViewCount != 42 {
		t.Fatalf("replay counted twice: %d", a.ViewCount)
	}
	var records int64
	database.DB.Model(&model.VisitRecord{}).Count(&records)
	if records != 1 {
		t.Fatalf("records=%d", records)
	}
	duplicate, e := p.Accept(ctx, event)
	if e != nil || !duplicate.Duplicate {
		t.Fatalf("retry %v %v", duplicate, e)
	}
	if n := database.RDB.XLen(ctx, visitStream).Val(); n != 0 {
		t.Fatalf("queue not drained: %d", n)
	}
}
func TestIntegrationMultiConsumerAndVisibility(t *testing.T) {
	p, id := integrationSetup(t)
	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()
	p.Options.Rate = 1000
	if err := p.Start(ctx); err != nil {
		t.Fatal(err)
	}
	events := make([]VisitEvent, 120)
	for i := range events {
		events[i] = testEvent(id)
		if _, e := p.Accept(ctx, events[i]); e != nil {
			t.Fatal(e)
		}
	}
	var wg sync.WaitGroup
	for i := 0; i < 4; i++ {
		wg.Add(1)
		go func() {
			defer wg.Done()
			if _, e := p.PersistBatch(ctx, events); e != nil {
				t.Error(e)
			}
		}()
	}
	wg.Wait()
	deadline := time.Now().Add(10 * time.Second)
	for database.RDB.XLen(ctx, visitStream).Val() > 0 && time.Now().Before(deadline) {
		time.Sleep(20 * time.Millisecond)
	}
	cancel()
	p.Wait()
	var a model.Article
	database.DB.First(&a, id)
	if a.ViewCount != 161 {
		t.Fatalf("count=%d want 161", a.ViewCount)
	}
	service := NewArticleService(repository.NewArticleRepository(database.DB))
	if _, err := service.Get(context.Background(), id); err != nil {
		t.Fatal(err)
	}
	hidden := "hidden"
	if _, err := service.Update(context.Background(), model.User{Role: "admin"}, id, ArticleUpdate{Stage: &hidden}); err != nil {
		t.Fatal(err)
	}
	if _, err := service.Get(context.Background(), id); err != ErrArticleNotFound {
		t.Fatalf("hidden exposed: %v", err)
	}
	if _, err := p.Accept(context.Background(), testEvent(id)); err != ErrArticleNotFound {
		t.Fatalf("hidden visit admitted: %v", err)
	}
	published := "published"
	if _, err := service.Update(context.Background(), model.User{Role: "admin"}, id, ArticleUpdate{Stage: &published}); err != nil {
		t.Fatal(err)
	}
	if _, err := service.Get(context.Background(), id); err != nil {
		t.Fatal(err)
	}
	if err := service.Delete(context.Background(), id); err != nil {
		t.Fatal(err)
	}
	if _, err := service.Get(context.Background(), id); err != ErrArticleNotFound {
		t.Fatalf("deleted cached content exposed: %v", err)
	}
	SyncCountsToDB(context.Background())
	database.DB.First(&a, id)
	if a.ViewCount != 161 {
		t.Fatal("legacy sync overwrote stream count")
	}
	if _, e := toggleLikeCounter(context.Background(), id, "test", 3); e != nil {
		t.Fatal(e)
	}
	SyncCountsToDB(context.Background())
	database.DB.First(&a, id)
	if a.LikeCount != 4 {
		t.Fatal("likes no longer persist")
	}
}
func TestIntegrationInvalidAndDeletedEvent(t *testing.T) {
	p, id := integrationSetup(t)
	ctx := context.Background()
	database.RDB.XGroupCreateMkStream(ctx, visitStream, visitGroup, "0")
	database.RDB.XAdd(ctx, &redis.XAddArgs{Stream: visitStream, Values: map[string]any{"event": "bad-json"}})
	s, e := database.RDB.XReadGroup(ctx, &redis.XReadGroupArgs{Group: visitGroup, Consumer: "test", Streams: []string{visitStream, ">"}, Count: 10}).Result()
	if e != nil {
		t.Fatal(e)
	}
	if e = p.process(ctx, s[0].Messages); e != nil {
		t.Fatal(e)
	}
	var failures int64
	database.DB.Table("visit_failures").Count(&failures)
	if failures != 1 {
		t.Fatal("dead letter missing")
	}
	event := testEvent(id)
	database.DB.Delete(&model.Article{}, id)
	if n, e := p.PersistBatch(ctx, []VisitEvent{event}); e != nil || n != 1 {
		t.Fatalf("deleted article event: %d %v", n, e)
	}
	if n, e := p.PersistBatch(ctx, []VisitEvent{event}); e != nil || n != 0 {
		t.Fatalf("deleted article replay: %d %v", n, e)
	}
}

func TestIntegrationRedisLossRebuildAndRetention(t *testing.T) {
	p, id := integrationSetup(t)
	ctx := context.Background()
	event := testEvent(id)
	if _, err := p.Accept(ctx, event); err != nil {
		t.Fatal(err)
	}
	database.RDB.XGroupCreate(ctx, visitStream, visitGroup, "0")
	streams, err := database.RDB.XReadGroup(ctx, &redis.XReadGroupArgs{Group: visitGroup, Consumer: "test", Streams: []string{visitStream, ">"}, Count: 1}).Result()
	if err != nil {
		t.Fatal(err)
	}
	if err = p.Prune(ctx); err != ErrReadBusy {
		t.Fatalf("cleanup crossed pending boundary: %v", err)
	}
	// A canceled transaction must leave its source message pending.
	canceled, cancel := context.WithCancel(ctx)
	cancel()
	if err = p.process(canceled, streams[0].Messages); err == nil {
		t.Fatal("canceled SQL unexpectedly committed")
	}
	if n := database.RDB.XPending(ctx, visitStream, visitGroup).Val().Count; n != 1 {
		t.Fatal("failed transaction was ACKed")
	}
	if err = p.process(ctx, streams[0].Messages); err != nil {
		t.Fatal(err)
	}
	database.RDB.FlushDB(ctx) // test-only DB 15; simulates complete Redis loss
	receipt, err := p.Accept(ctx, event)
	if err != nil || !receipt.Duplicate || receipt.ViewCount != 42 {
		t.Fatalf("durable reconstruction failed: %+v %v", receipt, err)
	}
	if database.RDB.XLen(ctx, visitStream).Val() != 0 {
		t.Fatal("durable duplicate re-enqueued")
	}
	if err = database.DB.Exec("INSERT INTO visit_events VALUES ('old',1,now()-interval '8 days',now()-interval '8 days')").Error; err != nil {
		t.Fatal(err)
	}
	if err = p.Prune(ctx); err != nil {
		t.Fatal(err)
	}
	var count int64
	database.DB.Table("visit_events").Count(&count)
	if count != 1 {
		t.Fatalf("retention removed recent dedup: %d", count)
	}
}

func TestIntegrationRealRedisCapacityRateAndTypeSafety(t *testing.T) {
	p, id := integrationSetup(t)
	ctx := context.Background()
	p.Options.Capacity = 1
	first := testEvent(id)
	if _, err := p.Accept(ctx, first); err != nil {
		t.Fatal(err)
	}
	if _, err := p.Accept(ctx, testEvent(id)); err != ErrVisitFull {
		t.Fatalf("queue capacity: %v", err)
	}
	duplicate, err := p.Accept(ctx, first)
	if err != nil || !duplicate.Duplicate {
		t.Fatal("full queue rejected idempotent retry", err)
	}
	database.RDB.XGroupCreate(ctx, visitStream, visitGroup, "0")
	streams, err := database.RDB.XReadGroup(ctx, &redis.XReadGroupArgs{Group: visitGroup, Consumer: "test", Streams: []string{visitStream, ">"}, Count: 1}).Result()
	if err != nil {
		t.Fatal(err)
	}
	if _, err = p.Accept(ctx, testEvent(id)); err != ErrVisitFull {
		t.Fatal("pending work lost capacity protection", err)
	}
	if err = p.process(ctx, streams[0].Messages); err != nil {
		t.Fatal(err)
	}
	p.Options.Rate = 1
	if _, err = p.Accept(ctx, testEvent(id)); err != ErrVisitRate {
		t.Fatalf("atomic rate limit: %v", err)
	}
	p.Options.Rate = 100
	// Wrong live-counter type fails BEFORE XADD or dedup/limiter mutation.
	key := fmt.Sprintf(liveViewKey, id)
	database.RDB.Del(ctx, key)
	database.RDB.LPush(ctx, key, "wrong")
	if _, err = p.Accept(ctx, testEvent(id)); err == nil {
		t.Fatal("wrong type accepted")
	}
	if database.RDB.XLen(ctx, visitStream).Val() != 0 {
		t.Fatal("Lua partially enqueued after type failure")
	}
	// Force a runtime XADD failure after preflight (exhausted Stream ID space).
	// Since XADD is the first mutation, no count/dedup is installed on failure.
	database.RDB.Del(ctx, key)
	database.RDB.Set(ctx, key, 42, 0)
	p.Options.Capacity = 100
	if err := database.RDB.XAdd(ctx, &redis.XAddArgs{Stream: visitStream, ID: "18446744073709551615-18446744073709551615", Values: map[string]any{"event": "sentinel"}}).Err(); err != nil {
		t.Fatal(err)
	}
	failed := testEvent(id)
	if _, err := p.Accept(ctx, failed); err == nil {
		t.Fatal("exhausted Stream accepted event")
	}
	if database.RDB.Get(ctx, key).Val() != "42" || database.RDB.Exists(ctx, "blog:visit:dedup:"+failed.EventID).Val() != 0 {
		t.Fatal("runtime XADD failure partially incremented/deduplicated")
	}
}
