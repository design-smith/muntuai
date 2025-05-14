import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Switch } from './SelectionElements';
import Slider from '@mui/material/Slider';
import baseTemplate from '../assets/template-base.html?raw';

const SettingsConversations = ({
  autoResponse,
  setAutoResponse,
  emailSearchRange,
  setEmailSearchRange
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [showTemplates, setShowTemplates] = useState(location.state?.showTemplates || false);
  const [templates, setTemplates] = useState(() => {
    // Try to load saved templates from localStorage
    const savedTemplates = JSON.parse(localStorage.getItem('emailTemplates') || '[]');
    if (savedTemplates.length > 0) {
      return savedTemplates;
    }
    // If no saved templates, use defaults
    return [
      { id: 0, content: baseTemplate, title: 'Base Template', data: {} },
    ];
  });

  // Handle template updates from navigation state
  useEffect(() => {
    if (location.state?.updatedTemplate) {
      setTemplates(templates.map(t => 
        t.id === location.state.updatedTemplate.id ? location.state.updatedTemplate : t
      ));
      // Clear the navigation state
      navigate(location.pathname, { replace: true, state: { showTemplates: true } });
    }
  }, [location.state]);

  const handleTemplateClick = (template) => {
    navigate(`/templates/edit/${template.id}`, { 
      state: { template }
    });
  };

  return (
    <div className="settings-conversations-root" style={{ maxWidth: 700 }}>
      <h2 style={{ color: 'var(--orange-crayola)', fontWeight: 700, fontSize: '2rem', marginBottom: '2rem' }}>Conversations Settings</h2>

      {/* Autoresponse Card */}
      <div style={{
        background: 'rgba(39, 45, 79, 0.7)',
        borderRadius: 12,
        padding: '1.5rem',
        marginBottom: '2rem',
        boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: 8 }}>
          <Switch checked={autoResponse} onChange={e => setAutoResponse(e.target.checked)} />
          <span style={{ color: '#fff', fontWeight: 600, fontSize: '1.1rem' }}>Auto Response</span>
        </div>
        <div style={{ color: 'var(--bone)', fontSize: '1rem', marginLeft: 44 }}>
          Allow the AI to automatically respond to your emails without user approval.
        </div>
      </div>

      {/* Fetch Range Card */}
      <div style={{
        background: 'rgba(39, 45, 79, 0.7)',
        borderRadius: 12,
        padding: '1.5rem',
        marginBottom: '2rem',
        boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
          <span style={{ color: '#fff', fontWeight: 600, fontSize: '1.1rem' }}>AI Email Search Range</span>
          <span style={{ color: 'var(--orange-crayola)', fontWeight: 700, fontSize: '1.1rem', minWidth: 40, textAlign: 'right' }}>{emailSearchRange} days</span>
        </div>
        <Slider
          value={emailSearchRange}
          onChange={(_, v) => setEmailSearchRange(v)}
          min={1}
          max={365}
          step={1}
          sx={{ color: 'var(--orange-crayola)', maxWidth: 340 }}
        />
        <div style={{ color: 'var(--bone)', fontSize: '1rem', marginTop: 4 }}>
          How far back should the AI search your emails?
        </div>
      </div>

      {/* Email Signature Card */}
      <div style={{
        background: 'rgba(39, 45, 79, 0.7)',
        borderRadius: 12,
        padding: '1.5rem',
        marginBottom: '2rem',
        boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <span style={{ color: '#fff', fontWeight: 600, fontSize: '1.1rem' }}>Email Signature</span>
          <button
            onClick={() => setShowTemplates(!showTemplates)}
            style={{
              background: 'var(--orange-crayola)',
              color: '#fff',
              border: 'none',
              padding: '0.6rem 1.2rem',
              borderRadius: 8,
              fontSize: '1rem',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'opacity 0.2s ease-in-out'
            }}
          >
            {showTemplates ? 'Hide Templates' : 'Customize'}
          </button>
        </div>
        {showTemplates && (
          <div className="email-templates-section">
            <div style={{ 
              display: 'flex',
              flexDirection: 'column',
              gap: '1.5rem',
              padding: '1rem 0'
            }}>
              {templates.map((template) => (
                <div 
                  key={template.id}
                  onClick={() => handleTemplateClick(template)}
                  style={{
                    background: 'rgba(39, 45, 79, 0.7)',
                    borderRadius: 12,
                    padding: '1.5rem',
                    minHeight: '300px',
                    overflow: 'hidden',
                    position: 'relative',
                    cursor: 'pointer',
                    transition: 'transform 0.2s ease-in-out',
                    border: '1px solid rgba(255,255,255,0.08)'
                  }}
                >
                  <div style={{ 
                    color: '#fff', 
                    fontWeight: 600, 
                    fontSize: '1.1rem',
                    marginBottom: '1rem'
                  }}>
                    {template.title}
                  </div>
                  <div 
                    style={{
                      height: 'calc(100% - 2rem)',
                      overflow: 'hidden',
                      position: 'relative',
                      background: '#fff',
                      borderRadius: 8,
                      padding: '1rem',
                      boxShadow: '0 1px 4px rgba(0,0,0,0.03)'
                    }}
                    dangerouslySetInnerHTML={{ __html: template.content }}
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SettingsConversations; 