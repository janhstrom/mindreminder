// In saveSettings...
if (isInitialSave) \{
    // For the very first save, only insert the non-time columns to avoid casting issues.
    // The user can set the times via the UI later.
    const initialUserSettingsData = \{
        user_id: userId,
        push_enabled: settings.pushEnabled,
        email_enabled: settings.emailEnabled,
        sound_enabled: settings.soundEnabled,
        vibration_enabled: settings.vibrationEnabled,
        quiet_hours: settings.quietHours,
        timezone: settings.timezone,
        theme: settings.theme,
        language: settings.language,
        reminder_style: settings.reminderStyle,
        week_starts_on: settings.weekStartsOn,
        date_format: settings.dateFormat,
        time_format: settings.timeFormat,
    \};
    const \{ error: settingsError \} = await supabase.from("user_settings").upsert(initialUserSettingsData, \{
        onConflict: "user_id",
    \});
    // ... handle error
\} else \{
    // For subsequent saves, include all fields.
    const userSettingsDataSnakeCase = \{ /* ... all fields ... */ \};
    const \{ error: settingsError \} = await supabase.from("user_settings").upsert(userSettingsDataSnakeCase, \{
        onConflict: "user_id",
    \});
    // ... handle error
\}