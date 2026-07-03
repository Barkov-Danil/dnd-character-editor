import { Slot } from 'expo-router';
import { View, StatusBar } from 'react-native';
import { COLORS } from './(main)/theme';

export default function RootLayout() {
  return (
    <View style={{ flex: 1, backgroundColor: COLORS.background }}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.background} translucent />
      <Slot />
    </View>
  );
}
