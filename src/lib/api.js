const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:4000/agriassist';

export function getToken() {
  return localStorage.getItem('agri_token') || '';
}

export function setToken(token) {
  if (!token) localStorage.removeItem('agri_token');
  else localStorage.setItem('agri_token', token);
}

export function getUser() {
  try {
    const raw = localStorage.getItem('agri_user');
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function setUser(user) {
  if (!user) localStorage.removeItem('agri_user');
  else localStorage.setItem('agri_user', JSON.stringify(user));
}

export async function apiFetch(path, { method = 'GET', body, headers = {}, isForm = false } = {}) {
  const token = getToken();
  const finalHeaders = {
    ...headers,
    ...(token ? { Authorization: token } : {}),
  };
  if (!isForm && body !== undefined) finalHeaders['Content-Type'] = 'application/json';

  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers: finalHeaders,
    body: body === undefined ? undefined : isForm ? body : JSON.stringify(body),
  });

  const text = await res.text();
  let data = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = { raw: text };
  }

  if (!res.ok) {
    const message = data?.message || data?.error || 'Request failed';
    const err = new Error(message);
    err.status = res.status;
    err.data = data;
    throw err;
  }
  return data;
}

