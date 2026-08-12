# Cobalt

A modern, fully self-managed **portfolio / resume website** — dark navy + electric-blue
theme, with a complete admin panel that controls **everything** on the site: text,
numbers, tags, stats, social links, projects, and even the theme colors. No code
edits needed to update your content — just log in to `/admin` and save.

Stats can also read themselves from GitHub, and the site ships with an optional
light theme — both switched on from the panel. See [Admin panel](#admin-panel).

---

## ⚡ Quick install

Deploy the whole site (frontend + backend + SSL) to a fresh Ubuntu server with a
single command, run as **root**:

```bash
bash <(curl -Ls https://raw.githubusercontent.com/AbolfazlTafakori/Cobalt/main/install.sh)
```

Just point your domain's DNS at the server first. Full details in
[Deploy to a server](#deploy-to-a-server-one-command) below.

---

## Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | React 19 · Vite · Tailwind CSS · React Router |
| **Backend** | ASP.NET Core 9 (Minimal API) — `ResumeAPI` |
| **Auth** | JWT bearer tokens · PBKDF2-hashed admin password |
| **Storage** | Single JSON content document + uploaded files on disk |
| **Deploy** | Nginx reverse proxy · systemd service · Let's Encrypt SSL |

The entire site is driven by one content document. The admin panel edits it live and
saves it to the backend (`PUT /api/content`); the public site loads it on start
(`GET /api/content`) and deep-merges it over the built-in defaults.

---

## Admin panel

Sign in at `/admin` (or at the admin subdomain in a server install). Every page
edits the shared content document live and saves it with one button.

| Page | Controls |
|------|----------|
| **Identity** | Name, role, greeting, tagline, profile photo, CV file or link |
| **Navbar** | Logo text, download-button label, menu labels, theme switch |
| **Theme & Colors** | Brand and surface colors for the whole site |
| **Home (Stats)** | The four numbers under the hero |
| **About / Skills / Projects / Contact** | Copy, cards, tags, images, links |
| **Social Links** | Label, URL and icon per link |
| **Change Password** | Admin credentials |

Two behaviors worth knowing about:

### Live GitHub stats

Any stat — on the Home bar or the Projects header — can read its number from
GitHub instead of being typed. Switch on **Live GitHub** under the stat and pick
what it counts:

| Metric | Source |
|--------|--------|
| **Repositories** | Your public repository count |
| **Commits this year** | Public commits authored since January 1st |

The account comes from whichever **Social Links** entry points at a GitHub
profile, so there is nothing extra to configure and no token to keep. The number
you typed stays as the offline fallback: if GitHub is unreachable, rate limited,
or no GitHub link is set, the site quietly shows the typed value instead of a
blank.

The call is made from the visitor's own browser, so GitHub's 60-an-hour
unauthenticated limit is spent per visitor rather than pooled across the site.
Each browser caches the result for 15 minutes — enough to keep a browsing
session from re-fetching on every page, short enough that the number tracks
reality. The admin panel always reads live, so what you see there is current. A
site with no live stat never calls GitHub at all.

### Light theme

The site is dark by default and the theme switch is **hidden** — the button is
not rendered at all, so visitors see one deliberate look. Turn on *Show the
light/dark switch in the header* under **Navbar** to offer both; each visitor's
choice is then remembered in their browser.

### Saving from two tabs

Each admin page holds the whole content document and saves all of it, so a tab
left open would otherwise overwrite everything saved since it loaded. A save
carrying a stale revision is refused and nothing is written — your edits stay on
screen with an offer to reload.

---

## Project structure

```
Cobalt/
├── src/                      Frontend (React + Vite)
│   ├── components/           public site — Navbar, sections, UI widgets
│   ├── content/              content model, ContentProvider, GitHub stats
│   ├── admin/                admin panel — pages, components, API client
│   ├── hooks/
│   ├── index.css             theme tokens (dark + light) and base styles
│   └── App.jsx
├── backend/
│   └── ResumeAPI/            ASP.NET Core 9 API  (see backend/README.md)
├── install.sh                one-command server installer
└── README.md
```

---

## Deploy to a server (one command)

On a fresh **Ubuntu 20.04+** server, point your domain's DNS **A record** at the
server's IP, then run this as **root**:

```bash
bash <(curl -Ls https://raw.githubusercontent.com/AbolfazlTafakori/Cobalt/main/install.sh)
```

The installer runs in this order:

1. Installs **Node.js 20**, **.NET 9 SDK**, **Nginx**, and **Certbot**
2. Asks for the **domains** and issues **SSL certificates** (see below)
3. Asks for the **admin username & password**
4. Builds the frontend (`npm run build` → `dist/`) and publishes the backend
   (`dotnet publish -c Release`)
5. Writes `appsettings.json` with a random 64-char JWT secret and your admin login
6. Registers a **`cobalt-api`** systemd service (auto-restart on boot/crash)
7. Configures **Nginx** and finishes

### Domains — main site vs. admin panel

For security, the public site and the admin panel run on **separate hostnames**.
During install you provide:

| Prompt | Example | Purpose |
|--------|---------|---------|
| **Main site domain** | `example.com` | The public portfolio |
| **Extra main hostname** *(optional)* | `www.example.com` | Alias for the main site |
| **Admin panel subdomain** | `admin.example.com` | The admin panel, isolated |

Each hostname gets its own SSL certificate. The `/admin` route is **blocked on
the main site** (returns 404) and is reachable **only** through the admin
subdomain — so the panel is never exposed on your public URL.

When it finishes:

- 🌐 Website: `https://example.com`
- 🔧 Admin:   `https://admin.example.com`  (opens the panel directly)

### Requirements for the one-command install

The command above fetches `install.sh` and clones the repo anonymously, so the
**GitHub repository must be public**. If you keep it private, either:

- clone it manually to `/opt/cobalt/src` and run `install.sh` from there, or
- run the installer from a local checkout (`sudo bash install.sh`) — it detects
  local project files and skips the clone.

### Managing the deployment — `c-ui`

The installer adds a management menu. Just run:

```bash
c-ui
```

From the menu you can:

- **Domain management** — change the main or admin hostname(s) and re-issue SSL
- **Admin credentials** — change the username / password
- **Service management** — restart / stop / start the API and view live logs
- **Update** — pull the latest code, rebuild frontend + backend, keep your data
- **Uninstall** — remove the service, nginx configs, files (and optionally SSL)

Or use the raw commands:

```bash
systemctl restart cobalt-api        # restart the API
systemctl status  cobalt-api        # service status
journalctl -u cobalt-api -f         # live API logs
certbot renew                       # renew SSL manually
```

Runtime data (content + uploads) lives in `/opt/cobalt/data/` and is **preserved
across re-installs and updates**.

### Running alongside other apps on the same server

Cobalt is built to coexist with other sites (e.g. another portfolio) on one
server without conflicts:

- **Backend port** is auto-selected — it picks the first free port from `5000`
  up, so it never collides with another app already bound to `5000`.
- **Nginx globals** are scoped per-site. Only a uniquely-named rate-limit zone
  (`cobalt_login`) is placed in `conf.d/`; all other directives live inside
  Cobalt's own `server {}` blocks, so they never duplicate another app's
  `http{}`-level directives (which would stop nginx from loading).
- **Service, nginx configs, install dir, and CLI** are all namespaced
  (`cobalt-api`, `cobalt-main`/`cobalt-admin`, `/opt/cobalt`, `c-ui`).

---

## Run locally (development)

Requires **Node.js 20.19+** (or 22.12+) and the **.NET 9 SDK** — Vite 8 will not
run on Node 18.

```bash
# 1) Backend — terminal 1
cd backend/ResumeAPI
dotnet run                 # http://localhost:5021

# 2) Frontend — terminal 2
npm install
npm run dev                # http://localhost:5173  (admin at /admin)
```

The frontend auto-detects `localhost` and talks to the backend at
`http://localhost:5021`; in production it uses the same-origin `/api` path.

**Default admin login:** `admin` / `admin123` — change it from the panel
(Settings → Password) after first sign-in.

---

## Configuration

Backend settings live in `backend/ResumeAPI/appsettings.json`:

| Key | Purpose |
|-----|---------|
| `Admin:Username` / `Admin:Password` | Seed admin account (used only on first run) |
| `Jwt:Secret` | Token signing key — **change in production** (min 32 bytes) |
| `Data:Dir` | Where content, uploads, and credentials are stored |
| `Urls` | Listen address (default `http://localhost:5021`) |

The API reference (all endpoints) is documented in
[`backend/README.md`](backend/README.md).

---

## License

Personal project by **Abolfazl Tafakori**.
