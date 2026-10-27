import { Pressable, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/components/theme';
import type { HistoryRow as Row } from '../useWearHistoryViewModel';
import { formatDay } from '../dates';
 
type Props = { row: Row; onDelete: () => void };
 
// One day an outfit was worn. Repeats get an orange badge.
export default function HistoryRow({ row, onDelete }: Props) {
  return (
    <View className="flex-row items-center p-3 mb-2 rounded-xl border border-border bg-background">
      <View className="flex-1">
        <Text className="text-[13px] text-muted">{formatDay(row.wornOn)}</Text>
        <Text className="text-body font-semibold text-text">{row.outfitName}</Text>
      </View>
      {row.isRepeat ? (
        <View className="py-1 px-2 mr-2 rounded-xl bg-amber">
          <Text className="text-white text-xs font-semibold">Repeat</Text>
        </View>
      ) : null}
      <Pressable onPress={onDelete} accessibilityRole="button" accessibilityLabel="Delete this record" hitSlop={10} className="active:opacity-70">
        <Ionicons name="trash-outline" size={20} color={colors.error} />
      </Pressable>
    </View>
  );
}