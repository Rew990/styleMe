import { Pressable, Text, StyleSheet } from 'react-native';
import { colors, fontSizes } from './theme';

type Props = { title: string; onPress: () => void; disabled?: boolean };

export default function AppButton({ title, onPress, disabled }: Props) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={[styles.button, disabled ? { opacity: 0.5 } : null]}
    >
      <Text style={styles.text}>{title}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: { backgroundColor: colors.primary, padding: 14, borderRadius: 8, alignItems: 'center' },
  text: { color: '#FFFFFF', fontSize: fontSizes.body, fontWeight: '600' },
});