import { useState } from 'react';
import { View, Text, TextInput, TextInputProps, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type Props = TextInputProps & {
  icon?: keyof typeof Ionicons.glyphMap;
  error?: string;
  isPassword?: boolean;
};

export default function GlassField({ icon, error, isPassword, ...inputProps }: Props) {
  const [hidden, setHidden] = useState(true);

  return (
    <View style={styles.wrapper}>
      <View style={[styles.box, error ? styles.boxError : null]}>
        <TextInput
          style={styles.input}
          placeholderTextColor="rgba(255,255,255,0.75)"
          secureTextEntry={isPassword ? hidden : false}
          {...inputProps}
        />
        {isPassword ? (
          <Pressable onPress={() => setHidden(!hidden)} hitSlop={10}>
            <Ionicons name={hidden ? 'eye-off-outline' : 'eye-outline'} size={22} color="#FFFFFF" />
          </Pressable>
        ) : icon ? (
          <Ionicons name={icon} size={22} color="#FFFFFF" />
        ) : null}
      </View>
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { marginBottom: 14 },
  box: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 54,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.6)',
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  boxError: { borderColor: '#FFB4AB' },
  input: { flex: 1, color: '#FFFFFF', fontSize: 16 },
  error: { color: '#FFB4AB', fontSize: 13, marginTop: 4, marginLeft: 4 },
});