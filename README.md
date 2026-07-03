# Cobalt

A modern, fully self-managed portfolio / resume website — dark navy + electric-blue theme,
with a complete admin panel that controls **everything** (text, numbers, tags, stats and colors).

## Stack
- **Frontend:** React + Vite + Tailwind CSS (React Router)
- **Backend:** ASP.NET (ResumeAPI) — stores the whole site content as one JSON document
- **Admin:** `/admin` — edits all content live and saves to the backend

## Structure
```
src/                   frontend (React + Vite)
├── components/        public site (Navbar, sections, UI)
├── content/           unified content model + ContentProvider
├── admin/             admin panel (pages, components, API client)
├── hooks/
└── App.jsx
backend/ResumeAPI/     ASP.NET Core (.NET 9) API — see backend/README.md
```

## Deploy to a server (one command)

On a fresh Ubuntu 20.04+ server (as root), point your domain's DNS A record at
the server, then run:

```bash
bash <(curl -Ls https://raw.githubusercontent.com/AbolfazlTafakori/Cobalt/main/install.sh)
```

The installer sets up Node.js, .NET 9, Nginx and Certbot; builds the frontend
and backend; creates a `cobalt-api` systemd service; and issues an SSL
certificate. It asks only for your domain and admin credentials.

> The repository must be **public** for the one-command install to work
> (`curl` and `git clone` need anonymous access). See `install.sh` for the
> local/private-repo path.

## Run (local development)
```bash
# Frontend
npm install
npm run dev            # http://localhost:5173  (admin at /admin)

# Backend (.NET 9)
cd backend/ResumeAPI
dotnet run             # http://localhost:5021
```

Admin default login: `admin` / `admin123` (change it from the panel).
