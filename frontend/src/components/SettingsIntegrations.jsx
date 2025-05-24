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
      const redirectUrl = `http://localhost:8000/integrations/connect?provider=${providerName.toLowerCase()}&token=${accessToken}`;
      window.location.href = redirectUrl;
    } catch (err) {
      alert('Error connecting ' + providerName + ': ' + (err.message || err));
      setLoadingProvider(null);
    }
  };

  // Define all providers for each integration type
  const allIntegrationTypes = [
    {
      key: 'email',
      title: 'Email Provider',
      desc: 'Connect your email service for sending and receiving messages',
      icon: <EmailOutlinedIcon className="integration-icon" />,
      providers: [
        { name: 'Gmail', desc: 'Connect your Google Mail account', icon: <EmailOutlinedIcon color="error" /> },
        { name: 'Outlook', desc: 'Connect your Outlook account', icon: <EmailOutlinedIcon color="primary" /> },
      ],
      connected: [],
    },
    {
      key: 'calendar',
      title: 'Calendar',
      desc: 'Sync your appointments and scheduling',
      icon: <CalendarMonthOutlinedIcon className="integration-icon" />,
      providers: [
        { name: 'Google Calendar', desc: 'Connect your Google Calendar', icon: <CalendarMonthOutlinedIcon color="primary" /> },
        { name: 'Outlook Calendar', desc: 'Connect your Outlook Calendar', icon: <CalendarMonthOutlinedIcon color="action" /> },
      ],
      connected: [],
    },
    {
      key: 'crm',
      title: 'CRM Connections',
      desc: 'Connect your CRM tools',
      icon: <BusinessCenterOutlinedIcon className="integration-icon" />,
      providers: [
        { name: 'HubSpot', desc: 'Connect HubSpot', icon: <BusinessCenterOutlinedIcon color="primary" /> },
        { name: 'Salesforce', desc: 'Connect Salesforce', icon: <BusinessCenterOutlinedIcon color="action" /> },
        { name: 'HIGHLEVEL', desc: 'Connect HIGHLEVEL', icon: <BusinessCenterOutlinedIcon color="error" /> },
      ],
      connected: [],
    },
    {
      key: 'payment',
      title: 'Payment Processing',
      desc: 'Connect payment providers',
      icon: <PaymentOutlinedIcon className="integration-icon" />,
      providers: [
        { name: 'Stripe', desc: 'Connect Stripe', icon: <PaymentOutlinedIcon color="primary" /> },
      ],
      connected: [],
    },
    {
      key: 'social',
      title: 'Social Media',
      desc: 'Connect your social channels',
      icon: <ChatOutlinedIcon className="integration-icon" />,
      providers: [
        { name: 'Slack', desc: 'Connect Slack', icon: <ChatOutlinedIcon color="primary" /> },
        { name: 'Discord', desc: 'Connect Discord', icon: <ChatOutlinedIcon color="action" /> },
        { name: 'WhatsApp', desc: 'Connect WhatsApp', icon: <ChatOutlinedIcon color="success" /> },
        { name: 'LinkedIn', desc: 'Connect LinkedIn', icon: <LinkedInIcon style={{ fontSize: 24 }} /> },
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