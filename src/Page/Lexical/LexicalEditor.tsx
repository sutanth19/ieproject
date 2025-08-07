// Complete LexicalEditor.tsx with editor reference for sticky toolbar
import React, { useEffect, useRef } from 'react';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';
import { ListPlugin } from '@lexical/react/LexicalListPlugin';
import { CheckListPlugin } from '@lexical/react/LexicalCheckListPlugin';
import { TablePlugin } from '@lexical/react/LexicalTablePlugin';
import { HorizontalRulePlugin } from '@lexical/react/LexicalHorizontalRulePlugin';
import { HeadingNode, QuoteNode } from '@lexical/rich-text';
import { ListNode, ListItemNode } from '@lexical/list';
import { TableNode, TableCellNode, TableRowNode } from '@lexical/table';
import { HorizontalRuleNode } from '@lexical/react/LexicalHorizontalRuleNode';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { registerTablePlugin, registerTableSelectionObserver } from '@lexical/table';
import { LexicalEditorProps } from '../../types/lexical';
import { useLexicalEditor } from '../../hooks/useLexicalEditor';
import { OnChangePlugin } from './plugins/OnChangePlugin';
import ComprehensiveLexicalToolbar from './LexicalToolbar';
import { useTheme } from './../../themes/ThemeContext';

// Import Image components
import { ImageNode } from './ImageNode';
import { ImagePlugin } from './ImagePlugin';

// Import Link components
import { LinkNode } from './LinkNode';
import { LinkPlugin } from './LinkPlugin';

// Import CodeBlock components
import { CodeBlockNode } from './CodeBlockNode';
import { CodeBlockPlugin } from './CodeBlockPlugin';

// Table setup component
const TableSetup: React.FC = () => {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    const unregisterTablePlugin = registerTablePlugin(editor);
    const unregisterTableSelection = registerTableSelectionObserver(editor);
    
    return () => {
      unregisterTablePlugin();
      unregisterTableSelection();
    };
  }, [editor]);

  return null;
};

export const LexicalEditor: React.FC<LexicalEditorProps & { 
  isDarkMode?: boolean;
  className?: string;
  stickyOffset?: number;
}> = ({
  config = {},
  initialValue,
  onChange,
  className,
  style,
  isDarkMode = false,
  stickyOffset = 0,
}) => {
  const { darkMode } = useTheme();
  const { outputs, handleEditorChange } = useLexicalEditor(onChange);
  const editorContainerRef = useRef<HTMLDivElement | null>(null);
  
  // Use darkMode from theme context instead of prop
  const isCurrentlyDarkMode = darkMode;
  
  // Combine your app's theme classes with the editor
  const editorContainerClass = `lexical-editor-container ${isCurrentlyDarkMode ? 'dark-mode' : ''} ${className || ''}`;
  const editorContentClass = `lexical-editor-content ${isCurrentlyDarkMode ? 'dark-mode' : ''}`;
  const placeholderClass = `lexical-editor-placeholder ${isCurrentlyDarkMode ? 'dark-mode' : ''}`;
  
  const editorConfig = {
    namespace: config.namespace || 'LexicalEditor',
    theme: config.theme || {
      // Text formatting theme classes (no Tailwind)
      text: {
        bold: 'editor-text-bold',
        italic: 'editor-text-italic',
        underline: 'editor-text-underline',
        strikethrough: 'editor-text-strikethrough',
        underlineStrikethrough: 'editor-text-underlineStrikethrough',
        code: 'editor-text-code',
        subscript: 'editor-text-subscript',
        superscript: 'editor-text-superscript',
      },
      // Heading styles (replaced Tailwind with custom CSS classes)
      heading: {
        h1: 'editor-heading-h1',
        h2: 'editor-heading-h2', 
        h3: 'editor-heading-h3',
        h4: 'editor-heading-h4',
        h5: 'editor-heading-h5',
        h6: 'editor-heading-h6',
      },
      // List styles (replaced Tailwind with custom CSS classes)
      list: {
        nested: {
          listitem: 'list-nested-listitem',
        },
        ol: 'editor-list-ordered',
        ul: 'editor-list-unordered',
        listitem: 'editor-list-item',
        checklist: 'editor-checklist',
        listitemChecked: 'checklist-item-checked',
        listitemUnchecked: 'checklist-item-unchecked',
      },
      // Other elements (replaced Tailwind with custom CSS classes)
      quote: 'editor-quote',
      table: 'editor-table',
      tableCell: 'editor-table-cell',
      tableCellHeader: 'editor-table-cell-header',
      tableRow: 'editor-table-row',
      hr: 'editor-hr',
      image: 'editor-image',
      link: 'editor-link',
      codeblock: 'editor-codeblock', // Added CodeBlock theme
    },
    onError: config.onError || ((error, editor) => console.error('Lexical Error:', error)),
    nodes: [
      HeadingNode,
      QuoteNode,
      ListNode,
      ListItemNode,
      TableNode,
      TableCellNode,
      TableRowNode,
      HorizontalRuleNode,
      ImageNode,
      LinkNode,
      CodeBlockNode, // Added CodeBlock node
      ...(config.nodes || [])
    ],
    ...(initialValue && { editorState: initialValue }),
  };

  return (
    <div 
      ref={editorContainerRef}
      className={editorContainerClass} 
      style={style}
    >
      <LexicalComposer initialConfig={editorConfig}>
        <div className={`lexical-editor ${isCurrentlyDarkMode ? 'dark-mode' : ''}`}>
          <ComprehensiveLexicalToolbar 
            isDarkMode={isCurrentlyDarkMode} 
            stickyOffset={70}
            editorRef={editorContainerRef}
          />
          <RichTextPlugin
            contentEditable={
              <ContentEditable
                className={editorContentClass}
                style={{
                  color: isCurrentlyDarkMode ? '#ffffff' : '#333333',
                  caretColor: isCurrentlyDarkMode ? '#ffffff' : '#333333',
                  padding: '16px 20px', 
                  minHeight: '200px',
                  height: 'auto',
                  overflow: 'visible',
                }}
              />
            }
            placeholder={
              <div className={placeholderClass}>
                Start typing your content here...
              </div>
            }
            ErrorBoundary={LexicalErrorBoundary}
          />
        </div>
        <HistoryPlugin />
        <ListPlugin />
        <CheckListPlugin />
        <TablePlugin hasCellMerge={true} hasCellBackgroundColor={true} />
        <HorizontalRulePlugin />
        <TableSetup />
        <ImagePlugin />
        <LinkPlugin />
        <CodeBlockPlugin /> {/* Added CodeBlock plugin */}
        <OnChangePlugin onChange={handleEditorChange} />
      </LexicalComposer>
    </div>
  );
};