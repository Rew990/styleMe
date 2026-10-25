import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors } from '../../../components/theme';
import { ColorOption } from '../options';

type Props = { options: ColorOption[]; value: string; onChange: (name: string) => void };

export default function ColorGrid({ options, value, onChange }: Props) {
  return (
    <View>
      <View style={styles.grid}>
        {options.map((option) => {
          const selected = option.name === value;
          return (
            <Pressable
              key={option.name}
              onPress={() => onChange(option.name)}
              style={[styles.ring, selected && styles.ringSelected]}
              accessibilityLabel={option.name}
            >
              <View style={[styles.swatch, { backgroundColor: option.hex }]} />
            </Pressable>
          );
        })}
      </View>
      <Text style={styles.chosen}>{value ? `Selected: ${value}` : 'Tap a color'}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  grid: { flexDirection: 'row', flexWrap: 'wrap' },
  ring: { padding: 3, margin: 4, borderRadius: 24, borderWidth: 2, borderColor: 'transparent' },
  ringSelected: { borderColor: colors.primary },
  swatch: { width: 34, height: 34, borderRadius: 17, borderWidth: 1, borderColor: '#CCCCCC' },
  chosen: { color: colors.text, marginTop: 4, marginBottom: 8 },
});