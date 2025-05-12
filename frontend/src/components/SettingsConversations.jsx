import React from 'react';
import { Switch } from './SelectionElements';
import Slider from '@mui/material/Slider';

const SettingsConversations = ({
  autoResponse,
  setAutoResponse,
  emailSearchRange,
  setEmailSearchRange
}) => (
  <div className="settings-conversations-root" style={{ maxWidth: 700 }}>
    <h2>Conversations Settings</h2>
    <div className="settings-conversations-section" style={{ background: 'rgba(39, 45, 79, 0.7)', borderRadius: 12, padding: '1.5rem 1.5rem 1.2rem 1.5rem', marginBottom: '1.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '1.5rem' }}>
        <Switch checked={autoResponse} onChange={e => setAutoResponse(e.target.checked)} />
        <span style={{ color: '#fff', fontWeight: 600, fontSize: '1.1rem' }}>Auto Response</span>
        <span style={{ color: 'var(--bone)', fontSize: '1rem', marginLeft: 8 }}>
          Allow the AI to automatically respond to your emails without user approval.
        </span>
      </div>
      <div style={{ marginTop: '1.5rem' }}>
        <div style={{ color: '#fff', fontWeight: 600, fontSize: '1.1rem', marginBottom: 8 }}>AI Email Search Range</div>
        <Slider
          value={emailSearchRange}
          onChange={(_, v) => setEmailSearchRange(v)}
          min={1}
          max={365}
          step={1}
          valueLabelDisplay="on"
          sx={{ color: 'var(--orange-crayola)', maxWidth: 340 }}
        />
        <div style={{ color: 'var(--bone)', fontSize: '1rem', marginTop: 4 }}>
          How far back should the AI search your emails? ({emailSearchRange} days)
        </div>
      </div>
    </div>
  </div>
);

export default SettingsConversations; 