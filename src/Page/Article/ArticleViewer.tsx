import React, { useState, useEffect } from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Chip from '@mui/material/Chip';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
import Divider from '@mui/material/Divider';
import { useParams, useNavigate } from 'react-router-dom';
import { useTheme } from '../../themes/ThemeContext';
import { articleAPI } from '../../services/articleAPI';
import { Article } from '../../types/article';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PersonIcon from '@mui/icons-material/Person';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import UpdateIcon from '@mui/icons-material/Update';
import EditIcon from '@mui/icons-material/Edit';
import '../Css/Global.css';

const ArticleViewer: React.FC = () => {
  const { darkMode } = useTheme();
  const navigate = useNavigate();
  const { articleGuid } = useParams<{ articleGuid: string }>();
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchArticle = async () => {
      if (!articleGuid) {
        setError('Article ID is required');
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const response = await articleAPI.getArticleById(articleGuid);
        console.log('Article fetched:', response.data);
        setArticle(response.data);
      } catch (error: any) {
        console.error('Failed to fetch article:', error);
        setError(error.response?.data?.message || 'Failed to load article');
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [articleGuid]);

  const handleBack = () => {
    navigate('/articles');
  };

  const handleEdit = () => {
    if (articleGuid) {
      navigate(`/article/edit/${articleGuid}`);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <Box className={`home-container ${darkMode ? 'dark-mode' : ''}`}>
        <Container maxWidth="lg" className="article-viewer-container">
          <Box className="article-viewer-loading">
            <CircularProgress size={50} />
          </Box>
        </Container>
      </Box>
    );
  }

  if (error) {
    return (
      <Box className={`home-container ${darkMode ? 'dark-mode' : ''}`}>
        <Container maxWidth="lg" className="article-viewer-container">
          <Box className="article-viewer-error-container">
            <Button
              startIcon={<ArrowBackIcon />}
              onClick={handleBack}
              className={`article-viewer-back-button ${darkMode ? 'dark-mode' : ''}`}
            >
              Back to Articles
            </Button>
            
            <Alert severity="error" className="article-viewer-error-alert">
              {error}
            </Alert>
          </Box>
        </Container>
      </Box>
    );
  }

  if (!article) {
    return (
      <Box className={`home-container ${darkMode ? 'dark-mode' : ''}`}>
        <Container maxWidth="lg" className="article-viewer-container">
          <Box className="article-viewer-error-container">
            <Button
              startIcon={<ArrowBackIcon />}
              onClick={handleBack}
              className={`article-viewer-back-button ${darkMode ? 'dark-mode' : ''}`}
            >
              Back to Articles
            </Button>
            
            <Alert severity="warning" className="article-viewer-error-alert">
              Article not found
            </Alert>
          </Box>
        </Container>
      </Box>
    );
  }

  return (
    <Box className={`home-container ${darkMode ? 'dark-mode' : ''}`}>
      <Container maxWidth="lg" className="article-viewer-container">
        <Box className="article-viewer-content"> 
          <Box className="article-viewer-navigation" sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Button
              startIcon={<ArrowBackIcon />}
              onClick={handleBack}
              className={`article-viewer-back-button ${darkMode ? 'dark-mode' : ''}`}
            >
              Back to Articles List
            </Button>
            
            {/* Edit Button with same styling as Create Article button */}
            <Button
              size="large"
              variant="contained"
              startIcon={<EditIcon />}
              onClick={handleEdit}
              className="article-create-button"
            >
              Edit Article
            </Button>
          </Box>

          <Paper className={`article-viewer-paper ${darkMode ? 'dark-mode' : ''}`}>

            <Box className="article-viewer-header">
              <Typography
                variant="h3"
                component="h1"
                className="article-viewer-title"
              >
                {article.articleTitle || 'Untitled Article'}
              </Typography>

              <Box className="article-viewer-single-row">
                {article.articleTopic && (
                  <Typography variant="body2" className="article-viewer-topic-text">
                    {article.articleTopic}
                  </Typography>
                )}

                {/* Display Tags and Collection if available */}
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 1 }}>
                  {article.articleTags && (
                    <Chip
                      label={`Tags: ${article.articleTags}`}
                      size="small"
                      color="primary"
                      variant="outlined"
                    />
                  )}
                  {article.articleCollection && (
                    <Chip
                      label={`Collection: ${article.articleCollection}`}
                      size="small"
                      color="secondary"
                      variant="outlined"
                    />
                  )}
                </Box>

                <Box className={`article-viewer-metadata-inline ${darkMode ? 'dark-mode' : ''}`}>
                  {article.articleAuthor && (
                    <Box className="article-viewer-metadata-item">
                      <PersonIcon className="article-viewer-metadata-icon" />
                      <Typography variant="body2" className="article-viewer-metadata-text">
                        {article.articleAuthor}
                      </Typography>
                    </Box>
                  )}
                  
                  <Box className="article-viewer-metadata-item">
                    <AccessTimeIcon className="article-viewer-metadata-icon" />
                    <Typography variant="body2" className="article-viewer-metadata-text">
                      Created: {formatDate(article.articleCreated)}
                    </Typography>
                  </Box>
                  
                  {article.articleUpdated && (
                    <Box className="article-viewer-metadata-item">
                      <UpdateIcon className="article-viewer-metadata-icon" />
                      <Typography variant="body2" className="article-viewer-metadata-text">
                        Updated: {formatDate(article.articleUpdated)}
                      </Typography>
                    </Box>
                  )}
                </Box>
              </Box>
            </Box>

            <Divider className={`article-viewer-divider ${darkMode ? 'dark-mode' : ''}`} />

            <Box className={`article-viewer-body-content ${darkMode ? 'dark-mode' : ''}`}>
              {article.articleHtml ? (
                <div 
                  dangerouslySetInnerHTML={{ __html: article.articleHtml }}
                />
              ) : (
                <Typography
                  variant="body1"
                  className="article-viewer-plain-text"
                >
                  {article.articlePlain || 'No content available'}
                </Typography>
              )}
            </Box>
          </Paper>
        
        </Box>
      </Container>
    </Box>
  );
};

export default ArticleViewer;