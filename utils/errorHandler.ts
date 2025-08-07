// utils/errorHandler.ts
export const handleApiError = (error: any): string => {
  if (error.response) {
    const status = error.response.status;
    const responseData = error.response.data;
    
    // Log detailed error for debugging
    console.error('API Error Details:', {
      status,
      data: responseData,
      headers: error.response.headers,
      url: error.config?.url
    });
    
    switch (status) {
      case 400:
        // Try to extract meaningful validation messages
        if (responseData?.message) {
          return responseData.message;
        }
        if (responseData?.errors) {
          if (Array.isArray(responseData.errors)) {
            return `Validation errors: ${responseData.errors.join(', ')}`;
          }
          if (typeof responseData.errors === 'object') {
            const errorMessages = Object.entries(responseData.errors)
              .map(([field, messages]) => {
                const msgArray = Array.isArray(messages) ? messages : [messages];
                return `${field}: ${msgArray.join(', ')}`;
              });
            return `Validation errors: ${errorMessages.join('; ')}`;
          }
        }
        if (responseData?.error) {
          return responseData.error;
        }
        return 'Please check all required fields are filled correctly.';
        
      case 401:
        return 'Session expired. Please log in again.';
        
      case 403:
        return 'You do not have permission to perform this action.';
        
      case 404:
        return 'The requested resource was not found.';
        
      case 413:
        return 'The content is too large. Please reduce the size.';
        
      case 422:
        return 'The data provided is invalid. Please check your input.';
        
      case 429:
        return 'Too many requests. Please wait a moment and try again.';
        
      case 500:
        return 'Server error. Please try again later.';
        
      case 503:
        return 'Service temporarily unavailable. Please try again later.';
        
      default:
        return responseData?.message || `Error ${status}: Something went wrong`;
    }
  }
  
  if (error.request) {
    return 'Unable to connect to server. Please check your internet connection.';
  }
  
  return error.message || 'An unexpected error occurred.';
};