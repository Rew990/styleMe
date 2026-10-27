import * as Calendar from 'expo-calendar';
import { Platform } from 'react-native';
 
// Ask once for calendar access. Returns true if the user allowed it.
export async function requestCalendarAccess(): Promise<boolean> {
  const { status } = await Calendar.requestCalendarPermissionsAsync();
  return status === 'granted';
}
 
// The calendar new events go into: the phone's default one.
async function getCalendarId(): Promise<string> {
  if (Platform.OS === 'ios') {
    return (await Calendar.getDefaultCalendarAsync()).id;
  }
  const calendars = await Calendar.getCalendarsAsync(Calendar.EntityTypes.EVENT);
  const writable =
    calendars.find((c) => c.allowsModifications && c.isPrimary) ??
    calendars.find((c) => c.allowsModifications);
  if (!writable) throw new Error('No calendar on this phone can be edited');
  return writable.id;
}
 
// Add an all-day event on a 'YYYY-MM-DD' date. Returns the event id.
export async function addOutfitEvent(date: string, title: string, notes: string): Promise<string> {
  if (!(await requestCalendarAccess())) {
    throw new Error('Calendar access was denied. Allow it in the phone Settings app.');
  }
  const [y, m, d] = date.split('-').map(Number);
  return Calendar.createEventAsync(await getCalendarId(), {
    title,
    notes,
    allDay: true,
    startDate: new Date(y, m - 1, d),
    endDate: new Date(y, m - 1, d + 1),
  });
}
 
// Remove an event this app added, e.g. when the plan is deleted.
export async function removeOutfitEvent(eventId: string): Promise<void> {
  await Calendar.deleteEventAsync(eventId);
}