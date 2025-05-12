import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button as MuiButton } from '@mui/material';

const SettingsIntegrations = ({
  integrationTypes,
  handleOpenModal,
  integrationModal,
  handleCloseModal,
  selectedIntegration
}) => (
  <div className="settings-integrations-root">
    <h2>Integrations</h2>
    <div className="settings-integrations-desc">Connect your business tools and communication channels</div>
    <div className="settings-integrations-cards-row">
      {integrationTypes.map((type) => (
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
          </div>
        ))}
      </DialogContent>
      <DialogActions>
        <MuiButton onClick={handleCloseModal} className="settings-integration-cancel-btn">Cancel</MuiButton>
        <MuiButton className="settings-integration-connect-btn">Connect</MuiButton>
        <MuiButton className="settings-integration-debug-btn">Debug Connection</MuiButton>
      </DialogActions>
    </Dialog>
  </div>
);

export default SettingsIntegrations; 