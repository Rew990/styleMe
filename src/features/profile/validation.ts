import { MAX_STYLES } from './options';

export type SettingsErrors = { repeatWindow?: string; styles?: string };

export function validateSettings(repeatWindowText: string, styles: string[]): SettingsErrors {
  const errors: SettingsErrors = {};
  const days = Number(repeatWindowText);
  if (!repeatWindowText.trim()) errors.repeatWindow = 'Enter a number of days';
  else if (!Number.isInteger(days) || days < 1 || days > 60) errors.repeatWindow = 'Use a whole number from 1 to 60';
  if (styles.length > MAX_STYLES) errors.styles = `Pick up to ${MAX_STYLES} styles`;
  return errors;
}