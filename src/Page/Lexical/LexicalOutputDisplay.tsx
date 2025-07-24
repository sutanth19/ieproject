import React from 'react';
import { LexicalOutputData } from '../../types/lexical';

interface LexicalOutputDisplayProps {
  data: LexicalOutputData;
  showJson?: boolean;
  showHtml?: boolean;
  showPlainText?: boolean;
  className?: string;
}

export const LexicalOutputDisplay: React.FC<LexicalOutputDisplayProps> = ({
  data,
  showJson = true,
  showHtml = true,
  showPlainText = true,
  className,
}) => {
  // Format JSON with proper indentation
  const formatJson = (jsonString: string): string => {
    if (!jsonString) return '';
    try {
      const parsed = JSON.parse(jsonString);
      return JSON.stringify(parsed, null, 2); // 2 spaces indentation
    } catch (error) {
      return jsonString; // Return original if parsing fails
    }
  };

  const outputs = [
    { 
      key: 'json', 
      label: 'JSON Output (for editor)', 
      value: formatJson(data.json), // Format the JSON
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
    <div className={className} style={{ display: 'grid', gridTemplateColumns: `repeat(${outputs.length}, 1fr)`, gap: '16px' }}>
      {outputs.map(({ key, label, value, language }) => (
        <div key={key}>
          <h3 style={{ 
            fontSize: '14px', 
            fontWeight: '600', 
            marginBottom: '8px',
            color: '#374151'
          }}>
            {label}
          </h3>
          <div style={{
            border: '1px solid #d1d5db',
            borderRadius: '6px',
            overflow: 'hidden',
            backgroundColor: '#f8fafc'
          }}>
            <div style={{
              backgroundColor: '#e5e7eb',
              padding: '8px 12px',
              fontSize: '12px',
              fontWeight: '500',
              color: '#6b7280',
              borderBottom: '1px solid #d1d5db'
            }}>
              {language.toUpperCase()}
            </div>
            <pre style={{ 
              margin: 0,
              padding: '12px',
              fontSize: '11px',
              fontFamily: '"Fira Code", "Cascadia Code", "SF Mono", Monaco, "Inconsolata", "Roboto Mono", "Source Code Pro", monospace',
              lineHeight: '1.5',
              overflow: 'auto',
              maxHeight: '300px',
              backgroundColor: 'transparent',
              color: '#1f2937',
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word'
            }}>
              {value || '(empty)'}
            </pre>
          </div>
        </div>
      ))}
    </div>
  );
};