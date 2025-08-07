// Updated LexicalPlayground.tsx with both Create and Edit functionality - No Tags/Collection
import React, { useState, useEffect } from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import Snackbar from '@mui/material/Snackbar';
import CircularProgress from '@mui/material/CircularProgress';
import { useNavigate, useParams } from 'react-router-dom';
import { LexicalEditor } from './LexicalEditor';
import { LexicalOutputData } from '../../types/lexical';
import { useTheme } from './../../themes/ThemeContext';
import { articleAPI } from '../../services/articleAPI';
import { handleApiError } from './../../../utils/errorHandler';
import { extractPlainTextFromContent, validateContentData } from './../../../utils/contentUtils';
import PreviewIcon from '@mui/icons-material/Preview';
import SaveIcon from '@mui/icons-material/Save';
import EditIcon from '@mui/icons-material/Edit';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PreviewModal from './PreviewModal';
import '../Css/Global.css';

interface LexicalPlaygroundProps {
  isDarkMode?: boolean;
}

const LexicalPlayground: React.FC<LexicalPlaygroundProps> = ({ 
  isDarkMode = false 
}) => {
  const { darkMode } = useTheme();
  const navigate = useNavigate();
  const { articleGuid } = useParams();
  
  // Check if we're in edit mode
  const isEditMode = !!articleGuid;
  
  const [outputData, setOutputData] = useState<LexicalOutputData>({
    json: '',
    html: '',
    plainText: ''
  });
  
  // Form fields - only title, topic, subTopic
  const [formData, setFormData] = useState({
    title: '',
    topic: '',
    subTopic: ''
  });
  
  // Loading and error states
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string>('');
  const [showSuccess, setShowSuccess] = useState(false);
  
  // Validation errors for individual fields
  const [fieldErrors, setFieldErrors] = useState<{[key: string]: string}>({});
  
  // State for controlling the preview modal
  const [previewOpen, setPreviewOpen] = useState(false);

  // Load article if editing
  useEffect(() => {
    if (isEditMode && articleGuid) {
      loadArticle(articleGuid);
    }
  }, [articleGuid, isEditMode]);

  const loadArticle = async (guid: string) => {
    try {
      setIsLoading(true);
      setErrorMessage('');
      
      const response = await articleAPI.getArticleById(guid);
      const article = response.data;
      
      console.log('Loaded article for editing:', article);
      
      // Set form data - only 3 fields
      setFormData({
        title: article.articleTitle || '',
        topic: article.articleTopic || '',
        subTopic: article.articleSubTopic || ''
      });
      
      // Extract and set content
      const plainText = extractPlainTextFromContent(article);
      setOutputData({
        json: article.articleJson || '',
        html: article.articleHtml || '',
        plainText: plainText
      });
      
    } catch (error) {
      console.error('Failed to load article:', error);
      const errorMsg = handleApiError(error);
      setErrorMessage(`Failed to load article: ${errorMsg}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    if (isEditMode) {
      navigate(`/article/view/${articleGuid}`);
    } else {
      navigate('/articles');
    }
  };

  const handlePreviewClick = () => {
    console.log('=== DEBUG INFO ===');
    console.log('HTML Output:', outputData.html);
    console.log('Plain Text:', outputData.plainText);
    console.log('JSON Output:', outputData.json);
    console.log('=================');
    
    setPreviewOpen(true);
  };

  const handlePreviewClose = () => {
    setPreviewOpen(false);
  };

  // Handle form field changes
  const handleFormChange = (field: keyof typeof formData) => (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear field error when user starts typing
    if (fieldErrors[field]) {
      setFieldErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
    
    // Clear general error message
    if (errorMessage) {
      setErrorMessage('');
    }
  };

  // Validate form fields
  const validateForm = (): boolean => {
    const errors: {[key: string]: string} = {};
    
    // Title validation
    if (!formData.title.trim()) {
      errors.title = 'Article title is required';
    } else if (formData.title.length > 255) {
      errors.title = 'Title must be less than 255 characters';
    }
    
    // Topic validation
    if (formData.topic && formData.topic.length > 100) {
      errors.topic = 'Topic must be less than 100 characters';
    }
    
    // SubTopic validation
    if (formData.subTopic && formData.subTopic.length > 100) {
      errors.subTopic = 'SubTopic must be less than 100 characters';
    }
    
    // Content validation
    if (!outputData.plainText.trim()) {
      errors.content = 'Article content is required';
    } else {
      const contentValidation = validateContentData(outputData);
      if (!contentValidation.isValid) {
        errors.content = contentValidation.errors.join(', ');
      }
    }
    
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle save/update article
  const handleSaveArticle = async () => {
    // Clear previous messages
    setErrorMessage('');
    setSuccessMessage('');
    
    // Validate form
    if (!validateForm()) {
      setErrorMessage('Please fix the validation errors below');
      return;
    }

    setIsSaving(true);
    try {
      const articleData = {
        title: formData.title.trim(),
        topic: formData.topic.trim() || undefined,
        subTopic: formData.subTopic.trim() || undefined,
        content: {
          json: outputData.json,
          html: outputData.html,
          plainText: outputData.plainText.trim()
        }
      };

      let response;
      if (isEditMode && articleGuid) {
        // Update existing article
        response = await articleAPI.updateArticle(articleGuid, articleData);
        setSuccessMessage('Article updated successfully!');
      } else {
        // Create new article
        response = await articleAPI.createArticle(articleData);
        setSuccessMessage('Article created successfully!');
      }

      console.log('Article saved successfully:', response.data);
      setShowSuccess(true);
      
      // Clear form only if creating new article
      if (!isEditMode) {
        setFormData({ title: '', topic: '', subTopic: '' });
        setOutputData({ json: '', html: '', plainText: '' });
      }
      
      // Navigate back after delay
      setTimeout(() => {
        if (isEditMode) {
          navigate(`/article/view/${articleGuid}`);
        } else {
          navigate('/articles');
        }
      }, 2000);
      
    } catch (error) {
      console.error('Failed to save article:', error);
      const errorMsg = handleApiError(error);
      setErrorMessage(errorMsg);
    } finally {
      setIsSaving(false);
    }
  };

  const clearError = () => {
    setErrorMessage('');
    setFieldErrors({});
  };

  // Show loading spinner while loading article
  if (isLoading) {
    return (
      <Box className={`home-container ${darkMode ? 'dark-mode' : ''}`}>
        <Container maxWidth="xl" sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
          <CircularProgress size={40} />
        </Container>
      </Box>
    );
  }

  return (
    <Box className={`home-container ${darkMode ? 'dark-mode' : ''}`}>
      <Container 
        maxWidth="xl"
        sx={{
          padding: '24px',
          paddingBottom: '16px',
          marginTop: 0,
          paddingTop: '10px',
          overflow: 'visible',
          position: 'relative',
          zIndex: 1
        }}
      >
        <Box 
          sx={{ 
            padding: '20px 0',
            paddingBottom: '0px',
            color: darkMode 
              ? 'var(--section-color-dark-mode)' 
              : 'var(--section-color-light-mode)',
            minHeight: 'auto',
            transition: 'var(--standard-transition)',
            position: 'relative',
            zIndex: 1,
            overflow: 'visible'
          }}
        >
          <Grid container spacing={3}>
            {/* Header Section */}
            <Grid size={{ xs: 12 }}>
              <Box 
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '32px',
                  marginTop: '40px',
                  position: 'relative',
                  zIndex: 1000,
                  overflow: 'visible',
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  {/* Back Button */}
                  <Button
                    startIcon={<ArrowBackIcon />}
                    onClick={handleBack}
                    sx={{
                      color: darkMode ? '#ffffff' : '#333333',
                      '&:hover': {
                        backgroundColor: darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
                      },
                    }}
                  >
                    Back
                  </Button>
                  
                  <Typography 
                    variant="h4" 
                    component="h1"
                    className={`lexical-editor-title ${darkMode ? 'dark-mode' : ''}`}
                    sx={{
                      fontWeight: 700,
                      lineHeight: '1.2',
                      fontSize: '2.125rem',
                      margin: 0,
                    }}
                  >
                    {isEditMode ? 'Edit Article' : 'Create New Article'}
                  </Typography>
                </Box>
                
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <Button
                    size="large"
                    variant="contained"
                    startIcon={<PreviewIcon />}
                    onClick={handlePreviewClick}
                    disabled={!outputData.html}
                    sx={{
                      backgroundColor: 'var(--primary-button-color)',
                      color: 'white',
                      boxShadow: 'var(--button-shadow)',
                      transition: 'var(--standard-transition)',
                      '&:hover': {
                        backgroundColor: 'var(--primary-button-hover)',
                        boxShadow: 'var(--button-shadow-hover)',
                      },
                      '&:disabled': {
                        backgroundColor: darkMode 
                          ? 'var(--section-stripe-background-dark-mode)' 
                          : 'var(--section-stripe-background-light-mode)',
                        color: darkMode 
                          ? 'var(--color-dark-mode)' 
                          : '#9ca3af',
                      },
                    }}
                  >
                    Preview
                  </Button>

                  <Button
                    size="large"
                    variant="contained"
                    startIcon={isSaving ? <CircularProgress size={20} color="inherit" /> : (isEditMode ? <EditIcon /> : <SaveIcon />)}
                    onClick={handleSaveArticle}
                    disabled={!formData.title.trim() || !outputData.plainText.trim() || isSaving}
                    sx={{
                      backgroundColor: isEditMode ? '#2563eb' : '#4caf50',
                      color: 'white',
                      boxShadow: isEditMode ? '0 2px 4px rgba(37, 99, 235, 0.3)' : '0 2px 4px rgba(76, 175, 80, 0.3)',
                      transition: 'var(--standard-transition)',
                      '&:hover': {
                        backgroundColor: isEditMode ? '#1d4ed8' : '#45a049',
                        boxShadow: isEditMode ? '0 4px 8px rgba(37, 99, 235, 0.4)' : '0 4px 8px rgba(76, 175, 80, 0.4)',
                      },
                      '&:disabled': {
                        backgroundColor: darkMode 
                          ? 'var(--section-stripe-background-dark-mode)' 
                          : 'var(--section-stripe-background-light-mode)',
                        color: darkMode 
                          ? 'var(--color-dark-mode)' 
                          : '#9ca3af',
                      },
                    }}
                  >
                    {isSaving ? 'Saving...' : (isEditMode ? 'Update Article' : 'Save Article')}
                  </Button>
                </Box>
              </Box>
            </Grid>

            {/* Error Alert */}
            {errorMessage && (
              <Grid size={{ xs: 12 }}>
                <Alert 
                  severity="error" 
                  onClose={clearError}
                  sx={{ mb: 2 }}
                >
                  <AlertTitle>Save Failed</AlertTitle>
                  {errorMessage}
                </Alert>
              </Grid>
            )}

            <Snackbar
              open={showSuccess}
              autoHideDuration={6000}
              onClose={() => setShowSuccess(false)}
              anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
              sx={{
                marginTop: '50px',
                zIndex: 9999,
              }}
            >
              <Alert 
                onClose={() => setShowSuccess(false)} 
                severity="success"
                sx={{ width: '100%' }}
              >
                {successMessage}
              </Alert>
            </Snackbar>

            {/* Form Fields Section - Only Title, Topic, SubTopic */}
            <Grid size={{ xs: 12 }}>
              <Box 
                sx={{
                  marginBottom: '8px',
                  padding: '20px',
                  backgroundColor: darkMode 
                    ? 'var(--card-background-color-dark-mode)' 
                    : 'white',
                  borderRadius: '8px',
                  border: `1px solid ${darkMode ? '#374151' : '#e0e0e0'}`,
                  transition: 'var(--standard-transition)',
                  boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
                }}
              >
                <Box component="form" className="lexical-editor-form">
                  <Grid container spacing={2}>
                    {/* Title Field - Full Width */}
                    <Grid size={{ xs: 12 }}>
                      <Box className="form-field">
                        <TextField
                          required
                          fullWidth
                          id="article-title"
                          label="Article Title"
                          name="title"
                          autoComplete="title"
                          value={formData.title}
                          onChange={handleFormChange('title')}
                          error={!!fieldErrors.title}
                          helperText={fieldErrors.title}
                          size="small"
                          className={`input-field ${darkMode ? 'dark-mode' : ''}`}
                          placeholder="Enter the article title"
                        />
                      </Box>
                    </Grid>

                    {/* Topic and SubTopic Fields - Side by Side */}
                    <Grid size={{ xs: 12, md: 6 }}>
                      <Box className="form-field">
                        <TextField
                          fullWidth
                          id="article-topic"
                          label="Topic"
                          name="topic"
                          autoComplete="topic"
                          value={formData.topic}
                          onChange={handleFormChange('topic')}
                          error={!!fieldErrors.topic}
                          helperText={fieldErrors.topic}
                          size="small"
                          className={`input-field ${darkMode ? 'dark-mode' : ''}`}
                          placeholder="e.g., Technology, News, Tutorial"
                        />
                      </Box>
                    </Grid>

                    <Grid size={{ xs: 12, md: 6 }}>
                      <Box className="form-field">
                        <TextField
                          fullWidth
                          id="article-subtopic"
                          label="SubTopic"
                          name="subTopic"
                          autoComplete="subtopic"
                          value={formData.subTopic}
                          onChange={handleFormChange('subTopic')}
                          error={!!fieldErrors.subTopic}
                          helperText={fieldErrors.subTopic}
                          size="small"
                          className={`input-field ${darkMode ? 'dark-mode' : ''}`}
                          placeholder="e.g., work cell, keysight"
                        />
                      </Box>
                    </Grid>
                  </Grid>
                </Box>
              </Box>
            </Grid>

            {/* Content Error */}
            {fieldErrors.content && (
              <Grid size={{ xs: 12 }}>
                <Alert severity="error" sx={{ mb: 2 }}>
                  {fieldErrors.content}
                </Alert>
              </Grid>
            )}

            {/* Editor Section */}
            <Grid size={{ xs: 12 }}>
              <Box 
                sx={{
                  marginBottom: '0px',
                  marginTop: '-10px',
                  position: 'relative',
                  zIndex: 1,
                  overflow: 'visible',
                  clear: 'both'
                }}
              >
                <LexicalEditor
                  config={{
                    namespace: 'Playground',
                  }}
                  onChange={setOutputData}
                  isDarkMode={darkMode}
                  initialValue={isEditMode ? outputData.json : undefined}
                  style={{
                    position: 'relative',
                    zIndex: 1,
                    overflow: 'visible',
                    marginBottom: '0px'
                  }}
                />
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Container>

      {/* Preview Modal */}
      <PreviewModal
        open={previewOpen}
        onClose={handlePreviewClose}
        html={outputData.html}
        plainText={outputData.plainText}
        json={outputData.json}
      />
    </Box>
  );
};

export default LexicalPlayground;