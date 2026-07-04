import { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Animated,
  Easing,
  ViewStyle,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';

type Slide = {
  imgAlt: string;
  imgSrc: ReturnType<typeof require>;
  title: string;
  subtitle: string;
  titleWidth: number;
};

const SLIDES: Slide[] = [
  {
    imgAlt: 'Иллюстрация листа персонажа',
    imgSrc: require('../assets/images/start_img1.png'),
    title: 'Твоё приключение начинается здесь',
    subtitle:
      'Интерактивный лист персонажа, который всегда под рукой. Бросай кубики, отслеживай ресурсы и погружайся в игру без бумажной волокиты.',
    titleWidth: 201,
  },
  {
    imgAlt: 'Иллюстрация создания героя',
    imgSrc: require('../assets/images/start_img2.png'),
    title: 'Создай героя за минуты',
    subtitle:
      'Выбирай расу, класс, распределяй характер-\nистики с помощью удобных визуальных слайдеров.',
    titleWidth: 255,
  },
  {
    imgAlt: 'Иллюстрация боевого интерфейса',
    imgSrc: require('../assets/images/start_img3.png'),
    title: 'В бою важна скорость',
    subtitle:
      'НР, АС, спасброски и главные действия — всегда на виду. Свайпай, чтобы увидеть заклинания или инвентарь, не отвлекаясь от сессии.',
    titleWidth: 235,
  },
];

const ONBOARDING_KEY = '@dnd_onboarding_seen';
const BTN_COLOR = '#D85336';
const BTN_COLOR_DARK = '#B8431F';

function PressableScale({
  onPress,
  style,
  children,
  scaleTo = 0.96,
  spring = true,
  disabled,
}: {
  onPress?: () => void;
  style?: ViewStyle;
  children: React.ReactNode;
  scaleTo?: number;
  spring?: boolean;
  disabled?: boolean;
}) {
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

export default function OnboardingScreen() {
  const [index, setIndex] = useState(0);
  const isLast = index === SLIDES.length - 1;
  const slide = SLIDES[index];
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(12)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 320,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 320,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
    ]).start();
  }, [index]);

  const finish = async () => {
    await AsyncStorage.setItem(ONBOARDING_KEY, '1');
    router.replace('/auth/login' as `/auth/login`);
  };

  const next = () => {
    if (isLast) {
      finish();
    } else {
      fadeAnim.setValue(0);
      slideAnim.setValue(12);
      setIndex(index + 1);
    }
  };

  return (
    <View style={styles.wrapper}>
      <Animated.View
        style={[
          styles.content,
          { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
        ]}
      >
        <View style={styles.imageWrapper}>
          <Image
            source={slide.imgSrc}
            style={styles.image}
            resizeMode="contain"
            accessibilityLabel={slide.imgAlt}
          />
        </View>

        <Text style={[styles.title, { maxWidth: slide.titleWidth, width: slide.titleWidth }]}>
          {slide.title}
        </Text>
        <Text style={styles.subtitle}>{slide.subtitle}</Text>
      </Animated.View>

      <View style={styles.footer}>
        <Animated.View
          style={[
            styles.indicator,
            {
              transform: [
                {
                  scale: fadeAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.6, 1],
                  }),
                },
              ],
            },
          ]}
        >
          {SLIDES.map((_, i) => {
            const active = i === index;
            return <View key={i} style={[styles.dot, active ? styles.dotActive : styles.dotInactive]} />;
          })}
        </Animated.View>

        <PressableScale onPress={next} style={styles.buttonTouch} scaleTo={0.95}>
          {isLast ? (
            <View style={styles.buttonSolid}>
              <Text style={styles.buttonText}>Создать персонажа</Text>
            </View>
          ) : (
            <LinearGradient
              colors={[BTN_COLOR, BTN_COLOR_DARK]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.button}
            >
              <Text style={styles.buttonText}>Далее</Text>
            </LinearGradient>
          )}
        </PressableScale>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: '#000000',
  },
  content: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  imageWrapper: {
    height: 368,
    width: 368,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  title: {
    marginTop: 44,
    color: '#DBDBDB',
    fontSize: 22,
    fontFamily: 'PlayfairDisplay-Medium',
    textAlign: 'center',
  },
  subtitle: {
    marginTop: 12,
    marginBottom: 74,
    color: 'rgba(219, 219, 219, 0.7)',
    fontSize: 16,
    fontFamily: 'Spectral-Regular',
    textAlign: 'center',
    maxWidth: 368,
    width: 368,
  },
  indicator: {
    marginBottom: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  dot: {
    borderRadius: 4,
  },
  dotActive: {
    width: 8,
    height: 8,
    backgroundColor: BTN_COLOR,
  },
  dotInactive: {
    width: 6,
    height: 6,
    backgroundColor: '#3A4052',
  },
  footer: {
    flexShrink: 0,
    paddingBottom: 24,
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: '#000000',
  },
  buttonTouch: {
    width: 328,
  },
  button: {
    width: 328,
    height: 56,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonSolid: {
    width: 328,
    height: 56,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: BTN_COLOR,
    shadowColor: 'rgba(216, 83, 54, 0.3)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 20,
    elevation: 8,
  },
  buttonText: {
    color: '#DBDBDB',
    fontSize: 18,
    letterSpacing: 0.3,
    fontFamily: 'PlayfairDisplay-SemiBold',
  },
});
