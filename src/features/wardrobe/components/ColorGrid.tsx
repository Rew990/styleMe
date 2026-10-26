import { Pressable, Text, View } from 'react-native';
import { ColorOption } from '../options';

type Props = { options: ColorOption[]; value: string; onChange: (name: string) => void };

export default function ColorGrid({ options, value, onChange }: Props) {
  return (
  <View>
    <View className="flex-row flex-wrap">
        {options.map((option) => {
            const selected = option.name === value;
            return (
            <Pressable
            key={option.name}
            onPress={() => onChange(option.name)}
            className={`p-[3px] m-1 rounded-3xl border-2 ${selected ? 'border-primary' : 'border-transparent'}`}accessibilityLabel={option.name}>
                <View
                className="w-[34px] h-[34px] rounded-full border border-[#CCCCCC]"
                style={{ backgroundColor: option.hex }}
                />
            </Pressable>
          );
        })}
      </View>
      <Text className="text-text mt-1 mb-2">Selected: {value}</Text>    </View>
  );
}

