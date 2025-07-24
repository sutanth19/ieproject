import { EditorThemeClasses, LexicalEditor } from 'lexical';
import type { InitialConfigType } from '@lexical/react/LexicalComposer';

export type InitialEditorStateType = InitialConfigType['editorState'];

export interface LexicalOutputData {
  json: string;
  html: string;
  plainText: string;
}

export interface LexicalContentData {
  id?: string;
  editorState: string;
  htmlContent: string;
  plainText: string;
  title?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface LexicalEditorConfig {
  namespace: string;
  theme?: EditorThemeClasses;
  onError: (error: Error, editor: LexicalEditor) => void;
  editorState?: InitialEditorStateType;
  nodes?: InitialConfigType['nodes'];
  editable?: boolean;
}

export interface LexicalEditorProps {
  config?: Partial<LexicalEditorConfig>;
  initialValue?: InitialEditorStateType;
  onChange?: (data: LexicalOutputData) => void;
  className?: string;
  style?: React.CSSProperties;
  placeholder?: string; 
}