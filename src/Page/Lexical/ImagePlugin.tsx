// Enhanced ImagePlugin.tsx with alignment support
import React, { useEffect } from 'react';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $insertNodes, $getNodeByKey } from 'lexical';
import { INSERT_IMAGE_COMMAND, SET_IMAGE_ALIGNMENT_COMMAND } from './ImageCommands';
import { $createImageNode, ImagePayload, ImageNode } from './ImageNode';

export const ImagePlugin: React.FC = () => {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    // Register insert image command
    const unregisterInsert = editor.registerCommand<ImagePayload>(
      INSERT_IMAGE_COMMAND,
      (payload) => {
        const imageNode = $createImageNode(payload);
        $insertNodes([imageNode]);
        return true;
      },
      0,
    );

    // Register image alignment command
    const unregisterAlignment = editor.registerCommand<{
      nodeKey: string;
      alignment: 'left' | 'center' | 'right';
    }>(
      SET_IMAGE_ALIGNMENT_COMMAND,
      (payload) => {
        const { nodeKey, alignment } = payload;
        const imageNode = $getNodeByKey(nodeKey) as ImageNode;
        if (imageNode && imageNode.setAlignment) {
          imageNode.setAlignment(alignment);
        }
        return true;
      },
      0,
    );

    return () => {
      unregisterInsert();
      unregisterAlignment();
    };
  }, [editor]);

  return null;
};