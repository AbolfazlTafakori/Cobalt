# Cobalt

A modern, fully self-managed **portfolio / resume website** — dark navy + electric-blue
theme, with a complete admin panel that controls **everything** on the site: text,
numbers, tags, stats, social links, projects, and even the theme colors. No code
edits needed to update your content — just log in to `/admin` and save.

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

## Project structure

```
Cobalt/
├── src/                       Frontend (React + Vite)
│   ├── components/            public site — Navbar, sections, UI widgets
│   ├── content/              unified content model + ContentProvider
│   ├── admin/                admin panel — pages, components, API client
│   ├── hooks/
│   └── App.jsx
├── backend/
│   └── ResumeAPI/            ASP.NET Core 9 API  (see backend/README.md)
├── install.sh               one-command server installer
└── README.md
```

---

## Deploy to a server (one command)

On a fresh **Ubuntu 20.04+** server, point your domain's DNS **A record** at the
server's IP, then run this as **root**:

```bash
bash <(curl -Ls https://raw.githubusercontent.com/AbolfazlTafakori/Cobalt/main/install.sh)
```

The installer is fully automated and asks only for your **domain** and **admin
credentials**. It then:

1. Installs **Node.js 20**, **.NET 9 SDK**, **Nginx**, and **Certbot**
2. Builds the frontend (`npm run build` → `dist/`)
3. Publishes the backend (`dotnet publish -c Release`)
4. Writes `appsettings.json` with a random 64-char JWT secret and your admin login
5. Registers a **`cobalt-api`** systemd service (auto-restart on boot/crash)
6. Configures **Nginx** — serves the site, proxies `/api` to the backend, and
   handles React Router routes (SPA fallback) with login rate-limiting
7. Issues an **SSL certificate** via Let's Encrypt with automatic renewal

When it finishes:

- 🌐 Website: `https://your-domain`
- 🔧 Admin:   `https://your-domain/admin`

> **Note:** Because the site and admin share the same React app, only **one
> domain** is required — the admin lives at the `/admin` route.

### Requirements for the one-command install

The command above fetches `install.sh` and clones the repo anonymously, so the
**GitHub repository must be public**. If you keep it private, either:

- clone it manually to `/opt/cobalt/src` and run `install.sh` from there, or
- run the installer from a local checkout (`sudo bash install.sh`) — it detects
  local project files and skips the clone.

### Managing the deployment

```bash
systemctl restart cobalt-api        # restart the API
systemctl status  cobalt-api        # service status
journalctl -u cobalt-api -f         # live API logs
certbot renew                       # renew SSL manually
```

Runtime data (content + uploads) lives in `/opt/cobalt/data/` and is **preserved
across re-installs**.

---

## Run locally (development)

Requires **Node.js 18+** and the **.NET 9 SDK**.

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
