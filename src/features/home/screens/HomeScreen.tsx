import { useCallback } from 'react';
import { Pressable, RefreshControl, ScrollView, Text, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, gradients } from '@/components/theme';
import QuickAction from '../components/QuickAction';
import StatPill from '../components/StatPill';
import TodayOutfitCard from '../components/TodayOutfitCard';
import { formatShort } from '../dates';
import { useHomeViewModel } from '../useHomeViewModel';

type HomeScreenProps = {
  userName?: string;
  onAddItem: () => void;
  onNewOutfit: () => void;
  onOpenPlanner: () => void;
  onOpenHistory: () => void;
};

// The first tab: greeting, today's outfit, shortcuts and what was worn lately.
export default function HomeScreen({ userName, onAddItem, onNewOutfit, onOpenPlanner, onOpenHistory }: HomeScreenProps) {
  const vm = useHomeViewModel();
  const { reload } = vm;

  // Hooks first, before any early return (Lab 2). Reload on focus: other tabs add items, outfits, plans and wears.
  useFocusEffect(
    useCallback(() => {
      reload();
    }, [reload])
  );

  if (vm.loading && vm.itemCount === 0) {
    return <Text className="text-center mt-10 text-muted">Loading...</Text>;
  }

  return (
    <ScrollView
      className="flex-1 bg-background"
      contentContainerClassName="p-4"
      refreshControl={<RefreshControl refreshing={vm.loading} onRefresh={reload} tintColor={colors.primary} />}
    >
      {/* 1. Greeting banner (same gradient as the login button) */}
      <LinearGradient colors={gradients.button} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={{ borderRadius: 24, padding: 20, marginBottom: 20 }}>
        <Text className="text-white/90 text-body">{vm.greeting},</Text>
        <Text className="text-white text-[26px] font-bold" numberOfLines={1}>{userName || 'there'}</Text>
        <Text className="text-white/80 text-[13px] mt-0.5 mb-4">{formatShort(vm.today)}</Text>
        <View className="flex-row -mx-1">
          <StatPill value={vm.itemCount} label="Items" />
          <StatPill value={vm.outfitCount} label="Outfits" />
          <StatPill value={vm.upcomingCount} label="Planned" />
        </View>
      </LinearGradient>

      {!!vm.error && <Text className="text-error mb-3">{vm.error}</Text>}

      {/* 2. Repeat warning */}
      {!!vm.repeatWarning && (
        <View className="p-3 mb-4 rounded-xl bg-amber/10 border border-amber">
          <Text className="text-text font-semibold">Repeat alert</Text>
          <Text className="text-text text-[13px] mt-0.5">{vm.repeatWarning} Swap it in the planner?</Text>
        </View>
      )}

      {/* 3. Today's outfit */}
      <Text className="text-body font-semibold text-text mb-2">Today's outfit</Text>
      <TodayOutfitCard
        plan={vm.todayPlan}
        outfit={vm.todayOutfit}
        items={vm.todayItems}
        wornToday={vm.wornToday}
        onOpenPlanner={onOpenPlanner}
      />

      {/* 4. Quick actions */}
      <Text className="text-body font-semibold text-text mb-2">Quick actions</Text>
      <View className="flex-row -mx-1 mb-5">
        <QuickAction icon="add-circle-outline" label="Add item" onPress={onAddItem} />
        <QuickAction icon="sparkles-outline" label="New outfit" onPress={onNewOutfit} />
        <QuickAction icon="calendar-outline" label="Plan" onPress={onOpenPlanner} />
      </View>

      {/* 5. Recently worn */}
      <View className="flex-row items-center justify-between mb-2">
        <Text className="text-body font-semibold text-text">Recently worn</Text>
        <Pressable onPress={onOpenHistory} accessibilityRole="button" hitSlop={10} className="active:opacity-70">
          <Text className="text-primary text-sm">See all</Text>
        </Pressable>
      </View>
      {vm.recent.length === 0 ? (
        <Text className="text-muted mb-3">No outfits worn yet. Tap Wore it on the Planner.</Text>
      ) : (
        vm.recent.map((row) => (
          <View key={row.id} className="flex-row items-center justify-between py-2.5 border-b border-border">
            <View className="flex-1">
              <Text className="text-body text-text" numberOfLines={1}>{row.outfitName}</Text>
              <Text className="text-[13px] text-muted">{formatShort(row.wornOn)}</Text>
            </View>
            {row.isRepeat && (
              <View className="py-1 px-2.5 rounded-2xl bg-amber/10 border border-amber">
                <Text className="text-amber text-[12px]">Repeat</Text>
              </View>
            )}
          </View>
        ))
      )}
    </ScrollView>
  );
}
