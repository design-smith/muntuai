import React from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Card
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import InputAdornment from '@mui/material/InputAdornment';
import EmailIcon from '@mui/icons-material/Email';
import SmsIcon from '@mui/icons-material/Sms';
import PhoneIcon from '@mui/icons-material/Phone';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';

// Message bubble (left or right)
export function MessageBubble({ text, position = 'left', ...props }) {
  return (
    <Box className={position === 'right' ? 'message-bubble-wrapper-right' : 'message-bubble-wrapper-left'}>
      <Box className={position === 'right' ? 'message-bubble-right' : 'message-bubble-left'} {...props}>
        <Typography>{text}</Typography>
      </Box>
    </Box>
  );
}

// Message list
export function MessageList({ messages = [] }) {
  return (
    <>
      {messages.map((msg, idx) => (
        <Box className="message-item" sx={{ position: 'relative' }} key={idx}>
          <Typography variant="subtitle1" className="heading-secondary">{msg.sender}</Typography>
          <Typography sx={msg.bold ? { fontWeight: 600 } : {}}>{msg.text}</Typography>
          <Typography variant="caption" sx={{ color: 'gray' }}>{msg.time}</Typography>
          {msg.unread && <Box className="message-unread-badge">{msg.unread}</Box>}
        </Box>
      ))}
    </>
  );
}

// Messaging input
export function MessagingInput({ value, onChange, onSend, placeholder = 'Type your message...', ...props }) {
  const hasText = value && value.trim().length > 0;
  return (
    <Box className="messaging-input-container">
      <TextField
        className="input-field"
        variant="outlined"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        fullWidth
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <SendIcon
                onClick={hasText ? onSend : undefined}
                className="messaging-send-icon"
                style={{
                  color: hasText ? '#fff' : '#888',
                  cursor: hasText ? 'pointer' : 'default',
                  transition: 'color 0.2s',
                }}
              />
            </InputAdornment>
          )
        }}
        {...props}
      />
    </Box>
  );
}

// New message dialog
export function NewMessageDialog({ open, onClose, accounts = [], onSend, onImprove, ...props }) {
  const [account, setAccount] = React.useState(accounts[0] || '');
  const [to, setTo] = React.useState('');
  const [subject, setSubject] = React.useState('');
  const [body, setBody] = React.useState('');

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm" className="dialog" {...props}>
      <DialogTitle className="dialog-title">New Conversation</DialogTitle>
      <DialogContent className="dialog-content">
        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel>Select account to send from</InputLabel>
          <Select className="input-field" value={account} onChange={e => setAccount(e.target.value)}>
            {accounts.map((acc) => (
              <MenuItem key={acc} value={acc}>{acc}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <TextField
          className="input-field"
          fullWidth
          label="Enter recipient email"
          variant="outlined"
          placeholder="To"
          margin="normal"
          value={to}
          onChange={e => setTo(e.target.value)}
        />
        <TextField
          className="input-field"
          fullWidth
          label="Email subject"
          variant="outlined"
          placeholder="Subject"
          margin="normal"
          value={subject}
          onChange={e => setSubject(e.target.value)}
        />
        <TextField
          className="input-field"
          fullWidth
          placeholder="Type your message here..."
          multiline
          rows={5}
          variant="outlined"
          margin="normal"
          value={body}
          onChange={e => setBody(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button className="button button-outlined" variant="outlined" onClick={() => onImprove && onImprove({ account, to, subject, body })}>Improve</Button>
        <Button className="button button-contained" variant="contained" onClick={() => onSend && onSend({ account, to, subject, body })}>Send as is</Button>
      </DialogActions>
    </Dialog>
  );
}

export function UnopenedMessage({ sender, message, time, unread, source }) {
  let SourceIcon = null;
  switch ((source || '').toLowerCase()) {
    case 'email':
      SourceIcon = EmailIcon;
      break;
    case 'sms':
      SourceIcon = SmsIcon;
      break;
    case 'phone':
      SourceIcon = PhoneIcon;
      break;
    case 'whatsapp':
      SourceIcon = WhatsAppIcon;
      break;
    case 'slack':
      SourceIcon = ChatBubbleOutlineIcon;
      break;
    default:
      SourceIcon = null;
  }
  return (
    <div className="action-message-card" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      {SourceIcon && <SourceIcon className="conversation-source-icon" />}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <span className="action-message-sender">{sender}</span>
        <span className="action-message-excerpt">{message}</span>
      </div>
      <span className="action-message-time">{time}</span>
      {unread > 0 && <span className="action-message-badge">{unread}</span>}
    </div>
  );
}

const MessagingElements = () => {
  // Example messages for the sidebar
  const conversations = [
    { sender: 'Alice Brown', text: 'Thanks for your help. Looking forward to it.', time: 'Today, 2:13 PM', unread: 0 },
    { sender: 'David Kim', text: 'Hey, are you available for a call?', time: 'Today, 1:05 PM', unread: 3 },
    { sender: 'Support Bot', text: 'Reminder: Follow up with new leads.', time: '09:30', unread: 1 },
  ];

  return (
    <Box className="page-container">
      <Box className="messaging-root">
        <Box className="messaging-sidebar">
          <Typography className="heading-secondary" style={{ margin: '1rem 0 1rem 1rem' }}>Conversations</Typography>
          <Box className="messaging-list">
            {conversations.map((msg, idx) => (
              <Box className="message-item" key={idx}>
                <Typography variant="subtitle1" className="heading-secondary">{msg.sender}</Typography>
                <Typography>{msg.text}</Typography>
                <Typography variant="caption" sx={{ color: 'gray' }}>{msg.time}</Typography>
                {msg.unread ? <Box className="message-unread-badge">{msg.unread}</Box> : null}
              </Box>
            ))}
          </Box>
        </Box>
        <Box className="messaging-main">
          <Box className="section" style={{ height: '100%' }}>
            <Typography className="heading-secondary">Message Bubbles</Typography>
            <Box sx={{ display: 'flex', justifyContent: 'flex-start', mb: 1 }}>
              <Box className="message-bubble-left">
                <Typography>Hi, I'm interested in your services.</Typography>
              </Box>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 1 }}>
              <Box className="message-bubble-right">
                <Typography>Thanks! I'll get back to you shortly.</Typography>
              </Box>
            </Box>
            <Box className="messaging-input-container">
              <TextField
                className="input-field"
                variant="outlined"
                placeholder="Type your message..."
                fullWidth
              />
              <Button className="button button-contained" variant="contained">Send</Button>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default MessagingElements; 