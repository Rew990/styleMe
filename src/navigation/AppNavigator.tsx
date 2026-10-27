import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import PlaceholderScreen from './PlaceholderScreen';
import { Button, Image } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../features/auth/screens/LoginScreen';
import SignUpScreen from '../features/auth/screens/SignUpScreen';
import { useSessionViewModel } from '../features/auth/useSessionViewModel';
import WardrobeStack from '../features/wardrobe/WardrobeStack';
import OutfitsStack from '@/features/outfits/OutfitsStack';
import PlannerStack from '@/features/planner/PlannerStack';
import ProfileSettingsScreen from '@/features/profile/screens/ProfileSettingsScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Placeholders. Each teammate swaps theirs for a real screen.
function WardrobeTab() {
  return <PlaceholderScreen title="Wardrobe" />;
}

function PlannerTab() {
  return <PlaceholderScreen title="Planner" />;
}

// The 3 main tabs.
function MainTabs({ onLogOut }: { onLogOut: () => void }) {
  return (
    <Tab.Navigator screenOptions={{ headerTitle: () => (
      <Image source={require('../../assets/logo.png')} style={{ width: 36, height: 36, resizeMode: 'contain' }} />
    ),
    headerRight: () => <Button title="Log out" onPress={onLogOut} />,
  }}
>
      <Tab.Screen name="Wardrobe" component={WardrobeStack} options={{headerShown: false}} />
      <Tab.Screen name="Outfits" component={OutfitsStack} options={{ headerShown: false }} />
<Tab.Screen name="Planner" component={PlannerStack} options={{ headerShown: false }} />
      <Tab.Screen name="Profile" component={ProfileSettingsScreen} />
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
