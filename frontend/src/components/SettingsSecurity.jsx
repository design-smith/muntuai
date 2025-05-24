import React, { useState, useEffect } from 'react';
import { Switch } from '../components/SelectionElements';
import { TextInput } from './BasicFormElements';
import { useUser } from '../App';
import { Box, Button, CircularProgress, Typography } from '@mui/material';

const SettingsSecurity = () => {
  const { supabase } = useUser();
  // 2FA state
  const [twoFAEnabled, setTwoFAEnabled] = useState(false);
  const [factors, setFactors] = useState([]);
  const [enrolling, setEnrolling] = useState(false);
  const [qrCode, setQrCode] = useState(null);
  const [factorId, setFactorId] = useState(null);
  const [totpCode, setTotpCode] = useState('');
  const [verifying, setVerifying] = useState(false);
  const [twoFAError, setTwoFAError] = useState('');
  const [twoFASuccess, setTwoFASuccess] = useState('');
  const [removing, setRemoving] = useState(false);

  // Password state
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [pwLoading, setPwLoading] = useState(false);
  const [pwError, setPwError] = useState('');
  const [pwSuccess, setPwSuccess] = useState('');

  // Data protection
  const [dataProtection, setDataProtection] = useState(false);

  // Fetch enrolled factors and set up state for TOTP
  const fetchFactors = async () => {
    setTwoFAError('');
    setTwoFASuccess('');
    const { data } = await supabase.auth.mfa.listFactors();
    const totp = data?.totp?.[0];
    if (totp) {
      setFactors([totp]);
      setTwoFAEnabled(totp.status === 'verified');
      if (totp.status !== 'verified') {
        setQrCode(totp.totp.qr_code);
        setFactorId(totp.id);
      } else {
        setQrCode(null);
        setFactorId(null);
      }
    } else {
      setFactors([]);
      setTwoFAEnabled(false);
      setQrCode(null);
      setFactorId(null);
    }
  };

  useEffect(() => {
    fetchFactors();
    // eslint-disable-next-line
  }, [supabase]);

  // Enroll TOTP (only if no factor exists)
  const handleEnrollTOTP = async () => {
    setEnrolling(true);
    setTwoFAError('');
    setTwoFASuccess('');
    // Check if a pending factor exists
    const { data } = await supabase.auth.mfa.listFactors();
    const totp = data?.totp?.[0];
    if (totp && totp.status !== 'verified') {
      setQrCode(totp.totp.qr_code);
      setFactorId(totp.id);
      setEnrolling(false);
      return;
    }
    if (totp && totp.status === 'verified') {
      setTwoFAEnabled(true);
      setQrCode(null);
      setFactorId(null);
      setEnrolling(false);
      return;
    }
    try {
      const { data, error } = await supabase.auth.mfa.enroll({ factorType: 'totp' });
      if (error) throw error;
      setQrCode(data.totp.qr_code);
      setFactorId(data.id);
    } catch (err) {
      setTwoFAError(err.message || 'Failed to start 2FA enrollment.');
    }
    setEnrolling(false);
  };

  // Verify TOTP
  const handleVerifyTOTP = async () => {
    setVerifying(true);
    setTwoFAError('');
    setTwoFASuccess('');
    try {
      const { error } = await supabase.auth.mfa.verify({ factorId, code: totpCode });
      if (error) throw error;
      setTwoFASuccess('2FA enabled successfully!');
      setQrCode(null);
      setFactorId(null);
      setTotpCode('');
      await fetchFactors();
    } catch (err) {
      setTwoFAError(err.message || 'Failed to verify code.');
    }
    setVerifying(false);
  };

  // Remove TOTP
  const handleRemoveTOTP = async (id) => {
    setRemoving(true);
    setTwoFAError('');
    setTwoFASuccess('');
    try {
      const { error } = await supabase.auth.mfa.unenroll({ factorId: id });
      if (error) throw error;
      setTwoFASuccess('2FA disabled.');
      setFactors([]);
      setTwoFAEnabled(false);
      setQrCode(null);
      setFactorId(null);
    } catch (err) {
      setTwoFAError(err.message || 'Failed to remove 2FA.');
    }
    setRemoving(false);
  };

  // Handle toggle
  const handleToggle2FA = () => {
    if (twoFAEnabled) {
      // Remove if enabled
      if (factors[0]) handleRemoveTOTP(factors[0].id);
    } else {
      // Enroll or resume verify if pending
      handleEnrollTOTP();
    }
  };

  // Password change
  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPwLoading(true);
    setPwError('');
    setPwSuccess('');
    if (!newPassword || newPassword !== confirmPassword) {
      setPwError('Passwords do not match.');
      setPwLoading(false);
      return;
    }
    try {
      // Supabase does not require current password for updateUser
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) throw error;
      setPwSuccess('Password updated successfully!');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setPwError(err.message || 'Failed to update password.');
    }
    setPwLoading(false);
  };

  return (
    <div className="settings-security-root">
      <h2>Security</h2>
      {/* 2FA Section */}
      <div className="settings-security-section">
        <h3 className="settings-security-title">Two-Factor Authentication (TOTP)</h3>
        <div style={{display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '1rem'}}>
          <Switch checked={twoFAEnabled || (!!qrCode && !!factorId)} onChange={handleToggle2FA} label={twoFAEnabled ? 'Disable 2FA' : 'Enable 2FA'} disabled={enrolling || removing} />
        </div>
        {twoFAError && <div style={{ color: '#FF7125', marginBottom: 8 }}>{twoFAError}</div>}
        {twoFASuccess && <div style={{ color: '#21a300', marginBottom: 8 }}>{twoFASuccess}</div>}
        {/* Enroll/verify flow */}
        {qrCode && factorId && !twoFAEnabled && (
          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" sx={{ color: 'var(--bone)', mb: 1 }}>Scan this QR code with your authenticator app:</Typography>
            <img src={qrCode} alt="TOTP QR Code" style={{ width: 180, height: 180, background: '#fff', padding: 8, borderRadius: 8 }} />
            <TextInput
              label="Enter code from app"
              value={totpCode}
              onChange={e => setTotpCode(e.target.value)}
              sx={{ mt: 2 }}
            />
            <Button
              variant="contained"
              sx={{ mt: 2, backgroundColor: 'var(--orange-crayola)' }}
              onClick={handleVerifyTOTP}
              disabled={verifying || !totpCode}
            >
              {verifying ? <CircularProgress size={18} sx={{ color: 'white', mr: 1 }} /> : 'Verify & Enable'}
            </Button>
          </Box>
        )}
        {/* Show enrolled factors */}
        {twoFAEnabled && factors.length > 0 && factors[0].status === 'verified' && (
          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" sx={{ color: 'var(--bone)' }}>2FA is enabled for your account.</Typography>
            <Button
              variant="outlined"
              color="error"
              sx={{ mt: 1 }}
              onClick={() => handleRemoveTOTP(factors[0].id)}
              disabled={removing}
            >
              {removing ? <CircularProgress size={18} sx={{ color: 'red', mr: 1 }} /> : 'Remove 2FA'}
            </Button>
          </Box>
        )}
      </div>
      {/* Password Change Section */}
      <div className="settings-security-section">
        <h3 className="settings-security-title">Change Password</h3>
        <form className="settings-form" style={{maxWidth: 340, margin: 0, gap: '1rem'}} onSubmit={handleChangePassword}>
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
          {pwError && <div style={{ color: '#FF7125', marginBottom: 8 }}>{pwError}</div>}
          {pwSuccess && <div style={{ color: '#21a300', marginBottom: 8 }}>{pwSuccess}</div>}
          <Button className="button" type="submit" disabled={pwLoading}>
            {pwLoading ? <CircularProgress size={18} sx={{ color: 'white', mr: 1 }} /> : 'Save'}
          </Button>
        </form>
      </div>
      {/* Data Protection Section */}
      <div className="settings-security-section">
        <h3 className="settings-security-title">Data Protection</h3>
        <div className="settings-label" style={{marginBottom: 0}}>Allow my data to be used to securely optimize models</div>
        <Switch checked={dataProtection} onChange={() => setDataProtection(v => !v)} label={dataProtection ? 'Yes' : 'No'} />
      </div>
    </div>
  );
};

export default SettingsSecurity; 