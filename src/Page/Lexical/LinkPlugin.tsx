// LinkPlugin.tsx
import React, { useEffect } from 'react';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import {
  $getSelection,
  $isRangeSelection,
  $createTextNode,
} from 'lexical';

import { INSERT_LINK_COMMAND, TOGGLE_LINK_COMMAND, LinkPayload } from './LinkCommands';
import { $createLinkNode, $isLinkNode, LinkNode } from './LinkNode';

export function LinkPlugin(): React.JSX.Element | null {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    if (!editor.hasNodes([LinkNode])) {
      throw new Error('LinkPlugin: LinkNode not registered on editor');
    }

    const unregisterInsertLink = editor.registerCommand(
      INSERT_LINK_COMMAND,
      (payload: LinkPayload) => {
        const { url, text } = payload;
        
        editor.update(() => {
          const selection = $getSelection();
          
          if ($isRangeSelection(selection)) {
            const linkNode = $createLinkNode(url, { target: '_blank' });
            const textNode = $createTextNode(text || url);
            
            // Use the correct append method for Lexical ElementNode
            linkNode.append(textNode);
            
            if (selection.isCollapsed()) {
              // No text selected, just insert the link
              selection.insertNodes([linkNode]);
            } else {
              // Text is selected, replace it with the link
              selection.insertNodes([linkNode]);
            }
          }
        });
        
        return true;
      },
      1,
    );

    const unregisterToggleLink = editor.registerCommand(
      TOGGLE_LINK_COMMAND,
      (url: string | null) => {
        editor.update(() => {
          const selection = $getSelection();
          
          if ($isRangeSelection(selection)) {
            const nodes = selection.extract();
            
            if (url === null) {
              // Remove link
              nodes.forEach((node) => {
                const parent = node.getParent();
                if ($isLinkNode(parent)) {
                  const children = parent.getChildren();
                  for (let i = 0; i < children.length; i += 1) {
                    parent.insertBefore(children[i]);
                  }
                  parent.remove();
                }
              });
            } else {
              // Add or update link
              if (nodes.length === 1) {
                const firstNode = nodes[0];
                const parent = firstNode.getParent();
                if ($isLinkNode(parent)) {
                  // Update existing link
                  parent.setURL(url);
                  return;
                }
              }
              
              // Create new link
              const linkNode = $createLinkNode(url, { target: '_blank' });
              
              if (selection.isCollapsed()) {
                const textNode = $createTextNode(url);
                linkNode.append(textNode);
                selection.insertNodes([linkNode]);
              } else {
                const selectedTextContent = selection.getTextContent();
                const textNode = $createTextNode(selectedTextContent);
                linkNode.append(textNode);
                selection.insertNodes([linkNode]);
              }
            }
          }
        });
        
        return true;
      },
      1,
    );

    return () => {
      unregisterInsertLink();
      unregisterToggleLink();
    };
  }, [editor]);

  return null;
}