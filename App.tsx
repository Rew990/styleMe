import { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import AppNavigator from './src/navigation/AppNavigator';
import { initStorage, seedSampleData } from './src/services/fileStorage';

export default function App() {
  const [ready, setReady] = useState(false);

  // Runs once when the app opens: create the data files,
  // then fill them with sample data (development only).
  useEffect(() => {
    async function prepare() {
      try {
        await initStorage();
        if (__DEV__) await seedSampleData();
      } catch (e) {
        console.warn('Storage setup failed', e);
      } finally {
        setReady(true);
      }
    }
    prepare();
  }, []);

  // A spinner while the files are being prepared.
  if (!ready) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <>
      <AppNavigator />
      <StatusBar style="auto" />
    </>
  );
}