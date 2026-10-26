import { ComponentRef, forwardRef } from 'react';
import { StyleSheet, Text, TextInput, TextInputProps, View } from 'react-native';
import { colors, fontSizes } from './theme';

// A labelled text box with a red error message under it.
// forwardRef lets a screen focus it, e.g. nameRef.current?.focus() (Lab 2 pattern).
type Props = TextInputProps & { label: string; error?: string };

const TextField = forwardRef<ComponentRef<typeof TextInput>, Props>(function TextField({ label, error, style, ...rest }, ref) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        ref={ref}
        style={[styles.input, error ? styles.inputError : null, style]}
        placeholderTextColor="#999"
        {...rest}
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
});

export default TextField;

const styles = StyleSheet.create({
  container: { marginBottom: 16 },
  label: { fontSize: fontSizes.body, color: colors.text, marginBottom: 6 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: fontSizes.body,
    color: colors.text,
    backgroundColor: '#fff',
  },
  inputError: { borderColor: colors.error },
  error: { color: colors.error, marginTop: 4 },
});