import React, { useState, useEffect } from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import Pagination from '@mui/material/Pagination';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
import Chip from '@mui/material/Chip';
import IconButton from '@mui/material/IconButton';
import { useNavigate, Link } from 'react-router-dom';
import { useTheme } from '../../themes/ThemeContext';
import { articleAPI } from '../../services/articleAPI';
import { Article, ArticleFilters } from '../../types/article';
import ArticleIcon from '@mui/icons-material/Article';
import ShareIcon from '@mui/icons-material/Share';
import '../Css/Global.css';

interface ArticleListProps {
  showCreateButton?: boolean;
}

const ArticleList: React.FC<ArticleListProps> = ({ showCreateButton = true }) => {
  const { darkMode } = useTheme();
  const navigate = useNavigate();
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<ArticleFilters>({
    page: 1,
    pageSize: 10
  });
  const [totalPages, setTotalPages] = useState<number>(1);

  const fetchArticles = async (currentFilters: ArticleFilters) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await articleAPI.getAllArticles(currentFilters);
      console.log('Articles fetched:', response.data);
      
      setArticles(response.data.data || []);
      setTotalPages(Math.ceil((response.data.totalData || 0) / (currentFilters.pageSize || 10)));
    } catch (error: any) {
      console.error('Failed to fetch articles:', error);
      setError(error.response?.data?.message || 'Failed to load articles');
      setArticles([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles(filters);
  }, [filters.page, filters.pageSize]);

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setFilters(prev => ({ ...prev, page: value }));
  };

  const handleViewArticle = (articleGuid: string) => {
    navigate(`/article/view/${articleGuid}`);
  };

  const handleCreateNew = () => {
    navigate('/lexical');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const handleShare = (articleGuid: string) => {
    console.log('Share article:', articleGuid);
  };

  return (
    <Box className={`home-container ${darkMode ? 'dark-mode' : ''}`}>
      <Container maxWidth="xl" className="article-list-container">
        <Box className="article-list-content">
          
          <Box className="article-list-header">
            <Typography variant="h4" component="h1" className="article-list-title">
              IE-Articles
            </Typography>
            
            {showCreateButton && (
              <Button
                size="large"
                variant="contained"
                component={Link}
                to="/text-editor"
                className="article-create-button"
              >
                Create New Article
              </Button>
            )}
          </Box>

          {error && (
            <Alert severity="error" className="article-error-alert">
              {error}
            </Alert>
          )}

          {loading && (
            <Box className="article-loading-container">
              <CircularProgress />
            </Box>
          )}

          {!loading && (
            <>
              {articles.length === 0 ? (
                <Box className={`article-empty-state ${darkMode ? 'dark-mode' : ''}`}>
                  <Typography variant="h6" className="article-empty-title">
                    No Articles Found
                  </Typography>
                  <Typography variant="body2" className="article-empty-subtitle">
                    Be the first to create an article!
                  </Typography>
                </Box>
              ) : (
                <Grid container spacing={3}>
                  {articles.map((article) => (
                    <Grid size={{ xs: 12, md: 6, lg: 4 }} key={article.articleGuid}>
                      <Card 
                        className={`article-card ${darkMode ? 'dark-mode' : ''}`}
                        elevation={0}
                        variant="outlined"
                      >
                        {/* Card Header with Icon */}
                        <Box className="article-card-header">
                          <Box className="article-card-icon">
                            <ArticleIcon />
                          </Box>
                          <Box className="article-card-title-section">
                            <Typography
                              variant="h6"
                              component="h3"
                              className="article-card-title"
                            >
                              {article.articleTitle || 'Untitled Article'}
                            </Typography>
                            <Typography
                              variant="body2"
                              className="article-card-author"
                            >
                              {article.articleAuthor || 'Unknown Author'}
                            </Typography>
                          </Box>
                        </Box>

                        <Box className="article-card-content-wrapper">
                          {article.articleTopic && (
                            <Box className="article-topic-container">
                              <Chip
                                label={article.articleTopic}
                                size="small"
                                className="article-topic-chip"
                              />
                            </Box>
                          )}

                          <Typography variant="caption" className="article-date-info">
                            Created {formatDate(article.articleCreated)}
                          </Typography>
                        </Box>

                        <Box className="article-card-metadata">
                          <Box className="article-metadata-left">
                            <Button
                              size="small"
                              component={Link}
                              to={`/article/view/${article.articleGuid}`}
                              className="article-access-button"
                              onMouseDown={(e) => {
                                // Handle middle-click (wheel click)
                                if (e.button === 1) {
                                  e.preventDefault();
                                  window.open(`/article/view/${article.articleGuid}`, '_blank');
                                }
                              }}
                              onContextMenu={(e) => {

                              }}
                            >
                              Read the article
                            </Button>
                          </Box>

                          <Box className="article-metadata-right">
                            <IconButton
                              size="small"
                              onClick={() => handleShare(article.articleGuid)}
                              className="article-action-icon"
                            >
                              <ShareIcon className="article-action-icon" />
                            </IconButton>
                          </Box>
                        </Box>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              )}

              {totalPages > 1 && (
                <Box className="article-pagination-container">
                  <Pagination
                    count={totalPages}
                    page={filters.page}
                    onChange={handlePageChange}
                    color="primary"
                    size="large"
                    className={`article-pagination ${darkMode ? 'dark-mode' : ''}`}
                  />
                </Box>
              )}
            </>
          )}
        </Box>
      </Container>
    </Box>
  );
};

export default ArticleList;