import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import PlaceholderScreen from './PlaceholderScreen';
import { Button } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../features/auth/screens/LoginScreen';
import SignUpScreen from '../features/auth/screens/SignUpScreen';
import { useSessionViewModel } from '../features/auth/useSessionViewModel';

const Stack = createNativeStackNavigator();
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
function MainTabs({ onLogOut }: { onLogOut: () => void }) {
  return (
    <Tab.Navigator screenOptions={{ headerRight: () => <Button title="Log out" onPress={onLogOut} /> }}>
      <Tab.Screen name="Wardrobe" component={WardrobeTab} />
      <Tab.Screen name="Outfits" component={OutfitsTab} />
      <Tab.Screen name="Planner" component={PlannerTab} />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
     const session = useSessionViewModel();
  if (session.checking) return null; // still reading session.json

  return (
    <NavigationContainer>
        {session.user ? (
            <MainTabs onLogOut={session.signOut} />
        ) : (
          <Stack.Navigator>
            <Stack.Screen name="Login" options={{ title: 'Login' }}>
              {({ navigation }) => (
                <LoginScreen onLoggedIn={session.setUser} onGoToSignUp={() => navigation.navigate('SignUp')} />
              )}
            </Stack.Screen>
            <Stack.Screen name="SignUp" options={{ title: 'Sign Up' }}>
              {({ navigation }) => (
                <SignUpScreen onSignedUp={session.setUser} onGoToLogin={() => navigation.navigate('Login')} />
              )}
            </Stack.Screen>
          </Stack.Navigator>
        )}
      {/* Login/signup (styleMe/auth) goes here later:
          show a Login/Sign up stack when nobody is logged in,
          and <MainTabs /> when someone is. */}
    </NavigationContainer>
  );
}