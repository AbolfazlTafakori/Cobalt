#!/bin/bash
# ============================================================
#  Cobalt — One-Command Installer for Ubuntu 20.04+
#  Usage:
#    bash <(curl -Ls https://raw.githubusercontent.com/AbolfazlTafakori/Cobalt/main/install.sh)
# ============================================================

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
BOLD='\033[1m'
NC='\033[0m'

info()    { echo -e "${CYAN}[•]${NC} $1"; }
success() { echo -e "${GREEN}[✓]${NC} $1"; }
warn()    { echo -e "${YELLOW}[!]${NC} $1"; }
error()   { echo -e "${RED}[✗] $1${NC}"; exit 1; }
step()    { echo -e "\n${BOLD}${CYAN}━━━ $1 ━━━${NC}"; }

# ---- Must be root ----
[[ $EUID -ne 0 ]] && error "Please run as root:  sudo bash install.sh"

clear

C1='\033[38;5;39m'
C2='\033[38;5;33m'
C3='\033[38;5;27m'
CG='\033[38;5;46m'
CY='\033[38;5;226m'
CW='\033[1;37m'
DIM='\033[2m'

echo ""
echo -e "${C1}   ██████╗ ██████╗ ██████╗  █████╗ ██╗     ████████╗"
echo -e "${C1}  ██╔════╝██╔═══██╗██╔══██╗██╔══██╗██║     ╚══██╔══╝"
echo -e "${C2}  ██║     ██║   ██║██████╔╝███████║██║        ██║   "
echo -e "${C2}  ██║     ██║   ██║██╔══██╗██╔══██║██║        ██║   "
echo -e "${C3}  ╚██████╗╚██████╔╝██████╔╝██║  ██║███████╗   ██║   "
echo -e "${C3}   ╚═════╝ ╚═════╝ ╚═════╝ ╚═╝  ╚═╝╚══════╝   ╚═╝   ${NC}"
echo ""
echo -e "  ${CW}Cobalt Portfolio${NC}  ${DIM}+${NC}  ${CG}One-Click Installer${NC}"
echo ""
echo -e "  ${DIM}┌─────────────────────────────────────────────────┐${NC}"
echo -e "  ${DIM}│${NC}  ${CY}Version   ${NC}  v1.0                                ${DIM}│${NC}"
echo -e "  ${DIM}│${NC}  ${CY}Stack     ${NC}  React · ASP.NET Core 9 · Nginx       ${DIM}│${NC}"
echo -e "  ${DIM}│${NC}  ${CY}Features  ${NC}  Admin Panel · SSL · Auto-Renew       ${DIM}│${NC}"
echo -e "  ${DIM}│${NC}  ${CY}Platform  ${NC}  Ubuntu 20.04+                        ${DIM}│${NC}"
echo -e "  ${DIM}└─────────────────────────────────────────────────┘${NC}"
echo ""
echo -e "  ${DIM}Developed by${NC} ${CW}Abolfazl Tafakori${NC}"
echo ""

# ══════════════════════════════════════════════
#  STEP 1 — Collect information from user
# ══════════════════════════════════════════════
step "Setup Information"
echo ""
echo -e "  ${YELLOW}Make sure your domain's DNS A record already points to this server's IP${NC}"
echo -e "  ${YELLOW}before continuing, otherwise SSL cannot be issued.${NC}"
echo ""

while true; do
    read -rp "$(echo -e "  ${BOLD}Domain${NC} (e.g. portfolio.example.com): ")" MAIN_DOMAIN
    [[ -n "$MAIN_DOMAIN" ]] && break
    echo -e "  ${RED}Domain cannot be empty.${NC}"
done

echo ""

while true; do
    read -rp "$(echo -e "  ${BOLD}Admin username${NC}: ")" ADMIN_USER
    [[ ${#ADMIN_USER} -ge 3 ]] && break
    echo -e "  ${RED}Username must be at least 3 characters.${NC}"
done

while true; do
    read -rsp "$(echo -e "  ${BOLD}Admin password${NC} (min 8 characters): ")" ADMIN_PASS
    echo ""
    if [[ ${#ADMIN_PASS} -lt 8 ]]; then
        echo -e "  ${RED}Password must be at least 8 characters.${NC}"
        continue
    fi
    read -rsp "$(echo -e "  ${BOLD}Confirm password${NC}: ")" ADMIN_PASS2
    echo ""
    [[ "$ADMIN_PASS" == "$ADMIN_PASS2" ]] && break
    echo -e "  ${RED}Passwords do not match. Please try again.${NC}"
done

echo ""
echo -e "  ${GREEN}Configuration summary:${NC}"
echo -e "  Website URL  : ${CYAN}https://${MAIN_DOMAIN}${NC}"
echo -e "  Admin URL    : ${CYAN}https://${MAIN_DOMAIN}/admin${NC}"
echo -e "  Admin user   : ${CYAN}${ADMIN_USER}${NC}"
echo ""
read -rp "$(echo -e "  ${BOLD}Proceed with installation? [y/N]:${NC} ")" CONFIRM
[[ ! "$CONFIRM" =~ ^[Yy]$ ]] && echo "Aborted." && exit 0

# ══════════════════════════════════════════════
#  STEP 2 — Install system dependencies
# ══════════════════════════════════════════════
step "Installing System Dependencies"

apt-get update -qq
apt-get install -y -qq curl wget unzip git nginx certbot python3-certbot-nginx lsb-release ca-certificates gnupg
success "nginx, certbot, git installed"

# ── Node.js 20 (needed to build the React frontend) ──
node_ok() { command -v node &>/dev/null && [[ "$(node -v 2>/dev/null | sed 's/v//;s/\..*//')" -ge 18 ]]; }
if node_ok; then
    success "Node.js already installed: $(node -v)"
else
    info "Installing Node.js 20..."
    curl -fsSL https://deb.nodesource.com/setup_20.x | bash - >/dev/null 2>&1
    apt-get install -y -qq nodejs
    node_ok && success "Node.js installed: $(node -v)" || error "Node.js installation failed."
fi

# ── .NET 9 SDK ───────────────────────────────
DOTNET_EXEC=""
dotnet_ok() { command -v dotnet &>/dev/null && [[ "$(dotnet --version 2>/dev/null | cut -d. -f1)" -ge 9 ]]; }

if dotnet_ok; then
    DOTNET_EXEC="$(command -v dotnet)"
    success ".NET already installed: $(dotnet --version)  [${DOTNET_EXEC}]"
else
    info "Installing .NET 9 SDK..."
    UBUNTU_VER=$(lsb_release -rs 2>/dev/null | cut -d. -f1)
    if [[ "$UBUNTU_VER" -ge 24 ]]; then
        apt-get install -y -qq dotnet-sdk-9.0 2>/dev/null || apt-get install -y -qq dotnet9 2>/dev/null || true
    fi
    if ! dotnet_ok; then
        info "Using official dotnet-install.sh (universal fallback)..."
        wget -q https://dot.net/v1/dotnet-install.sh -O /tmp/dotnet-install.sh \
            || curl -fsSL https://dot.net/v1/dotnet-install.sh -o /tmp/dotnet-install.sh \
            || error "Could not download dotnet-install.sh — check internet connection."
        chmod +x /tmp/dotnet-install.sh
        /tmp/dotnet-install.sh --channel 9.0 --install-dir /usr/share/dotnet 2>&1 | tail -5
        chmod -R o+rx /usr/share/dotnet
        ln -sf /usr/share/dotnet/dotnet /usr/local/bin/dotnet
        ln -sf /usr/share/dotnet/dotnet /usr/bin/dotnet
        export PATH="$PATH:/usr/share/dotnet"
    fi
    dotnet_ok && success ".NET 9 installed: $(dotnet --version)" || error ".NET 9 installation failed."
fi

if [[ -f /usr/share/dotnet/dotnet ]]; then
    chmod o+rx /usr/share/dotnet/dotnet
    DOTNET_EXEC="/usr/share/dotnet/dotnet"
fi
[[ -z "$DOTNET_EXEC" ]] && DOTNET_EXEC="$(command -v dotnet)"
info "Using dotnet binary: ${DOTNET_EXEC}"

# ══════════════════════════════════════════════
#  STEP 3 — Download source
# ══════════════════════════════════════════════
step "Downloading Source"

INSTALL_DIR="/opt/cobalt"
SRC_DIR="${INSTALL_DIR}/src"
PUBLISH_DIR="${INSTALL_DIR}/publish"
FRONTEND_DIR="${INSTALL_DIR}/frontend"
DATA_DIR="${INSTALL_DIR}/data"
APP_PORT=5000
REPO_URL="https://github.com/AbolfazlTafakori/Cobalt.git"
JWT_SECRET=$(head -c 48 /dev/urandom | base64 | tr -dc 'a-zA-Z0-9' | head -c 64)

# Preserve existing data (uploads / content) across re-installs.
BACKUP_DATA=""
if [[ -d "$DATA_DIR" ]]; then
    BACKUP_DATA="/tmp/cobalt-data-$$"
    cp -r "$DATA_DIR" "$BACKUP_DATA"
    warn "Existing data found — it will be preserved."
fi

rm -rf "$SRC_DIR" "$PUBLISH_DIR" "$FRONTEND_DIR"
mkdir -p "$INSTALL_DIR"

# Use local files if the installer is run from a checkout; otherwise clone.
SCRIPT_DIR=""
[[ -n "${BASH_SOURCE[0]}" ]] && SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" 2>/dev/null && pwd || true)"

if [[ -n "$SCRIPT_DIR" ]] && [[ -f "${SCRIPT_DIR}/backend/ResumeAPI/ResumeAPI.csproj" ]]; then
    info "Using local project files..."
    mkdir -p "$SRC_DIR"
    cp -r "${SCRIPT_DIR}/." "$SRC_DIR/"
else
    info "Cloning from GitHub..."
    git clone --depth=1 "$REPO_URL" "$SRC_DIR" \
        || error "Could not clone repository. If it is private, make it public or clone manually to ${SRC_DIR}."
fi

mkdir -p "$DATA_DIR/uploads"

# ══════════════════════════════════════════════
#  STEP 4 — Build frontend (React → dist)
# ══════════════════════════════════════════════
step "Building Frontend"

cd "$SRC_DIR"
info "Installing npm packages..."
npm ci --no-audit --no-fund 2>&1 | tail -3 || npm install --no-audit --no-fund 2>&1 | tail -3
info "Building production bundle..."
npm run build 2>&1 | tail -5
[[ -f "${SRC_DIR}/dist/index.html" ]] || error "Frontend build failed — dist/index.html not found."

rm -rf "$FRONTEND_DIR"
cp -r "${SRC_DIR}/dist" "$FRONTEND_DIR"
success "Frontend built"

# ══════════════════════════════════════════════
#  STEP 5 — Build backend (ASP.NET Core → publish)
# ══════════════════════════════════════════════
step "Building Backend"

rm -rf /tmp/cobalt-build && mkdir -p /tmp/cobalt-build/obj /tmp/cobalt-build/bin
chmod -R 777 /tmp/cobalt-build

cd "${SRC_DIR}/backend/ResumeAPI"
info "Publishing (this may take 1-2 minutes on first run)..."
"$DOTNET_EXEC" publish -c Release \
    -o "$PUBLISH_DIR" \
    -p:BaseIntermediateOutputPath=/tmp/cobalt-build/obj/ \
    -p:BaseOutputPath=/tmp/cobalt-build/bin/ \
    --nologo 2>&1 | grep -vE "^[[:space:]]*$|Telemetry|telemetry|learn\.microsoft|dotnet-cli|dev-certs|Write your first|Find out what|Explore doc|Report issues|Use \.dotnet"

[[ -f "$PUBLISH_DIR/ResumeAPI.dll" ]] || error "Backend build failed — ResumeAPI.dll not found."
success "Backend built"

# ══════════════════════════════════════════════
#  STEP 6 — Configure
# ══════════════════════════════════════════════
step "Configuring"

# Restore preserved data if this was a re-install.
if [[ -n "$BACKUP_DATA" ]]; then
    rm -rf "$DATA_DIR"
    mv "$BACKUP_DATA" "$DATA_DIR"
    success "Previous data restored"
fi

cat > "$PUBLISH_DIR/appsettings.json" <<EOF
{
  "Logging": {
    "LogLevel": {
      "Default": "Warning",
      "Microsoft.AspNetCore": "Warning"
    }
  },
  "AllowedHosts": "*",
  "Urls": "http://localhost:${APP_PORT}",
  "Data": {
    "Dir": "${DATA_DIR}"
  },
  "Admin": {
    "Username": "${ADMIN_USER}",
    "Password": "${ADMIN_PASS}"
  },
  "Jwt": {
    "Secret": "${JWT_SECRET}",
    "Issuer": "ResumeAPI",
    "Audience": "ResumeAPI"
  }
}
EOF
success "Configuration written"

# ══════════════════════════════════════════════
#  STEP 7 — Permissions
# ══════════════════════════════════════════════
step "Setting Permissions"

chown -R www-data:www-data "$INSTALL_DIR"
chmod -R 755 "$INSTALL_DIR"
chmod -R 775 "$DATA_DIR"
success "Permissions set"

# ══════════════════════════════════════════════
#  STEP 8 — Systemd service
# ══════════════════════════════════════════════
step "Creating System Service"

cat > "/etc/systemd/system/cobalt-api.service" <<EOF
[Unit]
Description=Cobalt Portfolio API
After=network.target

[Service]
WorkingDirectory=${PUBLISH_DIR}
ExecStart=${DOTNET_EXEC} ${PUBLISH_DIR}/ResumeAPI.dll
Restart=always
RestartSec=5
SyslogIdentifier=cobalt-api
User=www-data
Group=www-data
Environment=ASPNETCORE_ENVIRONMENT=Production
Environment=ASPNETCORE_URLS=http://localhost:${APP_PORT}

[Install]
WantedBy=multi-user.target
EOF

systemctl daemon-reload
systemctl enable cobalt-api >/dev/null 2>&1
systemctl restart cobalt-api

info "Waiting for API service to start..."
SERVICE_OK=false
for _ in $(seq 1 20); do
    sleep 1
    if systemctl is-active --quiet cobalt-api; then SERVICE_OK=true; break; fi
done
$SERVICE_OK && success "API service is running" \
    || warn "API did not start in time — diagnose with: journalctl -u cobalt-api -n 50 --no-pager"

# ══════════════════════════════════════════════
#  STEP 9 — Nginx
# ══════════════════════════════════════════════
step "Configuring Nginx"

rm -f /etc/nginx/sites-enabled/default

cat > /etc/nginx/conf.d/cobalt-performance.conf <<'NGINXPERF'
gzip_vary on;
gzip_proxied any;
gzip_comp_level 6;
gzip_types text/plain text/css text/javascript application/javascript application/json image/svg+xml;

client_max_body_size 100M;
keepalive_timeout 65;

add_header X-Frame-Options "SAMEORIGIN" always;
add_header X-Content-Type-Options "nosniff" always;
add_header Referrer-Policy "strict-origin-when-cross-origin" always;

limit_req_zone $binary_remote_addr zone=cobalt_login:10m rate=5r/m;
NGINXPERF

cat > "/etc/nginx/sites-available/cobalt" <<EOF
server {
    listen 80;
    server_name ${MAIN_DOMAIN};

    root ${FRONTEND_DIR};
    index index.html;

    # Rate-limit the login endpoint.
    location = /api/auth/login {
        limit_req zone=cobalt_login burst=3 nodelay;
        proxy_pass         http://localhost:${APP_PORT}/api/auth/login;
        proxy_http_version 1.1;
        proxy_set_header   Host              \$host;
        proxy_set_header   X-Real-IP         \$remote_addr;
        proxy_set_header   X-Forwarded-For   \$proxy_add_x_forwarded_for;
        proxy_set_header   X-Forwarded-Proto \$scheme;
    }

    # API + uploaded media proxied to the backend.
    location ^~ /api/ {
        proxy_pass         http://localhost:${APP_PORT}/api/;
        proxy_http_version 1.1;
        proxy_set_header   Host              \$host;
        proxy_set_header   X-Real-IP         \$remote_addr;
        proxy_set_header   X-Forwarded-For   \$proxy_add_x_forwarded_for;
        proxy_set_header   X-Forwarded-Proto \$scheme;
        proxy_read_timeout 60s;
    }

    # Cache hashed static assets aggressively.
    location /assets/ {
        expires 30d;
        add_header Cache-Control "public, immutable";
        try_files \$uri =404;
    }

    # SPA fallback — React Router handles /about, /admin, etc.
    location / {
        try_files \$uri \$uri/ /index.html;
    }

    client_max_body_size 100M;
}
EOF

ln -sf /etc/nginx/sites-available/cobalt /etc/nginx/sites-enabled/cobalt

if nginx -t 2>/dev/null; then
    systemctl reload nginx
    success "Nginx configured and reloaded"
else
    nginx -t
    warn "Nginx config has errors — check output above."
fi

# ══════════════════════════════════════════════
#  STEP 10 — SSL with Let's Encrypt
# ══════════════════════════════════════════════
step "Obtaining SSL Certificate"

info "Getting SSL for ${MAIN_DOMAIN}..."
if certbot --nginx -d "$MAIN_DOMAIN" \
    --non-interactive --agree-tos \
    --email "admin@${MAIN_DOMAIN}" \
    --redirect 2>/dev/null; then
    success "SSL ready for ${MAIN_DOMAIN}"
else
    warn "SSL failed — make sure DNS points here, then run:"
    warn "  certbot --nginx -d ${MAIN_DOMAIN} --redirect"
fi

systemctl enable certbot.timer 2>/dev/null \
    || { (crontab -l 2>/dev/null; echo "0 3 * * * certbot renew --quiet") | crontab -; }

# ══════════════════════════════════════════════
#  Done
# ══════════════════════════════════════════════
echo ""
echo -e "${GREEN}${BOLD}"
echo "  ╔═══════════════════════════════════════════╗"
echo "  ║        Installation Complete! ✓           ║"
echo "  ╚═══════════════════════════════════════════╝"
echo -e "${NC}"
echo -e "  🌐  Website   : ${CYAN}https://${MAIN_DOMAIN}${NC}"
echo -e "  🔧  Admin     : ${CYAN}https://${MAIN_DOMAIN}/admin${NC}"
echo -e "  👤  Username  : ${CYAN}${ADMIN_USER}${NC}"
echo -e "  🔑  Password  : ${CYAN}(the one you entered)${NC}"
echo ""
echo -e "  ${YELLOW}Useful commands:${NC}"
echo -e "  systemctl restart cobalt-api         — restart the API"
echo -e "  journalctl -u cobalt-api -f          — live API logs"
echo -e "  certbot renew                        — renew SSL manually"
echo ""
if ! $SERVICE_OK; then
    echo -e "  ${RED}⚠  API service did not start automatically.${NC}"
    echo -e "  Diagnose with: ${YELLOW}journalctl -u cobalt-api -n 50 --no-pager${NC}"
    echo ""
fi
