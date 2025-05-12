import React from 'react';
import { Box as MuiBox, FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import { TextInput } from './BasicFormElements';
import { CheckboxGroup } from './SelectionElements';

const SettingsGeneral = ({ name, setName, email, notifications, notificationOptions, handleNotificationChange, language, setLanguage, languageOptions, currency, setCurrency, currencyOptions }) => (
  <form className="settings-form">
    <h2>General Settings</h2>
    <MuiBox mb={2}>
      <TextInput label="Name" value={name} onChange={e => setName(e.target.value)} />
    </MuiBox>
    <MuiBox mb={2}>
      <TextInput label="Email" value={email} InputProps={{ readOnly: true }} />
    </MuiBox>
    <MuiBox mb={2}>
      <h3>Notification Preferences</h3>
      <CheckboxGroup options={notificationOptions} checked={notifications} onChange={handleNotificationChange} />
    </MuiBox>
    <MuiBox mb={2}>
      <FormControl fullWidth>
        <InputLabel>Language & Localization</InputLabel>
        <Select
          className="input-field"
          value={language}
          label="Language & Localization"
          onChange={e => setLanguage(e.target.value)}
        >
          {languageOptions.map(opt => (
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
          {currencyOptions.map(opt => (
            <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
          ))}
        </Select>
      </FormControl>
    </MuiBox>
  </form>
);

export default SettingsGeneral; 