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
import { Lock, Mail, Eye, EyeOff, User, ArrowLeft } from 'lucide-react-native';

export default function RegisterScreen() {
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
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
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton} 
            onPress={() => router.back()}
          >
            <ArrowLeft size={24} color={isDark ? colors.darkText : colors.text} />
          </TouchableOpacity>
          <Text style={[styles.title, isDark && { color: colors.darkText }]}>
            Create Account
          </Text>
          <Text style={[styles.subtitle, isDark && { color: colors.darkTextSecondary }]}>
            Sign up to get started with StriffPay
          </Text>
        </View>

        <View style={styles.form}>
          {/* Name Input */}
          <View style={[
            styles.inputContainer,
            isDark && { 
              backgroundColor: colors.dark.surface2,
              borderColor: colors.dark.border
            }
          ]}>
            <User size={20} color={isDark ? colors.darkTextSecondary : colors.grey} style={styles.inputIcon} />
            <TextInput
              style={[styles.input, isDark && { color: colors.darkText }]}
              placeholder="Full Name"
              placeholderTextColor={isDark ? colors.darkTextSecondary : colors.grey}
              value={name}
              onChangeText={setName}
            />
          </View>

          {/* Email Input */}
          <View style={[
            styles.inputContainer,
            isDark && { 
              backgroundColor: colors.dark.surface2,
              borderColor: colors.dark.border
            }
          ]}>
            <Mail size={20} color={isDark ? colors.darkTextSecondary : colors.grey} style={styles.inputIcon} />
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
            <Lock size={20} color={isDark ? colors.darkTextSecondary : colors.grey} style={styles.inputIcon} />
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

          {/* Confirm Password Input */}
          <View style={[
            styles.inputContainer,
            isDark && { 
              backgroundColor: colors.dark.surface2,
              borderColor: colors.dark.border
            }
          ]}>
            <Lock size={20} color={isDark ? colors.darkTextSecondary : colors.grey} style={styles.inputIcon} />
            <TextInput
              style={[styles.input, isDark && { color: colors.darkText }]}
              placeholder="Confirm Password"
              placeholderTextColor={isDark ? colors.darkTextSecondary : colors.grey}
              secureTextEntry={!showConfirmPassword}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
            />
            <TouchableOpacity
              style={styles.eyeIcon}
              onPress={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? (
                <EyeOff size={20} color={isDark ? colors.darkTextSecondary : colors.grey} />
              ) : (
                <Eye size={20} color={isDark ? colors.darkTextSecondary : colors.grey} />
              )}
            </TouchableOpacity>
          </View>

          <Button
            title="Create Account"
            onPress={handleRegister}
            loading={isLoading}
            style={styles.button}
            variant="primary"
            darkMode={isDark}
          />
        </View>

        <View style={styles.footer}>
          <Text style={[styles.footerText, isDark && { color: colors.darkTextSecondary }]}>
            Already have an account?
          </Text>
          <TouchableOpacity onPress={() => router.push('/login')}>
            <Text style={[
              styles.signInText,
              isDark && { color: colors.dark.primaryAccent }
            ]}> Sign In</Text>
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