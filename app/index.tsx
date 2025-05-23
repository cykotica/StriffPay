import { useEffect } from 'react';
import { View, StyleSheet, Text, Image, Animated } from 'react-native';
import { router } from 'expo-router';
import { colors } from '@/constants/colors';
import { fonts } from '@/constants/fonts';
import { layout } from '@/constants/layout';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function SplashScreen() {
  const insets = useSafeAreaInsets();
  const opacity = new Animated.Value(0);
  const translateY = new Animated.Value(20);

  useEffect(() => {
    // Animate logo appearing
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();

    // Navigate to auth screen after delay
    const timer = setTimeout(() => {
      router.replace('/(auth)/login');
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View 
      style={[
        styles.container, 
        { paddingTop: insets.top, paddingBottom: insets.bottom }
      ]}
    >
      <Animated.View 
        style={[
          styles.logoContainer,
          { opacity, transform: [{ translateY }] }
        ]}
      >
        <View style={styles.logoCircle}>
          <Text style={styles.logoText}>SP</Text>
        </View>
        <Text style={styles.appName}>StriffPay</Text>
        <Text style={styles.tagline}>Secure, Fast, Borderless</Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    alignItems: 'center',
  },
  logoCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: layout.spacing.lg,
  },
  logoText: {
    fontFamily: fonts.bold,
    fontSize: fonts.display,
    color: colors.primary,
  },
  appName: {
    fontFamily: fonts.bold,
    fontSize: fonts.display,
    color: colors.white,
    marginBottom: layout.spacing.sm,
  },
  tagline: {
    fontFamily: fonts.regular,
    fontSize: fonts.lg,
    color: colors.white,
    opacity: 0.8,
  },
});