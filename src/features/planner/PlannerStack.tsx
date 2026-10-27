import { createNativeStackNavigator } from '@react-navigation/native-stack';
import PlannerScreen from './screens/PlannerScreen';
import WearHistoryScreen from './screens/WearHistoryScreen';
 
export type PlannerStackParamList = {
  Planner: { outfitId?: string } | undefined;
  WearHistory: undefined;
};
 
const Stack = createNativeStackNavigator<PlannerStackParamList>();
 
// The Planner tab: the planner, with Wear history opening on top.
export default function PlannerStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Planner" options={{ title: 'Outfit planner' }}>
        {({ navigation, route }) => (
          <PlannerScreen
            outfitId={route.params?.outfitId}
            onOpenHistory={() => navigation.navigate('WearHistory')}
          />
        )}
      </Stack.Screen>
      <Stack.Screen name="WearHistory" component={WearHistoryScreen} options={{ title: 'Wear history' }} />
    </Stack.Navigator>
  );
}