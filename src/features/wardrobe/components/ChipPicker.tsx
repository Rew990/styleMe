import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors } from '../../../components/theme';

type Props = { options: string[]; value: string; onChange: (value: string) => void };

export default function ChipPicker({ options, value, onChange }: Props) {
  return (
    <View style={styles.row}>
      {options.map((option) => {
        const selected = option === value;
        return (
          <Pressable
            key={option}
            onPress={() => onChange(option)}
            style={[styles.chip, selected && styles.chipSelected]}
          >
            <Text style={[styles.text, selected && styles.textSelected]}>{option}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 8 },
  chip: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.primary,
    marginRight: 8,
    marginBottom: 8,
  },
  chipSelected: { backgroundColor: colors.primary },
  text: { color: colors.primary, fontSize: 14 },
  textSelected: { color: '#fff' },
});