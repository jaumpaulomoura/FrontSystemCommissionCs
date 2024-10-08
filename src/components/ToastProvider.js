import React, { createContext, useContext, useState } from 'react';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [severity, setSeverity] = useState('success');

  const showToast = (msg, severity = 'success') => {
    setMessage(msg);
    setSeverity(severity);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity={severity}>
          {message}
        </Alert>
      </Snackbar>
    </ToastContext.Provider>
  );
};

export const useToast = () => useContext(ToastContext);
