import { Text, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { AUTH_COLORS } from '../theme';
import { PressableScale } from './PressableScale';

type Props = {
  to?: string;
  onPress?: () => void;
};

export function BackButton({ to, onPress }: Props) {
  const handle = () => {
    if (onPress) return onPress();
    if (to) router.replace(to as `/`);
    else if (router.canGoBack()) router.back();
  };
  return (
    <PressableScale onPress={handle} style={styles.touch} scaleTo={0.9}>
      <Text style={styles.icon}>‹</Text>
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  touch: {
    position: 'absolute',
    top: 50,
    left: 16,
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    color: AUTH_COLORS.accent,
    fontSize: 28,
    lineHeight: 30,
    fontFamily: 'PlayfairDisplay-SemiBold',
  },
});
