import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SavedOutfitsScreen from './screens/SavedOutfitsScreen';
import SuggestionsScreen from './screens/SuggestionsScreen';
import OutfitBuilderScreen from './screens/OutfitBuilderScreen';

export type OutfitsStackParamList = {
  SavedOutfits: undefined;
  Suggestions: undefined;
  OutfitBuilder: { outfitId?: string };
};

const Stack = createNativeStackNavigator<OutfitsStackParamList>();

export default function OutfitsStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="SavedOutfits" options={{ title: 'My outfits' }}>
        {({ navigation }) => (
          <SavedOutfitsScreen
            onSuggest={() => navigation.navigate('Suggestions')}
            onBuild={() => navigation.navigate('OutfitBuilder', {})}
            onOpenOutfit={(id) => navigation.navigate('OutfitBuilder', { outfitId: id })}
          />
        )}
      </Stack.Screen>
      <Stack.Screen name="Suggestions" options={{ title: 'Outfit suggestions' }}>
        {() => <SuggestionsScreen />}
      </Stack.Screen>
      <Stack.Screen
        name="OutfitBuilder"
        options={({ route }) => ({ title: route.params.outfitId ? 'Edit outfit' : 'Build outfit' })}
      >
        {({ navigation, route }) => (
          <OutfitBuilderScreen outfitId={route.params.outfitId} onSaved={() => navigation.goBack()} />
        )}
      </Stack.Screen>
    </Stack.Navigator>
  );
}