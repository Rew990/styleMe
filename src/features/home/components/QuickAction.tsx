import { Pressable, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/components/theme';

type QuickActionProps = { icon: keyof typeof Ionicons.glyphMap; label: string; onPress: () => void };

// A square shortcut button: icon in a soft orange circle, label underneath.
export default function QuickAction({ icon, label, onPress }: QuickActionProps) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
      className="flex-1 items-center py-3 mx-1 rounded-2xl border border-border bg-background active:opacity-70"
    >
      <View className="w-11 h-11 rounded-full bg-primary/10 items-center justify-center mb-1.5">
        <Ionicons name={icon} size={22} color={colors.primary} />
      </View>
      <Text className="text-[13px] text-text font-semibold">{label}</Text>
    </Pressable>
  );
}