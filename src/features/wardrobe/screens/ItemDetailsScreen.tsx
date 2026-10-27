import { ActivityIndicator, Alert, Text, Image, ScrollView, View} from 'react-native';
import AppButton from '../../../components/AppButton';
import { useItemDetailsViewModel } from '../useItemDetailsViewModel';

type Props = { id: string; onDeleted: () => void};

export default function ItemDetailsScreen({ id,onDeleted}: Props) {
    const vm = useItemDetailsViewModel(id, onDeleted); 

  function confirmDelete() {
  Alert.alert('Delete item?', 'This removes it from your wardrobe.', [
    { text: 'Cancel', style: 'cancel' },
    { text: 'Delete', style: 'destructive', onPress: vm.remove },
  ]);
}
if (vm.loading) return <ActivityIndicator className="flex-1" />;
if (!vm.item) return <Text className="text-danger m-4">{vm.error}</Text>;
const item  = vm.item;
return (
  <ScrollView contentContainerClassName="grow p-6 bg-background">
    {item.imageUri ? (
        <Image source={{ uri: item.imageUri }} className="w-full aspect-square rounded-xl mb-4" />
    ) : (
    <View className="w-full aspect-square rounded-xl mb-4 bg-[#e5e5e5] items-center justify-center">
    <Text className="text-[72px] text-[#999]">{item.category.charAt(0)}</Text>
    </View>
    )}
    <Text className="text-body text-text mb-4">{item.name}</Text>
    <Text className="text-body text-text mb-2">Category: {item.category}</Text>
    <Text className="text-body text-text mb-2">Color: {item.color}</Text>
    <Text className="text-body text-text mb-2">Season: {item.season}</Text>
    <Text className="text-body text-text mb-2">Occasion: {item.occasion}</Text>
    <Text className="text-body text-text mb-2">Times worn: {item.timesWorn}</Text>
    <Text className="text-body text-text mb-2">Added on: {new Date(item.createdAt).toLocaleDateString()}</Text>
    {vm.error ? <Text className="text-danger mb-4">{vm.error}</Text> : null}
    <AppButton title="I wore it today" onPress={vm.wearToday} />
    <AppButton title="Delete" onPress={confirmDelete} />
  </ScrollView>
);
}



