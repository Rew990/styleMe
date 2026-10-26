import { useCallback } from 'react';
import { Alert, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import AppButton from '@/components/AppButton';
import { colors, fontSizes } from '@/components/theme';
import OutfitCard from '../components/OutfitCard';
import { useSavedOutfitsViewModel } from '../useSavedOutfitsViewModel';

type Props = { onSuggest: () => void; onBuild: () => void; onOpenOutfit: (id: string) => void };

// Screen 3: saved outfits, with favorite and delete. Tap one to edit it.
export default function SavedOutfitsScreen({ onSuggest, onBuild, onOpenOutfit }: Props) {
  const vm = useSavedOutfitsViewModel();
  const { reload } = vm;

  // Reload each time this screen comes back into view, e.g. after building an outfit.
  useFocusEffect(
    useCallback(() => {
      reload();
    }, [reload])
  );

  function confirmDelete(id: string) {
    Alert.alert('Delete outfit?', 'This removes it from your saved outfits.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => vm.remove(id) },
    ]);
  }

  return (
    <View style={styles.container}>
      {/* YOUR PART 2: the All / Favorites picker and the "3 outfits" count */}
      {vm.error ? <Text style={styles.error}>{vm.error}</Text> : null}
      <FlatList
        data={vm.outfits}
        keyExtractor={(o) => o.id}
        refreshing={vm.loading}
        onRefresh={reload}
        renderItem={({ item }) => (
          <Pressable onPress={() => onOpenOutfit(item.id)}>
            <OutfitCard title={item.name} items={item.items}>
              {/* YOUR PART 1: the ★ / ☆ favorite button */}
              <AppButton title="Delete" onPress={() => confirmDelete(item.id)} />
            </OutfitCard>
          </Pressable>
        )}
        ListEmptyComponent={
          vm.loading ? undefined : (
            <Text style={styles.empty}>No saved outfits yet. Build one from your wardrobe.</Text>
          )
        }
      />
      <AppButton title="Get suggestions" onPress={onSuggest} />
      <AppButton title="+ Build outfit" onPress={onBuild} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: colors.background },
  count: { color: '#777', marginBottom: 8 },
  star: { paddingHorizontal: 12, paddingVertical: 4, marginRight: 8 },
  starText: { fontSize: 24, color: colors.primary },
  error: { color: colors.error, marginBottom: 8 },
  empty: { textAlign: 'center', marginTop: 40, color: '#777' },
});