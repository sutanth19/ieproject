// LinkModal.tsx - Updated to use your CSS variable system
import React, { useState } from 'react';
import { styled } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';

interface LinkModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInsert: (linkData: { url: string; text: string }) => void;
  isDarkMode?: boolean;
  initialText?: string;
}

// Updated to use your CSS variables
const StyledDialog = styled(Dialog)<{ isDarkMode: boolean }>(({ isDarkMode }) => ({
  '& .MuiDialog-paper': {
    backgroundColor: isDarkMode ? 'var(--card-background-color-dark-mode) !important' : 'white !important',
    color: isDarkMode ? 'var(--section-color-dark-mode)' : 'var(--section-color-light-mode)',
    borderRadius: '8px',
    borderLeft: 'var(--border-accent-width) solid var(--color-light-mode)',
    boxShadow: isDarkMode 
      ? '0 8px 16px rgba(0, 0, 0, 0.3)' 
      : '0 8px 16px rgba(0, 0, 0, 0.1)',
    maxWidth: '500px',
    width: '90%',
    maxHeight: '80vh',
    animation: 'cardFadeIn 0.3s ease forwards',
  },
  '& .MuiDialog-container': {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
}));

const StyledTextField = styled(TextField)<{ isDarkMode: boolean }>(({ isDarkMode }) => ({
  '& .MuiOutlinedInput-root': {
    backgroundColor: isDarkMode ? 'var(--card-background-color-dark-mode)' : 'white',
    color: isDarkMode ? 'var(--section-color-dark-mode)' : 'var(--section-color-light-mode)',
    fontSize: '14px',
    transition: 'var(--standard-transition)',
    '& fieldset': {
      borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.23)' : 'rgba(0, 0, 0, 0.23)',
    },
    '&:hover fieldset': {
      borderColor: 'var(--color-light-mode)',
    },
    '&.Mui-focused fieldset': {
      borderColor: 'var(--color-light-mode)',
    },
  },
  '& .MuiInputLabel-root': {
    color: isDarkMode ? 'var(--section-color-dark-mode)' : 'var(--section-color-light-mode)',
    fontWeight: 500,
    fontSize: '14px',
  },
  '& .MuiInputLabel-root.Mui-focused': {
    color: 'var(--color-light-mode)',
  },
  '& .MuiOutlinedInput-input': {
    padding: '8px 12px',
  },
}));

// Same button sizes as CodeBlockModal and ImageModal
const StyledButton = styled(Button)<{ isDarkMode: boolean; variant: 'outlined' | 'contained' }>(({ isDarkMode, variant }) => ({
  padding: '8px 16px', // Same as other modals
  fontWeight: 600,
  fontSize: '0.875rem', // Same as other modals
  borderRadius: '4px',
  transition: 'var(--standard-transition)',
  letterSpacing: '0.5px',
  ...(variant === 'outlined' && {
    border: isDarkMode ? '1px solid rgba(255, 255, 255, 0.23)' : '1px solid rgba(0, 0, 0, 0.23)',
    backgroundColor: isDarkMode ? 'var(--card-background-color-dark-mode)' : 'white',
    color: isDarkMode ? 'var(--section-color-dark-mode)' : 'var(--section-color-light-mode)',
    '&:hover': {
      backgroundColor: isDarkMode ? 'var(--section-stripe-background-dark-mode)' : 'var(--section-stripe-background-light-mode)',
      borderColor: 'var(--color-light-mode)',
    },
  }),
  ...(variant === 'contained' && {
    backgroundColor: 'var(--primary-button-color)',
    color: 'white',
    boxShadow: 'var(--button-shadow)',
    '&:hover': {
      backgroundColor: 'var(--primary-button-hover)',
      boxShadow: 'var(--button-shadow-hover)',
    },
    '&:disabled': {
      backgroundColor: '#9ca3af',
      color: 'white',
    },
  }),
}));

export const LinkModal: React.FC<LinkModalProps> = ({
  isOpen,
  onClose,
  onInsert,
  isDarkMode = false,
  initialText = '',
}) => {
  const [url, setUrl] = useState('');
  const [text, setText] = useState(initialText);

  const handleInsert = () => {
    if (url.trim()) {
      onInsert({ 
        url: url.trim(), 
        text: text.trim() || url.trim() 
      });
      handleClose();
    } else {
      alert('Please enter a valid URL.');
    }
  };

  const handleClose = () => {
    setUrl('');
    setText('');
    onClose();
  };

  const isValidUrl = (string: string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      // Check if it's a relative URL or missing protocol
      if (string.includes('.') && !string.includes(' ')) {
        return true;
      }
      return false;
    }
  };

  const formatUrl = (inputUrl: string) => {
    if (!inputUrl.startsWith('http://') && !inputUrl.startsWith('https://') && !inputUrl.startsWith('/')) {
      return 'https://' + inputUrl;
    }
    return inputUrl;
  };

  return (
    <StyledDialog
      open={isOpen}
      onClose={handleClose}
      isDarkMode={isDarkMode}
      maxWidth="sm"
      fullWidth
    >
      <DialogContent sx={{ 
        padding: '24px',
        backgroundColor: isDarkMode ? 'var(--card-background-color-dark-mode) !important' : 'white !important',
        color: isDarkMode ? 'var(--section-color-dark-mode)' : 'var(--section-color-light-mode)'
      }}>
        {/* Title */}
        <Typography 
          variant="h6" 
          className="section-title"
          sx={{ 
            margin: '0 0 16px 0', 
            fontSize: '18px', 
            fontWeight: 500,
          }}
        >
          Insert Link
        </Typography>

        {/* URL Input */}
        <Box sx={{ marginBottom: '16px' }}>
          <StyledTextField
            fullWidth
            label="URL *"
            placeholder="https://example.com"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            isDarkMode={isDarkMode}
            variant="outlined"
            size="small"
            autoFocus
            type="url"
          />
          {url && !isValidUrl(url) && (
            <Typography 
              variant="caption" 
              sx={{ 
                display: 'block',
                marginTop: '4px', 
                fontSize: '12px', 
                color: '#ef4444' 
              }}
            >
              Please enter a valid URL (e.g., https://example.com)
            </Typography>
          )}
        </Box>

        {/* Display Text Input */}
        <Box sx={{ marginBottom: '16px' }}>
          <StyledTextField
            fullWidth
            label="Display Text"
            placeholder="Link text (optional)"
            value={text}
            onChange={(e) => setText(e.target.value)}
            isDarkMode={isDarkMode}
            variant="outlined"
            size="small"
          />
          <Typography 
            variant="caption" 
            sx={{ 
              display: 'block',
              marginTop: '4px', 
              fontSize: '12px', 
              color: isDarkMode ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.6)' 
            }}
          >
            If empty, the URL will be used as display text
          </Typography>
        </Box>

        {/* Preview */}
        {url && isValidUrl(url) && (
          <Box sx={{ marginBottom: '16px' }}>
            <Typography 
              variant="body2"
              sx={{ 
                display: 'block',
                marginBottom: '4px',
                fontSize: '14px',
                fontWeight: 500,
                color: isDarkMode ? 'var(--section-color-dark-mode)' : 'var(--section-color-light-mode)'
              }}
            >
              Preview
            </Typography>
            <Box sx={{ 
              padding: '8px 12px',
              border: isDarkMode ? '1px solid rgba(255, 255, 255, 0.23)' : '1px solid rgba(0, 0, 0, 0.23)',
              borderRadius: '4px',
              backgroundColor: isDarkMode ? 'var(--section-stripe-background-dark-mode)' : 'var(--section-stripe-background-light-mode)',
              transition: 'var(--standard-transition)',
            }}>
              <Link 
                href={formatUrl(url)} 
                target="_blank" 
                rel="noopener noreferrer"
                sx={{
                  color: 'var(--color-light-mode)',
                  textDecoration: 'underline',
                  cursor: 'pointer',
                  transition: 'var(--standard-transition)',
                  '&:hover': {
                    color: 'var(--primary-button-hover)'
                  }
                }}
                onClick={(e) => e.preventDefault()}
              >
                {text || url}
              </Link>
            </Box>
          </Box>
        )}
      </DialogContent>

      {/* Buttons */}
      <DialogActions sx={{ 
        padding: '0 24px 24px 24px', 
        gap: '8px',
        backgroundColor: isDarkMode ? 'var(--card-background-color-dark-mode) !important' : 'white !important'
      }}>
        <StyledButton
          onClick={handleClose}
          variant="outlined"
          isDarkMode={isDarkMode}
        >
          Cancel
        </StyledButton>
        <StyledButton
          onClick={handleInsert}
          disabled={!url.trim() || !isValidUrl(url)}
          variant="contained"
          isDarkMode={isDarkMode}
        >
          Insert Link
        </StyledButton>
      </DialogActions>
    </StyledDialog>
  );
};