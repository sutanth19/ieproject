// CodeBlockPlugin.tsx
import React, { useEffect } from 'react';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $insertNodes, $getSelection, $isRangeSelection } from 'lexical';
import { INSERT_CODE_BLOCK_COMMAND, UPDATE_CODE_BLOCK_LANGUAGE_COMMAND } from './CodeBlockCommands';
import { $createCodeBlockNode, CodeBlockPayload, CodeBlockNode } from './CodeBlockNode';
import { $getNodeByKey } from 'lexical';

export const CodeBlockPlugin: React.FC = () => {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    // Check if CodeBlockNode is registered
    if (!editor.hasNodes([CodeBlockNode])) {
      throw new Error('CodeBlockPlugin: CodeBlockNode not registered on editor');
    }

    // Register INSERT_CODE_BLOCK_COMMAND
    const unregisterInsert = editor.registerCommand<CodeBlockPayload>(
      INSERT_CODE_BLOCK_COMMAND,
      (payload) => {
        editor.update(() => {
          const codeBlockNode = $createCodeBlockNode(payload);
          const selection = $getSelection();
          if ($isRangeSelection(selection)) {
            $insertNodes([codeBlockNode]);
          }
        });
        
        return true;
      },
      0,
    );

    // Register UPDATE_CODE_BLOCK_LANGUAGE_COMMAND
    const unregisterUpdate = editor.registerCommand(
      UPDATE_CODE_BLOCK_LANGUAGE_COMMAND,
      ({ nodeKey, language }) => {
        editor.update(() => {
          const node = $getNodeByKey(nodeKey) as CodeBlockNode;
          if (node && node.setLanguage) {
            node.setLanguage(language);
          }
        });
        return true;
      },
      0,
    );

    return () => {
      unregisterInsert();
      unregisterUpdate();
    };
  }, [editor]);

  return null;
};