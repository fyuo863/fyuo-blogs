// Offline, isolated-stack-only migration. No production environment is read.
import { execFileSync } from 'node:child_process';
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
const compose = ['compose', '-f', 'bench/compose.yaml'];
const run = (args, input) => execFileSync('docker', [...compose, ...args], { encoding: 'utf8', input });
run(['stop', 'backend']);
const sql = query => run(['exec', '-T', 'postgres', 'psql', '-U', 'bench', '-d', 'bench', '-At', '-v', 'ON_ERROR_STOP=1'], query);
sql(readFileSync('backend/migrations/001_visit_events.sql', 'utf8'));
const ids = sql('SELECT id FROM articles ORDER BY id;').trim().split('\n').map(Number);
const snapshot = [];
for (const id of ids) {
  // Pipeline all counters through redis-cli to keep the script reproducible.
  snapshot.push(id);
}
const commands = snapshot.flatMap(id => [`GET article:views:${id}`, `GET article:likes:${id}`]).join('\n')+'\n';
const values = run(['exec','-T','redis','redis-cli','--raw'], commands).split(/\r?\n/);
const rows = snapshot.map((id,i) => ({ id, view_count: values[i*2] === '' ? null : Number(values[i*2]), like_count: values[i*2+1] === '' ? null : Number(values[i*2+1]) }));
if (rows.some(x=>[x.view_count,x.like_count].some(v=>v!==null&&(!Number.isSafeInteger(v)||v<0)))) throw new Error('Invalid legacy counter; inspect before migration');
mkdirSync('bench/results/migration', {recursive:true});
writeFileSync('bench/results/migration/baseline.json',JSON.stringify(rows,null,2));
// The marker makes re-running a no-op, never reapplying old absolute counts.
const migration = `BEGIN;
SELECT pg_advisory_xact_lock(74190321);
CREATE TABLE IF NOT EXISTS visit_migrations(name text PRIMARY KEY, applied_at timestamptz DEFAULT now());
DO $$ BEGIN
 IF NOT EXISTS(SELECT 1 FROM visit_migrations WHERE name='stream-v2') THEN
  IF EXISTS(SELECT 1 FROM visit_events) THEN RAISE EXCEPTION 'event ledger must be empty for baseline'; END IF;
  UPDATE articles a SET view_count=GREATEST(a.view_count,COALESCE(x.view_count,a.view_count)),like_count=COALESCE(x.like_count,a.like_count)
  FROM jsonb_to_recordset('${JSON.stringify(rows)}'::jsonb) x(id bigint,view_count integer,like_count integer) WHERE a.id=x.id;
  INSERT INTO visit_migrations(name) VALUES ('stream-v2');
 END IF;
END $$;
COMMIT;`;
writeFileSync('bench/results/migration/baseline.sql',migration);
if (process.argv.includes('--apply')) { sql(migration); console.log('Isolated baseline applied (or already applied). Backend remains stopped.'); }
else console.log('Review bench/results/migration/baseline.sql, then rerun with --apply. Backend remains stopped.');
