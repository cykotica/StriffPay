import { useEffect } from 'react';
import { View, StyleSheet, Text, Animated, useColorScheme } from 'react-native';
import { router } from 'expo-router';
import { colors } from '@/constants/colors';
import { fonts } from '@/constants/fonts';
import { layout } from '@/constants/layout';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function SplashScreen() {
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
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
        { 
          paddingTop: insets.top, 
          paddingBottom: insets.bottom,
          backgroundColor: isDark ? colors.dark.surface1 : colors.primary
        }
      ]}
    >
      <Animated.View 
        style={[
          styles.logoContainer,
          { opacity, transform: [{ translateY }] }
        ]}
      >
        <View style={[
          styles.logoCircle, 
          { 
            backgroundColor: isDark ? colors.dark.surface3 : colors.white,
            ...layout.shadow.sm
          }
        ]}> 
          <Text style={[
            styles.logoText, 
            { color: isDark ? colors.dark.primaryAccent : colors.primary }
          ]}>SP</Text>
        </View>
        <Text style={[
          styles.appName, 
          { color: isDark ? colors.darkText : colors.white }
        ]}>StriffPay</Text>
        <Text style={[
          styles.tagline, 
          { color: isDark ? colors.darkTextSecondary : colors.white, opacity: 0.8 }
        ]}>Secure, Fast, Borderless</Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor set dynamically
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
    // backgroundColor set dynamically
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: layout.spacing.lg,
  },
  logoText: {
    fontFamily: fonts.bold,
    fontSize: fonts.display,
    // color set dynamically
  },
  appName: {
    fontFamily: fonts.bold,
    fontSize: fonts.display,
    // color set dynamically
    marginBottom: layout.spacing.sm,
  },
  tagline: {
    fontFamily: fonts.regular,
    fontSize: fonts.lg,
    // color set dynamically
    opacity: 0.8,
  },
});