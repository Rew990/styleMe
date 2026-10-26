import { View, Text, Pressable, StyleSheet, Image, ImageBackground, KeyboardAvoidingView, Platform } from 'react-native';
import { colors, gradients } from '@/components/theme';
import { useLoginViewModel } from '@/features/auth/useLoginViewModel';
import { User } from '@/models/User';
import { BlurView } from 'expo-blur';
import {LinearGradient} from 'expo-linear-gradient';
import GlassField from '@/features/auth/GlassField';

type Props = { onLoggedIn: (user: User) => void; onGoToSignUp: () => void };

export default function LoginScreen({ onLoggedIn, onGoToSignUp }: Props) {
  const vm = useLoginViewModel(onLoggedIn);

  return (
      <ImageBackground source={require('../../../../assets/login-bg.jpg')} style={styles.background}>
        <KeyboardAvoidingView behavior={Platform.OS == 'ios' ? 'padding' : undefined} style={styles.center}>
        <BlurView style={styles.blur} intensity={40}>
          <Image source={require('../../../../assets/logo.png')} style={styles.logo} />
          <Text style={styles.title}>Welcome back</Text>
          <Text style={styles.subtitle}>Log in to plan Today's Outfit</Text>
          <GlassField
            placeholder="Email"
            icon='mail-outline'
            value={vm.email}
        onChangeText={vm.setEmail}
        error={vm.errors.email}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <GlassField
        placeholder="Password"
        isPassword
        value={vm.password}
        onChangeText={vm.setPassword}
        error={vm.errors.password}
      />

      {vm.formError ? <Text style={styles.formError}>{vm.formError}</Text> : null}
      
      <Pressable onPress={vm.submit} disabled={vm.loading} style={({pressed}) => [styles.buttonWrap, (pressed || vm.loading ) && {opacity: 0.8}]}>
<LinearGradient
              colors={gradients.button}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.button}
            >      
          <Text style={styles.buttonText}>{vm.loading ? 'Logging in…' : 'Log in'}</Text>
      </LinearGradient>
      </Pressable>
      
      
      <Pressable onPress={onGoToSignUp} style={styles.link}>
        <Text style={styles.linkText}>No account? Sign up</Text>
      </Pressable>
    </BlurView>
    </KeyboardAvoidingView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
background: { flex: 1 },
  center: { flex: 1, justifyContent: 'center', padding: 24 },
  card: {padding: 24,borderRadius: 24,borderWidth: 1,borderColor: 'rgba(255,255,255,0.7)',backgroundColor: 'rgba(255,255,255,0.08)',overflow: 'hidden',},
  title: { fontSize: 28, fontWeight: '700', color: colors.text, marginBottom: 24 },
  formError: { color: '#FFB4AB', textAlign: 'center', marginBottom: 12 },
  link: { marginTop: 16, alignItems: 'center' },
  linkText: { color: colors.primary, fontSize: 16 },
  linkBold: { color: colors.primary, fontWeight: '700' },
  logo: { width: 700, height: 270, alignSelf: 'center', marginBottom: 10, resizeMode: 'contain' },
  subtitle: { fontSize: 15, color: 'rgba(255,255,255,0.9)', textAlign: 'center', marginTop: 4, marginBottom: 24 },
  buttonWrap: { marginTop: 8, borderRadius: 14, overflow: 'hidden' },
  button: { height: 54, alignItems: 'center', justifyContent: 'center' },
  buttonText: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' },
  blur: { padding: 24, borderRadius: 24, borderWidth: 1, borderColor: 'rgba(255,255,255,0.7)', backgroundColor: 'rgba(255,255,255,0.08)', overflow: 'hidden',},
});