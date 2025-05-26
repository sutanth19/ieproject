import React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Contact from './../Home/Contact';

const ContactModal = ({ open, onClose, darkMode }) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: '12px',
          backgroundColor: darkMode ? '#000f2b' : '#fff',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
          overflow: 'hidden',
        },
      }}
    >
      <DialogTitle
        sx={{
          m: 0,
          p: 2,
          backgroundColor: '#002b49',
          color: 'white',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <span>Contact Us</span>
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            color: 'white',
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
            },
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent
        sx={{
          padding: 0,
          backgroundColor: darkMode ? '#000f2b' : '#fff',
        }}
      >
        <ContactWrapper darkMode={darkMode} />
      </DialogContent>
    </Dialog>
  );
};

// Wrapper component to adapt the Contact component for modal use
const ContactWrapper = ({ darkMode }) => {
  return (
    <div style={{ maxHeight: '80vh', overflowY: 'auto' }}>
      <Contact />
    </div>
  );
};

export default ContactModal;