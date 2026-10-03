#!/usr/bin/env python3
"""Local, no-credential health checks. Exit nonzero for systemd monitoring."""
import json, subprocess, time, shutil, pathlib

def run(args):
    try:
        p = subprocess.run(args, capture_output=True, text=True, timeout=15)
        return p.returncode == 0, p.stdout.strip()
    except (OSError, subprocess.TimeoutExpired):
        return False, ''

issues = []
for name in ['blog_nginx', 'blog-backend', 'blog_mcp_publisher', 'blog_postgres', 'blog_redis', 'blog-ai-coding-ai-coding-sync-1']:
    ok, state = run(['docker','inspect','--format','{{.State.Status}} {{if .State.Health}}{{.State.Health.Status}}{{end}}',name])
    if not ok or state != 'running healthy': issues.append(f'{name}: unhealthy')
if shutil.disk_usage('/data').free / shutil.disk_usage('/data').total < .10:
    issues.append('disk: less than 10% free')
backup = pathlib.Path('/data/blog-backups/last-success')
if not backup.exists() or time.time()-backup.stat().st_mtime > 36*3600:
    issues.append('backup: missing or older than 36 hours')
ok, _ = run(['openssl','x509','-checkend','604800','-noout','-in','/etc/letsencrypt/live/fyuoblog.top/fullchain.pem'])
if not ok: issues.append('TLS certificate: expires within 7 days or unreadable')
ok, logs = run(['docker','logs','--since','5m','--tail','2000','blog_nginx'])
if ok:
    failures = sum(('" 401 ' in line or '" 429 ' in line) for line in logs.splitlines())
    if failures >= 100: issues.append(f'auth/rate failures in last 5m: {failures}')
status = {'checkedAt': int(time.time()), 'ok': not issues, 'issues': issues}
path = pathlib.Path('/data/blog/security-status.json')
tmp = path.with_suffix('.tmp');tmp.write_text(json.dumps(status));tmp.chmod(0o600);tmp.replace(path)
print(json.dumps(status))
raise SystemExit(bool(issues))
