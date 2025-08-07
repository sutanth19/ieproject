// OnChangePlugin.tsx - Fixed implementation
import { useEffect } from 'react';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { EditorState, LexicalEditor } from 'lexical';

interface OnChangePluginProps {
  onChange: (editorState: EditorState, editor: LexicalEditor) => void;
}

export function OnChangePlugin({ onChange }: OnChangePluginProps): null {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    return editor.registerUpdateListener(({ editorState }) => {
      onChange(editorState, editor);
    });
  }, [editor, onChange]);

  return null;
}