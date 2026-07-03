# ResumeAPI — Cobalt backend

ASP.NET Core (.NET 9) Minimal API that powers the Cobalt admin panel and public
site. It stores the whole site as a single JSON document, handles admin auth,
image uploads, and backup/restore.

## Run

```bash
cd backend/ResumeAPI
dotnet run            # http://localhost:5021
```

On first run it seeds `Data/` with:
- `auth.json`   — admin account (`admin` / `admin123`, password stored as PBKDF2 hash)
- `content.json`— the site content document (starts empty; the React app deep-merges it over its built-in defaults)
- `uploads/`    — uploaded images / CV files

`Data/`, `bin/`, and `obj/` are git-ignored.

## Configuration (`appsettings.json`)

- `Admin:Username` / `Admin:Password` — seed credentials (used only on first run)
- `Jwt:Secret` — **change this in production** (min 32 bytes)
- `Urls` — listen address (default `http://localhost:5021`)

## Endpoints (all under `/api`)

| Method | Path | Auth | Purpose |
|--------|------|------|---------|
| POST | `/auth/login` | – | Returns `{ token }` |
| POST | `/auth/change-password` | ✓ | Change admin password |
| GET  | `/content` | – | Full site content document |
| PUT  | `/content` | ✓ | Save the content document |
| GET/PUT | `/profile` | ✓ | Profile sub-object |
| GET/PUT | `/sitetexts` | ✓ | Free-form text sub-object |
| GET/POST/PUT/DELETE | `/{skills\|projects\|education\|experience\|socials}` | ✓* | Legacy collections |
| POST | `/upload` | ✓ | Multipart file → `{ filename }` |
| GET  | `/uploads/{filename}` | – | Serve an uploaded file |
| GET  | `/backup` | ✓ | Download a zip of content + uploads |
| POST | `/restore` | ✓ | Restore from a backup zip |

\* GET on collections is public; writes require auth.

Authenticate by sending `Authorization: Bearer <token>` from the login response.
