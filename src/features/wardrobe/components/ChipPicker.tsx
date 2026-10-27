import { Pressable, Text, View } from 'react-native';

type Props = { options: string[]; value: string; onChange: (value: string) => void };

export default function ChipPicker({ options, value, onChange }: Props) {
  return (
    <View className="flex-row flex-wrap  mb-2">
      {options.map((option) => {
        const selected = option === value;
        return (
          <Pressable
            key={option}
            onPress={() => onChange(option)}
            className={`py-1.5 px-3 mr-2 mb-2 rounded-2xl border border-primary active:opacity-70 ${selected ? 'bg-primary' : ''}`}          >
            <Text className={selected ? 'text-white text-sm' : 'text-primary text-sm'}>{option}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}
