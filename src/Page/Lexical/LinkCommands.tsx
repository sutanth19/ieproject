// LinkCommands.tsx
import { createCommand, LexicalCommand } from 'lexical';

export interface LinkPayload {
  url: string;
  text?: string;
}

export const INSERT_LINK_COMMAND: LexicalCommand<LinkPayload> = createCommand('INSERT_LINK_COMMAND');
export const TOGGLE_LINK_COMMAND: LexicalCommand<string | null> = createCommand('TOGGLE_LINK_COMMAND');