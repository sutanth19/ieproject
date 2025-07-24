// LexicalEditor.tsx - Clean version with Image Support
import React, { useEffect } from 'react';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';
import { ListPlugin } from '@lexical/react/LexicalListPlugin';
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

// Import Image components
import { ImageNode } from './ImageNode';
import { ImagePlugin } from './ImagePlugin';

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

export const LexicalEditor: React.FC<LexicalEditorProps> = ({
  config = {},
  initialValue,
  onChange,
  className,
  style,
  placeholder = 'Enter some text...',
}) => {
  const { outputs, handleEditorChange } = useLexicalEditor(onChange);
  
  const editorConfig = {
    namespace: config.namespace || 'LexicalEditor',
    theme: config.theme || {
      heading: {
        h1: 'text-3xl font-bold',
        h2: 'text-2xl font-bold', 
        h3: 'text-xl font-bold',
      },
      list: {
        nested: {
          listitem: 'list-nested-listitem',
        },
        ol: 'list-decimal list-inside',
        ul: 'list-disc list-inside',
        listitem: 'list-item',
      },
      quote: 'border-l-4 border-gray-300 pl-4 italic',
      table: 'border-collapse border border-gray-300 w-full my-4',
      tableCell: 'border border-gray-300 px-3 py-2 min-w-20 relative',
      tableCellHeader: 'border border-gray-300 px-3 py-2 min-w-20 bg-gray-100 font-bold relative',
      tableRow: 'border-b border-gray-300',
      hr: 'border-none border-t border-gray-300 my-4',
      // Add image theme
      image: 'editor-image',
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
      ImageNode, // Add ImageNode here
      ...(config.nodes || [])
    ],
    ...(initialValue && { editorState: initialValue }),
  };

  return (
    <div className={className} style={style}>
      <LexicalComposer initialConfig={editorConfig}>
        <div className="lexical-editor" style={{ border: '1px solid #d1d5db', borderRadius: '6px', overflow: 'hidden' }}>
          <ComprehensiveLexicalToolbar />
          <RichTextPlugin
            contentEditable={
              <ContentEditable
                style={{
                  minHeight: '200px',
                  padding: '12px',
                  outline: 'none',
                  fontSize: '14px',
                  lineHeight: '1.5',
                  position: 'relative',
                }}
                aria-placeholder={placeholder}
                placeholder={
                  <div style={{ 
                    padding: '12px', 
                    color: '#9ca3af',
                    pointerEvents: 'none',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                  }}>
                    {placeholder}
                  </div>
                }
              />
            }
            ErrorBoundary={LexicalErrorBoundary}
          />
        </div>
        <HistoryPlugin />
        <ListPlugin />
        <TablePlugin hasCellMerge={true} hasCellBackgroundColor={true} />
        <HorizontalRulePlugin />
        <TableSetup />
        <ImagePlugin />
        <OnChangePlugin onChange={handleEditorChange} />
      </LexicalComposer>
    </div>
  );
};