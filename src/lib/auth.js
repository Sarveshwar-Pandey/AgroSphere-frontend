import { apiFetch, setToken, setUser, getUser } from './api';

export async function signup({ name, email, password, role, adminCode }) {
  const data = await apiFetch('/signup', {
    method: 'POST',
    body: { name, email, password, role, adminCode },
  });
  return data;
}

export async function login({ email, password }) {
  const data = await apiFetch('/login', { method: 'POST', body: { email, password } });
  if (data?.jwtToken) setToken(data.jwtToken);
  if (data?.user) setUser(data.user);
  return data;
}

export async function fetchMe() {
  const data = await apiFetch('/users/me');
  if (data?.user) setUser(data.user);
  return data?.user || null;
}

export function logout() {
  setToken('');
  setUser(null);
}

export function isAuthed() {
  return Boolean(getUser());
}

