// Weather is picked by hand in Phase 1 (no weather API).
export const WEATHERS = ['Hot', 'Mild', 'Cold'];

// Which item seasons suit each weather. 'All' suits every weather.
export const WEATHER_SEASONS: Record<string, string[]> = {
  Hot: ['Summer', 'All'],
  Mild: ['Spring-Autumn', 'All'],
  Cold: ['Winter', 'All'],
};

// Colors that go with anything (the rule from Rawan's color grid).
export const NEUTRAL_COLORS = ['White', 'Black', 'Grey', 'Beige', 'Navy'];