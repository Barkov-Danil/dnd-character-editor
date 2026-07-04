import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { router, useLocalSearchParams, Href } from 'expo-router';
import { AuthScreen } from './components/AuthScreen';
import { AuthInput } from './components/AuthInput';
import { AuthButton } from './components/AuthButton';
import { useCountdown } from './components/useCountdown';
import { apiVerifyResetCode, apiResendCode } from './api';
import { AUTH_COLORS } from './theme';

export default function VerifyResetCodeScreen() {
  const params = useLocalSearchParams<{ email?: string }>();
  const email = params.email || '';
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const { seconds, restart } = useCountdown(60);

  const canSubmit = code.length >= 4;

  const submit = async () => {
    setLoading(true);
    const res = await apiVerifyResetCode(email, code);
    setLoading(false);
    if (!res.success) {
      Alert.alert('Ошибка', res.message || 'Неверный код');
      return;
    }
    router.push({
      pathname: '/auth/reset-password',
      params: { email },
    } as Href);
  };

  const resend = async () => {
    const res = await apiResendCode(email);
    if (res.success) restart(60);
  };

  return (
    <AuthScreen title="Сброс пароля" cardHeight={368}>
      <AuthInput
        value={code}
        onChangeText={setCode}
        placeholder="Код"
        keyboardType="numeric"
        style={styles.codeField}
      />

      <View style={styles.timerRow}>
        <Text style={styles.timer}>
          {seconds > 0 ? `Отправить повторно через ${seconds}с` : 'Код не пришёл?'}
        </Text>
        {seconds === 0 && (
          <TouchableOpacity onPress={resend}>
            <Text style={styles.link}>Отправить снова</Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.btnWrap}>
        <TouchableOpacity
          style={styles.backRow}
          onPress={() => router.back()}
        >
          <Text style={styles.link}>Назад</Text>
        </TouchableOpacity>
        <AuthButton
          label="Сбросить пароль"
          onPress={submit}
          disabled={!canSubmit}
          loading={loading}
        />
      </View>
    </AuthScreen>
  );
}

const styles = StyleSheet.create({
  codeField: {
    marginTop: 32,
  },
  timerRow: {
    marginTop: 16,
    alignItems: 'center',
  },
  timer: {
    color: AUTH_COLORS.textSecondary,
    fontSize: 14,
    fontFamily: 'Spectral-Regular',
  },
  btnWrap: {
    marginTop: 74,
  },
  backRow: {
    alignSelf: 'flex-start',
    marginBottom: 12,
  },
  link: {
    color: AUTH_COLORS.accent,
    fontSize: 14,
    fontFamily: 'Spectral-Regular',
    marginTop: 8,
  },
});
