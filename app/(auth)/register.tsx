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
} from 'react-native';
import { router } from 'expo-router';
import { colors } from '@/constants/colors';
import { fonts } from '@/constants/fonts';
import { layout } from '@/constants/layout';
import Button from '@/components/Button';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Lock, Mail, Eye, EyeOff, User, ArrowLeft } from 'lucide-react-native';

export default function RegisterScreen() {
  const insets = useSafeAreaInsets();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = () => {
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
          <TouchableOpacity 
            onPress={() => router.back()}
            style={styles.backButton}
          >
            <ArrowLeft size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>Sign up to get started</Text>
        </View>

        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <User size={20} color={colors.grey} style={styles.inputIcon} />
            <TextInput
              placeholder="Full Name"
              value={name}
              onChangeText={setName}
              style={styles.input}
              placeholderTextColor={colors.grey}
              autoCapitalize="words"
            />
          </View>

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

          <View style={styles.inputContainer}>
            <Lock size={20} color={colors.grey} style={styles.inputIcon} />
            <TextInput
              placeholder="Confirm Password"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              style={styles.input}
              placeholderTextColor={colors.grey}
              secureTextEntry={!showConfirmPassword}
            />
            <TouchableOpacity 
              onPress={() => setShowConfirmPassword(!showConfirmPassword)}
              style={styles.eyeIcon}
            >
              {showConfirmPassword ? 
                <EyeOff size={20} color={colors.grey} /> : 
                <Eye size={20} color={colors.grey} />
              }
            </TouchableOpacity>
          </View>

          <View style={styles.termsContainer}>
            <Text style={styles.termsText}>
              By signing up, you agree to our{' '}
              <Text style={styles.termsLink}>Terms of Service</Text>
              {' '}and{' '}
              <Text style={styles.termsLink}>Privacy Policy</Text>
            </Text>
          </View>

          <Button
            title="Create Account"
            onPress={handleRegister}
            loading={isLoading}
            style={styles.button}
          />

          <View style={styles.footer}>
            <Text style={styles.footerText}>Already have an account? </Text>
            <TouchableOpacity onPress={() => router.push('/(auth)/login')}>
              <Text style={styles.signInText}>Sign In</Text>
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
    marginBottom: layout.spacing.xxl,
  },
  backButton: {
    marginBottom: layout.spacing.lg,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'flex-start',
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
  termsContainer: {
    marginBottom: layout.spacing.xl,
  },
  termsText: {
    fontFamily: fonts.regular,
    fontSize: fonts.sm,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  termsLink: {
    fontFamily: fonts.medium,
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
  signInText: {
    fontFamily: fonts.medium,
    fontSize: fonts.md,
    color: colors.primary,
  },
});