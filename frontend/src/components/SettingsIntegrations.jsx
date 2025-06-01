import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button as MuiButton } from '@mui/material';
import { useUser } from '../App';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import BusinessCenterOutlinedIcon from '@mui/icons-material/BusinessCenterOutlined';
import PaymentOutlinedIcon from '@mui/icons-material/PaymentOutlined';
import ChatOutlinedIcon from '@mui/icons-material/ChatOutlined';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
// Add icons for Slack, Discord, WhatsApp, HIGHLEVEL as needed

const SettingsIntegrations = ({
  handleOpenModal,
  integrationModal,
  handleCloseModal,
  selectedIntegration
}) => {
  const { supabase } = useUser();
  const [loadingProvider, setLoadingProvider] = useState(null);

  const handleConnectProvider = async (providerName) => {
    setLoadingProvider(providerName.toLowerCase());
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const accessToken = session?.access_token;
      if (!accessToken) {
        alert('Not authenticated');
        setLoadingProvider(null);
        return;
      }
      // Normalize provider name for backend
      let backendProvider = providerName.toLowerCase();
      if (backendProvider === 'google calendar') backendProvider = 'google_calendar';
      const url = `http://localhost:8000/integrations/connect?provider=${backendProvider}&token=${accessToken}`;
      const res = await fetch(url);
      const data = await res.json();
      if (data.redirect_url) {
        window.location.href = data.redirect_url;
      } else {
        alert('Failed to get redirect URL');
      }
    } catch (err) {
      alert('Error connecting provider: ' + err.message);
    }
    setLoadingProvider(null);
  };

  // Define all providers for each integration type
  const allIntegrationTypes = [
    {
      key: 'communications',
      title: 'Communications',
      desc: 'Connect your communication channels for sending and receiving messages',
      icon: <EmailOutlinedIcon className="integration-icon" />,
      providers: [
        { name: 'Gmail', desc: 'Connect your Google Mail account', icon: <EmailOutlinedIcon color="error" /> },
        { name: 'Outlook', desc: 'Connect your Outlook account', icon: <EmailOutlinedIcon color="primary" /> },
        { name: 'Slack', desc: 'Connect Slack', icon: <ChatOutlinedIcon color="primary" /> },
        { name: 'Discord', desc: 'Connect Discord', icon: <ChatOutlinedIcon color="action" /> },
      ],
      connected: [],
    },
    {
      key: 'schedule',
      title: 'Schedule',
      desc: 'Sync your appointments and scheduling',
      icon: <CalendarMonthOutlinedIcon className="integration-icon" />,
      providers: [
        { name: 'Google Calendar', desc: 'Connect your Google Calendar', icon: <CalendarMonthOutlinedIcon color="primary" /> },
        { name: 'Fireflies Note Taker', desc: 'Connect Fireflies Note Taker', icon: <CalendarMonthOutlinedIcon color="error" /> },
        { name: 'Calendly', desc: 'Connect Calendly', icon: <CalendarMonthOutlinedIcon color="action" /> },
      ],
      connected: [],
    },
  ];

  return (
    <div className="settings-integrations-root">
      <h2>Integrations</h2>
      <div className="settings-integrations-desc">Connect your business tools and communication channels</div>
      <div className="settings-integrations-cards-row">
        {allIntegrationTypes.map((type) => (
          <div className="settings-integration-card" key={type.key}>
            <div className="settings-integration-card-header">
              {type.icon}
              <div>
                <div className="settings-integration-title">{type.title}</div>
                <div className="settings-integration-desc">{type.desc}</div>
              </div>
            </div>
            <div className="settings-integration-connected">
              {type.connected.length === 0 ? (
                <span className="settings-integration-none">No connected {type.title.toLowerCase()}</span>
              ) : (
                type.connected.map((conn, idx) => (
                  <div key={idx} className="settings-integration-conn">{conn}</div>
                ))
              )}
            </div>
            <div className="settings-integration-actions">
              <MuiButton className="settings-integration-connect-btn" onClick={() => handleOpenModal(type)}>
                + Connect
              </MuiButton>
            </div>
          </div>
        ))}
      </div>
      <Dialog open={integrationModal.open} onClose={handleCloseModal} className="settings-integration-dialog">
        <DialogTitle className="settings-integration-dialog-title">
          {selectedIntegration?.icon} Connect {selectedIntegration?.title}
        </DialogTitle>
        <DialogContent>
          <div className="settings-integration-dialog-desc">Select a provider to configure your integration</div>
          {selectedIntegration?.providers?.map((prov) => (
            <div className="settings-integration-provider-row" key={prov.name}>
              <div className="settings-integration-provider-icon">{prov.icon}</div>
              <div className="settings-integration-provider-info">
                <div className="settings-integration-provider-name">{prov.name}</div>
                <div className="settings-integration-provider-desc">{prov.desc}</div>
              </div>
              <button
                className="button button-contained"
                onClick={() => handleConnectProvider(prov.name)}
                disabled={loadingProvider === prov.name.toLowerCase()}
                style={{ minWidth: 120 }}
              >
                {loadingProvider === prov.name.toLowerCase() ? `Connecting...` : `Connect ${prov.name}`}
              </button>
            </div>
          ))}
        </DialogContent>
        <DialogActions>
          <MuiButton onClick={handleCloseModal} className="settings-integration-cancel-btn">Cancel</MuiButton>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default SettingsIntegrations; 