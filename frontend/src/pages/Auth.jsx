import React, { useState } from 'react';
import { useUser } from '../App';
import { useNavigate, Navigate } from 'react-router-dom';
import { Button, TextInput } from '../components/BasicFormElements';

const GoogleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 48 48" style={{ marginRight: 8 }}>
    <g>
      <path fill="#4285F4" d="M24 9.5c3.54 0 6.7 1.22 9.19 3.22l6.85-6.85C35.64 2.36 30.18 0 24 0 14.82 0 6.73 5.48 2.69 13.44l7.98 6.2C12.13 13.13 17.62 9.5 24 9.5z"/>
      <path fill="#34A853" d="M46.1 24.55c0-1.64-.15-3.22-.42-4.74H24v9.01h12.42c-.54 2.9-2.18 5.36-4.65 7.03l7.2 5.6C43.98 37.13 46.1 31.36 46.1 24.55z"/>
      <path fill="#FBBC05" d="M9.67 28.09c-1.13-3.36-1.13-6.97 0-10.33l-7.98-6.2C-1.13 16.36-1.13 31.64 1.69 38.44l7.98-6.2z"/>
      <path fill="#EA4335" d="M24 48c6.18 0 11.64-2.03 15.47-5.53l-7.2-5.6c-2.01 1.35-4.6 2.13-8.27 2.13-6.38 0-11.87-3.63-14.33-8.94l-7.98 6.2C6.73 42.52 14.82 48 24 48z"/>
      <path fill="none" d="M0 0h48v48H0z"/>
    </g>
  </svg>
);

const Auth = () => {
  const { user, supabase } = useUser();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [mode, setMode] = useState('login'); // 'login' or 'signup'
  const [resetSent, setResetSent] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);
  const [resetError, setResetError] = useState('');
  const [oauthLoading, setOauthLoading] = useState(false);
  const [oauthError, setOauthError] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigate = useNavigate();

  if (user) return <Navigate to="/dashboard" replace />;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    if (mode === 'signup' && password !== confirmPassword) {
      setError('Passwords do not match.');
      setLoading(false);
      return;
    }
    try {
      let result;
      if (mode === 'login') {
        result = await supabase.auth.signInWithPassword({ email, password });
      } else {
        result = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              first_name: firstName,
              last_name: lastName,
            },
          },
        });
      }
      if (result.error) throw result.error;
      if (mode === 'login') navigate('/dashboard');
      else setMode('login'); // After signup, switch to login
    } catch (err) {
      setError(err.message || 'Authentication failed');
    }
    setLoading(false);
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setResetLoading(true);
    setResetError('');
    setResetSent(false);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email);
      if (error) throw error;
      setResetSent(true);
    } catch (err) {
      setResetError(err.message || 'Failed to send reset email');
    }
    setResetLoading(false);
  };

  const handleGoogleLogin = async () => {
    setOauthLoading(true);
    setOauthError('');
    try {
      const { error } = await supabase.auth.signInWithOAuth({ provider: 'google' });
      if (error) throw error;
    } catch (err) {
      setOauthError(err.message || 'Google login failed');
    }
    setOauthLoading(false);
  };

  return (
    <div className="auth-page-root" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="section" style={{ minWidth: 350, maxWidth: 400, margin: '0 auto', boxShadow: '0 2px 16px 0 rgba(0,0,0,0.18)' }}>
        <h2 className="heading-primary" style={{ textAlign: 'center', marginBottom: 32 }}>{mode === 'login' ? 'Login' : 'Sign Up'}</h2>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {mode === 'signup' && (
            <div style={{ display: 'flex', gap: 12 }}>
              <TextInput
                label="First Name"
                placeholder="First Name"
                value={firstName}
                onChange={e => setFirstName(e.target.value)}
                required
                style={{ flex: 1 }}
              />
              <TextInput
                label="Last Name"
                placeholder="Last Name"
                value={lastName}
                onChange={e => setLastName(e.target.value)}
                required
                style={{ flex: 1 }}
              />
            </div>
          )}
          <TextInput
            label="Email"
            placeholder="Enter your email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            type="email"
            required
            autoFocus
          />
          <TextInput
            label="Password"
            placeholder="Enter your password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            type="password"
            required
          />
          {mode === 'signup' && (
            <TextInput
              label="Confirm Password"
              placeholder="Re-enter your password"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              type="password"
              required
            />
          )}
          <Button type="submit" variant="contained" className="button button-contained" disabled={loading} style={{ marginTop: 8 }}>
            {loading ? 'Loading...' : mode === 'login' ? 'Login' : 'Sign Up'}
          </Button>
          {error && <div style={{ color: '#FF7125', textAlign: 'center', marginTop: 8 }}>{error}</div>}
        </form>
        <Button
          type="button"
          variant="outlined"
          className="button"
          onClick={handleGoogleLogin}
          disabled={oauthLoading}
          style={{
            marginTop: 18,
            background: '#fff',
            color: '#222',
            border: '1.5px solid #e0e0e0',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            boxShadow: '0 1px 4px 0 rgba(0,0,0,0.04)',
            fontSize: '1rem',
          }}
        >
          <GoogleIcon />
          Continue with Google
        </Button>
        {oauthError && <div style={{ color: '#FF7125', textAlign: 'center', marginBottom: 8 }}>{oauthError}</div>}
        <div style={{ marginTop: 24, textAlign: 'center' }}>
          {mode === 'login' ? (
            <span>Don't have an account? <button className="button button-text" style={{ fontSize: '1rem', padding: 0, margin: 0, background: 'none', border: 'none', color: 'var(--orange-crayola)', cursor: 'pointer' }} onClick={() => setMode('signup')}>Sign Up</button></span>
          ) : (
            <span>Already have an account? <button className="button button-text" style={{ fontSize: '1rem', padding: 0, margin: 0, background: 'none', border: 'none', color: 'var(--orange-crayola)', cursor: 'pointer' }} onClick={() => setMode('login')}>Login</button></span>
          )}
        </div>
        <div style={{ marginTop: 18, textAlign: 'center' }}>
          <form onSubmit={handleForgotPassword} style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <Button
              type="submit"
              variant="text"
              className="button button-text"
              disabled={resetLoading || !email}
              style={{ fontSize: '1rem', margin: 0, padding: 0 }}
            >
              Forgot password?
            </Button>
            {resetSent && <div style={{ color: 'var(--success-green)', fontSize: '0.95rem' }}>Password reset email sent!</div>}
            {resetError && <div style={{ color: '#FF7125', fontSize: '0.95rem' }}>{resetError}</div>}
          </form>
        </div>
      </div>
    </div>
  );
};

export default Auth;
