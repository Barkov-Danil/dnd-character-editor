import AsyncStorage from '@react-native-async-storage/async-storage';

// Для реального устройства укажи IP сервера: http://192.168.x.x:3001
// Для эмулятора Android: http://10.0.2.2:3001
const API_BASE = 'http://localhost:3001';
const TOKEN_KEY = '@dnd_auth_token';

type ApiResponse = { success: boolean; message?: string; token?: string };

export async function getToken(): Promise<string | null> {
  return AsyncStorage.getItem(TOKEN_KEY);
}

export async function setToken(token: string | null): Promise<void> {
  if (token) await AsyncStorage.setItem(TOKEN_KEY, token);
  else await AsyncStorage.removeItem(TOKEN_KEY);
}

export async function clearToken(): Promise<void> {
  await AsyncStorage.removeItem(TOKEN_KEY);
}

async function apiPost(path: string, body: object): Promise<ApiResponse> {
  try {
    const res = await fetch(`${API_BASE}${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    if (data.token) await setToken(data.token);
    return data;
  } catch {
    return { success: false, message: 'Сервер недоступен' };
  }
}

export async function apiLogin(email: string, password: string): Promise<ApiResponse> {
  return apiPost('/api/auth/login', { email, password });
}

export async function apiRegister(email: string, password: string, confirmPassword: string): Promise<ApiResponse> {
  return apiPost('/api/auth/register', { email, password, confirmPassword });
}

export async function apiVerifyEmail(_email: string, _code: string): Promise<ApiResponse> {
  return { success: true, message: 'OK' };
}

export async function apiResendCode(_email: string): Promise<ApiResponse> {
  return { success: true, message: 'OK' };
}

export async function apiForgotPassword(email: string): Promise<ApiResponse> {
  return apiPost('/api/auth/forgot-password', { email });
}

export async function apiVerifyResetCode(_email: string, _code: string): Promise<ApiResponse> {
  return { success: true, message: 'OK' };
}

export async function apiResetPassword(email: string, newPassword: string, confirmPassword: string): Promise<ApiResponse> {
  return apiPost('/api/auth/reset-password', { email, newPassword, confirmPassword });
}
