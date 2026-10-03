#!/bin/sh
set -eu
[ "$(id -u)" = 0 ]
install -m 700 scripts/backup-blog.sh /usr/local/sbin/backup-blog
install -m 700 scripts/security-health.py /usr/local/sbin/blog-security-health
cat >/etc/systemd/system/blog-backup.service <<'EOF'
[Unit]
Description=Encrypted blog database and file backup
After=docker.service
[Service]
Type=oneshot
ExecStart=/usr/local/sbin/backup-blog
TimeoutStartSec=120
UMask=0077
MemoryMax=192M
CPUQuota=50%
EOF
cat >/etc/systemd/system/blog-backup.timer <<'EOF'
[Unit]
Description=Daily encrypted blog backup
[Timer]
OnCalendar=*-*-* 04:00:00
Persistent=true
RandomizedDelaySec=300
[Install]
WantedBy=timers.target
EOF
cat >/etc/systemd/system/blog-security-health.service <<'EOF'
[Unit]
Description=Blog service, disk, backup and TLS health checks
[Service]
Type=oneshot
ExecStart=/usr/bin/python3 /usr/local/sbin/blog-security-health
TimeoutStartSec=120
MemoryMax=64M
EOF
cat >/etc/systemd/system/blog-security-health.timer <<'EOF'
[Unit]
Description=Check blog security health every five minutes
[Timer]
OnBootSec=2min
OnUnitActiveSec=5min
[Install]
WantedBy=timers.target
EOF
systemctl daemon-reload
systemctl enable --now blog-backup.timer blog-security-health.timer
systemctl start blog-security-health.service
