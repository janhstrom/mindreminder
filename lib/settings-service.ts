// In lib/settings-service.ts

// 1. Modify DEFAULT_SETTINGS_VALUES
const DEFAULT_SETTINGS_VALUES: Omit<UserSettings, "firstName" | "lastName" | "email" | "bio" | "quietStart" | "quietEnd" | "defaultReminderTime"> = \{
  pushEnabled: true,
  emailEnabled: false,
  soundEnabled: true,
  vibrationEnabled: true,
  quietHours: false,
  // quietStart: "22:00", // REMOVED
  // quietEnd: "08:00", // REMOVED
  timezone: "America/New_York",
  theme: "system",
  language: "en",
  reminderStyle: "gentle",
  // defaultReminderTime: "09:00", // REMOVED
  weekStartsOn: "monday",
  dateFormat: "MM/dd/yyyy",
  timeFormat: "12h",
\}

// 2. Modify UserSettings interface to make time fields optional
export interface UserSettings \{
  // ...
  quietStart?: string // changed to optional
  quietEnd?: string // changed to optional
  // ...
  defaultReminderTime?: string // changed to optional
  // ...
\}

// 3. Modify saveSettings to not send them if they are undefined
const userSettingsDataSnakeCase = \{
    user_id: userId,
    push_enabled: settings.pushEnabled,
    email_enabled: settings.emailEnabled,
    // ...
    quiet_start: settings.quietStart, // will be undefined on initial save
    quiet_end: settings.quietEnd, // will be undefined on initial save
    // ...
    default_reminder_time: settings.defaultReminderTime, // will be undefined on initial save
    // ...
\};