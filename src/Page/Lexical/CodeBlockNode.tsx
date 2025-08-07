import React, { useRef, useState, useEffect } from 'react';
import {
  DecoratorNode,
  NodeKey,
  LexicalNode,
  EditorConfig,
  SerializedLexicalNode,
  Spread,
  $getNodeByKey,
  DOMExportOutput,
} from 'lexical';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import Grid from '@mui/material/Grid';

export interface CodeBlockPayload {
  code: string;
  language?: string;
  key?: NodeKey;
}

export interface SerializedCodeBlockNode extends Spread<{
  code: string;
  language?: string;
}, SerializedLexicalNode> {
  type: 'codeblock';
  version: 1;
}

export class CodeBlockNode extends DecoratorNode<React.ReactElement> {
  __code: string;
  __language: string;

  static getType(): string {
    return 'codeblock';
  }

  static clone(node: CodeBlockNode): CodeBlockNode {
    return new CodeBlockNode(
      node.__code,
      node.__language,
      node.__key,
    );
  }

  constructor(
    code: string,
    language: string = 'javascript',
    key?: NodeKey,
  ) {
    super(key);
    this.__code = code;
    this.__language = language;
  }

  exportJSON(): SerializedCodeBlockNode {
    return {
      code: this.getCode(),
      language: this.getLanguage(),
      type: 'codeblock',
      version: 1,
    };
  }

  exportDOM(): DOMExportOutput {
    const pre = document.createElement('pre');
    const code = document.createElement('code');
    
    code.textContent = this.__code;
    code.setAttribute('class', `language-${this.__language}`);
    
    pre.style.cssText = [
      'background-color: var(--card-background-color-dark-mode)',
      'color: var(--section-color-dark-mode)',
      'padding: 16px',
      'border-radius: 8px',
      'font-family: "Fira Code", "Courier New", monospace',
      'font-size: 14px',
      'line-height: 1.5',
      'overflow-x: auto',
      'margin: 16px 0'
    ].join('; ');
    
    pre.appendChild(code);
    return { element: pre };
  }

  static importJSON(serializedNode: SerializedCodeBlockNode): CodeBlockNode {
    const { code, language } = serializedNode;
    const node = $createCodeBlockNode({
      code,
      language,
    });
    return node;
  }

  getCode(): string {
    return this.__code;
  }

  getLanguage(): string {
    return this.__language;
  }

  setCode(code: string): void {
    const writable = this.getWritable();
    writable.__code = code;
  }

  setLanguage(language: string): void {
    const writable = this.getWritable();
    writable.__language = language;
  }

  createDOM(config: EditorConfig): HTMLElement {
    const div = document.createElement('div');
    const theme = config.theme;
    if (theme && theme.codeblock) {
      div.className = theme.codeblock;
    }
    return div;
  }

  updateDOM(): false {
    return false;
  }

  decorate(): React.ReactElement {
    return (
      <CodeBlockComponent
        code={this.__code}
        language={this.__language}
        nodeKey={this.getKey()}
      />
    );
  }
}

interface CodeBlockComponentProps {
  code: string;
  language: string;
  nodeKey: NodeKey;
}

const CodeBlockComponent: React.FC<CodeBlockComponentProps> = ({
  code,
  language,
  nodeKey,
}) => {
  const [editor] = useLexicalComposerContext();
  const [currentCode, setCurrentCode] = useState(code);
  const [currentLanguage, setCurrentLanguage] = useState(language);
  const [isSelected, setIsSelected] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  useEffect(() => {
    const checkDarkMode = () => {

      const container = textareaRef.current?.closest('.home-container');
      const editorContainer = textareaRef.current?.closest('.lexical-editor-container');
      
      setIsDarkMode(
        container?.classList.contains('dark-mode') || 
        editorContainer?.classList.contains('dark-mode') || 
        document.body.classList.contains('dark-mode') ||
        false
      );
    };
    
    checkDarkMode();
    const observer = new MutationObserver(checkDarkMode);
    if (textareaRef.current) {
      observer.observe(document.body, { 
        attributes: true, 
        attributeFilter: ['class'],
        subtree: true 
      });
    }
    
    return () => observer.disconnect();
  }, []);

  const onDelete = () => {
    editor.update(() => {
      const node = $getNodeByKey(nodeKey);
      if (node) {
        node.remove();
      }
    });
  };

  const handleCodeChange = (newCode: string) => {
    setCurrentCode(newCode);
    editor.update(() => {
      const node = $getNodeByKey(nodeKey) as CodeBlockNode;
      if (node && node.setCode) {
        node.setCode(newCode);
      }
    });
  };

  const handleLanguageChange = (newLanguage: string) => {
    setCurrentLanguage(newLanguage);
    editor.update(() => {
      const node = $getNodeByKey(nodeKey) as CodeBlockNode;
      if (node && node.setLanguage) {
        node.setLanguage(newLanguage);
      }
    });
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(currentCode);
    } catch (err) {
      console.error('Failed to copy code:', err);
    }
  };

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [currentCode]);

  // Language options
  const languages = [
    'javascript', 'typescript', 'python', 'java', 'cpp', 'c', 'csharp',
    'php', 'ruby', 'go', 'rust', 'kotlin', 'swift', 'html', 'css',
    'scss', 'less', 'json', 'xml', 'yaml', 'markdown', 'bash', 'sql',
    'plaintext'
  ];

  return (
    <Grid container 
      className={`editor-codeblock ${isDarkMode ? 'dark-mode' : ''}`}
      onClick={() => setIsSelected(true)}
      onBlur={() => setIsSelected(false)}
      sx={{
        position: 'relative',
        margin: '16px 0',
        borderRadius: '8px',
        overflow: 'hidden',
        transition: 'var(--standard-transition)',
        // Removed the borderLeft property to eliminate the blue border
        backgroundColor: isDarkMode ? 'var(--card-background-color-dark-mode)' : '#fff',
        boxShadow: isDarkMode 
          ? '0 2px 10px rgba(0, 0, 0, 0.3)' 
          : '0 2px 10px rgba(0, 0, 0, 0.1)',
        border: 'none', 
        borderRight: 'none', 
      }}
    >
      <Grid size={{ xs: 12 }} sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '8px 12px',
        backgroundColor: isDarkMode 
          ? 'var(--section-stripe-background-dark-mode)' 
          : 'var(--section-stripe-background-light-mode)',
        borderBottom: `1px solid ${isDarkMode ? '#374151' : '#dee2e6'}`,
      }}>
        <Grid sx={{ display: 'flex', alignItems: 'center' }}>
          <select
            value={currentLanguage}
            onChange={(e) => handleLanguageChange(e.target.value)}
            style={{
              background: 'none',
              border: 'none',
              color: isDarkMode ? 'var(--section-color-dark-mode)' : 'var(--section-color-light-mode)',
              fontSize: '12px',
              fontFamily: 'inherit',
              cursor: 'pointer',
              padding: '2px 4px',
              borderRadius: '4px',
            }}
          >
            {languages.map(lang => (
              <option key={lang} value={lang}>
                {lang}
              </option>
            ))}
          </select>
        </Grid>
        
        <Grid sx={{ display: 'flex', gap: '4px' }}>
          <button
            onClick={handleCopy}
            style={{
              background: 'none',
              border: 'none',
              color: isDarkMode ? 'var(--section-color-dark-mode)' : 'var(--section-color-light-mode)',
              cursor: 'pointer',
              fontSize: '12px',
              padding: '4px 8px',
              borderRadius: '4px',
              transition: 'var(--standard-transition)',
            }}
            title="Copy code"
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(70, 191, 232, 0.2)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            Copy
          </button>
          
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            style={{
              background: 'none',
              border: 'none',
              color: isDarkMode ? 'var(--section-color-dark-mode)' : 'var(--section-color-light-mode)',
              cursor: 'pointer',
              fontSize: '12px',
              padding: '4px 8px',
              borderRadius: '4px',
              transition: 'var(--standard-transition)',
            }}
            title="Delete code block"
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(255, 59, 48, 0.2)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            ×
          </button>
        </Grid>
      </Grid>
      
      <Grid size={{ xs: 12 }}>
        <textarea
          ref={textareaRef}
          value={currentCode}
          onChange={(e) => handleCodeChange(e.target.value)}
          placeholder="Enter your code here..."
          style={{
            width: '100%',
            minHeight: '120px',
            padding: '16px',
            border: 'none',
            outline: 'none',
            resize: 'none',
            backgroundColor: 'transparent',
            color: isDarkMode ? 'var(--section-color-dark-mode)' : 'var(--section-color-light-mode)',
            fontFamily: '"Fira Code", "Courier New", monospace',
            fontSize: '14px',
            lineHeight: '1.5',
            overflow: 'hidden',
          }}
          spellCheck={false}
        />
      </Grid>
    </Grid>
  );
};

export function $createCodeBlockNode({
  code = '',
  language = 'javascript',
  key,
}: CodeBlockPayload): CodeBlockNode {
  return new CodeBlockNode(code, language, key);
}

export function $isCodeBlockNode(node: LexicalNode | null | undefined): node is CodeBlockNode {
  return node instanceof CodeBlockNode;
}