import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { router, Href } from 'expo-router';
import { AuthScreen } from './components/AuthScreen';
import { AuthInput } from './components/AuthInput';
import { AuthButton } from './components/AuthButton';
import { apiRegister } from './api';
import { AUTH_COLORS } from './theme';
import {
  validateEmail,
  validatePassword,
  validateConfirm_password,
} from './validation';

export default function RegisterScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [emailErr, setEmailErr] = useState<string | undefined>();
  const [passwordErr, setPasswordErr] = useState<string | undefined>();
  const [confirmErr, setConfirmErr] = useState<string | undefined>();
  const [touched, setTouched] = useState<{ password?: boolean; confirm?: boolean }>({});
  const [loading, setLoading] = useState(false);

  const canSubmit =
    email.trim().length > 0 &&
    password.length >= 6 &&
    password === confirm &&
    !emailErr &&
    !passwordErr &&
    !confirmErr;

  const onChangeEmail = (v: string) => {
    setEmail(v);
    setEmailErr(validateEmail(v));
  };
  const onChangePassword = (v: string) => {
    const cleaned = v.replace(/\s/g, '');
    setPassword(cleaned);
    setPasswordErr(touched.password ? validatePassword(cleaned) : undefined);
    if (touched.confirm) setConfirmErr(validateConfirm_password(confirm, cleaned));
  };
  const onChangeConfirm = (v: string) => {
    const cleaned = v.replace(/\s/g, '');
    setConfirm(cleaned);
    setTouched((t) => ({ ...t, confirm: true }));
    setConfirmErr(validateConfirm_password(cleaned, password));
  };

  const submit = async () => {
    const eErr = validateEmail(email);
    const pErr = validatePassword(password);
    const cErr = validateConfirm_password(confirm, password);
    setEmailErr(eErr);
    setPasswordErr(pErr);
    setConfirmErr(cErr);
    setTouched({ password: true, confirm: true });
    if (eErr || pErr || cErr) return;
    setLoading(true);
    const res = await apiRegister(email, password, confirm);
    setLoading(false);
    if (!res.success) {
      Alert.alert('Ошибка', res.message || 'Не удалось зарегистрироваться');
      return;
    }
    router.push({ pathname: '/auth/verify-email', params: { email } } as Href);
  };

  return (
    <AuthScreen title="Регистрация" cardHeight={488} titleMarginTop={0}>
      <AuthInput
        value={email}
        onChangeText={onChangeEmail}
        placeholder="Электронная почта"
        keyboardType="email-address"
        error={emailErr}
        style={styles.emailField}
        onBlur={() => setEmailErr(validateEmail(email))}
      />
      <AuthInput
        value={password}
        onChangeText={onChangePassword}
        placeholder="Пароль"
        secure
        showEye
        error={passwordErr}
        style={styles.passwordField}
        absoluteError
        onBlur={() => {
          setTouched((t) => ({ ...t, password: true }));
          setPasswordErr(validatePassword(password));
        }}
      />
      <AuthInput
        value={confirm}
        onChangeText={onChangeConfirm}
        placeholder="Повтор пароля"
        secure
        showEye
        error={confirmErr}
        style={styles.confirmField}
        absoluteError
        onBlur={() => {
          setTouched((t) => ({ ...t, confirm: true }));
          setConfirmErr(validateConfirm_password(confirm, password));
        }}
      />

      <View style={styles.btnWrap}>
        <View style={styles.bottomRow}>
          <Text style={styles.hint}>Есть аккаунт? </Text>
          <TouchableOpacity onPress={() => router.push('/auth/login' as `/auth/login`)}>
            <Text style={styles.link}>Войти</Text>
          </TouchableOpacity>
        </View>
        <AuthButton label="Продолжить" onPress={submit} disabled={!canSubmit} loading={loading} />
      </View>
    </AuthScreen>
  );
}

const styles = StyleSheet.create({
  emailField: {
    marginTop: 32,
  },
  passwordField: {
    marginTop: 16,
  },
  confirmField: {
    marginTop: 16,
  },
  btnWrap: {
    marginTop: 44,
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    marginBottom: 12,
  },
  hint: {
    color: AUTH_COLORS.textSecondary,
    fontSize: 14,
    fontFamily: 'Spectral-Regular',
  },
  link: {
    color: AUTH_COLORS.accent,
    fontSize: 14,
    fontFamily: 'Spectral-Regular',
  },
});
