import React, { useState, useRef } from 'react';
import { Box, Typography, Slider } from '@mui/material';
import { Button, TextInput, LongTextInput } from '../components/BasicFormElements';
import { CheckboxGroup, Switch } from '../components/SelectionElements';
import { useUser } from '../App';
import Aurora from '../Aurora';
import '../Aurora.css';
import UploadIcon from '@mui/icons-material/Upload';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';

const responsibilityOptions = [
  { label: 'Read and respond to emails', value: 'Read and respond to emails' },
  { label: 'Schedule meetings and appointments', value: 'Schedule meetings and appointments' },
  { label: 'Follow up with clients and leads', value: 'Follow up with clients and leads' },
  { label: 'Draft email responses for your review', value: 'Draft email responses for your review' },
  { label: 'Summarize long email threads', value: 'Summarize long email threads' },
];
const typeOptions = [
  { label: 'General', value: 'General' },
  { label: 'Sales', value: 'Sales' },
  { label: 'Customer Support', value: 'Customer Support' },
];
const channelOptions = [
  { label: 'email', value: 'email' },
  { label: 'sms', value: 'sms' },
  { label: 'phone', value: 'phone' },
  { label: 'whatsapp', value: 'whatsapp' },
  { label: 'messenger', value: 'messenger' },
  { label: 'linkedin', value: 'linkedin' },
];

const Onboarding = () => {
  const { user, setIsFirstLogin } = useUser();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  // Step 1: Profile
  const [profile, setProfile] = useState({
    firstName: user?.user_metadata?.firstName || '',
    lastName: user?.user_metadata?.lastName || '',
    email: user?.email || '',
    title: '',
    phone: '',
    resume: null,
    resumeName: '',
  });
  // Step 2: Assistant
  const [assistant, setAssistant] = useState({
    name: '',
    type: 'General',
    isActive: true,
    responsibilities: {},
    instructions: '',
    respondAsMe: false,
    channels: {},
  });
  // Step 3: Email
  const [emailDays, setEmailDays] = useState(30);
  const [connecting, setConnecting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef();

  // Resume upload and (placeholder) parse
  const handleResumeUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfile(prev => ({ ...prev, resume: file, resumeName: file.name }));
      // Send file to backend for parsing
      const formData = new FormData();
      formData.append('file', file);
      try {
        const res = await fetch('http://localhost:8000/api/parse-resume', {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${user?.accessToken}` },
          body: formData,
        });
        if (res.ok) {
          const data = await res.json();
          // Affinda returns a nested structure, e.g. data.data.phoneNumbers[0].number
          let phone = '';
          if (data.data && data.data.phoneNumbers && data.data.phoneNumbers.length > 0) {
            phone = data.data.phoneNumbers[0].number;
          } else if (data.data && data.data.mobile_number) {
            phone = data.data.mobile_number;
          }
          setProfile(prev => ({
            ...prev,
            phone: phone || '',
          }));
        }
      } catch {
        // Optionally handle error
      }
    }
  };

  // Navigation
  const next = () => setStep(s => Math.min(s + 1, 2));
  const back = () => setStep(s => Math.max(s - 1, 0));

  // Save onboarding data
  const finish = async () => {
    setConnecting(true);
    setError('');
    try {
      // 1. Save profile
      await fetch('http://localhost:8000/users/' + user.id, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: profile.firstName,
          lastName: profile.lastName,
          title: profile.title,
          email: profile.email,
          phone: profile.phone,
        }),
      });
      // 2. Save assistant
      await fetch('http://localhost:8000/assistants', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user?.accessToken}`
        },
        body: JSON.stringify({
          name: assistant.name,
          type: assistant.type,
          isActive: assistant.isActive,
          responsibilities: Object.keys(assistant.responsibilities).filter(k => assistant.responsibilities[k]),
          instructions: assistant.instructions,
          respondAsMe: assistant.respondAsMe,
          channels: Object.keys(assistant.channels).filter(k => assistant.channels[k]),
          user_id: user.id,
        }),
      });
      // 3. Save email connection (simulate)
      //await fetch('http://localhost:8000/integrations/connect', {
        //method: 'POST',
        //headers: { 'Content-Type': 'application/json' },
        //body: JSON.stringify({ user_id: user.id, days: emailDays }),
      //});
      // 4. Mark onboarding complete
      await fetch('http://localhost:8000/auth/complete_onboarding', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${user?.accessToken}` },
      });
      setIsFirstLogin(false);
      setDone(true);
      navigate('/dashboard');
    } catch {
      // Optionally handle error
    }
    setConnecting(false);
  };

  // Add these handlers above the return statement:
  const handleResponsibilitiesChange = (event) => {
    const { name, checked } = event.target;
    setAssistant(a => ({
      ...a,
      responsibilities: { ...a.responsibilities, [name]: checked },
    }));
  };
  const handleChannelsChange = (event) => {
    const { name, checked } = event.target;
    setAssistant(a => ({
      ...a,
      channels: { ...a.channels, [name]: checked },
    }));
  };

  // Slide content
  return (
    <Box className="onboarding-root" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0, 0, 0, 0.7)', position: 'relative', overflow: 'hidden' }}>
      <Aurora
        colorStops={["#0e3c99", "#ff7800", "#0e3c99"]}
        blend={0.5}
        amplitude={1.0}
        speed={0.5}
      />
      <Box className="section" style={{ minWidth: 400, maxWidth: 500, margin: '0 auto', boxShadow: '0 2px 16px 0 rgba(0,0,0,0.18)', position: 'relative', zIndex: 1 }}>
        <Typography className="heading-primary" style={{ fontSize:28, fontWeight: 900, textAlign: 'center', marginBottom: 24 }}>
          {step === 0 ? 'Complete Your Profile' : step === 1 ? 'Customize Your AI Assistant' : 'Connect Your Email'}
        </Typography>
        {done ? (
          <div style={{ textAlign: 'center', color: 'var(--success-green)', fontSize: 20, minHeight: 200 }}>
            Onboarding complete! Redirecting...
          </div>
        ) : step === 0 ? (
          <form style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <TextInput label="First Name" value={profile.firstName} onChange={e => setProfile({ ...profile, firstName: e.target.value })} required />
            <TextInput label="Last Name" value={profile.lastName} onChange={e => setProfile({ ...profile, lastName: e.target.value })} required />
            <TextInput label="Email" value={profile.email} onChange={e => setProfile({ ...profile, email: e.target.value })} required type="email" />
            <TextInput label="Title" value={profile.title} onChange={e => setProfile({ ...profile, title: e.target.value })} required />
            <TextInput label="Phone" value={profile.phone} onChange={e => setProfile({ ...profile, phone: e.target.value })} required type="tel" />
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <input type="file" accept=".pdf,.doc,.docx" ref={fileInputRef} style={{ display: 'none' }} onChange={handleResumeUpload} />
              <Button type="button" className="button button-outlined" onClick={() => fileInputRef.current.click()} startIcon={<UploadIcon />}>
                {profile.resumeName ? 'Change Resume' : 'Upload Resume'}
              </Button>
              {profile.resumeName && <span style={{ color: 'var(--desert-sand)' }}>{profile.resumeName}</span>}
            </div>
            <div style={{ color: 'var(--desert-sand)', fontSize: 13, marginTop: -10 }}>Uploading your resume will autofill your phone number if available.</div>
          </form>
        ) : step === 1 ? (
          <form style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <TextInput label="Assistant Name" value={assistant.name} onChange={e => setAssistant(a => ({ ...a, name: e.target.value }))} required />
            <div>
              <label style={{ color: '#fff', marginBottom: 4, display: 'block' }}>Type</label>
              <select className="input-field" value={assistant.type} onChange={e => setAssistant(a => ({ ...a, type: e.target.value }))} style={{ color: '#fff', width: '100%', padding: 8, borderRadius: 8 }}>
                {typeOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
              </select>
            </div>
            <div>
              <div className="settings-label" style={{ color: '#fff', marginBottom: 4 }}>Responsibilities</div>
              <CheckboxGroup options={responsibilityOptions} checked={assistant.responsibilities} onChange={handleResponsibilitiesChange} />
            </div>
            <LongTextInput label="Additional Instructions" value={assistant.instructions} onChange={e => setAssistant(a => ({ ...a, instructions: e.target.value }))} />
            <Switch checked={assistant.isActive} onChange={e => setAssistant(a => ({ ...a, isActive: e.target.checked }))} label="Active Status" />
            <Switch checked={assistant.respondAsMe} onChange={e => setAssistant(a => ({ ...a, respondAsMe: e.target.checked }))} label="Respond to emails as me" />
            <div>
              <div className="settings-label" style={{ color: '#fff', marginBottom: 4 }}>Channels</div>
              <CheckboxGroup options={channelOptions} checked={assistant.channels} onChange={handleChannelsChange} />
            </div>
          </form>
        ) : (
          <form style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <div style={{ marginBottom: 12 }}>
              <Typography variant="body1" style={{ color: '#fff', marginBottom: 8 }}>Connect your email account to Muntu AI.</Typography>
              <Button variant="contained" className="button button-contained" style={{ marginBottom: 12 }}>Connect Email</Button>
            </div>
            <div style={{ marginBottom: 12 }}>
              <Typography variant="body1" style={{ color: '#fff', marginBottom: 8 }}>How many days in the past should Muntu fetch your emails?</Typography>
              <Slider
                value={emailDays}
                onChange={(_, v) => setEmailDays(v)}
                min={1}
                max={90}
                step={1}
                marks={[{ value: 7, label: '7' }, { value: 30, label: '30' }, { value: 90, label: '90' }]}
                valueLabelDisplay="auto"
                sx={{ color: 'var(--orange-crayola)' }}
              />
            </div>
          </form>
        )}
        {error && <div style={{ color: '#FF7125', textAlign: 'center', marginTop: 12 }}>{error}</div>}
        {!done && (
          <Box style={{ display: 'flex', justifyContent: 'space-between', marginTop: 32 }}>
            <Button variant="outlined" className="button button-outlined" onClick={back} disabled={step === 0} startIcon={<ArrowBackIcon />}>Back</Button>
            {step < 2 ? (
              <Button variant="contained" className="button button-contained" onClick={next} endIcon={<ArrowForwardIcon />}>Next</Button>
            ) : (
              <Button variant="contained" className="button button-contained" onClick={finish} disabled={connecting} endIcon={<ArrowForwardIcon />}>{connecting ? 'Finishing...' : 'Finish'}</Button>
            )}
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default Onboarding; 