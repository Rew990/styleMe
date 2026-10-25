import { View, Text, Pressable, StyleSheet } from 'react-native';
import TextField from '../../components/TextField';
import AppButton from '../../components/AppButton';
import { colors, fontSizes } from '../../components/theme';
import { useLoginViewModel } from './useLoginViewModel';
import { User } from '../../models/User';

type Props = { onLoggedIn: (user: User) => void; onGoToSignUp: () => void };

export default function LoginScreen({ onLoggedIn, onGoToSignUp }: Props) {
  const vm = useLoginViewModel(onLoggedIn);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome back</Text>
      <TextField
        label="Email"
        value={vm.email}
        onChangeText={vm.setEmail}
        error={vm.errors.email}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextField
        label="Password"
        value={vm.password}
        onChangeText={vm.setPassword}
        error={vm.errors.password}
        secureTextEntry
      />
      {vm.formError ? <Text style={styles.formError}>{vm.formError}</Text> : null}
      <AppButton title={vm.loading ? 'Logging in…' : 'Log in'} onPress={vm.submit} disabled={vm.loading} />
      <Pressable onPress={onGoToSignUp} style={styles.link}>
        <Text style={styles.linkText}>No account? Sign up</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, justifyContent: 'center', backgroundColor: colors.background },
  title: { fontSize: fontSizes.title, fontWeight: '700', color: colors.text, marginBottom: 24 },
  formError: { color: colors.error, marginBottom: 12 },
  link: { marginTop: 16, alignItems: 'center' },
  linkText: { color: colors.primary, fontSize: fontSizes.body },
});