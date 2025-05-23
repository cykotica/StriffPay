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
  Alert,
} from 'react-native';
import { router } from 'expo-router';
import { colors } from '@/constants/colors';
import { fonts } from '@/constants/fonts';
import { layout } from '@/constants/layout';
import Button from '@/components/Button';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Mail, ArrowLeft } from 'lucide-react-native';

export default function ForgotPasswordScreen() {
  const insets = useSafeAreaInsets();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = () => {
    if (!email) {
      Alert.alert('Error', 'Please enter your email address.');
      return;
    }
    
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setIsSent(true);
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
          <Text style={styles.title}>Reset Password</Text>
          <Text style={styles.subtitle}>We'll send instructions to your email</Text>
        </View>

        {!isSent ? (
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

            <Button
              title="Send Instructions"
              onPress={handleSubmit}
              loading={isLoading}
              style={styles.button}
            />

            <View style={styles.footer}>
              <Text style={styles.footerText}>Remember your password? </Text>
              <TouchableOpacity onPress={() => router.push('/(auth)/login')}>
                <Text style={styles.signInText}>Sign In</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <View style={styles.successContainer}>
            <View style={styles.successIconContainer}>
              <Mail size={40} color={colors.white} />
            </View>
            <Text style={styles.successTitle}>Check your email</Text>
            <Text style={styles.successText}>
              We've sent password recovery instructions to your email address.
            </Text>
            <Button
              title="Back to Login"
              onPress={() => router.push('/(auth)/login')}
              style={styles.button}
            />
          </View>
        )}
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
  successContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: layout.spacing.xxl,
  },
  successIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: layout.spacing.xl,
  },
  successTitle: {
    fontFamily: fonts.bold,
    fontSize: fonts.xxxl,
    color: colors.text,
    marginBottom: layout.spacing.md,
    textAlign: 'center',
  },
  successText: {
    fontFamily: fonts.regular,
    fontSize: fonts.lg,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: layout.spacing.xxl,
    lineHeight: 24,
  },
});