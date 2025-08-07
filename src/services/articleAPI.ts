import api from './api';
import { AxiosResponse } from 'axios';
import { Article, ArticleCreateRequest, ArticleListResponse, ArticleFilters } from '../types/article';

export const articleAPI = {
  getAllArticles: (filters?: ArticleFilters): Promise<AxiosResponse<ArticleListResponse>> => {
    console.log('Fetching articles with filters:', filters);
    
    const params = {
      page: filters?.page || 1,
      ...(filters?.topic && { topic: filters.topic }),
      ...(filters?.subTopic && { subtopic: filters.subTopic }) 
    };

    return api.get('/api/article/list', { params });
  },

  createArticle: (articleData: {
    title: string;
    topic?: string;
    subTopic?: string;
    tags?: string;
    collection?: string;
    content: {
      json: string;
      html: string;
      plainText: string;
    };
  }): Promise<AxiosResponse<string>> => {
    console.log('Creating new article:', articleData.title);
    
    const payload: ArticleCreateRequest = {
      articleGuid: null, 
      articleTitle: articleData.title,
      articleTopic: articleData.topic || null,
      articleSubTopic: articleData.subTopic || null,
      articleJson: articleData.content.json,
      articleHtml: articleData.content.html,
      articlePlain: articleData.content.plainText,
      articleTags: articleData.tags || null,
      articleCollection: articleData.collection || null,
    };

    return api.post('/api/article/new', payload);
  },

  getArticleById: async (articleGuid: string): Promise<AxiosResponse<Article>> => {
    console.log('Fetching article:', articleGuid);
    
    try {
      const response = await api.get('/api/article/guid', { 
        params: { 
          articleGuid: articleGuid
        } 
      });
      
      // The API now returns a single object, not an array
      const articleData = response.data;
      
      if (!articleData || !articleData.articleGuid) {
        throw new Error('Article not found');
      }
      
      // Merge the main article data with the nested articleBody content
      const article: Article = {
        articleGuid: articleData.articleGuid,
        articleTitle: articleData.articleTitle,
        articleTopic: articleData.articleTopic,
        articleSubTopic: articleData.articleSubTopic,
        articleAuthor: articleData.articleAuthor,
        articleCreated: articleData.articleCreated,
        articleTags: articleData.articleTags,
        articleCollection: articleData.articleCollection,
        // Extract content from nested articleBody
        articleJson: articleData.articleBody?.articleJson || null,
        articleHtml: articleData.articleBody?.articleHtml || null,
        articlePlain: articleData.articleBody?.articlePlain || null,
        articleUpdated: articleData.articleBody?.articleUpdated || null,
      };
      
      return {
        ...response,
        data: article
      } as AxiosResponse<Article>;
      
    } catch (error) {
      console.error('Error fetching article by ID:', error);
      throw error;
    }
  },

  updateArticle: (articleGuid: string, articleData: {
    title: string;
    topic?: string;
    subTopic?: string;
    tags?: string;
    collection?: string;
    content: {
      json: string;
      html: string;
      plainText: string;
    };
  }): Promise<AxiosResponse<string>> => {
    console.log('Updating article:', articleGuid);
    
    const payload: ArticleCreateRequest = {
      articleGuid: articleGuid,
      articleTitle: articleData.title,
      articleTopic: articleData.topic || null,
      articleSubTopic: articleData.subTopic || null,
      articleJson: articleData.content.json,
      articleHtml: articleData.content.html,
      articlePlain: articleData.content.plainText,
      articleTags: articleData.tags || null,
      articleCollection: articleData.collection || null,
    };

    return api.put('/api/article/edit', payload);
  },

  deleteArticle: (articleGuid: string): Promise<AxiosResponse<void>> => {
    console.log('Deleting article:', articleGuid);
    return Promise.reject(new Error('Delete functionality not yet implemented by backend.'));
  }
};