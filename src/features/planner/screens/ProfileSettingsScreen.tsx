import { type ComponentRef, useRef } from 'react';
import { Pressable, ScrollView, Switch, Text, TextInput, View } from 'react-native';
import AppButton from '@/components/AppButton';
import TextField from '@/components/TextField';
import { colors } from '@/components/theme';
import { MAX_STYLES, STYLE_OPTIONS } from '../options';
import { useProfileSettingsViewModel } from '../useProfileSettingsViewModel';
 
// Style preferences, the repeat window and the calendar switch.
export default function ProfileSettingsScreen() {
  const vm = useProfileSettingsViewModel();
  const windowRef = useRef<ComponentRef<typeof TextInput>>(null);
 
  // Lab 2: validate, then focus the first wrong field.
  async function handleSave() {
    const found = await vm.save();
    if (found.repeatWindow) windowRef.current?.focus();
  }
 
  if (vm.loading) {
    return <Text className="text-center mt-10 text-muted">Loading...</Text>;
  }
 
  const picked = vm.chosenStyles.length;
 
  return (
    <ScrollView className="flex-1 bg-background" contentContainerClassName="p-4" keyboardShouldPersistTaps="handled">
      <Text className="text-body font-semibold text-text mb-1">Style preferences</Text>
      <Text className={vm.errors.styles ? 'text-error mb-2' : 'text-muted mb-2'}>
        {vm.errors.styles ?? `Pick up to ${MAX_STYLES} (${picked} picked)`}
      </Text>
      <View className="flex-row flex-wrap mb-4">
        {STYLE_OPTIONS.map((style) => {
          const selected = vm.chosenStyles.includes(style);
          return (
            <Pressable
              key={style}
              onPress={() => vm.toggleStyle(style)}
              accessibilityRole="checkbox"
              accessibilityState={{ checked: selected }}
              className={`py-1.5 px-3 mr-2 mb-2 rounded-2xl border border-primary active:opacity-70 ${selected ? 'bg-primary' : ''}`}
            >
              <Text className={selected ? 'text-white text-sm' : 'text-primary text-sm'}>{style}</Text>
            </Pressable>
          );
        })}
      </View>
 
      <TextField
        ref={windowRef}
        label="Repeat window (days)"
        placeholder="7"
        keyboardType="number-pad"
        value={vm.repeatWindowText}
        onChangeText={vm.changeRepeatWindow}
        maxLength={2}
        error={vm.errors.repeatWindow}
      />
      <Text className="text-[13px] text-muted -mt-2 mb-4">
        Wearing the same outfit again within this many days counts as a repeat.
      </Text>
 
      <View className="flex-row items-center justify-between mb-6">
        <View className="flex-1 mr-3">
          <Text className="text-body text-text">Add plans to my calendar</Text>
          <Text className="text-[13px] text-muted">Shows an Add to calendar button on each plan.</Text>
        </View>
        <Switch
          value={vm.calendarOn}
          onValueChange={vm.toggleCalendar}
          trackColor={{ true: colors.primary, false: colors.border }}
          accessibilityLabel="Add plans to my calendar"
        />
      </View>
 
      {vm.formError ? <Text className="text-error mb-3">{vm.formError}</Text> : null}
      {vm.savedMessage ? <Text className="text-sage mb-3">✓ {vm.savedMessage}</Text> : null}
 
      <AppButton title={vm.saving ? 'Saving...' : 'Save settings'} onPress={handleSave} disabled={vm.saving} />
    </ScrollView>
  );
}