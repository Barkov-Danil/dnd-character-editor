import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { PaperProvider, MD3DarkTheme } from 'react-native-paper';
import { COLORS } from './theme';
import { View } from 'react-native';
import { useCharacterStore } from './store/characterStore';

const paperTheme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    primary: COLORS.primary,
    secondary: COLORS.accent,
    background: COLORS.background,
    surface: COLORS.surface,
    surfaceVariant: COLORS.surfaceVariant,
    onSurface: COLORS.text,
    onBackground: COLORS.text,
    outline: COLORS.border,
  },
};

export default function MainLayout() {
  const loadSavedCharacters = useCharacterStore((s) => s.loadSavedCharacters);
  const loadLibraryCharacters = useCharacterStore((s) => s.loadLibraryCharacters);

  useEffect(() => {
    loadLibraryCharacters();
    loadSavedCharacters();
  }, []);

  return (
    <PaperProvider theme={paperTheme}>
      <View style={{ flex: 1, backgroundColor: COLORS.background }}>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" options={{ title: 'D&D Редактор' }} />
          <Stack.Screen name="library" options={{ title: 'Библиотека' }} />
          <Stack.Screen name="calculator" options={{ presentation: 'card', title: 'Калькулятор' }} />
          <Stack.Screen name="catalog" options={{ presentation: 'card', title: 'Каталог' }} />
          <Stack.Screen name="character/[id]" options={{ presentation: 'card', title: 'Персонаж' }} />
          <Stack.Screen name="wizard/step1-race" options={{ title: 'Шаг 1: Раса' }} />
          <Stack.Screen name="wizard/step2-class" options={{ title: 'Шаг 2: Класс' }} />
          <Stack.Screen name="wizard/step3-stats" options={{ title: 'Шаг 3: Характеристики' }} />
          <Stack.Screen name="wizard/step4-skills" options={{ title: 'Шаг 4: Навыки' }} />
          <Stack.Screen name="wizard/step5-details" options={{ title: 'Шаг 5: Детали' }} />
          <Stack.Screen name="wizard/step6-review" options={{ title: 'Шаг 6: Проверка' }} />
        </Stack>
      </View>
    </PaperProvider>
  );
}