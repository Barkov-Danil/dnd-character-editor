import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { router, Href } from 'expo-router';
import { AuthScreen } from './components/AuthScreen';
import { AuthInput } from './components/AuthInput';
import { AuthButton } from './components/AuthButton';
import { Divider } from './components/Divider';
import { SocialButtons } from './components/SocialButtons';
import { apiForgotPassword } from './api';
import { AUTH_COLORS } from './theme';
import { validateEmail } from './validation';

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState('');
  const [emailErr, setEmailErr] = useState<string | undefined>();
  const [loading, setLoading] = useState(false);

  const canSubmit = email.trim().length > 0 && !emailErr;

  const onChangeEmail = (v: string) => {
    setEmail(v);
    setEmailErr(validateEmail(v));
  };

  const submit = async () => {
    const eErr = validateEmail(email);
    setEmailErr(eErr);
    if (eErr) return;
    setLoading(true);
    const res = await apiForgotPassword(email);
    setLoading(false);
    if (!res.success) {
      Alert.alert('Ошибка', res.message || 'Не удалось отправить код');
      return;
    }
    router.push({
      pathname: '/auth/verify-reset-code',
      params: { email },
    } as Href);
  };

  return (
    <AuthScreen title="Восстановление" cardHeight={368}>
      <AuthInput
        value={email}
        onChangeText={onChangeEmail}
        placeholder="Электронная почта"
        keyboardType="email-address"
        error={emailErr}
        style={styles.emailField}
        onBlur={() => setEmailErr(validateEmail(email))}
      />
      <View style={styles.btnWrap}>
        <TouchableOpacity
          style={styles.backRow}
          onPress={() => router.push('/auth/login' as `/auth/login`)}
        >
          <Text style={styles.link}>Назад</Text>
        </TouchableOpacity>
        <AuthButton label="Отправить код" onPress={submit} disabled={!canSubmit} loading={loading} />
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
  btnWrap: {
    marginTop: 44,
    marginBottom: 16,
  },
  backRow: {
    alignSelf: 'flex-start',
    marginBottom: 12,
  },
  link: {
    color: AUTH_COLORS.accent,
    fontSize: 14,
    fontFamily: 'Spectral-Regular',
  },
});
