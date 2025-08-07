// Enhanced ImageCommands.ts with alignment support
import { createCommand, LexicalCommand } from 'lexical';
import { ImagePayload } from './ImageNode';

export const INSERT_IMAGE_COMMAND: LexicalCommand<ImagePayload> = createCommand('INSERT_IMAGE_COMMAND');

// New alignment command for images
export const SET_IMAGE_ALIGNMENT_COMMAND: LexicalCommand<{
  nodeKey: string;
  alignment: 'left' | 'center' | 'right';
}> = createCommand('SET_IMAGE_ALIGNMENT_COMMAND');