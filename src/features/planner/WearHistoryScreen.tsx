import { useCallback, useMemo, useState } from 'react';
import { Alert, FlatList, Switch, Text, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { colors } from '@/components/theme';
import HistoryRow from '../components/HistoryRow';
import { useWearHistoryViewModel } from '../useWearHistoryViewModel';
 
// What was worn when, newest first. Repeats inside the repeat window are marked.
export default function WearHistoryScreen() {
  const vm = useWearHistoryViewModel();
  const { reload } = vm;
  const [repeatsOnly, setRepeatsOnly] = useState(false);
 
  // Reload on focus: Wore it on the Planner adds rows, Profile can change the window.
  useFocusEffect(
    useCallback(() => {
      reload();
    }, [reload])
  );