// CodeBlockModal.tsx - Updated to use your CSS variable system
import React, { useState } from 'react';
import { styled } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';

interface CodeBlockModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInsert: (codeData: { code: string; language: string }) => void;
  isDarkMode?: boolean;
}

// Styled components using your CSS variable system
const StyledDialog = styled(Dialog)<{ isDarkMode: boolean }>(({ isDarkMode }) => ({
  '& .MuiDialog-paper': {
    backgroundColor: isDarkMode ? 'var(--card-background-color-dark-mode) !important' : 'white !important',
    color: isDarkMode ? 'var(--section-color-dark-mode)' : 'var(--section-color-light-mode)',
    borderRadius: '8px',
    borderLeft: 'var(--border-accent-width) solid var(--color-light-mode)',
    boxShadow: isDarkMode 
      ? '0 8px 16px rgba(0, 0, 0, 0.3)' 
      : '0 8px 16px rgba(0, 0, 0, 0.1)',
    maxWidth: '600px',
    width: '90%',
    maxHeight: '80vh',
    animation: 'cardFadeIn 0.3s ease forwards',
  },
  '& .MuiDialog-container': {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  '& .MuiBackdrop-root': {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
}));

const StyledTextField = styled(TextField)<{ isDarkMode: boolean }>(({ isDarkMode }) => ({
  '& .MuiOutlinedInput-root': {
    backgroundColor: isDarkMode ? 'var(--card-background-color-dark-mode)' : 'white',
    color: isDarkMode ? 'var(--section-color-dark-mode)' : 'var(--section-color-light-mode)',
    fontFamily: '"Fira Code", "Courier New", monospace',
    fontSize: '14px',
    transition: 'var(--standard-transition)',
    '& fieldset': {
      borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.23)' : 'rgba(0, 0, 0, 0.23)',
      transition: 'var(--standard-transition)',
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
  '& textarea': {
    fontFamily: '"Fira Code", "Courier New", monospace !important',
  },
}));

const StyledFormControl = styled(FormControl)<{ isDarkMode: boolean }>(({ isDarkMode }) => ({
  '& .MuiOutlinedInput-root': {
    backgroundColor: isDarkMode ? 'var(--card-background-color-dark-mode)' : 'white',
    color: isDarkMode ? 'var(--section-color-dark-mode)' : 'var(--section-color-light-mode)',
    transition: 'var(--standard-transition)',
    '& fieldset': {
      borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.23)' : 'rgba(0, 0, 0, 0.23)',
      transition: 'var(--standard-transition)',
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
  '& .MuiSelect-select': {
    color: isDarkMode ? 'var(--section-color-dark-mode)' : 'var(--section-color-light-mode)',
  },
  '& .MuiSelect-icon': {
    color: isDarkMode ? 'var(--section-color-dark-mode)' : 'var(--section-color-light-mode)',
  },
}));

const StyledButton = styled(Button)<{ isDarkMode: boolean; variant: 'outlined' | 'contained' }>(({ isDarkMode, variant }) => ({
  padding: '8px 16px',
  fontWeight: 600,
  fontSize: '0.875rem',
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

export const CodeBlockModal: React.FC<CodeBlockModalProps> = ({
  isOpen,
  onClose,
  onInsert,
  isDarkMode = false,
}) => {
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('javascript');

  // Language options
  const languages = [
    { value: 'javascript', label: 'JavaScript' },
    { value: 'typescript', label: 'TypeScript' },
    { value: 'python', label: 'Python' },
    { value: 'java', label: 'Java' },
    { value: 'cpp', label: 'C++' },
    { value: 'c', label: 'C' },
    { value: 'csharp', label: 'C#' },
    { value: 'php', label: 'PHP' },
    { value: 'ruby', label: 'Ruby' },
    { value: 'go', label: 'Go' },
    { value: 'rust', label: 'Rust' },
    { value: 'kotlin', label: 'Kotlin' },
    { value: 'swift', label: 'Swift' },
    { value: 'html', label: 'HTML' },
    { value: 'css', label: 'CSS' },
    { value: 'scss', label: 'SCSS' },
    { value: 'less', label: 'Less' },
    { value: 'json', label: 'JSON' },
    { value: 'xml', label: 'XML' },
    { value: 'yaml', label: 'YAML' },
    { value: 'markdown', label: 'Markdown' },
    { value: 'bash', label: 'Bash' },
    { value: 'sql', label: 'SQL' },
    { value: 'plaintext', label: 'Plain Text' },
  ];

  const handleInsert = () => {
    if (code.trim()) {
      onInsert({ code: code.trim(), language });
      handleClose();
    } else {
      alert('Please enter some code.');
    }
  };

  const handleClose = () => {
    setCode('');
    setLanguage('javascript');
    onClose();
  };

  const getSampleCode = (lang: string) => {
    const samples: Record<string, string> = {
      javascript: 'function greet(name) {\n  return `Hello, ${name}!`;\n}\n\nconsole.log(greet("World"));',
      typescript: 'interface User {\n  name: string;\n  age: number;\n}\n\nfunction greet(user: User): string {\n  return `Hello, ${user.name}!`;\n}',
      python: 'def greet(name):\n    return f"Hello, {name}!"\n\nprint(greet("World"))',
      java: 'public class HelloWorld {\n    public static void main(String[] args) {\n        System.out.println("Hello, World!");\n    }\n}',
      cpp: '#include <iostream>\n\nint main() {\n    std::cout << "Hello, World!" << std::endl;\n    return 0;\n}',
      html: '<!DOCTYPE html>\n<html lang="en">\n<head>\n    <meta charset="UTF-8">\n    <title>Hello World</title>\n</head>\n<body>\n    <h1>Hello, World!</h1>\n</body>\n</html>',
      css: '.container {\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  height: 100vh;\n}\n\n.greeting {\n  font-size: 2rem;\n  color: var(--color-light-mode);\n}',
      json: '{\n  "name": "John Doe",\n  "age": 30,\n  "city": "New York",\n  "skills": ["JavaScript", "React", "Node.js"]\n}',
    };
    return samples[lang] || '';
  };

  const insertSampleCode = () => {
    const sample = getSampleCode(language);
    if (sample) {
      setCode(sample);
    }
  };

  return (
    <StyledDialog
      open={isOpen}
      onClose={handleClose}
      isDarkMode={isDarkMode}
      maxWidth="md"
      fullWidth
      className={isDarkMode ? 'dark-mode' : ''}
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
          Insert Code Block
        </Typography>

        <Grid container sx={{ marginBottom: '16px' }}>
          <Grid size={{ xs: 12 }}>
            <StyledFormControl fullWidth size="small" isDarkMode={isDarkMode}>
              <InputLabel>Programming Language</InputLabel>
              <Select
                value={language}
                label="Programming Language"
                onChange={(e) => setLanguage(e.target.value)}
                MenuProps={{
                  PaperProps: {
                    sx: {
                      backgroundColor: isDarkMode ? 'var(--card-background-color-dark-mode)' : 'white',
                      color: isDarkMode ? 'var(--section-color-dark-mode)' : 'var(--section-color-light-mode)',
                      '& .MuiMenuItem-root': {
                        color: isDarkMode ? 'var(--section-color-dark-mode)' : 'var(--section-color-light-mode)',
                        transition: 'var(--standard-transition)',
                        '&:hover': {
                          backgroundColor: isDarkMode 
                            ? 'var(--section-stripe-background-dark-mode)' 
                            : 'var(--section-stripe-background-light-mode)',
                        },
                      },
                    },
                  },
                }}
              >
                {languages.map((lang) => (
                  <MenuItem key={lang.value} value={lang.value}>
                    {lang.label}
                  </MenuItem>
                ))}
              </Select>
            </StyledFormControl>
          </Grid>
        </Grid>

        <Grid container sx={{ marginBottom: '16px' }}>
          <Grid size={{ xs: 12 }} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              size="small"
              onClick={insertSampleCode}
              disabled={!getSampleCode(language)}
              sx={{
                color: 'var(--color-light-mode)',
                fontSize: '12px',
                textTransform: 'none',
                transition: 'var(--standard-transition)',
                '&:hover': {
                  backgroundColor: 'rgba(70, 191, 232, 0.1)',
                },
                '&:disabled': {
                  color: '#9ca3af',
                },
              }}
            >
              Insert Sample Code
            </Button>
          </Grid>
        </Grid>

        <Grid container sx={{ marginBottom: '16px' }}>
          <Grid size={{ xs: 12 }}>
            <StyledTextField
              fullWidth
              label="Code"
              placeholder="Enter your code here..."
              value={code}
              onChange={(e) => setCode(e.target.value)}
              isDarkMode={isDarkMode}
              variant="outlined"
              multiline
              rows={12}
              InputProps={{
                style: {
                  fontFamily: '"Fira Code", "Courier New", monospace',
                  fontSize: '14px',
                  lineHeight: '1.5',
                },
              }}
            />
          </Grid>
        </Grid>

        {/* Preview */}
        {code && (
          <Grid container sx={{ marginBottom: '16px', marginTop: '24px' }}> {/* Added marginTop for more space */}
            <Grid size={{ xs: 12 }}>
              <Typography 
                variant="body2"
                sx={{ 
                  display: 'block',
                  marginBottom: '16px', // Gap between Preview text and code box
                  fontSize: '14px',
                  fontWeight: 500,
                  color: isDarkMode ? 'var(--section-color-dark-mode)' : 'var(--section-color-light-mode)'
                }}
              >
                Preview
              </Typography>
              <div style={{ 
                overflow: 'hidden',
                backgroundColor: '#1e1e1e', // Black background
                boxShadow: 'none !important', // Force remove box shadow
                outline: 'none !important',   // Force remove outline
              }}>
                {/* Preview Header */}
                <div style={{
                  padding: '8px 12px',
                  backgroundColor: '#2d2d2d',
                  borderBottom: '1px solid #374151',
                  fontSize: '12px',
                  color: '#d4d4d4',
                  border: 'none !important',
                }}>
                  {language}
                </div>
                {/* Preview Content */}
                <div style={{
                  padding: '16px',
                  fontFamily: '"Fira Code", "Courier New", monospace',
                  fontSize: '14px',
                  lineHeight: '1.5',
                  color: '#d4d4d4',
                  backgroundColor: '#1e1e1e',
                  maxHeight: '200px',
                  overflow: 'auto',
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-word',
                  border: 'none !important',
                }}>
                  {code}
                </div>
              </div>
            </Grid>
          </Grid>
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
          disabled={!code.trim()}
          variant="contained"
          isDarkMode={isDarkMode}
        >
          Insert Code Block
        </StyledButton>
      </DialogActions>
    </StyledDialog>
  );
};