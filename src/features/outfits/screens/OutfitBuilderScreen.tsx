import { ComponentRef, useRef } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, TextInput } from 'react-native';
import AppButton from '@/components/AppButton';
import TextField from '@/components/TextField';
import { colors, fontSizes } from '@/components/theme';
import ChipPicker from '@/features/wardrobe/components/ChipPicker';
import { OCCASIONS } from '@/features/wardrobe/options';
import { useBuilderViewModel } from '../useBuilderViewModel';

type Props = { outfitId?: string; onSaved: () => void };

// Screen 2: name an outfit and pick its clothes by hand. With an outfitId it edits that outfit.
export default function OutfitBuilderScreen({ outfitId, onSaved }: Props) {
  const vm = useBuilderViewModel(outfitId, onSaved);
  const nameRef = useRef<ComponentRef<typeof TextInput>>(null); // hooks always before any return

  async function handleSave() {
    // YOUR PART 2: save, and jump to the Name field when the name is wrong
  }

  if (vm.loading) return <ActivityIndicator style={styles.spinner} />;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <TextField
        ref={nameRef}
        label="Name"
        value={vm.name}
        onChangeText={vm.setName}
        error={vm.errors.name}
        placeholder="e.g. Friday dinner"
      />
      <Text style={styles.label}>Occasion</Text>
      <ChipPicker options={OCCASIONS} value={vm.occasion} onChange={vm.setOccasion} />
      <Text style={styles.label}>Pick the clothes ({vm.selectedIds.length} selected)</Text>
      {vm.wardrobe.length === 0 ? (
        <Text style={styles.empty}>Your wardrobe is empty. Add clothes in the Wardrobe tab first.</Text>
      ) : (
        null /* YOUR PART 1: one tappable row per item in vm.wardrobe */
      )}
      {vm.errors.items ? <Text style={styles.error}>{vm.errors.items}</Text> : null}
      {vm.formError ? <Text style={styles.error}>{vm.formError}</Text> : null}
      <AppButton
        title={vm.saving ? 'Saving…' : vm.isEditing ? 'Save changes' : 'Save outfit'}
        onPress={handleSave}
        disabled={vm.saving}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: 16 },
  spinner: { flex: 1 },
  label: { fontSize: fontSizes.body, fontWeight: '600', color: colors.text, marginTop: 8, marginBottom: 6 },
  itemRow: { borderWidth: 1, borderColor: '#ddd', borderRadius: 10, padding: 12, marginBottom: 8, backgroundColor: '#fff' },
  itemRowPicked: { borderColor: colors.primary, backgroundColor: '#f3ecff' },
  itemText: { color: colors.text },
  empty: { color: '#777', marginVertical: 12 },
  error: { color: colors.error, marginBottom: 8 },
});