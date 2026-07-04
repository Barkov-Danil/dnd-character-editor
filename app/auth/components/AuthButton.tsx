import { PressableScale } from './PressableScale';
import { Text, View, StyleSheet, ActivityIndicator } from 'react-native';
import { AUTH_COLORS, AUTH_FONT, AUTH_SIZES } from '../theme';

type Props = {
  onPress: () => void;
  label: string;
  disabled?: boolean;
  loading?: boolean;
};

export function AuthButton({ onPress, label, disabled, loading }: Props) {
  const inactive = disabled || loading;
  return (
    <PressableScale
      onPress={onPress}
      style={styles.touch}
      scaleTo={0.96}
      disabled={inactive}
    >
      <View style={[styles.button, inactive ? styles.buttonOutline : styles.buttonSolid]}>
        {loading ? (
          <ActivityIndicator color={inactive ? AUTH_COLORS.accent : AUTH_COLORS.buttonText} />
        ) : (
          <Text style={[styles.text, inactive ? styles.textOutline : styles.textSolid]}>
            {label}
          </Text>
        )}
      </View>
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  touch: {
    width: AUTH_SIZES.buttonWidth,
  },
  button: {
    width: AUTH_SIZES.buttonWidth,
    height: AUTH_SIZES.buttonHeight,
    borderRadius: AUTH_SIZES.buttonRadius,
    borderWidth: 1,
    borderColor: AUTH_COLORS.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonOutline: {
    backgroundColor: 'transparent',
  },
  buttonSolid: {
    backgroundColor: AUTH_COLORS.buttonTop,
  },
  text: {
    fontFamily: AUTH_FONT.buttonFamily,
    fontSize: AUTH_FONT.buttonSize,
  },
  textOutline: {
    color: AUTH_COLORS.buttonText,
  },
  textSolid: {
    color: AUTH_COLORS.buttonText,
  },
});
