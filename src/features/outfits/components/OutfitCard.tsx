import { ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, fontSizes } from '@/components/theme';
import type { ClothingItem } from '@/models/ClothingItem';
import { colorHex } from '@/features/wardrobe/options';

type Props = { title: string; items: ClothingItem[]; children?: ReactNode };

// One outfit: its name, a color dot and name per piece, and any buttons passed in.
export default function OutfitCard({ title, items, children }: Props) {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>{title}</Text>
      {items.map((item) => (
        <View key={item.id} style={styles.row}>
          <View style={[styles.dot, { backgroundColor: colorHex(item.color) }]} />
          <Text style={styles.itemText}>{item.name} · {item.category}</Text>
        </View>
      ))}
      {items.length === 0 ? <Text style={styles.missing}>The clothes in this outfit were deleted</Text> : null}
      {children ? <View style={styles.actions}>{children}</View> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: '#fff', borderRadius: 12, borderWidth: 1, borderColor: '#e5e5e5', padding: 12, marginBottom: 12 },
  title: { fontSize: fontSizes.body, fontWeight: '700', color: colors.text, marginBottom: 8 },
  row: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
  dot: { width: 14, height: 14, borderRadius: 7, borderWidth: 1, borderColor: '#ccc', marginRight: 8 },
  itemText: { color: colors.text },
  missing: { color: '#777', fontStyle: 'italic' },
  actions: { flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', marginTop: 8 },
});