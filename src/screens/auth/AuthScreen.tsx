import { useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { fontFamily } from '../../theme/typography';

type AuthMode = 'register' | 'login';

type AuthScreenProps = {
  error?: string;
  isSubmitting?: boolean;
  onBack: () => void;
  onLogin: (email: string, password: string) => Promise<void>;
  onRegister: (email: string, password: string) => Promise<void>;
};

export function AuthScreen({
  error,
  isSubmitting = false,
  onBack,
  onLogin,
  onRegister,
}: AuthScreenProps) {
  const [mode, setMode] = useState<AuthMode>('register');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [localError, setLocalError] = useState('');

  const isRegister = mode === 'register';
  const canSubmit = email.trim().length > 0 && password.length >= 8 && !isSubmitting;

  const handleSubmit = async () => {
    setLocalError('');

    if (!email.includes('@')) {
      setLocalError('Please enter a valid email address.');
      return;
    }

    if (password.length < 8) {
      setLocalError('Password must be at least 8 characters.');
      return;
    }

    if (isRegister) {
      await onRegister(email.trim(), password);
    } else {
      await onLogin(email.trim(), password);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboardView}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
          <View style={styles.header}>
            <Pressable accessibilityRole="button" onPress={onBack} style={styles.backButton}>
              <Text style={styles.backText}>Back</Text>
            </Pressable>
            <Text style={styles.brand}>Nutri Planner</Text>
          </View>

          <View style={styles.titleBlock}>
            <Text style={styles.title}>{isRegister ? 'Create your account' : 'Welcome back'}</Text>
            <Text style={styles.subtitle}>
              {isRegister
                ? 'Save your path and body profile so your nutrition plan can follow you.'
                : 'Sign in and we will sync the profile you just entered to your account.'}
            </Text>
          </View>

          <View style={styles.segmented}>
            {(['register', 'login'] as const).map((item) => {
              const isActive = mode === item;
              return (
                <Pressable
                  accessibilityRole="tab"
                  accessibilityState={{ selected: isActive }}
                  key={item}
                  onPress={() => {
                    setMode(item);
                    setLocalError('');
                  }}
                  style={[styles.segment, isActive && styles.segmentActive]}
                >
                  <Text style={[styles.segmentText, isActive && styles.segmentTextActive]}>
                    {item === 'register' ? 'Register' : 'Log in'}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          <View style={styles.form}>
            <View style={styles.field}>
              <Text style={styles.label}>EMAIL</Text>
              <TextInput
                autoCapitalize="none"
                autoComplete="email"
                autoCorrect={false}
                editable={!isSubmitting}
                keyboardType="email-address"
                onChangeText={setEmail}
                placeholder="you@example.com"
                placeholderTextColor="#94A3B8"
                style={styles.input}
                textContentType="emailAddress"
                value={email}
              />
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>PASSWORD</Text>
              <TextInput
                autoCapitalize="none"
                editable={!isSubmitting}
                onChangeText={setPassword}
                placeholder="At least 8 characters"
                placeholderTextColor="#94A3B8"
                secureTextEntry
                style={styles.input}
                textContentType={isRegister ? 'newPassword' : 'password'}
                value={password}
              />
            </View>

            {localError || error ? <Text style={styles.errorText}>{localError || error}</Text> : null}

            <Pressable
              accessibilityRole="button"
              disabled={!canSubmit}
              onPress={handleSubmit}
              style={[styles.submitButton, !canSubmit && styles.submitButtonDisabled]}
            >
              {isSubmitting ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.submitText}>{isRegister ? 'Create Account' : 'Log In'}</Text>
              )}
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  backButton: {
    alignItems: 'center',
    backgroundColor: '#EAF6F1',
    borderRadius: 999,
    height: 40,
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
  },
  backText: {
    color: colors.primary,
    fontFamily: fontFamily.bold,
    fontSize: 14,
  },
  brand: {
    color: colors.primary,
    fontFamily: fontFamily.bold,
    fontSize: 18,
  },
  container: {
    backgroundColor: '#F8FAFC',
    flex: 1,
  },
  errorText: {
    color: '#DC2626',
    fontFamily: fontFamily.semiBold,
    fontSize: 13,
    lineHeight: 19,
  },
  field: {
    gap: spacing.sm,
  },
  form: {
    backgroundColor: '#FFFFFF',
    borderColor: '#EEF2F7',
    borderRadius: 24,
    borderWidth: 1,
    gap: spacing.xl,
    padding: 24,
  },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  input: {
    backgroundColor: '#F1F5F9',
    borderColor: '#E2E8F0',
    borderRadius: 16,
    borderWidth: 1,
    color: colors.ink,
    fontFamily: fontFamily.medium,
    fontSize: 16,
    height: 58,
    paddingHorizontal: 18,
  },
  keyboardView: {
    flex: 1,
  },
  label: {
    color: colors.inkMuted,
    fontFamily: fontFamily.bold,
    fontSize: 12,
    letterSpacing: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 42,
    paddingHorizontal: 28,
    paddingTop: 34,
  },
  segment: {
    alignItems: 'center',
    borderRadius: 14,
    flex: 1,
    height: 50,
    justifyContent: 'center',
  },
  segmentActive: {
    backgroundColor: '#FFFFFF',
  },
  segmented: {
    backgroundColor: '#EAF6F1',
    borderRadius: 18,
    flexDirection: 'row',
    marginBottom: 26,
    padding: 5,
  },
  segmentText: {
    color: colors.inkMuted,
    fontFamily: fontFamily.bold,
    fontSize: 15,
  },
  segmentTextActive: {
    color: colors.primary,
  },
  submitButton: {
    alignItems: 'center',
    backgroundColor: colors.primaryMid,
    borderRadius: 20,
    height: 64,
    justifyContent: 'center',
  },
  submitButtonDisabled: {
    backgroundColor: '#CBD5E1',
  },
  submitText: {
    color: '#FFFFFF',
    fontFamily: fontFamily.bold,
    fontSize: 17,
  },
  subtitle: {
    color: colors.inkMuted,
    fontFamily: fontFamily.regular,
    fontSize: 18,
    lineHeight: 28,
    marginTop: spacing.md,
  },
  title: {
    color: colors.ink,
    fontFamily: fontFamily.manropeExtraBold,
    fontSize: 36,
    lineHeight: 43,
  },
  titleBlock: {
    marginBottom: 28,
    marginTop: 54,
  },
});
