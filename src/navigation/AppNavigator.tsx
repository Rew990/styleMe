import { NavigationContainer, type NavigatorScreenParams } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import PlaceholderScreen from './PlaceholderScreen';
import { Button, Image } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../features/auth/screens/LoginScreen';
import SignUpScreen from '../features/auth/screens/SignUpScreen';
import { useSessionViewModel } from '../features/auth/useSessionViewModel';
import WardrobeStack, { type WardrobeStackParamList } from '../features/wardrobe/WardrobeStack';
import OutfitsStack from '@/features/outfits/OutfitsStack';
import PlannerStack, { type PlannerStackParamList } from '@/features/planner/PlannerStack';
import ProfileSettingsScreen from '@/features/profile/screens/ProfileSettingsScreen';
import HomeScreen from '@/features/home/screens/HomeScreen';

// One entry per tab. Nested stacks use NavigatorScreenParams (Lab 3 typed navigation).
export type MainTabParamList = {
  Home: undefined;
  Wardrobe: NavigatorScreenParams<WardrobeStackParamList> | undefined;
  Outfits: undefined;
  Planner: NavigatorScreenParams<PlannerStackParamList> | undefined;
  Profile: undefined;
};

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator<MainTabParamList>();

// Placeholders. Each teammate swaps theirs for a real screen.
function WardrobeTab() {
  return <PlaceholderScreen title="Wardrobe" />;
}

function PlannerTab() {
  return <PlaceholderScreen title="Planner" />;
}

// The main tabs. Home is first and opens after login.
function MainTabs({ onLogOut, userName }: { onLogOut: () => void; userName?: string }) {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerTitle: () => (
          <Image source={require('../../assets/logo.png')} style={{ width: 36, height: 36, resizeMode: 'contain' }} />
        ),
        headerRight: () => <Button title="Log out" onPress={onLogOut} />,
      }}
    >
      <Tab.Screen name="Home">
        {({ navigation }) => (
          <HomeScreen
            userName={userName}
            onAddItem={() => navigation.navigate('Wardrobe', { screen: 'AddItem' })}
            onNewOutfit={() => navigation.navigate('Outfits')}
            onOpenPlanner={() => navigation.navigate('Planner', { screen: 'Planner' })}
            onOpenHistory={() => navigation.navigate('Planner', { screen: 'WearHistory' })}
          />
        )}
      </Tab.Screen>
      <Tab.Screen name="Wardrobe" component={WardrobeStack} options={{ headerShown: false }} />
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
        <MainTabs onLogOut={session.signOut} userName={session.user?.name} />
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
    </NavigationContainer>
  );
}
