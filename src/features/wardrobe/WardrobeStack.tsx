import { createNativeStackNavigator } from '@react-navigation/native-stack';
import WardrobeScreen from './screens/Wardrobe';
import AddItemScreen from './screens/AddItemScreen';
import ItemDetailsScreen from './screens/ItemDetailsScreen';
import HeaderLogo from '@/components/HeaderLogo';

const Stack = createNativeStackNavigator();

// The Wardrobe tab: the list, with Add item and Item details opening on top.
export default function WardrobeStack() {
  return (
    <Stack.Navigator screenOptions={{ headerTitle: () => <HeaderLogo/>}}>
      <Stack.Screen name="WardrobeList" options={{ title: 'My wardrobe' }}>
        {({ navigation }) => (
          <WardrobeScreen
            onAddItem={() => navigation.navigate('AddItem')}
            onOpenItem={(id) => navigation.navigate('ItemDetails', { id })}
          />
        )}
      </Stack.Screen>
      <Stack.Screen name="AddItem" options={{ title: 'Add item' }}>
        {({ navigation }) => <AddItemScreen onSaved={() => navigation.goBack()} />}
      </Stack.Screen>
      <Stack.Screen name="ItemDetails" options={{ title: 'Item details' }}>
        {({ navigation, route }) => (
          <ItemDetailsScreen
            id={(route.params as { id: string }).id}
            onDeleted={() => navigation.goBack()}
          />
        )}
      </Stack.Screen>
    </Stack.Navigator>
  );
}