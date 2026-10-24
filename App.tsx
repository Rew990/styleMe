import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { useEffect } from 'react';
import { initStorage, readJson, seedSampleData } from './src/services/fileStorage';

export default function App() {
  useEffect(() => {
    initStorage()
      .then(() => (__DEV__ ? seedSampleData() : undefined))
      .then(() => readJson<unknown[]>('wardrobe'))
      .then((items) => console.log('Storage ready, wardrobe has', items.length, 'items'))
      .catch((error) => console.error('Storage setup failed', error));
  }, []);
  return (
    <View style={styles.container}>
      <Text>Open up App.tsx to start working on your app!</Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
