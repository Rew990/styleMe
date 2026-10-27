import { useCallback, useMemo, useState } from 'react';
import { Alert, FlatList, Switch, Text, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { colors } from '@/components/theme';
import HistoryRow from '../components/HistoryRow';
import { useWearHistoryViewModel } from '../useWearHistoryViewModel';

// What was worn when, newest first. Repeats inside the repeat window are marked.
export default function WearHistoryScreen() {
  const vm = useWearHistoryViewModel();
  const { reload } = vm;
  const [repeatsOnly, setRepeatsOnly] = useState(false);

  // Reload on focus: Wore it on the Planner adds rows, Profile can change the window.
  useFocusEffect(
    useCallback(() => {
      reload();
    }, [reload])
  );

  // Lab 2: filter with useMemo, never change vm.rows itself.
  const shown = useMemo(
    () => (repeatsOnly ? vm.rows.filter((r) => r.isRepeat) : vm.rows),
    [vm.rows, repeatsOnly]
  );

  function confirmDelete(id: string) {
    Alert.alert('Delete this record?', 'Repeats are counted again without it.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => vm.remove(id) },
    ]);
  }

  const count = shown.length;

  return (
    <View className="flex-1 p-4 bg-background">
      <Text className="text-muted mb-3">Repeat = the same outfit worn again within {vm.windowDays} days.</Text>

      <View className="flex-row items-center justify-between mb-3">
        <Text className="text-body text-text">Repeats only</Text>
        <Switch
          value={repeatsOnly}
          onValueChange={setRepeatsOnly}
          trackColor={{ true: colors.primary, false: colors.border }}
          accessibilityLabel="Show repeats only"
        />
      </View>

      {!!vm.error && <Text className="text-error mb-3">{vm.error}</Text>}

      {count > 0 ? (
        <Text className="text-body font-semibold text-text mb-2">
          {count} {count === 1 ? 'outfit' : 'outfits'} worn
        </Text>
      ) : null}

      <FlatList
        data={shown}
        keyExtractor={(row) => row.id}
        renderItem={({ item }) => <HistoryRow row={item} onDelete={() => confirmDelete(item.id)} />}
        refreshing={vm.loading}
        onRefresh={reload}
        ListEmptyComponent={
          vm.loading ? undefined : (
            <Text className="text-center mt-10 text-muted">
              {repeatsOnly
                ? `No repeats in your ${vm.windowDays}-day window.`
                : 'No outfits worn yet. Tap Wore it on the Planner.'}
            </Text>
          )
        }
      />
    </View>
  );
}