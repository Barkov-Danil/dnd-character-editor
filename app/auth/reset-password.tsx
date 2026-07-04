import { useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { router, useLocalSearchParams, Href } from 'expo-router';
import { AuthScreen } from './components/AuthScreen';
import { AuthInput } from './components/AuthInput';
import { AuthButton } from './components/AuthButton';
import { apiResetPassword } from './api';
import { AUTH_COLORS } from './theme';
import { validatePassword, validateConfirm_password } from './validation';

export default function ResetPasswordScreen() {
  const params = useLocalSearchParams<{ email?: string }>();
  const email = params.email || 'vvleginvv@gmail.com';
  const [newPassword, setNewPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [newErr, setNewErr] = useState<string | undefined>();
  const [confirmErr, setConfirmErr] = useState<string | undefined>();
  const [touched, setTouched] = useState<{ new?: boolean; confirm?: boolean }>({});
  const [loading, setLoading] = useState(false);

  const canSubmit =
    newPassword.length >= 6 &&
    confirm.length > 0 &&
    newPassword === confirm &&
    !newErr &&
    !confirmErr;

  const onChangeNew = (v: string) => {
    const cleaned = v.replace(/\s/g, '');
    setNewPassword(cleaned);
    setNewErr(touched.new ? validatePassword(cleaned) : undefined);
    if (touched.confirm) setConfirmErr(validateConfirm_password(confirm, cleaned));
  };
  const onChangeConfirm = (v: string) => {
    const cleaned = v.replace(/\s/g, '');
    setConfirm(cleaned);
    setTouched((t) => ({ ...t, confirm: true }));
    setConfirmErr(validateConfirm_password(cleaned, newPassword));
  };

  const submit = async () => {
    const nErr = validatePassword(newPassword);
    const cErr = validateConfirm_password(confirm, newPassword);
    setNewErr(nErr);
    setConfirmErr(cErr);
    setTouched({ new: true, confirm: true });
    if (nErr || cErr) return;
    setLoading(true);
    const res = await apiResetPassword(email, newPassword, confirm);
    setLoading(false);
    if (!res.success) {
      Alert.alert('Ошибка', res.message || 'Не удалось сбросить пароль');
      return;
    }
    router.replace('/auth/login' as Href);
  };

  return (
    <AuthScreen title="Новый пароль" cardHeight={488} titleMarginTop={0}>
      <AuthInput
        value={email}
        onChangeText={() => {}}
        placeholder="Электронная почта"
        disabled
        rightIcon={<Text style={styles.check}>✓</Text>}
        keyboardType="email-address"
        style={styles.emailField}
      />
      <AuthInput
        value={newPassword}
        onChangeText={onChangeNew}
        placeholder="Новый пароль"
        secure
        showEye
        error={newErr}
        style={styles.newField}
        absoluteError
        onBlur={() => {
          setTouched((t) => ({ ...t, new: true }));
          setNewErr(validatePassword(newPassword));
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
          setConfirmErr(validateConfirm_password(confirm, newPassword));
        }}
      />

      <View style={styles.btnWrap}>
        <AuthButton label="Войти" onPress={submit} disabled={!canSubmit} loading={loading} />
      </View>
    </AuthScreen>
  );
}

const styles = StyleSheet.create({
  emailField: {
    marginTop: 32,
  },
  newField: {
    marginTop: 16,
  },
  confirmField: {
    marginTop: 16,
  },
  btnWrap: {
    marginTop: 44,
  },
  check: {
    color: AUTH_COLORS.accent,
    fontSize: 18,
    fontWeight: 'bold',
  },
});
