import React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Slide from '@mui/material/Slide';
import { TransitionProps } from '@mui/material/transitions';
import CloseIcon from '@mui/icons-material/Close';
import SaveIcon from '@mui/icons-material/Save';
import EditIcon from '@mui/icons-material/Edit';
import { useTheme } from './../../themes/ThemeContext';

interface PreviewModalProps {
  open: boolean;
  onClose: () => void;
  html: string;
  plainText: string;
  json: string;
}

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement;
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const PreviewModal: React.FC<PreviewModalProps> = ({
  open,
  onClose,
  html,
  plainText,
  json
}) => {
  const { darkMode } = useTheme();

  const handleSave = () => {
    console.log('Save content:', { html, plainText, json });
    alert('Save functionality to be implemented');
  };

  const handleEdit = () => {
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      TransitionComponent={Transition}
      maxWidth="md"
      fullWidth
      className={darkMode ? 'dark-mode' : ''}
      sx={{
        '& .MuiDialog-paper': {
          backgroundColor: darkMode ? 'var(--card-background-color-dark-mode)' : 'var(--section-background-light-mode)',
          maxHeight: '85vh',
          height: '85vh',
          m: 2,
          borderRadius: '12px',
          boxShadow: darkMode 
            ? '0 20px 40px rgba(0, 0, 0, 0.5)' 
            : '0 20px 40px rgba(0, 0, 0, 0.15)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column'
        },
        '& .MuiBackdrop-root': {
          backgroundColor: 'rgba(0, 0, 0, 0.6)',
        }
      }}
    >
      {/* Header with CSS Variables */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          p: 3,
          borderBottom: darkMode 
            ? '1px solid var(--color-dark-mode)' 
            : '1px solid #e2e8f0',
          backgroundColor: darkMode 
            ? 'var(--card-background-color-dark-mode)' 
            : 'var(--section-background-light-mode)',
          flexShrink: 0, // Prevent header from shrinking
        }}
      >
        <Typography 
          variant="h6"
          sx={{
            fontWeight: 600,
            color: darkMode 
              ? 'var(--section-color-dark-mode)' 
              : 'var(--section-color-light-mode)',
          }}
        >
          Preview
        </Typography>
        
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Button
            variant="outlined"
            size="small"
            startIcon={<EditIcon />}
            onClick={handleEdit}
            sx={{
              color: darkMode 
                ? 'var(--section-color-dark-mode)' 
                : 'var(--section-color-light-mode)',
              borderColor: darkMode ? 'var(--color-dark-mode)' : '#e2e8f0',
              transition: 'var(--standard-transition)',
              '&:hover': {
                backgroundColor: darkMode 
                  ? 'rgba(70, 191, 232, 0.1)' 
                  : 'rgba(70, 191, 232, 0.05)',
                borderColor: 'var(--color-light-mode)',
              }
            }}
          >
            Edit
          </Button>
          
          <Button
            variant="contained"
            size="small"
            startIcon={<SaveIcon />}
            onClick={handleSave}
            sx={{
              backgroundColor: 'var(--primary-button-color)',
              color: 'white',
              boxShadow: 'var(--button-shadow)',
              '&:hover': {
                backgroundColor: 'var(--primary-button-hover)',
                boxShadow: 'var(--button-shadow-hover)',
              }
            }}
          >
            Save
          </Button>
          
          <IconButton
            onClick={onClose}
            size="small"
            sx={{
              color: darkMode 
                ? 'var(--section-color-dark-mode)' 
                : 'var(--section-color-light-mode)',
              transition: 'var(--standard-transition)',
              '&:hover': {
                backgroundColor: darkMode 
                  ? 'rgba(70, 191, 232, 0.1)' 
                  : 'rgba(70, 191, 232, 0.05)',
                color: 'var(--color-light-mode)',
              }
            }}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>
      </Box>

      {/* Content Area with Fixed Scrolling */}
      <DialogContent
        sx={{
          flex: 1,
          p: 0,
          backgroundColor: darkMode 
            ? 'var(--card-background-color-dark-mode)' 
            : 'var(--section-background-light-mode)',
          overflow: 'auto', // Changed from 'hidden' to 'auto'
          // Custom scrollbar styling
          '&::-webkit-scrollbar': {
            width: '8px'
          },
          '&::-webkit-scrollbar-track': {
            backgroundColor: darkMode ? 'var(--section-stripe-background-dark-mode)' : 'var(--section-stripe-background-light-mode)',
            borderRadius: '4px'
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: darkMode ? 'var(--color-light-mode)' : 'var(--color-dark-mode)',
            borderRadius: '4px',
            opacity: 0.7,
            '&:hover': {
              backgroundColor: 'var(--color-light-mode)',
              opacity: 1
            }
          },
          scrollbarWidth: 'thin',
          scrollbarColor: darkMode 
            ? 'var(--color-light-mode) var(--section-stripe-background-dark-mode)'
            : 'var(--color-dark-mode) var(--section-stripe-background-light-mode)',
          // Enable smooth scrolling
          scrollBehavior: 'smooth'
        }}
      >
        <Box
          sx={{
            p: 4,
            minHeight: '100%', // Changed from height: '100%' to minHeight: '100%'
            fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
            lineHeight: 1.6,
            fontSize: '16px',
            color: darkMode 
              ? 'var(--section-color-dark-mode)' 
              : 'var(--section-color-light-mode)',
            
            '& h1, & h2, & h3, & h4, & h5, & h6': {
              color: darkMode 
                ? 'var(--section-color-dark-mode)' 
                : 'var(--section-color-light-mode)',
              fontWeight: 700,
              marginTop: '1.5em',
              marginBottom: '0.5em',
              lineHeight: 1.3,
            },
            '& h1': { fontSize: '2rem' },
            '& h2': { fontSize: '1.75rem' },
            '& h3': { fontSize: '1.5rem' },
            '& h4': { fontSize: '1.25rem' },
            '& h5': { fontSize: '1.1rem' },
            '& h6': { fontSize: '1rem' },
            
            '& p': {
              marginBottom: '1em',
              color: darkMode 
                ? 'var(--section-color-dark-mode)' 
                : 'var(--section-color-light-mode)',
            },
            
            '& ul, & ol': {
              paddingLeft: '1.5em',
              marginBottom: '1em',
              color: darkMode 
                ? 'var(--section-color-dark-mode)' 
                : 'var(--section-color-light-mode)',
            },
            
            '& li': {
              marginBottom: '0.25em',
            },
            
            '& blockquote': {
              borderLeft: 'var(--border-accent-width) solid var(--color-light-mode)',
              paddingLeft: '1em',
              margin: '1.5em 0',
              fontStyle: 'italic',
              color: darkMode ? '#d1d5db' : '#6b7280',
              backgroundColor: darkMode 
                ? 'rgba(70, 191, 232, 0.1)' 
                : 'rgba(70, 191, 232, 0.05)',
              padding: '16px',
              borderRadius: '0 8px 8px 0',
            },
            
            '& code': {
              backgroundColor: darkMode 
                ? 'rgba(70, 191, 232, 0.2)' 
                : 'rgba(70, 191, 232, 0.1)',
              color: darkMode ? '#ff6b9d' : '#e91e63',
              padding: '2px 6px',
              borderRadius: '4px',
              fontFamily: '"Fira Code", "Courier New", monospace',
              fontSize: '0.9em',
              border: darkMode 
                ? '1px solid rgba(70, 191, 232, 0.3)' 
                : '1px solid rgba(70, 191, 232, 0.2)',
            },
            
            '& a': {
              color: 'var(--color-light-mode)',
              textDecoration: 'underline',
              transition: 'var(--standard-transition)',
              '&:hover': {
                color: darkMode ? '#5cd3ff' : '#3c9ad1',
              }
            },
            
            '& img': {
              maxWidth: '100%',
              height: 'auto',
              borderRadius: '8px',
              margin: '1em auto',
              display: 'block',
              boxShadow: darkMode 
                ? '0 4px 12px rgba(0, 0, 0, 0.3)' 
                : '0 4px 12px rgba(0, 0, 0, 0.1)',
            },
            
            '& hr': {
              border: 'none',
              borderTop: '2px solid var(--color-light-mode)',
              margin: '2em 0',
              opacity: 0.6,
            },
            
            '& table': {
              borderCollapse: 'collapse',
              width: '100%',
              margin: '1em 0',
              border: darkMode 
                ? `1px solid var(--color-dark-mode)` 
                : '1px solid #d1d5db',
              borderRadius: '6px',
              overflow: 'hidden',
              backgroundColor: darkMode 
                ? 'var(--card-background-color-dark-mode)' 
                : 'var(--section-background-light-mode)',
            },
            
            '& td, & th': {
              border: darkMode 
                ? `1px solid var(--color-dark-mode)` 
                : '1px solid #d1d5db',
              padding: '12px',
              textAlign: 'left',
              color: darkMode 
                ? 'var(--section-color-dark-mode)' 
                : 'var(--section-color-light-mode)',
            },
            
            '& th': {
              backgroundColor: darkMode 
                ? 'var(--section-stripe-background-dark-mode)' 
                : 'var(--section-stripe-background-light-mode)',
              fontWeight: 600,
            },
            
            // Text formatting
            '& strong, & b': {
              fontWeight: 700,
              color: 'inherit',
            },
            '& em, & i': {
              fontStyle: 'italic',
              color: 'inherit',
            },
            '& u': {
              textDecoration: 'underline',
              color: 'inherit',
            },
            '& s, & strike': {
              textDecoration: 'line-through',
              color: 'inherit',
            },
            
            // Subscript and superscript
            '& sub': {
              verticalAlign: 'sub',
              fontSize: '0.8em',
            },
            '& sup': {
              verticalAlign: 'super',
              fontSize: '0.8em',
            },
            
            // Text alignment
            '& [style*="text-align: center"]': {
              textAlign: 'center',
            },
            '& [style*="text-align: right"]': {
              textAlign: 'right',
            },
            '& [style*="text-align: justify"]': {
              textAlign: 'justify',
            },
          }}
          dangerouslySetInnerHTML={{ 
            __html: html || '<p style="color: #9ca3af; font-style: italic; text-align: center; padding: 2em;">No content to preview</p>' 
          }}
        />
      </DialogContent>
    </Dialog>
  );
};

export default PreviewModal;