import React from 'react';
import { Button as MuiButton, TextField, Stack, Box, Typography, Card } from '@mui/material';
import '../App.css';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import CheckIcon from '@mui/icons-material/Check';

// Reusable Button component
export function Button({ children, variant = 'contained', ...props }) {
  let className = 'button';
  if (variant === 'contained') className += ' button-contained';
  if (variant === 'outlined') className += ' button-outlined';
  if (variant === 'text') className += ' button-text';
  return (
    <MuiButton className={className} variant={variant} {...props}>
      {children}
    </MuiButton>
  );
}

// Reusable TextInput component
export function TextInput({ label, placeholder, value, onChange, ...props }) {
  return (
    <TextField
      className="input-field"
      label={label}
      variant="outlined"
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      fullWidth
      {...props}
    />
  );
}

// Reusable LongTextInput component
export function LongTextInput({ label, placeholder, value, onChange, rows = 4, ...props }) {
  return (
    <TextField
      className="input-field"
      label={label}
      variant="outlined"
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      multiline
      rows={rows}
      fullWidth
      {...props}
    />
  );
}

export function TodoCard({
  title,
  description,
  dueTime,
  status = 'done', // or 'pending'
  onToggle,
}) {
  return (
    <div className="todo-card">
      <div
        className={`todo-card-icon ${status === 'done' ? 'todo-card-icon-done' : 'todo-card-icon-pending'}`}
        onClick={onToggle}
      >
        {status === 'done' && <CheckIcon className="todo-card-check-icon" />}
      </div>
      <div className="todo-card-content">
        <div className="todo-card-header-row">
          <span className="todo-card-title">{title}</span>
          {dueTime && (
            <span className="todo-card-due">Best by {dueTime}</span>
          )}
        </div>
        <span className="todo-card-description">{description}</span>
      </div>
    </div>
  );
}

const BasicFormElements = () => {
  return (
    <>
      <Box className="section">
        <Typography className="heading-secondary">Buttons</Typography>
        <Stack direction="row" spacing={2}>
          <Button className="button button-contained" variant="contained">Contained</Button>
          <Button className="button button-outlined" variant="outlined">Outlined</Button>
          <Button className="button button-text" variant="text">Text</Button>
          <Button className="button" variant="contained" disabled>Disabled</Button>
        </Stack>
      </Box>

      <Box className="section">
        <Typography className="heading-secondary">Short Text Input</Typography>
        <TextInput 
          label="Name" 
          placeholder="Enter short text" 
        />
      </Box>

      <Box className="section">
        <Typography className="heading-secondary">Long Text Input</Typography>
        <LongTextInput
          label="Description"
          placeholder="Enter detailed description"
        />
      </Box>
    </>
  );
};

export default BasicFormElements; 