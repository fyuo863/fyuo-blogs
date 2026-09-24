package service

import (
	"context"
	"myblog/internal/database"
	"time"
)

// Prune is bounded and only removes ledger entries outside the admission window
// when no work is queued/pending. Accepted but unprocessed events are never aged
// out. Each call deletes at most 1,000 rows per table; repeat during idle periods.
func (p *VisitPipeline) Prune(ctx context.Context) error {
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
	for _, q := range []struct {
		sql    string
		before time.Time
	}{
		{`DELETE FROM visit_events WHERE event_id IN (SELECT event_id FROM visit_events WHERE received_at < ? ORDER BY received_at LIMIT 1000)`, time.Now().Add(-7 * 24 * time.Hour)},
		{`DELETE FROM visit_records WHERE id IN (SELECT id FROM visit_records WHERE created_at < ? ORDER BY created_at LIMIT 1000)`, time.Now().Add(-90 * 24 * time.Hour)},
		{`DELETE FROM visit_failures WHERE stream_id IN (SELECT stream_id FROM visit_failures WHERE created_at < ? ORDER BY created_at LIMIT 1000)`, time.Now().Add(-30 * 24 * time.Hour)},
	} {
		if err = database.DB.WithContext(ctx).Exec(q.sql, q.before).Error; err != nil {
			return err
		}
	}
	return nil
}
