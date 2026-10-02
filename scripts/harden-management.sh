#!/bin/sh
set -eu
[ "$(id -u)" = 0 ] || { echo 'Run as root'; exit 1; }
# Preserve 22, 80, 443 and the existing 8443 proxy. Panel remains available
# through: ssh -L 16123:127.0.0.1:16123 aliyun-light
stamp=$(date +%s)
snapshot=/root/ufw-before-blog-security-$stamp
cp -a /etc/ufw "$snapshot"
# Roll back automatically unless a separate SSH session confirms access.
cat >"$snapshot/rollback.sh" <<EOF
#!/bin/sh
if [ ! -f /run/blog-firewall-confirmed-$stamp ]; then
 cp -a "$snapshot/user.rules" /etc/ufw/user.rules
 cp -a "$snapshot/user6.rules" /etc/ufw/user6.rules
 ufw reload
fi
EOF
systemd-run --unit="blog-firewall-rollback-$stamp" --on-active=120s /bin/sh "$snapshot/rollback.sh"
printf 'Confirm only from a NEW SSH session: sudo touch /run/blog-firewall-confirmed-%s\n' "$stamp"
for port in 20 21 888 8888 16123 39000:40000; do
 ufw --force delete allow "$port/tcp" || true
done
# Do not alter the SSH firewall rule in the same change that removes panel access.
# SSH authentication/startup limits below bound attempts without risking access.
cat >/etc/ssh/sshd_config.d/00-blog-security.conf <<'EOF'
PasswordAuthentication no
KbdInteractiveAuthentication no
PermitRootLogin prohibit-password
MaxAuthTries 3
LoginGraceTime 30
MaxStartups 10:30:30
EOF
sshd -t
systemctl reload ssh
ufw status
