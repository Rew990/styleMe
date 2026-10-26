import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native';
import AppButton from '@/components/AppButton';
import { colors, fontSizes } from '@/components/theme';
import ChipPicker from '@/features/wardrobe/components/ChipPicker';
import { OCCASIONS } from '@/features/wardrobe/options';
import OutfitCard from '../components/OutfitCard';
import { WEATHERS } from '../options';
import { useSuggestionsViewModel } from '../useSuggestionsViewModel';

// Screen 1: pick an occasion and the weather, get matching outfits.
export default function SuggestionsScreen() {
  const vm = useSuggestionsViewModel();

  // The controls scroll together with the results.
  const header = (
    <View>
      <Text style={styles.label}>Occasion</Text>
      <ChipPicker options={OCCASIONS} value={vm.occasion} onChange={vm.setOccasion} />
      {/* YOUR PART 1: the Weather label and picker */}
      <AppButton title={vm.loading ? 'Finding…' : 'Find outfits'} onPress={vm.findOutfits} disabled={vm.loading} />
      {vm.error ? <Text style={styles.error}>{vm.error}</Text> : null}
    </View>
  );

  return (
    <FlatList
      style={styles.container}
      contentContainerStyle={styles.content}
      data={vm.suggestions}
      keyExtractor={(s) => s.id}
      ListHeaderComponent={header}
      renderItem={({ item, index }) => (
        <OutfitCard title={`Option ${index + 1}`} items={item.items}>
          {/* YOUR PART 2: the Save button */}
        </OutfitCard>
      )}
      ListEmptyComponent={
        vm.loading ? (
          <ActivityIndicator style={styles.spinner} />
        ) : (
          <Text style={styles.empty}>
            {vm.searched
              ? 'No outfits match. Try another occasion or weather, or add more clothes.'
              : 'Pick an occasion and the weather, then tap Find outfits.'}
          </Text>
        )
      }
    />
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: 16 },
  label: { fontSize: fontSizes.body, fontWeight: '600', color: colors.text, marginTop: 8, marginBottom: 6 },
  error: { color: colors.error, marginTop: 8 },
  spinner: { marginTop: 32 },
  empty: { textAlign: 'center', marginTop: 32, color: '#777' },
});