# Cobalt

A modern, fully self-managed portfolio / resume website — dark navy + electric-blue theme,
with a complete admin panel that controls **everything** (text, numbers, tags, stats and colors).

## Stack
- **Frontend:** React + Vite + Tailwind CSS (React Router)
- **Backend:** ASP.NET (ResumeAPI) — stores the whole site content as one JSON document
- **Admin:** `/admin` — edits all content live and saves to the backend

## Structure
```
src/
├── components/        public site (Navbar, sections, UI)
├── content/           unified content model + ContentProvider
├── admin/             admin panel (pages, components, API client)
├── hooks/
└── App.jsx
```

## Run
```bash
# Frontend
npm install
npm run dev            # http://localhost:5173  (admin at /admin)

# Backend (separate .NET project)
dotnet run             # http://localhost:5021
```

Admin default login: `admin` / `admin123` (change it from the panel).
