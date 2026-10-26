import { Text, Image, ScrollView} from 'react-native';
import TextField from '../../../components/TextField';
import AppButton from '../../../components/AppButton';
import { ClothingItem } from '../../../models/ClothingItem';
import { useAddItemViewModel } from '../useAddItemViewModel';
import ChipPicker from '../components/ChipPicker';
import { CATEGORIES, SEASONS, OCCASIONS, COLORS } from '../options';
import ColorGrid from '../components/ColorGrid';

type Props = {onSaved: (item: ClothingItem) => void};
export default function AddItemScreen({onSaved}: Props) {
  const vm = useAddItemViewModel(onSaved);

  return (
  <ScrollView contentContainerClassName="grow p-6 bg-background">
    <Image source={require('../../../../assets/logo.png')} className="self-center mb-2.5"
    style={{width: 150, height: 199}}
    resizeMode="contain"
     />
    <Text className="text-title font-bold text-text mb-6">Add Item</Text>
    <TextField label="Name" value={vm.name} onChangeText={vm.setName} error={vm.errors.name} />
    <Text className="text-body text-text mb-2">Color</Text>
    <ColorGrid 
      options={COLORS} 
      value={vm.color} 
      onChange={vm.setColor} 
    />
    {vm.errors.color ? <Text className="text-danger mb-2">{vm.errors.color}</Text> : null}
      <Text className="text-body font-semibold text-text mt-3 mb-1.5">Category</Text>
      <ChipPicker 
      options={CATEGORIES} 
      value={vm.category} 
      onChange={vm.setCategory} 
      />
      {vm.errors.category ? <Text className="text-danger mb-2">{vm.errors.category}</Text> : null}
      <Text className="text-body font-semibold text-text mt-3 mb-1.5">Season</Text>
      <ChipPicker options={SEASONS} value={vm.season} onChange={vm.setSeason} />
      <Text className="text-body font-semibold text-text mt-3 mb-1.5">Occasion</Text>
      <ChipPicker options={OCCASIONS} value={vm.occasion} onChange={vm.setOccasion} />
      
      {vm.formError ? <Text className="text-danger mb-3">{vm.formError}</Text> : null}
      <AppButton title={vm.saving ? 'Saving…' : 'Save Item'} onPress={vm.save} disabled={vm.saving} />
    </ScrollView>
  );
}

 