import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import PlaceholderScreen from './PlaceholderScreen';
import { Button, Image, } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../features/auth/screens/LoginScreen';
import SignUpScreen from '../features/auth/screens/SignUpScreen';
import { useSessionViewModel } from '../features/auth/useSessionViewModel';
import WardrobeStack from '../features/wardrobe/WardrobeStack';
import OutfitsStack from '@/features/outfits/OutfitsStack';
import HeaderLogo from '@/components/HeaderLogo';

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
    <Tab.Navigator
  screenOptions={({ route }) => ({
    headerTitle: () => <HeaderLogo />,
     
    headerRight: () => <Button title="Log out" color="#FF4F03" onPress={onLogOut} />,
        tabBarIcon: ({ color, size }) => (
      <Image source={require('../../assets/tab-icon.png')} style={{ width: size, height: size, tintColor: color, resizeMode: 'contain' }} />
    ),
    tabBarActiveTintColor: '#FF4F03',
    tabBarInactiveTintColor: '#829475',
    
  })}
>
      <Tab.Screen name="Wardrobe" component={WardrobeStack} options={{headerShown: false}} />
      <Tab.Screen name="Outfits" component={OutfitsStack} options={{ headerShown: false }} />
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
            <Stack.Screen name="Login" options={{ headerShown: false }}>
              {({ navigation }) => (
                <LoginScreen onLoggedIn={session.setUser} onGoToSignUp={() => navigation.navigate('SignUp')} />
              )}
            </Stack.Screen>
            <Stack.Screen name="SignUp" options={{ headerShown: false }}>
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
