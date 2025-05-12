import React from 'react';
import {
  Box,
  Typography,
  Card,
  Switch,
  Button
} from '@mui/material';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import HeadsetMicIcon from '@mui/icons-material/HeadsetMic';

// Assistant Card
export function AssistantCard({
  name,
  responsibilities = [],
  channels = [],
  onEdit,
  created,
  isActive = true,
  onToggle,
  ...props
}) {
  return (
    <Card className="assistant-card" {...props}>
      <div className="assistant-card-header-row">
        <span className="assistant-card-icon"><HeadsetMicIcon /></span>
        <span className="assistant-card-name">{name}</span>
        <Switch checked={isActive} onChange={onToggle} className="toggle-button" />
      </div>
      <div className={`assistant-card-status-row${!isActive ? ' inactive' : ''}`}>
        <span className={`assistant-card-status-dot${!isActive ? ' inactive' : ''}`} />
        <span className={`assistant-card-status-text${!isActive ? ' inactive' : ''}`}>{isActive ? 'Active' : 'Inactive'}</span>
      </div>
      <div className="assistant-card-section-label">Responsibilities</div>
      <div className="assistant-card-responsibilities">{responsibilities.join(' | ')}</div>
      <div className="assistant-card-section-label">Channels</div>
      <div className="assistant-card-channels-row">
        {channels.map((ch) => (
          <span className="assistant-card-channel-pill" key={ch}>{ch}</span>
        ))}
      </div>
      <div className="assistant-card-footer-row">
        {created && <span className="assistant-card-created">Created: {created}</span>}
        <button className="button button-outlined assistant-card-edit-btn" onClick={onEdit}>Edit</button>
      </div>
    </Card>
  );
}

// Product/Service Card
export function ProductCard({
  title,
  description,
  buttonLabel = 'Action',
  onButtonClick,
  ...props
}) {
  return (
    <Card className="product-card" {...props}>
      <Typography variant="h6" sx={{ mb: 1 }}>{title}</Typography>
      <Button size="small" variant="outlined" sx={{ borderRadius: 2, mb: 1 }} onClick={onButtonClick}>{buttonLabel}</Button>
      <Typography>{description}</Typography>
    </Card>
  );
}

// Information Card
export function InfoCard({
  title,
  value,
  icon = <ChatBubbleOutlineIcon className="info-card-icon" />, // default icon
  change = '',
  changeColor = '#4caf50', // green by default
  subtext = '',
  ...props
}) {
  return (
    <Card
      className="info-card"
      {...props}
    >
      <Box className="info-card-header">
        <Typography variant="subtitle2" className="info-card-title">
          {title}
        </Typography>
        <Box>{icon}</Box>
      </Box>
      <Typography variant="h4" className="info-card-value">
        {value}
      </Typography>
      <Box className="info-card-footer">
        {change && (
          <Typography variant="body2" style={{ color: changeColor, fontWeight: 600 }}>
            {change}
          </Typography>
        )}
        {subtext && (
          <Typography variant="body2" className="info-card-subtext">
            {subtext}
          </Typography>
        )}
      </Box>
    </Card>
  );
} 