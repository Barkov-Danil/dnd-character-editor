import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ViewStyle,
  Platform,
} from 'react-native';
import { AUTH_COLORS, AUTH_SIZES } from '../theme';

const webFocusFix =
  Platform.OS === 'web'
    ? { outlineWidth: 0, outlineStyle: 'none' as const, boxShadow: 'none' as const }
    : {};

type Props = {
  value: string;
  onChangeText: (v: string) => void;
  placeholder?: string;
  secure?: boolean;
  error?: string;
  disabled?: boolean;
  showEye?: boolean;
  rightIcon?: React.ReactNode;
  style?: ViewStyle;
  keyboardType?: 'default' | 'email-address' | 'numeric';
  editable?: boolean;
  onBlur?: () => void;
  absoluteError?: boolean;
};

export function AuthInput({
  value,
  onChangeText,
  placeholder,
  secure,
  error,
  disabled,
  showEye,
  rightIcon,
  style,
  keyboardType = 'default',
  editable = true,
  onBlur,
  absoluteError = false,
}: Props) {
  const [hidden, setHidden] = useState(!!secure);
  const [focused, setFocused] = useState(false);
  const borderColor = error
    ? AUTH_COLORS.inputBorderError
    : focused
      ? AUTH_COLORS.accent
      : AUTH_COLORS.inputBorder;
  const textColor = disabled ? AUTH_COLORS.textMuted : AUTH_COLORS.textPrimary;

  const handleBlur = () => {
    setFocused(false);
    onBlur?.();
  };

  return (
    <View style={[styles.wrapper, style]}>
      <View style={[styles.box, { borderColor }]}>
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={AUTH_COLORS.textSecondary}
          secureTextEntry={hidden}
          keyboardType={keyboardType}
          editable={editable}
          autoCapitalize="none"
          autoCorrect={false}
          spellCheck={false}
          autoComplete="off"
          textContentType="none"
          importantForAutofill="no"
          style={[styles.input, webFocusFix, { color: textColor }]}
          onFocus={() => setFocused(true)}
          onBlur={handleBlur}
        />
        {showEye && (
          <TouchableOpacity onPress={() => setHidden((h) => !h)} style={styles.eye}>
            <Text style={styles.eyeIcon}>{hidden ? '○' : '●'}</Text>
          </TouchableOpacity>
        )}
        {rightIcon && !showEye && <View style={styles.eye}>{rightIcon}</View>}
      </View>
      {error ? (
        <Text style={[styles.error, absoluteError && styles.errorAbsolute]}>{error}</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
  },
  box: {
    width: AUTH_SIZES.inputWidth,
    height: AUTH_SIZES.inputHeight,
    borderRadius: AUTH_SIZES.inputRadius,
    backgroundColor: AUTH_COLORS.inputBg,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
  },
  input: {
    flex: 1,
    height: '100%',
    fontSize: 16,
    padding: 0,
    borderWidth: 0,
    backgroundColor: 'transparent',
  },
  eye: {
    paddingHorizontal: 6,
    justifyContent: 'center',
  },
  eyeIcon: {
    color: AUTH_COLORS.textSecondary,
    fontSize: 16,
  },
  error: {
    color: AUTH_COLORS.inputBorderError,
    fontSize: 12,
    marginTop: 6,
    width: AUTH_SIZES.inputWidth,
    textAlign: 'left',
  },
  errorAbsolute: {
    position: 'absolute',
    top: AUTH_SIZES.inputHeight + 6,
  },
});
