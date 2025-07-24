import { useCallback, useState } from 'react';
import { EditorState, LexicalEditor } from 'lexical';
import { $getRoot } from 'lexical';
import { $generateHtmlFromNodes } from '@lexical/html';
import { LexicalOutputData } from '../types/lexical';

export const useLexicalEditor = (onChange?: (data: LexicalOutputData) => void) => {
  const [outputs, setOutputs] = useState<LexicalOutputData>({
    json: '',
    html: '',
    plainText: ''
  });

  const handleEditorChange = useCallback((editorState: EditorState, editor: LexicalEditor) => {
    const jsonOutput = JSON.stringify(editorState.toJSON());
    
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