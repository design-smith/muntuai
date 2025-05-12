import React from 'react';
import { Switch } from '../components/SelectionElements';
import { TextInput } from './BasicFormElements';

const SettingsSecurity = ({
  twoFAEnabled,
  setTwoFAEnabled,
  twoFAMethods,
  handleSelectMethod,
  handleAddMethod,
  currentPassword,
  setCurrentPassword,
  newPassword,
  setNewPassword,
  confirmPassword,
  setConfirmPassword,
  dataProtection,
  setDataProtection
}) => (
  <div className="settings-security-root">
    <h2>Security</h2>
    <div className="settings-security-section">
      <h3 className="settings-security-title">Two-Factor Authentication</h3>
      <div style={{display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '1rem'}}>
        <Switch checked={twoFAEnabled} onChange={e => setTwoFAEnabled(e.target.checked)} label="Enable Two-Factor Authentication" />
      </div>
      {twoFAEnabled && (
        <div style={{marginTop: '0.5rem', marginBottom: '1.5rem'}}>
          {twoFAMethods.map(method => (
            <div key={method.id} className="settings-2fa-method-card" style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(39,45,79,0.7)', borderRadius: 10, padding: '1rem 1.5rem', marginBottom: 12}}>
              <span style={{fontWeight: 600, color: 'var(--desert-sand)'}}>{method.name}</span>
              <span style={{color: 'var(--bone)', marginLeft: 16, marginRight: 16}}>{method.value}</span>
              <input
                type="radio"
                name="2fa-method"
                checked={method.selected}
                onChange={() => handleSelectMethod(method.id)}
                className="settings-payment-method-radio-native"
                aria-label={`Select ${method.name} as default 2FA method`}
              />
            </div>
          ))}
          <button className="button button-outlined" style={{marginTop: 8}} onClick={handleAddMethod} type="button">Add Method +</button>
        </div>
      )}
    </div>
    <div className="settings-security-section">
      <h3 className="settings-security-title">Password Reset</h3>
      <form className="settings-form" style={{maxWidth: 340, margin: 0, gap: '1rem'}} onSubmit={e => e.preventDefault()}>
        <TextInput
          label="Current Password"
          type="password"
          value={currentPassword}
          onChange={e => setCurrentPassword(e.target.value)}
          autoComplete="current-password"
        />
        <TextInput
          label="New Password"
          type="password"
          value={newPassword}
          onChange={e => setNewPassword(e.target.value)}
          autoComplete="new-password"
        />
        <TextInput
          label="Confirm New Password"
          type="password"
          value={confirmPassword}
          onChange={e => setConfirmPassword(e.target.value)}
          autoComplete="new-password"
        />
        <button className="button" type="submit">Save</button>
      </form>
    </div>
    <div className="settings-security-section">
      <h3 className="settings-security-title">Data Protection</h3>
      <div className="settings-label" style={{marginBottom: 0}}>Allow my data to be used to securely optimize models</div>
      <Switch checked={dataProtection} onChange={() => setDataProtection(v => !v)} label={dataProtection ? 'Yes' : 'No'} />
    </div>
  </div>
);

export default SettingsSecurity; 