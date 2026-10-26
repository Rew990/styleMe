import { useCallback } from 'react';
import { FlatList, Image, Pressable, StyleSheet, Text, View, } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import AppButton from '../../../components/AppButton';
import { colors, fontSizes } from '../../../components/theme';
import { ClothingItem } from '../../../models/ClothingItem';
import ChipPicker from '../components/ChipPicker';
import { CATEGORIES, SEASONS } from '../options';
import { useWardrobeViewModel } from '../useWardrobeViewModel';
import TextField from '@/components/TextField';

type Props = { onAddItem: () => void; onOpenItem: (id: string) => void };

export default function WardrobeScreen({ onAddItem, onOpenItem }: Props) {
  const vm = useWardrobeViewModel();
  const { reload } = vm;

  // Reload each time this screen comes back into view, e.g. after adding an item.
  useFocusEffect(
    useCallback(() => {
      reload();
    }, [reload])
  );

  function renderItem({ item }: { item: ClothingItem }) {
    return (
      <Pressable style={styles.card} onPress={() => onOpenItem(item.id)}>
        {item.imageUri ? (
          <Image source={{ uri: item.imageUri }} style={styles.photo} />
        ) : (
          <View style={[styles.photo, styles.noPhoto]}>
            <Text style={styles.noPhotoText}>{item.category.charAt(0)}</Text>
          </View>
        )}
        <Text style={styles.name} numberOfLines={1}>{item.name}</Text>
        <Text style={styles.meta}>{item.color} · {item.category}</Text>
      </Pressable>
    );
  }

  return (
    <View style={styles.container}>
        <TextField label="Search" placeholder="Search items..." value={vm.query} onChangeText={vm.setQuery} />
      <ChipPicker options={['All', ...CATEGORIES]} value={vm.category} onChange={vm.setCategory} />
      <ChipPicker options={['All', ...SEASONS.filter((s) => s !== 'All')]} value={vm.season} onChange={vm.setSeason} />

      {vm.error ? <Text style={styles.error}>{vm.error}</Text> : null}
      <FlatList
        data={vm.items}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        numColumns={2}
        columnWrapperStyle={styles.row}
        refreshing={vm.loading}
        onRefresh={reload}
        ListEmptyComponent={
          vm.loading ? undefined : (
            <Text style={styles.empty}>
              {vm.query.trim() ? 'No items match your search' :vm.total === 0 ? 'Your wardrobe is empty. Add your first item!' : 'No items match these filters.'}
            </Text>
          )
        }
      />
      <AppButton title="+ Add item" onPress={onAddItem} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: colors.background },
  row: { justifyContent: 'space-between' },
  card: { width: '48%', marginBottom: 16 },
  photo: { width: '100%', aspectRatio: 1, borderRadius: 12 },
  noPhoto: { backgroundColor: '#e5e5e5', alignItems: 'center', justifyContent: 'center' },
  noPhotoText: { fontSize: 32, color: '#999' },
  name: { fontSize: fontSizes.body, fontWeight: '600', color: colors.text, marginTop: 6 },
  meta: { fontSize: 13, color: '#777' },
  error: { color: colors.error, marginBottom: 12 },
  empty: { textAlign: 'center', marginTop: 40, color: '#777' },
});