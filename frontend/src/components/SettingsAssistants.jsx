import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button as MuiButton, Box as MuiBox, FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import { AssistantCard } from './CardElements';
import { TextInput, LongTextInput } from './BasicFormElements';
import { CheckboxGroup, Switch } from './SelectionElements';

const SettingsAssistants = ({
  assistants,
  setAssistants,
  openAddModal,
  openEditModal,
  assistantModal,
  closeAssistantModal,
  assistantForm,
  handleAssistantFormChange,
  responsibilityOptions,
  handleResponsibilitiesChange,
  typeOptions,
  channelOptions,
  handleChannelsChange,
  handleSaveAssistant
}) => (
  <div className="settings-assistants-root">
    <h2>Assistants</h2>
    <MuiButton className="settings-assistants-add-btn" onClick={openAddModal}>+ Add New Assistant</MuiButton>
    <div className="settings-assistants-list">
      {assistants.map((a, idx) => (
        <AssistantCard
          key={a.name + idx}
          name={a.name}
          status={a.status}
          responsibilities={a.responsibilities}
          channels={a.channels}
          created={a.created}
          isActive={a.isActive}
          onEdit={() => openEditModal(idx)}
          onToggle={() => setAssistants(prev => prev.map((asst, i) => i === idx ? { ...asst, isActive: !asst.isActive, status: asst.isActive ? 'Inactive' : 'Active' } : asst))}
        />
      ))}
    </div>
    <Dialog open={assistantModal.open} onClose={closeAssistantModal} className="settings-assistant-dialog">
      <DialogTitle className="settings-assistant-dialog-title">
        {assistantModal.mode === 'add' ? 'Add New Assistant' : 'Edit Assistant'}
      </DialogTitle>
      <DialogContent className="settings-assistant-dialog-content">
        <form className="settings-assistant-form">
          <MuiBox mb={2}>
            <TextInput label="Assistant Name" value={assistantForm.name} onChange={e => handleAssistantFormChange('name', e.target.value)} InputLabelProps={{ style: { color: '#fff' } }} inputProps={{ style: { color: '#fff' } }} />
          </MuiBox>
          {assistantModal.mode === 'add' && (
            <MuiBox mb={2}>
              <FormControl fullWidth>
                <InputLabel style={{ color: '#fff' }}>Type</InputLabel>
                <Select
                  className="input-field"
                  value={assistantForm.type}
                  label="Type"
                  onChange={e => handleAssistantFormChange('type', e.target.value)}
                  style={{ color: '#fff' }}
                >
                  {typeOptions.map(opt => (
                    <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </MuiBox>
          )}
          <MuiBox mb={2}>
            <div className="settings-label" style={{ color: '#fff' }}>Responsibilities</div>
            <CheckboxGroup options={responsibilityOptions} checked={assistantForm.responsibilities} onChange={handleResponsibilitiesChange} />
          </MuiBox>
          <MuiBox mb={2}>
            <div className="settings-label" style={{ color: '#fff' }}>Additional Instructions</div>
            <LongTextInput value={assistantForm.instructions} onChange={e => handleAssistantFormChange('instructions', e.target.value)} inputProps={{ style: { color: '#fff' } }} />
          </MuiBox>
          <MuiBox mb={2}>
            <Switch checked={assistantForm.isActive} onChange={e => handleAssistantFormChange('isActive', e.target.checked)} label="Active Status" />
          </MuiBox>
          <MuiBox mb={2}>
            <Switch checked={assistantForm.respondAsMe} onChange={e => handleAssistantFormChange('respondAsMe', e.target.checked)} label="Respond to emails as me" />
          </MuiBox>
          <MuiBox mb={2}>
            <div className="settings-label" style={{ color: '#fff' }}>Channels</div>
            <CheckboxGroup options={channelOptions} checked={assistantForm.channels} onChange={handleChannelsChange} />
          </MuiBox>
        </form>
      </DialogContent>
      <DialogActions>
        <MuiButton onClick={closeAssistantModal} className="settings-assistant-cancel-btn">Cancel</MuiButton>
        <MuiButton className="settings-assistant-save-btn" onClick={handleSaveAssistant}>{assistantModal.mode === 'add' ? 'Add Assistant' : 'Update Assistant'}</MuiButton>
      </DialogActions>
    </Dialog>
  </div>
);

export default SettingsAssistants; 