import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import PlaceholderScreen from './PlaceholderScreen';

const Tab = createBottomTabNavigator();

// Placeholders. Each teammate swaps theirs for a real screen.
function WardrobeTab() {
  return <PlaceholderScreen title="Wardrobe" />;
}

function OutfitsTab() {
  return <PlaceholderScreen title="Outfits" />;
}

function PlannerTab() {
  return <PlaceholderScreen title="Planner" />;
}

// The 3 main tabs.
function MainTabs() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Wardrobe" component={WardrobeTab} />
      <Tab.Screen name="Outfits" component={OutfitsTab} />
      <Tab.Screen name="Planner" component={PlannerTab} />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  return (
    <NavigationContainer>
      {/* Login/signup (styleMe/auth) goes here later:
          show a Login/Sign up stack when nobody is logged in,
          and <MainTabs /> when someone is. */}
      <MainTabs />
    </NavigationContainer>
  );
}