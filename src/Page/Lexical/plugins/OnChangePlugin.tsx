import { useEffect } from 'react';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { EditorState, LexicalEditor } from 'lexical';

interface OnChangePluginProps {
  onChange: (editorState: EditorState, editor: LexicalEditor) => void;
}

export const OnChangePlugin: React.FC<OnChangePluginProps> = ({ onChange }) => {
  const [editor] = useLexicalComposerContext();
  
  useEffect(() => {
    return editor.registerUpdateListener(({ editorState }) => {
      onChange(editorState, editor);
    });
  }, [editor, onChange]);
  
  return null;
};