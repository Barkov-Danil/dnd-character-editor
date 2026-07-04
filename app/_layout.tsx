import { useEffect, useState, useCallback } from 'react';
import { Slot, useRouter } from 'expo-router';
import { View, StatusBar, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Font from 'expo-font';
import {
  PlayfairDisplay_400Regular,
  PlayfairDisplay_500Medium,
  PlayfairDisplay_600SemiBold,
  PlayfairDisplay_700Bold,
} from '@expo-google-fonts/playfair-display';
import {
  Spectral_400Regular,
  Spectral_500Medium,
  Spectral_600SemiBold,
} from '@expo-google-fonts/spectral';
import { COLORS } from './(main)/theme';

export default function RootLayout() {
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [checking, setChecking] = useState(true);
  const router = useRouter();

  const loadFonts = useCallback(async () => {
    await Font.loadAsync({
      'PlayfairDisplay-Regular': PlayfairDisplay_400Regular,
      'PlayfairDisplay-Medium': PlayfairDisplay_500Medium,
      'PlayfairDisplay-SemiBold': PlayfairDisplay_600SemiBold,
      'PlayfairDisplay-Bold': PlayfairDisplay_700Bold,
      'Spectral-Regular': Spectral_400Regular,
      'Spectral-Medium': Spectral_500Medium,
      'Spectral-SemiBold': Spectral_600SemiBold,
    });
    setFontsLoaded(true);
  }, []);

  useEffect(() => {
    loadFonts();
  }, [loadFonts]);

  useEffect(() => {
    if (!fontsLoaded) return;
    (async () => {
      try {
        const token = await AsyncStorage.getItem('@dnd_auth_token');
        if (token) {
          router.replace('/' as `/`);
        } else {
          router.replace('/onboarding' as `/onboarding`);
        }
      } catch {
        router.replace('/onboarding' as `/onboarding`);
      }
      setChecking(false);
    })();
  }, [fontsLoaded]);

  if (!fontsLoaded || checking) {
    return (
      <View style={{ flex: 1, backgroundColor: COLORS.background, justifyContent: 'center', alignItems: 'center' }}>
        <StatusBar barStyle="light-content" backgroundColor={COLORS.background} translucent />
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.background }}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.background} translucent />
      <Slot />
    </View>
  );
}
