// utils/contentUtils.ts

export const createContentFromText = (plainText: string) => {
  // Convert plain text to the required format for your API
  const htmlContent = plainText
    .split('\n')
    .map(line => line.trim() ? `<p>${line}</p>` : '<br>')
    .join('');
  
  // Create a simple JSON structure for Lexical editor
  const paragraphs = plainText.split('\n').map(line => ({
    children: line.trim() ? [
      {
        detail: 0,
        format: 0,
        mode: "normal",
        style: "",
        text: line,
        type: "text",
        version: 1
      }
    ] : [],
    direction: "ltr",
    format: "",
    indent: 0,
    type: "paragraph",
    version: 1
  }));

  const jsonContent = JSON.stringify({
    root: {
      children: paragraphs,
      direction: "ltr",
      format: "",
      indent: 0,
      type: "root",
      version: 1
    }
  });

  return {
    json: jsonContent,
    html: htmlContent,
    plainText: plainText
  };
};

export const extractPlainTextFromContent = (article: any): string => {
  // Try to extract plain text from different possible sources
  if (article.articlePlain) {
    return article.articlePlain;
  }
  
  if (article.articleHtml) {
    // Strip HTML tags to get plain text
    return article.articleHtml
      .replace(/<p>/g, '')
      .replace(/<\/p>/g, '\n')
      .replace(/<br\s*\/?>/g, '\n')
      .replace(/<[^>]*>/g, '')
      .replace(/\n+/g, '\n')
      .trim();
  }
  
  if (article.articleJson) {
    try {
      const jsonContent = JSON.parse(article.articleJson);
      // Extract text from Lexical JSON structure
      const extractTextFromNode = (node: any): string => {
        if (node.text) return node.text;
        if (node.children && Array.isArray(node.children)) {
          return node.children.map(extractTextFromNode).join('');
        }
        return '';
      };
      
      if (jsonContent.root && jsonContent.root.children) {
        return jsonContent.root.children
          .map(extractTextFromNode)
          .join('\n')
          .trim();
      }
    } catch (e) {
      console.warn('Could not parse article JSON:', e);
    }
  }
  
  return '';
};

export const validateContentData = (content: {
  json: string;
  html: string;
  plainText: string;
}): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (!content.plainText || content.plainText.trim().length === 0) {
    errors.push('Article content cannot be empty');
  }
  
  if (content.plainText && content.plainText.length > 50000) {
    errors.push('Article content is too long (maximum 50,000 characters)');
  }
  
  try {
    if (content.json) {
      JSON.parse(content.json);
    }
  } catch (e) {
    errors.push('Invalid JSON content format');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};