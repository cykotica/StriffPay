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
  Image,
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
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView 
        contentContainerStyle={[
          styles.container,
          { paddingTop: insets.top + layout.spacing.xl, paddingBottom: insets.bottom + layout.spacing.xl }
        ]}
      >
        <View style={styles.header}>
          <View style={styles.logoCircle}>
            <Text style={styles.logoText}>SP</Text>
          </View>
          <Text style={styles.title}>Welcome back</Text>
          <Text style={styles.subtitle}>Sign in to your account</Text>
        </View>

        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <Mail size={20} color={colors.grey} style={styles.inputIcon} />
            <TextInput
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
              style={styles.input}
              placeholderTextColor={colors.grey}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputContainer}>
            <Lock size={20} color={colors.grey} style={styles.inputIcon} />
            <TextInput
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              style={styles.input}
              placeholderTextColor={colors.grey}
              secureTextEntry={!showPassword}
            />
            <TouchableOpacity 
              onPress={() => setShowPassword(!showPassword)}
              style={styles.eyeIcon}
            >
              {showPassword ? 
                <EyeOff size={20} color={colors.grey} /> : 
                <Eye size={20} color={colors.grey} />
              }
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            onPress={() => router.push('/(auth)/forgot-password')}
            style={styles.forgotPasswordContainer}
          >
            <Text style={styles.forgotPasswordText}>Forgot password?</Text>
          </TouchableOpacity>

          <Button
            title="Sign In"
            onPress={handleLogin}
            loading={isLoading}
            style={styles.button}
          />

          <View style={styles.footer}>
            <Text style={styles.footerText}>Don't have an account? </Text>
            <TouchableOpacity onPress={() => router.push('/(auth)/register')}>
              <Text style={styles.signUpText}>Sign Up</Text>
            </TouchableOpacity>
          </View>
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