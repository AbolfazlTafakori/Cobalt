#!/bin/bash
# ============================================================
#  Cobalt — Management CLI  (c-ui)
#  Usage: c-ui
# ============================================================

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
BLUE='\033[0;34m'
BOLD='\033[1m'
DIM='\033[2m'
NC='\033[0m'

SERVICE='cobalt-api'
SERVICE_FILE="/etc/systemd/system/${SERVICE}.service"
NGINX_MAIN='/etc/nginx/sites-available/cobalt-main'
NGINX_ADMIN='/etc/nginx/sites-available/cobalt-admin'
INSTALL_DIR='/opt/cobalt'
SRC_DIR="${INSTALL_DIR}/src"
PUBLISH_DIR="${INSTALL_DIR}/publish"
FRONTEND_DIR="${INSTALL_DIR}/frontend"
DATA_DIR="${INSTALL_DIR}/data"
APPSETTINGS="${PUBLISH_DIR}/appsettings.json"
REPO_URL='https://github.com/AbolfazlTafakori/Cobalt.git'

[[ $EUID -ne 0 ]] && exec sudo bash "$0" "$@"

# ── helpers ──────────────────────────────────────────────────
json_get()   { grep -oP "\"$1\"\\s*:\\s*\"\\K[^\"]+" "$APPSETTINGS" 2>/dev/null | head -1; }
main_names() { grep -m1 -oP '(?<=server_name )[^;]+' "$NGINX_MAIN"  2>/dev/null; }
admin_name() { grep -m1 -oP '(?<=server_name )[^;]+' "$NGINX_ADMIN" 2>/dev/null; }
dotnet_bin() { grep -oP '(?<=ExecStart=)\S+' "$SERVICE_FILE" 2>/dev/null | head -1; }
app_port()   { grep -oP '(?<=localhost:)\d+' "$APPSETTINGS" 2>/dev/null | head -1; }

pause() { echo ""; read -rp "$(echo -e "  ${DIM}Press Enter to continue...${NC}")" _; }
ok()    { echo -e "\n  ${GREEN}✓  $1${NC}"; }
fail()  { echo -e "\n  ${RED}✗  $1${NC}"; }
info()  { echo -e "  ${CYAN}·  $1${NC}"; }
warn()  { echo -e "  ${YELLOW}!  $1${NC}"; }

svc_status() {
    local s; s=$(systemctl is-active "$SERVICE" 2>/dev/null)
    if [[ "$s" == "active" ]]; then echo -e "${GREEN}● running${NC}"; else echo -e "${RED}● ${s}${NC}"; fi
}

header() {
    clear
    echo ""
    echo -e "  ${BOLD}${CYAN}┌─────────────────────────────────────────────────────┐${NC}"
    echo -e "  ${BOLD}${CYAN}│${NC}               ${BOLD}Cobalt Portfolio  ·  c-ui${NC}             ${BOLD}${CYAN}│${NC}"
    echo -e "  ${BOLD}${CYAN}└─────────────────────────────────────────────────────┘${NC}"
    echo ""
}

show_status() {
    echo -e "  ${DIM}┌──────────────────────────────────────────────────┐${NC}"
    echo -e "  ${DIM}│${NC}  API      $(svc_status)"
    echo -e "  ${DIM}│${NC}  Website  ${CYAN}https://$(main_names)${NC}"
    echo -e "  ${DIM}│${NC}  Admin    ${CYAN}https://$(admin_name)${NC}"
    echo -e "  ${DIM}│${NC}  User     $(json_get Username)"
    echo -e "  ${DIM}└──────────────────────────────────────────────────┘${NC}"
    echo ""
}

section() {
    echo -e "\n  ${BOLD}${BLUE}▸ $1${NC}"
    echo -e "  ${DIM}────────────────────────────────────────${NC}"
}

# Rewrite appsettings.json, preserving JWT secret / data dir / port.
write_appsettings() {
    local user="$1" pass="$2"
    local jwt datadir port
    jwt=$(json_get Secret);  [[ -z "$jwt" ]]     && jwt=$(head -c 48 /dev/urandom | base64 | tr -dc 'a-zA-Z0-9' | head -c 64)
    datadir=$(json_get Dir); [[ -z "$datadir" ]] && datadir="$DATA_DIR"
    port=$(app_port);        [[ -z "$port" ]]    && port=5000

    cat > "$APPSETTINGS" <<EOF
{
  "Logging": {
    "LogLevel": {
      "Default": "Warning",
      "Microsoft.AspNetCore": "Warning"
    }
  },
  "AllowedHosts": "*",
  "Urls": "http://localhost:${port}",
  "Data": {
    "Dir": "${datadir}"
  },
  "Admin": {
    "Username": "${user}",
    "Password": "${pass}"
  },
  "Jwt": {
    "Secret": "${jwt}",
    "Issuer": "ResumeAPI",
    "Audience": "ResumeAPI"
  }
}
EOF
    # Force a re-seed so the new credentials take effect on next start.
    rm -f "${datadir}/auth.json"
    chown www-data:www-data "$APPSETTINGS"
    systemctl restart "$SERVICE"
}

# Replace every server_name line in a config, then reload + issue SSL.
apply_domains() {
    local conf="$1"; shift
    local names="$*"
    sed -i -E "s/server_name[[:space:]]+[^;]+;/server_name ${names};/g" "$conf"
    if nginx -t 2>/dev/null; then
        systemctl reload nginx
    else
        fail "Nginx config test failed — reverting is recommended"; nginx -t; return 1
    fi
    local args=() d
    for d in $names; do args+=(-d "$d"); done
    certbot --nginx "${args[@]}" --non-interactive --agree-tos \
        --email "admin@${names%% *}" --redirect 2>/dev/null \
        && ok "Domain updated + SSL issued" \
        || warn "Domain updated — SSL failed (check DNS)"
}

# ══════════════════════════════════════════════
#  MENU: Domains
# ══════════════════════════════════════════════
menu_domains() {
    while true; do
        header
        section "Domain Management"
        echo ""
        echo -e "    Main site  : ${CYAN}$(main_names)${NC}"
        echo -e "    Admin panel: ${CYAN}$(admin_name)${NC}"
        echo ""
        echo "    [1]  Change main site domain(s)"
        echo "    [2]  Change admin panel subdomain"
        echo "    [3]  Re-issue all SSL certificates"
        echo "    [0]  ← Back"
        echo ""
        read -rp "  Choice: " ch
        case $ch in
        1)
            echo -e "  ${DIM}Space-separate multiple hostnames, e.g.: example.com www.example.com${NC}"
            read -rp "  New main hostname(s): " new_d
            [[ -z "$new_d" ]] && continue
            apply_domains "$NGINX_MAIN" $new_d
            pause ;;
        2)
            read -rp "  New admin subdomain: " new_d
            [[ -z "$new_d" ]] && continue
            apply_domains "$NGINX_ADMIN" "$new_d"
            pause ;;
        3)
            local args=() d
            for d in $(main_names) $(admin_name); do args+=(-d "$d"); done
            certbot --nginx "${args[@]}" --non-interactive --agree-tos \
                --email "admin@$(main_names | awk '{print $1}')" --redirect 2>/dev/null \
                && ok "SSL certificates renewed" || fail "SSL renewal failed — check DNS"
            pause ;;
        0) break ;;
        esac
    done
}

# ══════════════════════════════════════════════
#  MENU: Credentials
# ══════════════════════════════════════════════
menu_credentials() {
    while true; do
        header
        section "Admin Credentials"
        echo ""
        echo -e "    Username: ${CYAN}$(json_get Username)${NC}"
        echo -e "    Password: ${DIM}(hidden)${NC}"
        echo ""
        echo "    [1]  Change username"
        echo "    [2]  Change password"
        echo "    [3]  Change both"
        echo "    [0]  ← Back"
        echo ""
        read -rp "  Choice: " ch
        local cur_u cur_p new_u new_p new_p2
        cur_u=$(json_get Username); cur_p=$(json_get Password)
        case $ch in
        1)
            read -rp "  New username (min 3 chars): " new_u
            [[ ${#new_u} -lt 3 ]] && fail "Too short" && pause && continue
            write_appsettings "$new_u" "$cur_p"
            ok "Username changed to: ${new_u}"; pause ;;
        2)
            while true; do
                read -rsp "  New password (min 8 chars): " new_p; echo
                [[ ${#new_p} -lt 8 ]] && fail "Too short" && continue
                read -rsp "  Confirm: " new_p2; echo
                [[ "$new_p" == "$new_p2" ]] && break
                fail "Passwords do not match"
            done
            write_appsettings "$cur_u" "$new_p"
            ok "Password changed"; pause ;;
        3)
            read -rp "  New username (min 3 chars): " new_u
            [[ ${#new_u} -lt 3 ]] && fail "Too short" && pause && continue
            while true; do
                read -rsp "  New password (min 8 chars): " new_p; echo
                [[ ${#new_p} -lt 8 ]] && fail "Too short" && continue
                read -rsp "  Confirm: " new_p2; echo
                [[ "$new_p" == "$new_p2" ]] && break
                fail "Passwords do not match"
            done
            write_appsettings "$new_u" "$new_p"
            ok "Credentials updated"; pause ;;
        0) break ;;
        esac
    done
}

# ══════════════════════════════════════════════
#  MENU: Service
# ══════════════════════════════════════════════
menu_service() {
    while true; do
        header
        section "Service Management"
        echo ""
        show_status
        echo "    [1]  Restart API"
        echo "    [2]  Stop API"
        echo "    [3]  Start API"
        echo "    [4]  Live logs  (Ctrl+C to exit)"
        echo "    [5]  Last 50 log lines"
        echo "    [0]  ← Back"
        echo ""
        read -rp "  Choice: " ch
        case $ch in
        1) systemctl restart "$SERVICE" && ok "Service restarted"; pause ;;
        2) systemctl stop    "$SERVICE" && warn "Service stopped";  pause ;;
        3) systemctl start   "$SERVICE" && ok "Service started";    pause ;;
        4) journalctl -u "$SERVICE" -f ;;
        5) journalctl -u "$SERVICE" -n 50 --no-pager; pause ;;
        0) break ;;
        esac
    done
}

# ══════════════════════════════════════════════
#  MENU: Update
# ══════════════════════════════════════════════
menu_update() {
    header
    section "Update Cobalt"
    echo ""
    echo -e "  This will:"
    echo -e "    ${DIM}·${NC} Pull the latest code from GitHub"
    echo -e "    ${DIM}·${NC} Rebuild the frontend and backend"
    echo -e "    ${DIM}·${NC} Restart the API service"
    echo -e "    ${DIM}·${NC} ${GREEN}Keep your data, credentials and domains intact${NC}"
    echo ""
    read -rp "$(echo -e "  ${YELLOW}Proceed with update? [y/N]:${NC} ")" CONFIRM
    [[ ! "$CONFIRM" =~ ^[Yy]$ ]] && return

    local dotnet_exec; dotnet_exec=$(dotnet_bin)
    [[ -z "$dotnet_exec" ]] && dotnet_exec="$(command -v dotnet)"

    local TMP="/tmp/cobalt-update-$$"
    info "Pulling latest code..."
    git clone --depth=1 "$REPO_URL" "$TMP" 2>&1 \
        || { fail "Git clone failed — check internet/repo access"; rm -rf "$TMP"; pause; return; }

    info "Building frontend..."
    ( cd "$TMP" && npm ci --no-audit --no-fund 2>&1 | tail -2 && npm run build 2>&1 | tail -3 )
    if [[ ! -f "$TMP/dist/index.html" ]]; then
        fail "Frontend build failed — keeping current version"; rm -rf "$TMP"; pause; return
    fi

    info "Building backend..."
    local BK="$PUBLISH_DIR.bak"
    cp -r "$PUBLISH_DIR" "$BK"                     # rollback point
    cp "$APPSETTINGS" "/tmp/cobalt-appsettings-$$" # preserve config
    rm -rf /tmp/cobalt-build && mkdir -p /tmp/cobalt-build
    ( cd "$TMP/backend/ResumeAPI" && "$dotnet_exec" publish -c Release -o "$PUBLISH_DIR" \
        -p:BaseIntermediateOutputPath=/tmp/cobalt-build/obj/ \
        -p:BaseOutputPath=/tmp/cobalt-build/bin/ --nologo 2>&1 \
        | grep -vE "^[[:space:]]*$|Telemetry|telemetry|learn\.microsoft" )

    if [[ ! -f "$PUBLISH_DIR/ResumeAPI.dll" ]]; then
        fail "Backend build failed — rolling back"
        rm -rf "$PUBLISH_DIR"; mv "$BK" "$PUBLISH_DIR"
        systemctl start "$SERVICE"; rm -rf "$TMP"; pause; return
    fi
    rm -rf "$BK"

    info "Deploying frontend + config..."
    rm -rf "$FRONTEND_DIR"; cp -r "$TMP/dist" "$FRONTEND_DIR"
    cp "/tmp/cobalt-appsettings-$$" "$APPSETTINGS"; rm -f "/tmp/cobalt-appsettings-$$"

    # Refresh source checkout + the management tool itself.
    rm -rf "$SRC_DIR"; cp -r "$TMP" "$SRC_DIR"
    [[ -f "$TMP/c-ui.sh" ]] && cp "$TMP/c-ui.sh" /usr/local/bin/c-ui && chmod +x /usr/local/bin/c-ui

    info "Fixing permissions..."
    chown -R www-data:www-data "$INSTALL_DIR"
    chmod -R 755 "$INSTALL_DIR"; chmod -R 775 "$DATA_DIR"

    rm -rf "$TMP"
    systemctl daemon-reload; systemctl restart "$SERVICE"; sleep 2
    systemctl is-active --quiet "$SERVICE" \
        && ok "Update complete — service is running" \
        || warn "Service did not start — journalctl -u ${SERVICE} -n 30 --no-pager"
    pause
}

# ══════════════════════════════════════════════
#  MENU: Uninstall
# ══════════════════════════════════════════════
menu_uninstall() {
    header
    section "Uninstall Cobalt"
    echo ""
    echo -e "  ${RED}${BOLD}⚠  This will permanently remove:${NC}"
    echo ""
    echo -e "    ${DIM}·${NC} API service  (${SERVICE})"
    echo -e "    ${DIM}·${NC} All site files  (${INSTALL_DIR})"
    echo -e "    ${DIM}·${NC} Nginx configs  (cobalt-main, cobalt-admin)"
    echo -e "    ${DIM}·${NC} c-ui management tool"
    echo ""
    read -rp "$(echo -e "  ${YELLOW}Also remove SSL certificates? [y/N]:${NC} ")" RM_SSL
    echo ""
    echo -e "  ${RED}${BOLD}This cannot be undone.${NC}"
    read -rp "$(echo -e "  Type  ${BOLD}yes${NC}  to confirm: ")" FINAL
    [[ "$FINAL" != "yes" ]] && warn "Uninstall cancelled" && pause && return

    local main_d admin_d; main_d=$(main_names | awk '{print $1}'); admin_d=$(admin_name)

    info "Stopping service..."
    systemctl stop "$SERVICE" 2>/dev/null; systemctl disable "$SERVICE" 2>/dev/null
    rm -f "$SERVICE_FILE"; systemctl daemon-reload

    info "Removing nginx configs..."
    rm -f /etc/nginx/sites-enabled/cobalt-main /etc/nginx/sites-enabled/cobalt-admin
    rm -f /etc/nginx/sites-available/cobalt-main /etc/nginx/sites-available/cobalt-admin
    rm -f /etc/nginx/conf.d/cobalt-performance.conf
    nginx -t 2>/dev/null && systemctl reload nginx

    if [[ "$RM_SSL" =~ ^[Yy]$ ]]; then
        info "Removing SSL certificates..."
        certbot delete --cert-name "$main_d"  --non-interactive 2>/dev/null || true
        certbot delete --cert-name "$admin_d" --non-interactive 2>/dev/null || true
    fi

    info "Removing site files..."
    rm -rf "$INSTALL_DIR"
    rm -f /usr/local/bin/c-ui

    echo ""
    echo -e "  ${GREEN}${BOLD}✓  Uninstall complete.${NC}"
    echo -e "  ${DIM}Nginx, Node and .NET remain installed (system packages).${NC}"
    echo ""
    exit 0
}

# ══════════════════════════════════════════════
#  MAIN MENU
# ══════════════════════════════════════════════
[[ -f "$SERVICE_FILE" ]] || { echo -e "${RED}Cobalt does not appear to be installed.${NC}"; exit 1; }

while true; do
    header
    show_status
    echo -e "  ${BOLD}Main Menu${NC}"
    echo ""
    echo "    [1]  Domain management"
    echo "    [2]  Admin credentials"
    echo "    [3]  Service management"
    echo "    [4]  Update to latest version"
    echo ""
    echo -e "    ${RED}[5]  Uninstall${NC}"
    echo ""
    echo "    [0]  Exit"
    echo ""
    read -rp "  Choice: " choice
    case $choice in
    1) menu_domains ;;
    2) menu_credentials ;;
    3) menu_service ;;
    4) menu_update ;;
    5) menu_uninstall ;;
    0) echo ""; exit 0 ;;
    esac
done
