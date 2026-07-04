const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateEmail(v: string): string | undefined {
  const t = v.trim();
  if (!t) return 'Введите email';
  if (!EMAIL_RE.test(t)) return 'Некорректный email';
  return undefined;
}

export function validatePassword(v: string): string | undefined {
  if (!v) return 'Введите пароль';
  if (v.length < 6) return 'Минимум 6 символов';
  return undefined;
}

export function validateConfirm_password(v: string, password: string): string | undefined {
  if (!v) return 'Повторите пароль';
  if (v !== password) return 'Пароли не совпадают';
  return undefined;
}
