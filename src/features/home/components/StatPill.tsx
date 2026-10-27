import { Text, View } from 'react-native';

type StatPillProps = { value: number; label: string };

// One number on the orange banner, drawn like the glass login fields.
export default function StatPill({ value, label }: StatPillProps) {
  return (
    <View className="flex-1 items-center py-2.5 mx-1 rounded-2xl border border-white/60 bg-white/10">
      <Text className="text-white text-[20px] font-bold">{value}</Text>
      <Text className="text-white/90 text-[12px]">{label}</Text>
    </View>
  );
}