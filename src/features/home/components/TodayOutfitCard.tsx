import { Image, Pressable, ScrollView, Text, View } from 'react-native';
import type { ClothingItem } from '@/models/ClothingItem';
import type { Outfit } from '@/models/Outfit';
import type { PlannedOutfit } from '@/models/PlannedOutfit';

type TodayOutfitCardProps = {
  plan: PlannedOutfit | null;
  outfit: Outfit | null;
  items: ClothingItem[];
  wornToday: boolean;
  onOpenPlanner: () => void;
};

// Today's planned outfit with its clothes, or an invite to plan one.
export default function TodayOutfitCard({ plan, outfit, items, wornToday, onOpenPlanner }: TodayOutfitCardProps) {
  if (!plan || !outfit) {
    return (
      <View className="p-4 mb-5 rounded-xl border border-dashed border-primary items-center">
        <Text className="text-body text-text mb-1">Nothing planned for today</Text>
        <Text className="text-[13px] text-muted mb-3">Pick an outfit so your morning is easy.</Text>
        <Pressable onPress={onOpenPlanner} accessibilityRole="button" className="py-2 px-4 rounded-2xl bg-primary active:opacity-70">
          <Text className="text-white text-sm">Plan today's outfit</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View className="p-4 mb-5 rounded-xl border border-border bg-background">
      <View className="flex-row items-center justify-between">
        <Text className="text-[18px] font-bold text-text flex-1" numberOfLines={1}>{outfit.name}</Text>
        {!!outfit.occasion && (
          <View className="py-1 px-2.5 rounded-2xl bg-sage/15">
            <Text className="text-sage text-[12px]">{outfit.occasion}</Text>
          </View>
        )}
      </View>
      {!!plan.note && <Text className="text-[13px] text-muted mt-1">{plan.note}</Text>}

      <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mt-3">
        {items.map((item) => (
          <View key={item.id} className="w-20 mr-2">
            {item.imageUri ? (
              <Image source={{ uri: item.imageUri }} className="w-20 h-20 rounded-xl" />
            ) : (
              <View className="w-20 h-20 rounded-xl bg-surface items-center justify-center">
                <Text className="text-[24px] text-muted">{item.category.charAt(0)}</Text>
              </View>
            )}
            <Text className="text-[12px] text-text mt-1" numberOfLines={1}>{item.name}</Text>
          </View>
        ))}
      </ScrollView>

      {wornToday ? (
        <Text className="text-sage text-[13px] mt-3">✓ Worn today</Text>
      ) : (
        <Pressable onPress={onOpenPlanner} accessibilityRole="button" className="self-start mt-3 py-1.5 px-3 rounded-2xl border border-primary active:opacity-70">
          <Text className="text-primary text-sm">Open planner</Text>
        </Pressable>
      )}
    </View>
  );
}