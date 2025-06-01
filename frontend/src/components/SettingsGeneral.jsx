import React, { useState, useEffect } from 'react';
import { Box as MuiBox, FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import { TextInput } from './BasicFormElements';
import { CheckboxGroup } from './SelectionElements';

const timezones = [
  'UTC', 'America/New_York', 'America/Chicago', 'America/Denver', 'America/Los_Angeles',
  'Europe/London', 'Europe/Paris', 'Europe/Berlin', 'Europe/Moscow',
  'Asia/Kolkata', 'Asia/Shanghai', 'Asia/Tokyo', 'Australia/Sydney',
  'Africa/Johannesburg', 'America/Sao_Paulo', 'Pacific/Auckland',
];

const SettingsGeneral = ({ notifications, notificationOptions, handleNotificationChange }) => {
  const defaultTz = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const [timezone, setTimezone] = useState(defaultTz);
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const formatted = now.toLocaleString('en-US', { timeZone: timezone, weekday: 'short', year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' });

  return (
    <form className="settings-form">
      <h2>General Settings</h2>
      <MuiBox mb={2}>
        <FormControl fullWidth>
          <InputLabel>Timezone</InputLabel>
          <Select
            className="input-field"
            value={timezone}
            label="Timezone"
            onChange={e => setTimezone(e.target.value)}
          >
            {[defaultTz, ...timezones.filter(tz => tz !== defaultTz)].map(tz => (
              <MenuItem key={tz} value={tz}>{tz}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </MuiBox>
      <MuiBox mb={2}>
        <h3>Notification Preferences</h3>
        <CheckboxGroup options={Array.isArray(notificationOptions) ? notificationOptions : []} checked={notifications} onChange={handleNotificationChange} />
      </MuiBox>
      {/*
      <MuiBox mb={2}>
        <FormControl fullWidth>
          <InputLabel>Language & Localization</InputLabel>
          <Select
            className="input-field"
            value={language}
            label="Language & Localization"
            onChange={e => setLanguage(e.target.value)}
          >
            {languageOptions && languageOptions.map(opt => (
              <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </MuiBox>
      <MuiBox mb={2}>
        <FormControl fullWidth>
          <InputLabel>Default Currency</InputLabel>
          <Select
            className="input-field"
            value={currency}
            label="Default Currency"
            onChange={e => setCurrency(e.target.value)}
          >
            {currencyOptions && currencyOptions.map(opt => (
              <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </MuiBox>
      */}
    </form>
  );
};

export default SettingsGeneral; 