// CodeBlockCommands.ts
import { createCommand, LexicalCommand } from 'lexical';

export interface CodeBlockPayload {
  language?: string;
  code?: string;
}

export const INSERT_CODE_BLOCK_COMMAND: LexicalCommand<CodeBlockPayload> = createCommand('INSERT_CODE_BLOCK_COMMAND');
export const UPDATE_CODE_BLOCK_LANGUAGE_COMMAND: LexicalCommand<{ nodeKey: string; language: string }> = createCommand('UPDATE_CODE_BLOCK_LANGUAGE_COMMAND');