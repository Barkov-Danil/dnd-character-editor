import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { router } from 'expo-router';
import { AuthScreen } from './components/AuthScreen';
import { AuthInput } from './components/AuthInput';
import { AuthButton } from './components/AuthButton';
import { Divider } from './components/Divider';
import { SocialButtons } from './components/SocialButtons';
import { apiLogin, getToken } from './api';
import { initServerService } from '../../src/application/CharacterServiceProvider';
import { AUTH_COLORS } from './theme';
import { validateEmail, validatePassword } from './validation';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailErr, setEmailErr] = useState<string | undefined>();
  const [passwordErr, setPasswordErr] = useState<string | undefined>();
  const [touched, setTouched] = useState<{ email?: boolean; password?: boolean }>({});
  const [loading, setLoading] = useState(false);

  const canSubmit =
    email.trim().length > 0 && password.length > 0 && !emailErr && !passwordErr;

  const onChangeEmail = (v: string) => {
    setEmail(v);
    setEmailErr(validateEmail(v));
  };
  const onChangePassword = (v: string) => {
    const cleaned = v.replace(/\s/g, '');
    setPassword(cleaned);
    setPasswordErr(touched.password ? validatePassword(cleaned) : undefined);
  };

  const submit = async () => {
    const eErr = validateEmail(email);
    const pErr = validatePassword(password);
    setEmailErr(eErr);
    setPasswordErr(pErr);
    setTouched({ email: true, password: true });
    if (eErr || pErr) return;
    setLoading(true);
    const res = await apiLogin(email, password);
    setLoading(false);
    if (!res.success) {
      Alert.alert('Ошибка', res.message || 'Не удалось войти');
      return;
    }
    initServerService(getToken);
    router.replace('/' as `/`);
  };

  return (
    <AuthScreen title="Вход" cardHeight={428} titleMarginTop={0}>
      <AuthInput
        value={email}
        onChangeText={onChangeEmail}
        placeholder="Электронная почта"
        keyboardType="email-address"
        error={emailErr}
        style={styles.emailField}
        onBlur={() => {
          setTouched((t) => ({ ...t, email: true }));
          setEmailErr(validateEmail(email));
        }}
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

      <View style={styles.linksRow}>
        <View style={styles.row}>
          <Text style={styles.hint}>Нет аккаунта? </Text>
          <TouchableOpacity onPress={() => router.push('/auth/register' as `/auth/register`)}>
            <Text style={styles.link}>Создать</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity onPress={() => router.push('/auth/forgot-password' as `/auth/forgot-password`)}>
          <Text style={styles.link}>Забыли пароль?</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.btnWrap}>
        <AuthButton label="Войти" onPress={submit} disabled={!canSubmit} loading={loading} />
      </View>

      <Divider />
      <SocialButtons />
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
  linksRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: 312,
    marginTop: 44,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
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
  btnWrap: {
    marginTop: 12,
    marginBottom: 16,
  },
});
