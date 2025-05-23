import React, { useState } from 'react';
import { Box, Button, Typography, TextField } from '@mui/material';

/**
 * CfeedBubble - Confirmation Feed Bubble
 * Props:
 *  - cfeedType: 'messaging' | 'action'
 *  - content: object (see below)
 *  - position: 'right' | 'left' (for alignment)
 *  - onApprove, onEdit, onDecline, onSaveEdit, onCancelEdit: function handlers
 *
 * content for 'messaging': { text }
 * content for 'action': { eventTitle, date, time, description, guests }
 */
const CfeedBubble = ({
  cfeedType,
  content,
  position = 'left',
  onApprove,
  onEdit,
  onDecline,
  onSaveEdit,
  onCancelEdit,
  editing: editingProp = false,
}) => {
  const [editing, setEditing] = useState(editingProp);
  const [editContent, setEditContent] = useState(content);

  // Handlers for edit mode
  const handleEditClick = () => {
    setEditContent(content);
    setEditing(true);
    if (onEdit) onEdit();
  };
  const handleCancel = () => {
    setEditing(false);
    setEditContent(content);
    if (onCancelEdit) onCancelEdit();
  };
  const handleSave = () => {
    setEditing(false);
    if (onSaveEdit) onSaveEdit(editContent);
  };

  // Alignment classes
  const wrapperClass = position === 'right' ? 'message-bubble-wrapper-right' : 'message-bubble-wrapper-left';

  // Messaging cfeed
  if (cfeedType === 'messaging') {
    return (
      <Box className={wrapperClass}>
        <Box className="cfeed-bubble" sx={{
          background: 'rgba(39, 45, 79, 0.85)',
          borderRadius: '16px',
          padding: '1.2rem 1.5rem',
          color: 'var(--bone, #fff)',
          minWidth: 280,
          maxWidth: 400,
          boxShadow: '0 2px 12px 0 rgba(0,0,0,0.12)',
          fontFamily: 'Work Sans, sans-serif',
          margin: '0.5rem 0',
        }}>
          <Typography variant="subtitle2" sx={{ fontStyle: 'italic', opacity: 0.7, marginBottom: '0.5rem' }}>
            Assistant
          </Typography>
          {editing ? (
            <TextField
              multiline
              minRows={2}
              maxRows={6}
              value={editContent.text}
              onChange={e => setEditContent({ ...editContent, text: e.target.value })}
              fullWidth
              sx={{ marginBottom: '1.2rem' }}
            />
          ) : (
            <Typography variant="body1" sx={{ marginBottom: '1.2rem', whiteSpace: 'pre-line' }}>
              {content.text}
            </Typography>
          )}
          <Box sx={{ display: 'flex', gap: 1 }}>
            {editing ? (
              <>
                <Button size="small" variant="contained" color="success" onClick={handleSave}>SAVE & SEND</Button>
                <Button size="small" variant="outlined" color="inherit" onClick={handleCancel}>CANCEL</Button>
              </>
            ) : (
              <>
                <Button size="small" variant="outlined" color="success" onClick={onApprove}>APPROVE</Button>
                <Button size="small" variant="outlined" color="primary" onClick={handleEditClick}>EDIT</Button>
                <Button size="small" variant="outlined" color="error" onClick={onDecline}>DECLINE</Button>
              </>
            )}
          </Box>
        </Box>
      </Box>
    );
  }

  // Action cfeed
  if (cfeedType === 'action') {
    return (
      <Box className={wrapperClass}>
        <Box className="cfeed-bubble" sx={{
          background: 'rgba(39, 45, 79, 0.85)',
          borderRadius: '16px',
          padding: '1.2rem 1.5rem',
          color: 'var(--bone, #fff)',
          minWidth: 320,
          maxWidth: 440,
          boxShadow: '0 2px 12px 0 rgba(0,0,0,0.12)',
          fontFamily: 'Work Sans, sans-serif',
          margin: '0.5rem 0',
        }}>
          {editing ? (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, marginBottom: '1.2rem' }}>
              <TextField
                label="Event Title"
                value={editContent.eventTitle}
                onChange={e => setEditContent({ ...editContent, eventTitle: e.target.value })}
                sx={{ marginBottom: 1 }}
                size="small"
              />
              <TextField
                label="Date"
                value={editContent.date}
                onChange={e => setEditContent({ ...editContent, date: e.target.value })}
                sx={{ marginBottom: 1 }}
                size="small"
              />
              <TextField
                label="Time"
                value={editContent.time}
                onChange={e => setEditContent({ ...editContent, time: e.target.value })}
                sx={{ marginBottom: 1 }}
                size="small"
              />
              <TextField
                label="Description"
                value={editContent.description}
                onChange={e => setEditContent({ ...editContent, description: e.target.value })}
                sx={{ marginBottom: 1 }}
                size="small"
                multiline
                minRows={2}
                maxRows={4}
              />
              <TextField
                label="Guests"
                value={editContent.guests}
                onChange={e => setEditContent({ ...editContent, guests: e.target.value })}
                sx={{ marginBottom: 1 }}
                size="small"
              />
            </Box>
          ) : (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, marginBottom: '1.2rem' }}>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Typography sx={{ fontWeight: 600, minWidth: 90, color: 'var(--bone, #fff)' }}>Event Title</Typography>
                <Typography>{content.eventTitle}</Typography>
              </Box>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Typography sx={{ fontWeight: 600, minWidth: 90, color: 'var(--bone, #fff)' }}>Date</Typography>
                <Typography>{content.date}</Typography>
              </Box>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Typography sx={{ fontWeight: 600, minWidth: 90, color: 'var(--bone, #fff)' }}>Time</Typography>
                <Typography>{content.time}</Typography>
              </Box>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Typography sx={{ fontWeight: 600, minWidth: 90, color: 'var(--bone, #fff)' }}>Description</Typography>
                <Typography sx={{ maxWidth: 220, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{content.description}</Typography>
              </Box>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Typography sx={{ fontWeight: 600, minWidth: 90, color: 'var(--bone, #fff)' }}>Guests</Typography>
                <Typography>{content.guests}</Typography>
              </Box>
            </Box>
          )}
          <Box sx={{ display: 'flex', gap: 1 }}>
            {editing ? (
              <>
                <Button size="small" variant="contained" color="success" onClick={handleSave}>SAVE & SEND</Button>
                <Button size="small" variant="outlined" color="inherit" onClick={handleCancel}>CANCEL</Button>
              </>
            ) : (
              <>
                <Button size="small" variant="outlined" color="success" onClick={onApprove}>APPROVE</Button>
                <Button size="small" variant="outlined" color="primary" onClick={handleEditClick}>EDIT</Button>
                <Button size="small" variant="outlined" color="error" onClick={onDecline}>DECLINE</Button>
              </>
            )}
          </Box>
        </Box>
      </Box>
    );
  }

  // fallback
  return null;
};

export default CfeedBubble; 