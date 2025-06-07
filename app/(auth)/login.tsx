import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  useColorScheme,
} from 'react-native';
import { router } from 'expo-router';
import { colors } from '@/constants/colors';
import { fonts } from '@/constants/fonts';
import { layout } from '@/constants/layout';
import Button from '@/components/Button';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Lock, Mail, Eye, EyeOff } from 'lucide-react-native';

export default function LoginScreen() {
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = () => {
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      router.replace('/(tabs)');
    }, 1500);
  };

  return (
    <KeyboardAvoidingView
      style={[{ flex: 1 }, isDark && { backgroundColor: colors.dark.surface1 }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView 
        contentContainerStyle={[
          styles.container,
          { paddingTop: insets.top + layout.spacing.xl, paddingBottom: insets.bottom + layout.spacing.xl },
          isDark && { backgroundColor: colors.dark.surface1 }
        ]}
      >
        {/* Logo and Title Section */}
        <View style={styles.header}>
          <View style={[styles.logoCircle, isDark && { backgroundColor: colors.dark.surface3 }]}>
            <Text style={[styles.logoText, isDark && { color: colors.dark.primaryAccent }]}>SP</Text>
          </View>
          <Text style={[styles.title, isDark && { color: colors.darkText }]}>
            Welcome Back
          </Text>
          <Text style={[styles.subtitle, isDark && { color: colors.darkTextSecondary }]}>
            Login to access your crypto wallet
          </Text>
        </View>

        {/* Form Section */}
        <View style={styles.form}>
          {/* Email Input */}
          <View style={[
            styles.inputContainer,
            isDark && { 
              backgroundColor: colors.dark.surface2,
              borderColor: colors.dark.border
            }
          ]}>
            <Mail 
              size={20} 
              color={isDark ? colors.darkTextSecondary : colors.grey} 
              style={styles.inputIcon} 
            />
            <TextInput
              style={[styles.input, isDark && { color: colors.darkText }]}
              placeholder="Email"
              placeholderTextColor={isDark ? colors.darkTextSecondary : colors.grey}
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
            />
          </View>

          {/* Password Input */}
          <View style={[
            styles.inputContainer,
            isDark && { 
              backgroundColor: colors.dark.surface2,
              borderColor: colors.dark.border
            }
          ]}>
            <Lock 
              size={20} 
              color={isDark ? colors.darkTextSecondary : colors.grey} 
              style={styles.inputIcon} 
            />
            <TextInput
              style={[styles.input, isDark && { color: colors.darkText }]}
              placeholder="Password"
              placeholderTextColor={isDark ? colors.darkTextSecondary : colors.grey}
              secureTextEntry={!showPassword}
              value={password}
              onChangeText={setPassword}
            />
            <TouchableOpacity
              style={styles.eyeIcon}
              onPress={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <EyeOff size={20} color={isDark ? colors.darkTextSecondary : colors.grey} />
              ) : (
                <Eye size={20} color={isDark ? colors.darkTextSecondary : colors.grey} />
              )}
            </TouchableOpacity>
          </View>

          {/* Forgot Password Link */}
          <TouchableOpacity
            style={styles.forgotPasswordContainer}
            onPress={() => router.push('/forgot-password')}
          >
            <Text style={[
              styles.forgotPasswordText,
              isDark && { color: colors.dark.primaryAccent }
            ]}>
              Forgot Password?
            </Text>
          </TouchableOpacity>

          {/* Login Button */}
          <Button
            title="Login"
            onPress={handleLogin}
            loading={isLoading}
            style={styles.button}
            darkMode={isDark}
          />
        </View>

        {/* Footer Section */}
        <View style={styles.footer}>
          <Text style={[styles.footerText, isDark && { color: colors.darkTextSecondary }]}>
            Don't have an account?
          </Text>
          <TouchableOpacity onPress={() => router.push('/register')}>
            <Text style={[
              styles.signUpText,
              isDark && { color: colors.dark.primaryAccent }
            ]}>
              {' '}Sign Up
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: colors.background,
    paddingHorizontal: layout.spacing.xl,
  },
  header: {
    alignItems: 'center',
    marginBottom: layout.spacing.xxl,
  },
  logoCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: layout.spacing.lg,
  },
  logoText: {
    fontFamily: fonts.bold,
    fontSize: fonts.xxl,
    color: colors.white,
  },
  title: {
    fontFamily: fonts.bold,
    fontSize: fonts.xxxl,
    color: colors.text,
    marginBottom: layout.spacing.xs,
  },
  subtitle: {
    fontFamily: fonts.regular,
    fontSize: fonts.lg,
    color: colors.textSecondary,
  },
  form: {
    width: '100%',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.lightGrey,
    borderRadius: layout.radius.md,
    marginBottom: layout.spacing.lg,
    paddingHorizontal: layout.spacing.md,
    height: 56,
    backgroundColor: colors.white,
    ...layout.shadow.sm,
  },
  inputIcon: {
    marginRight: layout.spacing.sm,
  },
  input: {
    flex: 1,
    fontFamily: fonts.regular,
    fontSize: fonts.md,
    color: colors.text,
  },
  eyeIcon: {
    padding: layout.spacing.xs,
  },
  forgotPasswordContainer: {
    alignSelf: 'flex-end',
    marginBottom: layout.spacing.xl,
  },
  forgotPasswordText: {
    fontFamily: fonts.medium,
    fontSize: fonts.md,
    color: colors.primary,
  },
  button: {
    marginBottom: layout.spacing.xl,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerText: {
    fontFamily: fonts.regular,
    fontSize: fonts.md,
    color: colors.textSecondary,
  },
  signUpText: {
    fontFamily: fonts.medium,
    fontSize: fonts.md,
    color: colors.primary,
  },
});