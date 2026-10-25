import { Text, StyleSheet, Image, ScrollView} from 'react-native';
import TextField from '../../../components/TextField';
import AppButton from '../../../components/AppButton';
import {colors, fontSizes} from '../../../components/theme';
import { ClothingItem } from '../../../models/ClothingItem';
import { useAddItemViewModel } from '../useAddItemViewModel';
import ChipPicker from '../components/ChipPicker';
import { CATEGORIES, SEASONS, OCCASIONS, COLORS } from '../options';
import ColorGrid from '../components/ColorGrid';

type Props = {onSaved: (item: ClothingItem) => void};
export default function AddItemScreen({onSaved}: Props) {
  const vm = useAddItemViewModel(onSaved);

  return (
  <ScrollView contentContainerStyle={styles.container}>
    <Image source={require('../../../../assets/logo.png')} style={styles.logo} />
    <Text style={styles.title}>Add Item</Text>
    <TextField label="Name" value={vm.name} onChangeText={vm.setName} error={vm.errors.name} />
    <Text style={styles.label}>Color</Text>
    <ColorGrid 
      options={COLORS} 
      value={vm.color} 
      onChange={vm.setColor} 
    />
    {vm.errors.color ? <Text style={styles.error}>{vm.errors.color}</Text> : null}
      <Text style={styles.label}>Category</Text>
      <ChipPicker 
      options={CATEGORIES} 
      value={vm.category} 
      onChange={vm.setCategory} 
      />
      {vm.errors.category ? <Text style={styles.error}>{vm.errors.category}</Text> : null}
      <Text style={styles.label}>Season</Text>
      <ChipPicker options={SEASONS} value={vm.season} onChange={vm.setSeason} />
      <Text style={styles.label}>Occasion</Text>
      <ChipPicker options={OCCASIONS} value={vm.occasion} onChange={vm.setOccasion} />
      
      {vm.formError ? <Text style={styles.error}>{vm.formError}</Text> : null}
      <AppButton title={vm.saving ? 'Saving…' : 'Save Item'} onPress={vm.save} disabled={vm.saving} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {flexGrow: 1, padding: 24, backgroundColor: colors.background},
  title: {fontSize: fontSizes.title, fontWeight: '700', color: colors.text, marginBottom: 6, marginTop: 12},
  label: {fontSize: fontSizes.body, color: colors.text, marginBottom: 8},
  error: {color: colors.error, marginBottom: 8},
  logo: {width: 150, height: 199, alignSelf: 'center', marginBottom: 10, resizeMode: 'contain'},
});  