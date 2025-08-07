import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import { LexicalOutputData } from '../../types/lexical';

interface LexicalOutputDisplayProps {
  data: LexicalOutputData;
  showJson?: boolean;
  showHtml?: boolean;
  showPlainText?: boolean;
  className?: string;
  isDarkMode?: boolean;
}

export const LexicalOutputDisplay: React.FC<LexicalOutputDisplayProps> = ({
  data,
  showJson = true,
  showHtml = true,
  showPlainText = true,
  className,
  isDarkMode = false,
}) => {
  // Format JSON with proper indentation and truncate long data URLs
  const formatJson = (jsonString: string): string => {
    if (!jsonString) return '';
    try {
      const parsed = JSON.parse(jsonString);
      
      // Function to truncate long data URLs for better readability
      const truncateDataUrls = (obj: any): any => {
        if (typeof obj === 'string' && obj.startsWith('data:image/')) {
          const commaIndex = obj.indexOf(',');
          if (commaIndex !== -1 && obj.length > 100) {
            const prefix = obj.substring(0, commaIndex + 1);
            const suffix = obj.substring(obj.length - 20);
            return `${prefix}...[${obj.length - commaIndex - 1} chars]...${suffix}`;
          }
        } else if (typeof obj === 'object' && obj !== null) {
          if (Array.isArray(obj)) {
            return obj.map(truncateDataUrls);
          } else {
            const result: any = {};
            for (const [key, value] of Object.entries(obj)) {
              result[key] = truncateDataUrls(value);
            }
            return result;
          }
        }
        return obj;
      };
      
      const truncatedParsed = truncateDataUrls(parsed);
      return JSON.stringify(truncatedParsed, null, 2);
    } catch (error) {
      return jsonString;
    }
  };

  const outputs = [
    { 
      key: 'json', 
      label: 'JSON Output (for editor)', 
      value: formatJson(data.json),
      show: showJson,
      language: 'json'
    },
    { 
      key: 'html', 
      label: 'HTML Output (for search)', 
      value: data.html, 
      show: showHtml,
      language: 'html'
    },
    { 
      key: 'plainText', 
      label: 'Plain Text (for indexing)', 
      value: data.plainText, 
      show: showPlainText,
      language: 'text'
    },
  ].filter(output => output.show);

  return (
    // Use MUI Grid v2 for responsive layout, but keep your CSS classes for styling
    <Box className={`output-panels-container ${isDarkMode ? 'dark-mode' : ''} ${className || ''}`}>
      <Grid container spacing={2}>
        {outputs.map(({ key, label, value, language }) => (
          <Grid size={{ xs: 12, md: 6, lg: 4 }} key={key}>
            <Typography 
              variant="subtitle2" 
              className={isDarkMode ? 'dark-mode' : ''}
              sx={{ 
                fontWeight: 600, 
                mb: 1,
                // Let CSS handle the color
                color: 'inherit'
              }}
            >
              {label}
            </Typography>
            {/* Keep your existing CSS classes */}
            <div className={`output-panel ${isDarkMode ? 'dark-mode' : ''}`}>
              <div className={`output-panel-header ${isDarkMode ? 'dark-mode' : ''}`}>
                {language.toUpperCase()}
              </div>
              <pre className={`output-panel-content ${isDarkMode ? 'dark-mode' : ''}`}>
                {value || '(empty)'}
              </pre>
            </div>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};