import { View, Text, Pressable, StyleSheet, Image, ImageBackground, KeyboardAvoidingView, Platform } from 'react-native';
import { colors } from '../../../components/theme';
import { useLoginViewModel } from '../useLoginViewModel';
import { User } from '../../../models/User';
import { BlurView } from 'expo-blur';
import {LinearGradient} from 'expo-linear-gradient';
import GlassField from '../../auth/GlassField';

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
        secureTextEntry
      />
      {vm.formError ? <Text style={styles.formError}>{vm.formError}</Text> : null}
      
      <Pressable onPress={vm.submit} disabled={vm.loading} style={({pressed}) => [styles.buttonWrapp, (pressed || vm.loading ) && {opacity: 0.8}]}>
<LinearGradient
              colors={[colors.primary, '#5B2BD6']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.button}
            >      
          <Text style={styles.buttonText}>{vm.loading ? 'Logging in…' : 'Log in'}</Text>
      </LinearGradient>
      </Pressable>
      
      
      <Pressable onPress={onGoToSignUp} style={styles.link}>
        <Text style={styles.linkText}>No account? Sign up<Text style={styles.linkBold}>Sign up</Text>

        </Text>
      </Pressable>
    </BlurView>
    </KeyboardAvoidingView>
    <ImageBackground/>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, justifyContent: 'center', backgroundColor: colors.background },
  title: { fontSize: fontSizes.title, fontWeight: '700', color: colors.text, marginBottom: 24 },
  formError: { color: colors.error, marginBottom: 12 },
  link: { marginTop: 16, alignItems: 'center' },
  linkText: { color: colors.primary, fontSize: fontSizes.body },
  logo: { width: 700, height: 270, alignSelf: 'center', marginBottom: 10, resizeMode: 'contain' },
  blur: { padding: 24, borderRadius: 24, borderWidth: 1, borderColor: 'rgba(255,255,255,0.7)', backgroundColor: 'rgba(255,255,255,0.08)', overflow: 'hidden',},
});