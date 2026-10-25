import { ActivityIndicator, Alert, Text, Image, ScrollView, StyleSheet, View} from 'react-native';
import AppButton from '../../../components/AppButton';
import {colors, fontSizes} from '../../../components/theme';
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
if (vm.loading) return <ActivityIndicator style={{ flex: 1 }} />;
if (!vm.item) return <Text style={styles.error}>{vm.error}</Text>;
const item  = vm.item;
return (
  <ScrollView contentContainerStyle={styles.container}>
    {item.imageUri ? (
        <Image source={{ uri: item.imageUri }} style={styles.photo} />
    ) : (
    <View style={[styles.photo, styles.noPhoto]}> 
    <Text style={styles.noPhotoText}>{item.category.charAt(0)}</Text>
    </View>
    )}
    <Text style={styles.title}>{item.name}</Text>
    <Text style={styles.row}>Category: {item.category}</Text>
    <Text style={styles.row}>Color: {item.color}</Text>
    <Text style={styles.row}>Season: {item.season}</Text>
    <Text style={styles.row}>Occasion: {item.occasion}</Text>
    <Text style={styles.row}>Times worn: {item.timesWorn}</Text>
    <Text style={styles.row}>Added on: {new Date(item.createdAt).toLocaleDateString()}</Text>
    {vm.error ? <Text style={styles.error}>{vm.error}</Text> : null}
    <AppButton title="I wore it today" onPress={vm.wearToday} />
    <AppButton title="Delete" onPress={confirmDelete} />
  </ScrollView>
);
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 24, backgroundColor: colors.background },
  title: { fontSize: fontSizes.title, fontWeight: '700', color: colors.text, marginBottom: 16 },
  row: { fontSize: fontSizes.body, color: colors.text, marginBottom: 8 },
  error: { color: colors.error, margin: 16 },
  photo: { width: '100%', aspectRatio: 1, borderRadius: 12, marginBottom: 16 },
  noPhoto: { backgroundColor: '#e5e5e5', alignItems: 'center', justifyContent: 'center' },
  noPhotoText: { fontSize: 72, color: '#999' },
  
});

