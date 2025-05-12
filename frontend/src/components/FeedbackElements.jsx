import React from 'react';
import {
  Box,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Alert,
  LinearProgress,
  Tooltip,
  Skeleton
} from '@mui/material';

// Reusable Modal component
export function Modal({ open, onClose, title, children, actions, ...props }) {
  return (
    <Dialog open={open} onClose={onClose} PaperProps={{ className: 'dialog-popup' }} className="dialog" {...props}>
      {title && <DialogTitle className="dialog-title">{title}</DialogTitle>}
      <DialogContent className="dialog-content">{children}</DialogContent>
      {actions && <DialogActions>{actions}</DialogActions>}
    </Dialog>
  );
}

// Reusable Toast (Snackbar) component
export function Toast({ open, onClose, message, severity = 'success', autoHideDuration = 3000, ...props }) {
  return (
    <Snackbar
      open={open}
      autoHideDuration={autoHideDuration}
      onClose={onClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      className="snackbar"
      {...props}
    >
      <Alert onClose={onClose} severity={severity} sx={{ width: '100%' }}>
        {message}
      </Alert>
    </Snackbar>
  );
}

// Reusable ProgressBar component
export function ProgressBar({ value = 0, label, ...props }) {
  return (
    <div style={{ width: '100%' }}>
      <LinearProgress
        variant="determinate"
        value={value}
        className="progress-bar"
        {...props}
      />
      {label && <div style={{ marginTop: 8 }}>{label}</div>}
    </div>
  );
}

// Reusable TooltipButton component
export function TooltipButton({ title, children, ...props }) {
  return (
    <Tooltip title={title} arrow>
      <span>
        <Button className="button button-contained" variant="contained" {...props}>
          {children}
        </Button>
      </span>
    </Tooltip>
  );
}

// Reusable SkeletonLoader component
export function SkeletonLoader({ variant = 'text', width = '100%', height = 24, ...props }) {
  return (
    <Skeleton variant={variant} width={width} height={height} sx={{ bgcolor: 'var(--onyx)', mt: variant === 'rectangular' ? 1 : 0 }} {...props} />
  );
}

const FeedbackElements = () => {
  const [isModalOpen, setModalOpen] = React.useState(false);
  const [snackbarOpen, setSnackbarOpen] = React.useState(false);

  return (
    <>
      <Box className="section">
        <Typography className="heading-secondary">Modal</Typography>
        <Button
          className="button button-outlined"
          variant="outlined"
          onClick={() => setModalOpen(true)}
        >
          Open Modal
        </Button>
        <Modal open={isModalOpen} onClose={() => setModalOpen(false)}>
          <DialogTitle className="dialog-title">Modal Title</DialogTitle>
          <DialogContent className="dialog-content">
            This is some content inside the modal.
          </DialogContent>
        </Modal>
      </Box>

      <Box className="section">
        <Typography className="heading-secondary">Toast (Snackbar)</Typography>
        <Button
          className="button button-contained"
          variant="contained"
          onClick={() => setSnackbarOpen(true)}
        >
          Show Toast
        </Button>
        <Toast open={snackbarOpen} onClose={() => setSnackbarOpen(false)} message="This is a success message!" />
      </Box>

      <Box className="section">
        <Typography className="heading-secondary">Progress Bar</Typography>
        <ProgressBar value={60} label="60% completed" />
      </Box>

      <Box className="section">
        <Typography className="heading-secondary">Tooltip</Typography>
        <TooltipButton title="This is a tooltip!" children="Hover me" />
      </Box>

      <Box className="section">
        <Typography className="heading-secondary">Skeleton</Typography>
        <SkeletonLoader variant="text" width="40%" />
        <SkeletonLoader variant="rectangular" width="100%" height={100} />
      </Box>
    </>
  );
};

export default FeedbackElements; 