import api from './api.js';

const normalizeUser = (user) => ({
  username: user?.username || user?.email || user?.name || '',
  role: user?.role || user?.user_type || 'Admin',
  name: user?.name || `${user?.first_name || ''} ${user?.last_name || ''}`.trim() || user?.username || 'User',
});

export async function login({ username, password }) {
  const { data } = await api.post('auth/login/', { username, password });
  const payload = data?.data ?? data;
  const token = payload?.access || payload?.token || payload?.access_token || payload?.accessToken || '';
  const refreshToken = payload?.refresh || payload?.refresh_token || payload?.refreshToken || '';

  if (!token) {
    throw new Error(payload?.detail || payload?.message || 'Login failed');
  }
  // localStorage.setItem('authToken', token);
  // if (refreshToken) {
  //   localStorage.setItem('refreshToken', refreshToken);
  // }
  return {
    token,
    refreshToken,
    user: normalizeUser(payload?.user || payload?.data?.user || payload?.user_details || payload),
  };
}

export async function logout() {
  try {
    await api.post('auth/logout/');
  } catch (error) {
    console.error('Logout failed on backend.', error);
  }
  return { success: true };
}
