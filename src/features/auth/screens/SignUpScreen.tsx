import {View, Text, Pressable, StyleSheet} from 'react-native';
import TextField from '../../../components/TextField';
import AppButton from '../../../components/AppButton';
import {colors, fontSizes} from '../../../components/theme';
import {User} from '../../../models/User';
import { useSignUpViewModel } from '../useSignUpViewModel';

type Props = {onSignedUp: (user: User) => void; onGoToLogin: () => void};
export default function SignUpScreen({onSignedUp, onGoToLogin}: Props) {
  const vm = useSignUpViewModel(onSignedUp);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create an account</Text>
      <TextField label="Name" value={vm.name} onChangeText={vm.setName} error={vm.errors.name} />
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
      <TextField
        label="Confirm password"
        value={vm.confirm}
        onChangeText={vm.setConfirm}
        error={vm.errors.confirm}
        secureTextEntry
      />
      {vm.formError ? <Text style={styles.formError}>{vm.formError}</Text> : null}
      <AppButton title={vm.loading ? 'Signing up…' : 'Sign up'} onPress={vm.submit} disabled={vm.loading} />
      <Pressable onPress={onGoToLogin} style={styles.link}>
        <Text style={styles.linkText}>Already have an account? Log in</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, padding: 24, justifyContent: 'center', backgroundColor: colors.background},
  title: {fontSize: fontSizes.title, fontWeight: '700', color: colors.text, marginBottom: 24},
  formError: {color: colors.error, marginBottom: 12},
  link: {marginTop: 16, alignItems: 'center'},
  linkText: {color: colors.primary, fontSize: fontSizes.body},
});  