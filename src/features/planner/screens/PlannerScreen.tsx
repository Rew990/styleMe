import {View, Text, Pressable, StyleSheet, ScrollView, TextInput, Alert} from 'react-native';
import {colors, fontSizes} from '@/components/theme';
import ChipPicker from '@/features/wardrobe/components/ChipPicker';
import AppButton from '@/components/AppButton';
import TextField from '@/components/TextField';
import {formatDay} from '@/features/planner/dates';
import { usePlannerViewModel } from '@/features/planner/usePlannerViewModel';
import { ComponentRef, useCallback, useRef } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { PlannedOutfit } from '@/models/PlannedOutfit';

type Props = { outfitId?: string ; onOpenHistory: () => void}

export default function PlannerScreen({ outfitId,onOpenHistory }: Props) {
  const vm = usePlannerViewModel(outfitId);
  const { reload } = vm;
  const noteRef = useRef<ComponentRef<typeof TextInput>>(null); 

  // Reload each time this screen comes back into view, e.g. after adding an item.
  useFocusEffect(
    useCallback(() => {
      reload();
    }, [reload])
);
    
    async function handleSave() {
        const found = await vm.savePlan();
        if (found.note) noteRef.current?.focus();}
        
    function confirmDelete(plan: PlannedOutfit) {  Alert.alert('Delete plan', 'Are you sure you want to delete this plan?', [{text: 'Cancel', style: 'cancel'}, {text: 'Delete', style: 'destructive', onPress: () => vm.removePlan(plan)},]);}


    if (vm.loading) {return <Text>Loading...</Text>;}

  return (
    <ScrollView>
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.days}>
  {vm.days.map((day) => 
  {const picked = day === vm.date;
    return (
      <Pressable key={day} onPress={() => vm.setDate(day)} style={[styles.day, picked && styles.dayPicked]}>
        <Text style={picked ? styles.dayTextPicked : styles.dayText}>
          {day === vm.today ? 'Today' : formatDay(day)}
        </Text>
      </Pressable>);
  })}
      </ScrollView>
      {vm.repeatWarning ? (<View style={styles.warning}>
    <Text style={styles.warningText}> {vm.repeatWarning}</Text>
  </View>
) : null}


{vm.plans.map((plan) => (<View key={plan.id}>
    <Text>{formatDay(plan.date)}: {vm.outfitName(plan.outfitId)}</Text>
    {vm.calendarOn && !plan.calendarEventId ? (
        <AppButton title="Add to calendar" onPress={() => vm.addToCalendar(plan)} />
        ) : null}
        {plan.calendarEventId ? <Text style={styles.inCalendar}>✓ In your calendar</Text> : null}
        {plan.date <= vm.today ? <AppButton title="Wore it" onPress={() => vm.woreIt(plan)} /> : null}
        <AppButton title="Delete" onPress={() => confirmDelete(plan)} />
  </View>
))}
</ScrollView>
  );
}

const styles = StyleSheet.create({
days: {flexDirection: 'row', paddingVertical: 12, paddingHorizontal: 8, backgroundColor: colors.background},
day: {paddingVertical: 8, paddingHorizontal: 12, borderRadius: 8, marginHorizontal: 4},
dayPicked: {backgroundColor: colors.primary},
dayText: {color: colors.text, fontSize: fontSizes.body},
dayTextPicked: {color: '#FFFFFF', fontSize: fontSizes.body},
warning: {backgroundColor: '#FFF4E5', paddingVertical: 8, paddingHorizontal: 12, borderRadius: 8, marginHorizontal: 4},
warningText: {color: '#663C00', fontSize: fontSizes.body},
inCalendar: {color: '#2E7D32', fontSize: fontSizes.body, marginTop: 8},
});