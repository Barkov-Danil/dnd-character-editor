import { useRef } from 'react';
import {
  TouchableOpacity,
  Animated,
  Easing,
  ViewStyle,
} from 'react-native';

type Props = {
  onPress?: () => void;
  style?: ViewStyle;
  children: React.ReactNode;
  scaleTo?: number;
  spring?: boolean;
  disabled?: boolean;
};

export function PressableScale({
  onPress,
  style,
  children,
  scaleTo = 0.96,
  spring = true,
  disabled,
}: Props) {
  const scale = useRef(new Animated.Value(1)).current;

  const pressIn = () => {
    Animated.timing(scale, {
      toValue: scaleTo,
      duration: 90,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }).start();
  };
  const pressOut = () => {
    Animated.timing(scale, {
      toValue: 1,
      duration: spring ? 320 : 140,
      easing: spring ? Easing.bounce : Easing.out(Easing.ease),
      useNativeDriver: true,
    }).start();
  };

  return (
    <Animated.View style={[style, { transform: [{ scale }] }]}>
      <TouchableOpacity
        onPress={onPress}
        onPressIn={pressIn}
        onPressOut={pressOut}
        activeOpacity={1}
        disabled={disabled}
        delayPressIn={0}
      >
        {children}
      </TouchableOpacity>
    </Animated.View>
  );
}
