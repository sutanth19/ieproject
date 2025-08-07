// ImageUploadModal.tsx - Updated to use your CSS variable system
import React, { useState, useCallback } from 'react';
import { styled } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import Input from '@mui/material/Input';
import FormLabel from '@mui/material/FormLabel';

interface ImageUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInsert: (imageData: { src: string; altText: string }) => void;
  isDarkMode?: boolean;
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
}));

const StyledInput = styled(Input)<{ isDarkMode: boolean }>(({ isDarkMode }) => ({
  width: '100%',
  padding: '8px',
  border: isDarkMode ? '1px solid rgba(255, 255, 255, 0.23)' : '1px solid rgba(0, 0, 0, 0.23)',
  borderRadius: '4px',
  backgroundColor: isDarkMode ? 'var(--card-background-color-dark-mode)' : 'white',
  color: isDarkMode ? 'var(--section-color-dark-mode)' : 'var(--section-color-light-mode)',
  transition: 'var(--standard-transition)',
  '&:before, &:after': {
    display: 'none',
  },
  '&:hover': {
    borderColor: 'var(--color-light-mode)',
  },
}));

const StyledTabs = styled(Tabs)<{ isDarkMode: boolean }>(({ isDarkMode }) => ({
  borderBottom: isDarkMode ? '1px solid rgba(255, 255, 255, 0.23)' : '1px solid rgba(0, 0, 0, 0.23)',
  '& .MuiTabs-indicator': {
    backgroundColor: 'var(--color-light-mode)',
  },
}));

const StyledTab = styled(Tab)<{ isDarkMode: boolean }>(({ isDarkMode }) => ({
  color: isDarkMode ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.6)',
  fontWeight: 400,
  transition: 'var(--standard-transition)',
  '&.Mui-selected': {
    color: 'var(--color-light-mode)',
    fontWeight: 600,
  },
}));

// Same button sizes as CodeBlockModal
const StyledButton = styled(Button)<{ isDarkMode: boolean; variant: 'outlined' | 'contained' }>(({ isDarkMode, variant }) => ({
  padding: '8px 16px', // Same as CodeBlockModal
  fontWeight: 600,
  fontSize: '0.875rem', // Same as CodeBlockModal
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

const StyledFormLabel = styled(FormLabel)<{ isDarkMode: boolean }>(({ isDarkMode }) => ({
  display: 'block',
  marginBottom: '4px',
  fontSize: '14px',
  fontWeight: 500,
  color: isDarkMode ? 'var(--section-color-dark-mode)' : 'var(--section-color-light-mode)',
}));

export const ImageUploadModal: React.FC<ImageUploadModalProps> = ({
  isOpen,
  onClose,
  onInsert,
  isDarkMode = false, 
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState('');
  const [altText, setAltText] = useState('');
  const [uploadMethod, setUploadMethod] = useState<'file' | 'url'>('file');
  const [previewUrl, setPreviewUrl] = useState('');
  const [fileDataUrl, setFileDataUrl] = useState('');

  // Convert file to base64 data URL (permanent)
  const convertFileToDataUrl = useCallback((file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          resolve(reader.result);
        } else {
          reject(new Error('Failed to read file'));
        }
      };
      reader.onerror = () => reject(reader.error);
      reader.readAsDataURL(file);
    });
  }, []);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      try {
        setSelectedFile(file);
        
        const blobUrl = URL.createObjectURL(file);
        const dataUrl = await convertFileToDataUrl(file);
        
        setPreviewUrl(blobUrl);
        setFileDataUrl(dataUrl);
        setAltText(file.name.split('.')[0]);
        
        console.log('File selected:', {
          name: file.name,
          size: file.size,
          type: file.type,
          dataUrlLength: dataUrl.length
        });
      } catch (error) {
        console.error('Error processing file:', error);
        alert('Error processing file. Please try again.');
      }
    } else {
      alert('Please select a valid image file.');
    }
  };

  const handleUrlChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const url = event.target.value;
    setImageUrl(url);
    setPreviewUrl(url);
    setFileDataUrl('');
  };

  const handleInsert = () => {
    let src = '';
    
    if (uploadMethod === 'file' && selectedFile && fileDataUrl) {
      src = fileDataUrl;
      console.log('Inserting file as data URL, length:', src.length);
    } else if (uploadMethod === 'url' && imageUrl) {
      src = imageUrl;
      console.log('Inserting URL:', src);
    }

    if (src && altText) {
      onInsert({ src, altText });
      handleClose();
    } else {
      alert('Please ensure you have selected an image and provided alt text.');
    }
  };

  const handleClose = () => {
    if (previewUrl && selectedFile && previewUrl.startsWith('blob:')) {
      URL.revokeObjectURL(previewUrl);
    }
    
    setSelectedFile(null);
    setImageUrl('');
    setAltText('');
    setPreviewUrl('');
    setFileDataUrl('');
    setUploadMethod('file');
    onClose();
  };

  const handleMethodSwitch = (method: 'file' | 'url') => {
    if (uploadMethod === 'file' && previewUrl && previewUrl.startsWith('blob:')) {
      URL.revokeObjectURL(previewUrl);
    }
    
    setUploadMethod(method);
    setPreviewUrl('');
    setFileDataUrl('');
    setSelectedFile(null);
    setImageUrl('');
    setAltText('');
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    handleMethodSwitch(newValue === 0 ? 'file' : 'url');
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
          Insert Image
        </Typography>

        {/* Upload Method Tabs */}
        <StyledTabs
          value={uploadMethod === 'file' ? 0 : 1}
          onChange={handleTabChange}
          isDarkMode={isDarkMode}
          sx={{ marginBottom: '16px' }}
        >
          <StyledTab label="Upload File" isDarkMode={isDarkMode} />
          <StyledTab label="Image URL" isDarkMode={isDarkMode} />
        </StyledTabs>

        {/* File Upload */}
        {uploadMethod === 'file' && (
          <Box sx={{ marginBottom: '16px' }}>
            <StyledFormLabel isDarkMode={isDarkMode}>
              Select Image File
            </StyledFormLabel>
            <StyledInput
              type="file"
              inputProps={{ accept: "image/*" }}
              onChange={handleFileSelect}
              isDarkMode={isDarkMode}
            />
            {selectedFile && (
              <Typography 
                variant="caption" 
                sx={{ 
                  display: 'block',
                  marginTop: '8px', 
                  fontSize: '12px', 
                  color: isDarkMode ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.6)' 
                }}
              >
                Selected: {selectedFile.name} ({(selectedFile.size / 1024).toFixed(1)} KB)
              </Typography>
            )}
          </Box>
        )}

        {/* URL Input */}
        {uploadMethod === 'url' && (
          <Box sx={{ marginBottom: '16px' }}>
            <StyledTextField
              fullWidth
              label="Image URL"
              placeholder="https://example.com/image.jpg"
              value={imageUrl}
              onChange={handleUrlChange}
              isDarkMode={isDarkMode}
              variant="outlined"
              size="small"
            />
          </Box>
        )}

        {/* Alt Text */}
        <Box sx={{ marginBottom: '16px' }}>
          <StyledTextField
            fullWidth
            label="Alt Text*"
            placeholder="Describe the image..."
            value={altText}
            onChange={(e) => setAltText(e.target.value)}
            isDarkMode={isDarkMode}
            variant="outlined"
            size="small"
            required
          />
        </Box>

        {/* Preview */}
        {previewUrl && (
          <Box sx={{ marginBottom: '16px' }}>
            <StyledFormLabel isDarkMode={isDarkMode}>
              Preview
            </StyledFormLabel>
            <Box sx={{ 
              border: isDarkMode ? '1px solid rgba(255, 255, 255, 0.23)' : '1px solid rgba(0, 0, 0, 0.23)', 
              borderRadius: '8px', 
              padding: '8px',
              textAlign: 'center',
              backgroundColor: isDarkMode ? 'var(--section-stripe-background-dark-mode)' : 'var(--section-stripe-background-light-mode)',
              transition: 'var(--standard-transition)',
            }}>
              <img
                src={previewUrl}
                alt="Preview"
                style={{
                  maxWidth: '100%',
                  maxHeight: '200px',
                  borderRadius: '4px',
                }}
                onError={(e) => {
                  console.error('Preview image failed to load:', previewUrl);
                  e.currentTarget.style.display = 'none';
                }}
                onLoad={() => {
                  console.log('Preview image loaded successfully');
                }}
              />
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
          disabled={!previewUrl || !altText}
          variant="contained"
          isDarkMode={isDarkMode}
        >
          Insert Image
        </StyledButton>
      </DialogActions>
    </StyledDialog>
  );
};