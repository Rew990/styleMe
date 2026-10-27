import {View, Text, Pressable, StyleSheet, Image, ImageBackground, KeyboardAvoidingView, Platform} from 'react-native';
import {colors, gradients} from '@/components/theme';
import {User} from '@/models/User';
import { useSignUpViewModel } from '@/features/auth/useSignUpViewModel';
import { BlurView } from 'expo-blur';
import {LinearGradient} from 'expo-linear-gradient';
import GlassField from '@/features/auth/GlassField';

type Props = {onSignedUp: (user: User) => void; onGoToLogin: () => void};
export default function SignUpScreen({onSignedUp, onGoToLogin}: Props) {
  const vm = useSignUpViewModel(onSignedUp);

  return (
    <ImageBackground source={require('../../../../assets/login-bg.jpg')} style={styles.background}>
      <KeyboardAvoidingView behavior={Platform.OS == 'ios' ? 'padding' : undefined} style={styles.center}>
        <BlurView style={styles.blur} intensity={20}>
          <Image source={require('../../../../assets/logo.png')} style={styles.logo} />
          <Text style={styles.title}>Create an account</Text>
   <Text style={styles.subtitle}>Sign up to plan Today's Outfit</Text>
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
      <GlassField
        placeholder="Confirm password"
        value={vm.confirm}
        onChangeText={vm.setConfirm}
        error={vm.errors.confirm}
      />
      {vm.formError ? <Text style={styles.formError}>{vm.formError}</Text> : null}
      
      <Pressable onPress={vm.submit} disabled={vm.loading} style={({pressed}) => [styles.buttonWrap, (pressed || vm.loading ) && {opacity: 0.8}]}>
        <LinearGradient
          colors={gradients.button}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.button}
        >      
          <Text style={styles.buttonText}>{vm.loading ? 'Signing up…' : 'Sign up'}</Text>
        </LinearGradient>
      </Pressable>
      <Pressable onPress={onGoToLogin} style={styles.link}>
        <Text style={styles.linkText}>Already have an account? Log in</Text>
      </Pressable>
    </BlurView>
    </KeyboardAvoidingView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {flex: 1},
  center: {flex: 1, justifyContent: 'center',paddingBottom: 24, paddingTop: 24, paddingHorizontal: 24},
  blur: {padding: 24, borderRadius: 24, borderWidth: 1, borderColor: 'rgba(255,255,255,0.7)', backgroundColor: 'rgba(255,255,255,0.08)', overflow: 'hidden'},
  logo: {width: 700, height: 190, alignSelf: 'center', marginBottom: 5, resizeMode: 'contain'},
  title: {fontSize: 24, fontFamily: 'PlayfairDisplay_700Bold', color: '#FFFFFF', textAlign: 'center', marginBottom: 4},
  subtitle: {fontSize: 15, color: 'rgba(255,255,255,0.9)', textAlign: 'center', marginTop: 4, marginBottom: 24},
  formError: {color: '#FFB4AB', textAlign: 'center', marginBottom: 12},
  buttonWrap: {marginTop: 8, borderRadius: 14, overflow: 'hidden'},
  button: {height: 54, alignItems: 'center', justifyContent: 'center'},
  buttonText: {color: '#FFFFFF', fontSize: 16, fontWeight: '700'},
  link: {marginTop: 10, alignItems: 'center'},
  linkText: {color: colors.primaryDark, fontSize:15},
  linkBold: {color: colors.primary, fontWeight: '700'},
});  