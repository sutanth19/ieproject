import { useCallback, useState } from 'react';
import { EditorState, LexicalEditor } from 'lexical';
import { $getRoot } from 'lexical';
import { $generateHtmlFromNodes } from '@lexical/html';
import { HeadingNode, QuoteNode } from '@lexical/rich-text';
import { ListNode, ListItemNode } from '@lexical/list';
import { TableNode, TableCellNode, TableRowNode } from '@lexical/table';
import { HorizontalRuleNode } from '@lexical/react/LexicalHorizontalRuleNode';
import { LexicalOutputData } from '../types/lexical';

// Import your custom nodes
import { ImageNode } from '../Page/Lexical/ImageNode';
import { LinkNode } from '../Page/Lexical/LinkNode';

export const useLexicalEditor = (onChange?: (data: LexicalOutputData) => void) => {
  const [outputs, setOutputs] = useState<LexicalOutputData>({
    json: '',
    html: '',
    plainText: ''
  });

  const handleEditorChange = useCallback((editorState: EditorState, editor: LexicalEditor) => {
    const jsonOutput = JSON.stringify(editorState.toJSON());
    
    // Enhanced HTML generation with proper node transformers
    const htmlOutput = editorState.read(() => {
      return $generateHtmlFromNodes(editor, null);
    });
    
    const plainTextOutput = editorState.read(() => {
      return $getRoot().getTextContent();
    });
    
    const newOutputs = {
      json: jsonOutput,
      html: htmlOutput,
      plainText: plainTextOutput
    };
    
    setOutputs(newOutputs);
    onChange?.(newOutputs);
  }, [onChange]);

  return {
    outputs,
    handleEditorChange
  };
};