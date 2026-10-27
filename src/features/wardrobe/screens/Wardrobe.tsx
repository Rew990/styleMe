import { useCallback, useState } from 'react';
import { FlatList, Image, Pressable, Text, View, } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import AppButton from '@/components/AppButton';
import TextField from '@/components/TextField';
import { colors } from '@/components/theme';
import { ClothingItem } from '@/models/ClothingItem';
import ChipPicker from '@/features/wardrobe/components/ChipPicker';
import { CATEGORIES, SEASONS } from '../options';
import { useWardrobeViewModel } from '../useWardrobeViewModel';


type Props = { onAddItem: () => void; onOpenItem: (id: string) => void };

export default function WardrobeScreen({ onAddItem, onOpenItem }: Props) {
  const vm = useWardrobeViewModel();
  const { reload } = vm;
  const [showFilters, setShowFilters] = useState(false);
  // Reload each time this screen comes back into view, e.g. after adding an item.
  useFocusEffect(
    useCallback(() => {
      reload();
    }, [reload])
  );

  function renderItem({ item }: { item: ClothingItem }) {
    return (
      <Pressable className="w-[48%] mb-4" onPress={() => onOpenItem(item.id)}>
        {item.imageUri ? (
          <Image source={{ uri: item.imageUri }} className="w-full aspect-square rounded-xl" />
        ) : (
          <View className="w-full aspect-square rounded-xl bg-[#e5e5e5] items-center justify-center">
            <Text className="text-[32px] text-[#999]">{item.name.charAt(0).toUpperCase()}
            </Text>
          </View>
        )}
        <Text className="text-body font-semibold text-text mt-1.5">{item.name}</Text>
        <Text className="text-[13px] text-muted">{item.color} · {item.category}</Text>
      </Pressable>
    );
  }

  return (
    <View className="flex-1 p-4 bg-background">
        <TextField label="Search" placeholder="Search items..." value={vm.query} onChangeText={vm.setQuery} />
        <Pressable
        onPress={() => setShowFilters((open) => !open)}
        accessibilityRole="button"
        accessibilityLabel="Filters"
        accessibilityState={{ expanded: showFilters }}
        className="flex-row items-center self-start py-2 px-4 mb-3 rounded-2xl border border-primary active:opacity-70"
      >
        <Ionicons name="options-outline" size={18} color={colors.primary} />
        <Text className="text-primary text-body ml-2">
            {vm.activeFilterCount > 0 ? `Filters (${vm.activeFilterCount})` : 'Filters'}
            </Text>
            </Pressable>
            {showFilters && (
                <View className="p-3 mb-3 rounded-xl bg-surface">
                    <Text className="text-body font-semibold text-text mb-1.5">Category</Text>
                    <ChipPicker options={['All', ...CATEGORIES]} value={vm.category} onChange={vm.setCategory} />
                    <Text className="text-body font-semibold text-text mb-1.5">Season</Text>
                    <ChipPicker options={['All', ...SEASONS.filter((s) => s !== 'All')]}value={vm.season}onChange={vm.setSeason}/>
            {vm.activeFilterCount > 0 && (
                <Pressable onPress={vm.clearFilters} accessibilityRole="button" className="active:opacity-70">
                    <Text className="text-primary text-sm">Clear filters</Text>
                    </Pressable>
            )}
            </View>
        )}
      {!!vm.error && <Text className="text-danger mb-3">{vm.error}</Text>}
      <FlatList
        data={vm.items}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        numColumns={2}
        columnWrapperStyle={{justifyContent: 'space-between'}}
        refreshing={vm.loading}
        onRefresh={reload}
        ListEmptyComponent={
          vm.loading ? undefined : (
            <Text className="text-center mt-10 text-muted">
              {vm.query.trim() ? 'No items match your search' :vm.total === 0 ? 'Your wardrobe is empty. Add your first item!' : 'No items match these filters.'}
            </Text>
          )
        }
      />
      <AppButton title="+ Add item" onPress={onAddItem} />
    </View>
  );
}

