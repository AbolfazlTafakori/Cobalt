// ============================================================
//  Admin API client — talks to the ResumeAPI .NET backend.
//  Mirrors the endpoint contract of the original admin panel.
// ============================================================

// Dev points at the local .NET server; production uses the nginx /api proxy.
const host = typeof window !== 'undefined' ? window.location.hostname : '';
export const API_BASE =
  host === 'localhost' || host === '127.0.0.1' || host === ''
    ? 'http://localhost:5021/api'
    : '/api';

const TOKEN_KEY = 'admin_token';

export const getToken = () => localStorage.getItem(TOKEN_KEY);
export const setToken = (t) => localStorage.setItem(TOKEN_KEY, t);
export const clearToken = () => localStorage.removeItem(TOKEN_KEY);
export const isAuthed = () => !!getToken();

// Build the public URL for an uploaded file.
export const uploadUrl = (filename) =>
  filename ? `${API_BASE}/uploads/${filename}` : '';

// Thrown on 401 so callers can bounce to the login screen.
export class AuthError extends Error {}

async function request(path, { method = 'GET', body, auth = true } = {}) {
  const headers = {};
  if (auth) headers.Authorization = `Bearer ${getToken()}`;
  if (body !== undefined) headers['Content-Type'] = 'application/json';

  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  if (res.status === 401) {
    clearToken();
    throw new AuthError('Session expired — please log in again');
  }
  if (!res.ok) {
    let detail = '';
    try {
      detail = await res.text();
    } catch {
      /* ignore */
    }
    throw new Error(`HTTP ${res.status}${detail ? `: ${detail}` : ''}`);
  }

  if (res.status === 204) return null;
  const text = await res.text();
  return text ? JSON.parse(text) : null;
}

// Upload a File; returns the stored filename.
export async function uploadFile(file) {
  const form = new FormData();
  form.append('file', file);
  const res = await fetch(`${API_BASE}/upload`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${getToken()}` },
    body: form,
  });
  if (res.status === 401) {
    clearToken();
    throw new AuthError('Session expired — please log in again');
  }
  if (!res.ok) throw new Error(`Image upload failed (HTTP ${res.status})`);
  const data = await res.json();
  if (!data?.filename) throw new Error('Upload returned no filename');
  return data.filename;
}

// ---- Auth ----
export const login = (username, password) =>
  request('/auth/login', { method: 'POST', auth: false, body: { username, password } });
export const changePassword = (currentPassword, newPassword) =>
  request('/auth/change-password', { method: 'POST', body: { currentPassword, newPassword } });

// ---- Whole-site content document ----
export const getContent = () => request('/content', { auth: false });
export const putContent = (content) => request('/content', { method: 'PUT', body: content });

// ---- Profile (single object) ----
export const getProfile = () => request('/profile');
export const updateProfile = (patch) => request('/profile', { method: 'PUT', body: patch });

// ---- Site texts (single object) ----
export const getTexts = () => request('/sitetexts');
export const updateTexts = (texts) => request('/sitetexts', { method: 'PUT', body: texts });

// Site texts PUT expects the full object, so merge the patch over current
// values before saving — this lets separate admin pages edit their own subset
// of text fields without blanking the others.
export async function patchTexts(patch) {
  const current = (await getTexts()) || {};
  return updateTexts({ ...current, ...patch });
}

// ---- Generic collection factory (skills/projects/education/experience/socials) ----
function collection(path) {
  return {
    list: () => request(`/${path}`),
    create: (body) => request(`/${path}`, { method: 'POST', body }),
    update: (id, body) => request(`/${path}/${id}`, { method: 'PUT', body }),
    remove: (id) => request(`/${path}/${id}`, { method: 'DELETE' }),
  };
}

export const skillsApi = collection('skills');
export const projectsApi = collection('projects');
export const educationApi = collection('education');
export const experienceApi = collection('experience');
export const socialsApi = collection('socials');

// ---- Backup / restore ----
export async function downloadBackup() {
  const res = await fetch(`${API_BASE}/backup`, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  if (res.status === 401) {
    clearToken();
    throw new AuthError('Session expired');
  }
  if (!res.ok) throw new Error('Backup failed');
  const blob = await res.blob();
  let name = `resume-backup-${new Date().toISOString().slice(0, 19).replace(/[:T]/g, '-')}.zip`;
  const cd = res.headers.get('Content-Disposition');
  const m = cd && cd.match(/filename="?([^"]+)"?/);
  if (m) name = m[1];
  return { blob, name };
}

export async function restoreBackup(file) {
  const form = new FormData();
  form.append('file', file);
  const res = await fetch(`${API_BASE}/restore`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${getToken()}` },
    body: form,
  });
  if (res.status === 401) {
    clearToken();
    throw new AuthError('Session expired');
  }
  if (!res.ok) {
    let detail = '';
    try {
      detail = await res.text();
    } catch {
      /* ignore */
    }
    throw new Error(`Restore failed${detail ? `: ${detail}` : ''}`);
  }
}
