import { View, Text, TextInput, TextInputProps, StyleSheet } from 'react-native';
import { colors, fontSizes } from './theme';

type Props = TextInputProps & { label: string; error?: string };

export default function TextField({ label, error, ...inputProps }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={[styles.input, error ? { borderColor: colors.error } : null]}
        placeholderTextColor={colors.muted}
        {...inputProps}
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: 16 },
  label: { fontSize: fontSizes.small, color: colors.text, marginBottom: 4 },
  input: { borderWidth: 1, borderColor: colors.border, borderRadius: 8, padding: 12, fontSize: fontSizes.body },
  error: { color: colors.error, fontSize: fontSizes.small, marginTop: 4 },
});