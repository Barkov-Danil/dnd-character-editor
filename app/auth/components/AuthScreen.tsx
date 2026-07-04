import { ReactNode } from 'react';
import { Text, StyleSheet, View, ImageBackground, Dimensions, KeyboardAvoidingView, Platform } from 'react-native';
import { AUTH_COLORS, AUTH_FONT, AUTH_SIZES, AUTH_BG_IMAGE } from '../theme';

type Props = {
  title: string;
  children: ReactNode;
  showBack?: boolean;
  cardHeight?: number;
  titleMarginTop?: number;
};

export function AuthScreen({ title, children, showBack, cardHeight, titleMarginTop }: Props) {
  const { width, height } = Dimensions.get('window');
  const content = (
      <View style={[StyleSheet.absoluteFill, styles.overlay]}>
        <View style={[styles.card, cardHeight != null && { height: cardHeight }]}>
          <View style={styles.inner}>
            {showBack ? null : null}
            <Text style={[styles.title, titleMarginTop != null && { marginTop: titleMarginTop }]}>{title}</Text>
            {children}
          </View>
      </View>
    </View>
  );

  return (
    <ImageBackground
      source={AUTH_BG_IMAGE}
      style={[styles.screen, { width, height }]}
      resizeMode="cover"
    >
      {Platform.OS === 'web' ? (
        content
      ) : (
        <KeyboardAvoidingView
          behavior="padding"
          keyboardVerticalOffset={-134}
          style={{ flex: 1 }}
        >
          {content}
        </KeyboardAvoidingView>
      )}
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  overlay: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    width: AUTH_SIZES.cardWidth,
    height: AUTH_SIZES.cardHeight,
    borderRadius: AUTH_SIZES.cardRadius,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    padding: AUTH_SIZES.cardPadding,
    alignItems: 'center',
    justifyContent: 'center',
  },
  inner: {
    width: AUTH_SIZES.innerWidth,
    height: AUTH_SIZES.innerHeight,
    alignItems: 'center',
  },
  title: {
    color: AUTH_COLORS.textPrimary,
    fontSize: AUTH_FONT.titleSize,
    fontFamily: AUTH_FONT.titleFamily,
    textAlign: 'center',
    marginTop: 31.5,
  },
});
