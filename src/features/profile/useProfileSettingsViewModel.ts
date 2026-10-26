import { useEffect, useState } from 'react';
import { requestCalendarAccess } from '@/services/calendar';
import { getSettings, saveSettings } from './repository';
import { SettingsErrors, validateSettings } from './validation';

export function useProfileSettingsViewModel() {
  const [chosenStyles, setChosenStyles] = useState<string[]>([]);
  const [repeatWindowText, setRepeatWindowText] = useState('7');
  const [calendarOn, setCalendarOn] = useState(false);
  const [errors, setErrors] = useState<SettingsErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [savedMessage, setSavedMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getSettings()
      .then((s) => {
        setChosenStyles(s.stylePreferences);
        setRepeatWindowText(String(s.repeatWindowDays));
        setCalendarOn(s.googleConnected);
      })
      .catch(() => setFormError('Could not load your settings'))
      .finally(() => setLoading(false));
  }, []);

  function toggleStyle(style: string) {
    setSavedMessage(null);
    setChosenStyles((list) => (list.includes(style) ? list.filter((s) => s !== style) : [...list, style]));
  }

  // Turning it on asks the phone for calendar access first.
  async function toggleCalendar(on: boolean) {
    setSavedMessage(null);
    setFormError(null);
    if (!on) {
      setCalendarOn(false);
      return;
    }
    try {
      const granted = await requestCalendarAccess();
      setCalendarOn(granted);
      if (!granted) setFormError('Calendar access was denied. Allow it in the phone Settings app.');
    } catch {
      setFormError('Could not ask for calendar access');
    }
  }

  function changeRepeatWindow(text: string) {
    setSavedMessage(null);
    setRepeatWindowText(text);
  }

  // Returns the errors it found, so the screen can focus the first wrong field.
  async function save(): Promise<SettingsErrors> {
    const found = validateSettings(repeatWindowText, chosenStyles);
    setErrors(found);
    setFormError(null);
    setSavedMessage(null);
    if (Object.keys(found).length > 0) return found;
    setSaving(true);
    try {
      await saveSettings({
        stylePreferences: chosenStyles,
        repeatWindowDays: Number(repeatWindowText),
        googleConnected: calendarOn,
      });
      setSavedMessage('Settings saved');
    } catch {
      setFormError('Could not save your settings. Try again.');
    } finally {
      setSaving(false);
    }
    return found;
  }

  return {
    chosenStyles, toggleStyle, repeatWindowText, changeRepeatWindow,
    calendarOn, toggleCalendar, errors, formError, savedMessage, loading, saving, save,
  };
}