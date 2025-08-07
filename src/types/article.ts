
export interface Article {
  articleGuid: string;
  articleTopic: string | null;
  articleSubTopic: string | null;
  articleTitle: string | null;
  articleAuthor: string | null;
  articleCreated: string;
  articleTags: string | null;
  articleCollection: string | null;
  articleJson?: string | null;    
  articlePlain?: string | null;   
  articleHtml?: string | null;    
  articleUpdated?: string | null;
  articleTag?: string | null;
}

export interface ArticleCreateRequest {
  articleGuid: string | null;    
  articleTopic: string | null;
  articleSubTopic: string | null;
  articleTitle: string | null;
  articleJson: string | null;
  articlePlain: string | null;
  articleHtml: string | null;
  articleTags?: string | null;      // New field
  articleCollection?: string | null; // New field
}

export interface ArticleListResponse {
  page: number;
  pageSize: number;
  totalData: number;
  message: string | null;
  data: Article[] | null;
}

export interface ArticleFilters {
  page?: number;
  pageSize?: number;
  search?: string;
  author?: string;
  topic?: string;
  subTopic?: string;
  tags?: string;         
  collection?: string;   
}