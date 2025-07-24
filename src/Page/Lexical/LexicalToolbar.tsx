// Updated LexicalToolbar.tsx with Fixed Image Support
import React, { useCallback, useEffect, useState } from 'react';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import {
  $getSelection,
  $isRangeSelection,
  FORMAT_TEXT_COMMAND,
  UNDO_COMMAND,
  REDO_COMMAND,
  $createParagraphNode,
  TextFormatType,
  CAN_UNDO_COMMAND,
  CAN_REDO_COMMAND,
  SELECTION_CHANGE_COMMAND,
  $isTextNode,
  INDENT_CONTENT_COMMAND,
  OUTDENT_CONTENT_COMMAND,
} from 'lexical';
import {
  INSERT_ORDERED_LIST_COMMAND,
  INSERT_UNORDERED_LIST_COMMAND,
  $isListNode,
  INSERT_CHECK_LIST_COMMAND,
} from '@lexical/list';
import { 
  $createHeadingNode, 
  $createQuoteNode, 
  HeadingTagType 
} from '@lexical/rich-text';
import {
  INSERT_HORIZONTAL_RULE_COMMAND,
} from '@lexical/react/LexicalHorizontalRuleNode';
import {
  FORMAT_ELEMENT_COMMAND,
} from 'lexical';

// Import the image functionality
import { INSERT_IMAGE_COMMAND } from './ImageCommands';
import { ImageUploadModal } from './ImageUploadModal';

// MUI Icons
import FormatBoldIcon from '@mui/icons-material/FormatBold';
import FormatItalicIcon from '@mui/icons-material/FormatItalic';
import FormatUnderlinedIcon from '@mui/icons-material/FormatUnderlined';
import FormatStrikethroughIcon from '@mui/icons-material/FormatStrikethrough';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import FormatListNumberedIcon from '@mui/icons-material/FormatListNumbered';
import FormatQuoteIcon from '@mui/icons-material/FormatQuote';
import UndoIcon from '@mui/icons-material/Undo';
import RedoIcon from '@mui/icons-material/Redo';
import CodeIcon from '@mui/icons-material/Code';
import SubscriptIcon from '@mui/icons-material/Subscript';
import SuperscriptIcon from '@mui/icons-material/Superscript';
import FormatAlignLeftIcon from '@mui/icons-material/FormatAlignLeft';
import FormatAlignCenterIcon from '@mui/icons-material/FormatAlignCenter';
import FormatAlignRightIcon from '@mui/icons-material/FormatAlignRight';
import FormatAlignJustifyIcon from '@mui/icons-material/FormatAlignJustify';
import FormatIndentIncreaseIcon from '@mui/icons-material/FormatIndentIncrease';
import FormatIndentDecreaseIcon from '@mui/icons-material/FormatIndentDecrease';
import LinkIcon from '@mui/icons-material/Link';
import ImageIcon from '@mui/icons-material/Image';
import HorizontalRuleIcon from '@mui/icons-material/HorizontalRule';
import FormatClearIcon from '@mui/icons-material/FormatClear';
import CheckBoxIcon from '@mui/icons-material/CheckBox';

interface ToolbarButtonProps {
  onClick: () => void;
  disabled?: boolean;
  active?: boolean;
  children: React.ReactNode;
  title?: string;
  size?: 'small' | 'medium';
}

const ToolbarButton: React.FC<ToolbarButtonProps> = ({
  onClick,
  disabled = false,
  active = false,
  children,
  title,
  size = 'small',
}) => (
  <button
    onClick={onClick}
    disabled={disabled}
    title={title}
    style={{
      padding: '8px',
      border: 'none',
      borderRadius: '6px',
      backgroundColor: active ? '#3b82f6' : 'transparent',
      color: active ? 'white' : '#4b5563',
      cursor: disabled ? 'not-allowed' : 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      transition: 'all 0.15s ease',
      opacity: disabled ? 0.4 : 1,
      minWidth: '36px',
      height: '36px',
      position: 'relative'
    }}
    onMouseEnter={(e) => {
      if (!disabled && !active) {
        e.currentTarget.style.backgroundColor = '#f1f5f9';
        e.currentTarget.style.color = '#1e293b';
      }
    }}
    onMouseLeave={(e) => {
      if (!disabled && !active) {
        e.currentTarget.style.backgroundColor = 'transparent';
        e.currentTarget.style.color = '#4b5563';
      }
    }}
  >
    {children}
  </button>
);

const ToolbarDivider: React.FC = () => (
  <div style={{ 
    width: '1px', 
    height: '28px', 
    backgroundColor: '#e2e8f0', 
    margin: '0 4px',
    flexShrink: 0
  }} />
);

const ComprehensiveLexicalToolbar: React.FC = () => {
  const [editor] = useLexicalComposerContext();
  
  // Add state for image modal
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  
  // State management
  const [activeFormats, setActiveFormats] = useState({
    bold: false,
    italic: false,
    underline: false,
    strikethrough: false,
    code: false,
    subscript: false,
    superscript: false,
  });
  
  const [blockType, setBlockType] = useState('paragraph');
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);
  const [fontSize, setFontSize] = useState('14');
  const [fontFamily, setFontFamily] = useState('');
  const [elementFormat, setElementFormat] = useState('left');

  // Helper functions
  const applyFontSize = useCallback((size: string) => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        selection.getNodes().forEach((node) => {
          if ($isTextNode(node)) {
            node.setStyle(`font-size: ${size}px`);
          }
        });
      }
    });
  }, [editor]);

  const applyFontFamily = useCallback((family: string) => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        selection.getNodes().forEach((node) => {
          if ($isTextNode(node)) {
            const currentStyle = node.getStyle() || '';
            const newStyle = currentStyle
              .split(';')
              .filter(style => !style.trim().startsWith('font-family'))
              .join(';') + (family ? `;font-family: ${family}` : '');
            node.setStyle(newStyle.replace(/^;/, ''));
          }
        });
      }
    });
  }, [editor]);

  const getCurrentFontStyles = useCallback(() => {
    const selection = $getSelection();
    if ($isRangeSelection(selection)) {
      const node = selection.anchor.getNode();
      if ($isTextNode(node)) {
        const style = node.getStyle() || '';
        
        const fontSizeMatch = style.match(/font-size:\s*(\d+)px/);
        if (fontSizeMatch) {
          setFontSize(fontSizeMatch[1]);
        }
        
        const fontFamilyMatch = style.match(/font-family:\s*([^;]+)/);
        if (fontFamilyMatch) {
          setFontFamily(fontFamilyMatch[1].trim());
        }
      }
    }
  }, []);

  const updateToolbar = useCallback(() => {
    const selection = $getSelection();
    if ($isRangeSelection(selection)) {
      setActiveFormats({
        bold: selection.hasFormat('bold'),
        italic: selection.hasFormat('italic'),
        underline: selection.hasFormat('underline'),
        strikethrough: selection.hasFormat('strikethrough'),
        code: selection.hasFormat('code'),
        subscript: selection.hasFormat('subscript'),
        superscript: selection.hasFormat('superscript'),
      });

      getCurrentFontStyles();

      const anchorNode = selection.anchor.getNode();
      const element = anchorNode.getKey() === 'root' 
        ? anchorNode 
        : anchorNode.getTopLevelElementOrThrow();
      
      const elementKey = element.getKey();
      const elementDOM = editor.getElementByKey(elementKey);
      
      if (elementDOM !== null) {
        if ($isListNode(element)) {
          const parentList = element;
          const type = parentList.getListType();
          setBlockType(type === 'bullet' ? 'bullet' : 'number');
        } else {
          const type = element.getType();
          if (type === 'quote') {
            setBlockType('quote');
          } else if (type === 'heading') {
            const tag = (element as any).getTag();
            setBlockType(tag);
          } else {
            setBlockType('paragraph');
          }
        }
      }
    }
  }, [editor, getCurrentFontStyles]);

  // Register update listeners
  useEffect(() => {
    return editor.registerUpdateListener(({ editorState }) => {
      editorState.read(() => {
        updateToolbar();
      });
    });
  }, [editor, updateToolbar]);

  useEffect(() => {
    return editor.registerCommand(
      SELECTION_CHANGE_COMMAND,
      () => {
        updateToolbar();
        return false;
      },
      1
    );
  }, [editor, updateToolbar]);

  useEffect(() => {
    const unregisterUndo = editor.registerCommand(
      CAN_UNDO_COMMAND,
      (canUndo: boolean) => {
        setCanUndo(canUndo);
        return false;
      },
      1
    );

    const unregisterRedo = editor.registerCommand(
      CAN_REDO_COMMAND,
      (canRedo: boolean) => {
        setCanRedo(canRedo);
        return false;
      },
      1
    );

    return () => {
      unregisterUndo();
      unregisterRedo();
    };
  }, [editor]);

  // Command functions
  const formatText = (format: TextFormatType) => {
    editor.dispatchCommand(FORMAT_TEXT_COMMAND, format);
  };

  const formatElement = (format: 'left' | 'center' | 'right' | 'justify') => {
    editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, format);
    setElementFormat(format);
  };

  const insertList = (listType: 'bullet' | 'number' | 'check') => {
    if (listType === 'bullet') {
      editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined);
    } else if (listType === 'number') {
      editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined);
    } else {
      editor.dispatchCommand(INSERT_CHECK_LIST_COMMAND, undefined);
    }
  };

  const formatHeading = (headingSize: string) => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        const anchorNode = selection.anchor.getNode();
        const element = anchorNode.getKey() === 'root' 
          ? anchorNode 
          : anchorNode.getTopLevelElementOrThrow();
        
        if (headingSize === 'h1' || headingSize === 'h2' || headingSize === 'h3' || 
            headingSize === 'h4' || headingSize === 'h5' || headingSize === 'h6') {
          const heading = $createHeadingNode(headingSize as HeadingTagType);
          element.replace(heading);
        } else if (headingSize === 'quote') {
          const quote = $createQuoteNode();
          element.replace(quote);
        } else {
          const paragraph = $createParagraphNode();
          element.replace(paragraph);
        }
      }
    });
  };

  const insertHorizontalRule = () => {
    editor.dispatchCommand(INSERT_HORIZONTAL_RULE_COMMAND, undefined);
  };

  const indentContent = () => {
    editor.dispatchCommand(INDENT_CONTENT_COMMAND, undefined);
  };

  const outdentContent = () => {
    editor.dispatchCommand(OUTDENT_CONTENT_COMMAND, undefined);
  };

  const clearFormatting = () => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        const formats: TextFormatType[] = ['bold', 'italic', 'underline', 'strikethrough', 'code', 'subscript', 'superscript'];
        formats.forEach(format => {
          if (selection.hasFormat(format)) {
            selection.toggleFormat(format);
          }
        });
        
        selection.getNodes().forEach((node) => {
          if ($isTextNode(node)) {
            node.setStyle('');
          }
        });
      }
    });
  };

  const undo = () => {
    editor.dispatchCommand(UNDO_COMMAND, undefined);
  };

  const redo = () => {
    editor.dispatchCommand(REDO_COMMAND, undefined);
  };

  const handleFontSizeChange = (newSize: string) => {
    setFontSize(newSize);
    applyFontSize(newSize);
  };

  const handleFontFamilyChange = (newFamily: string) => {
    setFontFamily(newFamily);
    applyFontFamily(newFamily);
  };

  // NEW: Image insertion functions
  const openImageModal = () => {
    setIsImageModalOpen(true);
  };

  const handleImageInsert = (imageData: { src: string; altText: string }) => {
    editor.dispatchCommand(INSERT_IMAGE_COMMAND, {
      src: imageData.src,
      altText: imageData.altText,
      maxWidth: 800, // Default max width
    });
    setIsImageModalOpen(false);
  };

  return (
    <>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '1px',
        padding: '8px 16px',
        borderBottom: '1px solid #e2e8f0',
        backgroundColor: '#ffffff',
        borderTopLeftRadius: '8px',
        borderTopRightRadius: '8px',
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
        flexWrap: 'wrap',
        minHeight: '56px',
        overflow: 'hidden'
      }}>
        {/* History Controls */}
        <div style={{ display: 'flex', gap: '1px', marginRight: '8px' }}>
          <ToolbarButton onClick={undo} disabled={!canUndo} title="Undo (Ctrl+Z)">
            <UndoIcon fontSize="small" />
          </ToolbarButton>
          <ToolbarButton onClick={redo} disabled={!canRedo} title="Redo (Ctrl+Y)">
            <RedoIcon fontSize="small" />
          </ToolbarButton>
        </div>

        <ToolbarDivider />

        {/* Block Type & Font Controls */}
        <div style={{ display: 'flex', gap: '6px', alignItems: 'center', marginRight: '8px' }}>
          <select
            value={blockType}
            onChange={(e) => formatHeading(e.target.value)}
            style={{
              padding: '6px 10px',
              border: '1px solid #cbd5e1',
              borderRadius: '6px',
              fontSize: '14px',
              minWidth: '120px',
              backgroundColor: 'white',
              color: '#374151',
              cursor: 'pointer',
              outline: 'none',
              transition: 'border-color 0.2s'
            }}
            onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
            onBlur={(e) => e.target.style.borderColor = '#cbd5e1'}
          >
            <option value="paragraph">Paragraph</option>
            <option value="h1">Heading 1</option>
            <option value="h2">Heading 2</option>
            <option value="h3">Heading 3</option>
            <option value="h4">Heading 4</option>
            <option value="h5">Heading 5</option>
            <option value="h6">Heading 6</option>
            <option value="quote">Quote</option>
          </select>

          <select
            value={fontFamily}
            onChange={(e) => handleFontFamilyChange(e.target.value)}
            style={{
              padding: '6px 10px',
              border: '1px solid #cbd5e1',
              borderRadius: '6px',
              fontSize: '14px',
              minWidth: '110px',
              backgroundColor: 'white',
              color: '#374151',
              cursor: 'pointer',
              outline: 'none',
              transition: 'border-color 0.2s'
            }}
            onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
            onBlur={(e) => e.target.style.borderColor = '#cbd5e1'}
          >
            <option value="">Default</option>
            <option value="Arial">Arial</option>
            <option value="Georgia">Georgia</option>
            <option value="Times New Roman">Times</option>
            <option value="Courier New">Courier</option>
            <option value="Helvetica">Helvetica</option>
          </select>

          <select
            value={fontSize}
            onChange={(e) => handleFontSizeChange(e.target.value)}
            style={{
              padding: '6px 8px',
              border: '1px solid #cbd5e1',
              borderRadius: '6px',
              fontSize: '14px',
              width: '65px',
              backgroundColor: 'white',
              color: '#374151',
              cursor: 'pointer',
              outline: 'none',
              transition: 'border-color 0.2s'
            }}
            onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
            onBlur={(e) => e.target.style.borderColor = '#cbd5e1'}
          >
            <option value="10">10</option>
            <option value="12">12</option>
            <option value="14">14</option>
            <option value="16">16</option>
            <option value="18">18</option>
            <option value="20">20</option>
            <option value="24">24</option>
            <option value="32">32</option>
          </select>
        </div>

        <ToolbarDivider />

        {/* Text Formatting */}
        <div style={{ display: 'flex', gap: '1px', marginRight: '8px' }}>
          <ToolbarButton
            onClick={() => formatText('bold')}
            active={activeFormats.bold}
            title="Bold (Ctrl+B)"
          >
            <FormatBoldIcon fontSize="small" />
          </ToolbarButton>
          
          <ToolbarButton
            onClick={() => formatText('italic')}
            active={activeFormats.italic}
            title="Italic (Ctrl+I)"
          >
            <FormatItalicIcon fontSize="small" />
          </ToolbarButton>
          
          <ToolbarButton
            onClick={() => formatText('underline')}
            active={activeFormats.underline}
            title="Underline (Ctrl+U)"
          >
            <FormatUnderlinedIcon fontSize="small" />
          </ToolbarButton>
          
          <ToolbarButton
            onClick={() => formatText('strikethrough')}
            active={activeFormats.strikethrough}
            title="Strikethrough"
          >
            <FormatStrikethroughIcon fontSize="small" />
          </ToolbarButton>

          <ToolbarButton
            onClick={() => formatText('code')}
            active={activeFormats.code}
            title="Inline Code"
          >
            <CodeIcon fontSize="small" />
          </ToolbarButton>
        </div>

        <ToolbarDivider />

        {/* Text Style */}
        <div style={{ display: 'flex', gap: '1px', marginRight: '8px' }}>
          <ToolbarButton
            onClick={() => formatText('subscript')}
            active={activeFormats.subscript}
            title="Subscript"
          >
            <SubscriptIcon fontSize="small" />
          </ToolbarButton>
          
          <ToolbarButton
            onClick={() => formatText('superscript')}
            active={activeFormats.superscript}
            title="Superscript"
          >
            <SuperscriptIcon fontSize="small" />
          </ToolbarButton>

          <ToolbarButton
            onClick={clearFormatting}
            title="Clear Formatting"
          >
            <FormatClearIcon fontSize="small" />
          </ToolbarButton>
        </div>

        <ToolbarDivider />

        {/* Alignment */}
        <div style={{ display: 'flex', gap: '1px', marginRight: '8px' }}>
          <ToolbarButton
            onClick={() => formatElement('left')}
            active={elementFormat === 'left'}
            title="Align Left"
          >
            <FormatAlignLeftIcon fontSize="small" />
          </ToolbarButton>
          
          <ToolbarButton
            onClick={() => formatElement('center')}
            active={elementFormat === 'center'}
            title="Align Center"
          >
            <FormatAlignCenterIcon fontSize="small" />
          </ToolbarButton>
          
          <ToolbarButton
            onClick={() => formatElement('right')}
            active={elementFormat === 'right'}
            title="Align Right"
          >
            <FormatAlignRightIcon fontSize="small" />
          </ToolbarButton>
          
          <ToolbarButton
            onClick={() => formatElement('justify')}
            active={elementFormat === 'justify'}
            title="Justify"
          >
            <FormatAlignJustifyIcon fontSize="small" />
          </ToolbarButton>
        </div>

        <ToolbarDivider />

        {/* Lists & Indentation */}
        <div style={{ display: 'flex', gap: '1px', marginRight: '8px' }}>
          <ToolbarButton
            onClick={() => insertList('bullet')}
            title="Bullet List"
          >
            <FormatListBulletedIcon fontSize="small" />
          </ToolbarButton>
          
          <ToolbarButton
            onClick={() => insertList('number')}
            title="Numbered List"
          >
            <FormatListNumberedIcon fontSize="small" />
          </ToolbarButton>

          <ToolbarButton
            onClick={() => insertList('check')}
            title="Checklist"
          >
            <CheckBoxIcon fontSize="small" />
          </ToolbarButton>

          <ToolbarButton
            onClick={outdentContent}
            title="Decrease Indent"
          >
            <FormatIndentDecreaseIcon fontSize="small" />
          </ToolbarButton>
          
          <ToolbarButton
            onClick={indentContent}
            title="Increase Indent"
          >
            <FormatIndentIncreaseIcon fontSize="small" />
          </ToolbarButton>
        </div>

        <ToolbarDivider />

        {/* Special Elements & Media */}
        <div style={{ display: 'flex', gap: '1px' }}>
          <ToolbarButton
            onClick={() => formatHeading('quote')}
            title="Quote"
          >
            <FormatQuoteIcon fontSize="small" />
          </ToolbarButton>

          <ToolbarButton
            onClick={insertHorizontalRule}
            title="Horizontal Rule"
          >
            <HorizontalRuleIcon fontSize="small" />
          </ToolbarButton>

          <ToolbarButton
            onClick={() => console.log('Link - Coming soon')}
            title="Insert Link"
            disabled
          >
            <LinkIcon fontSize="small" />
          </ToolbarButton>
          
          {/* UPDATED: Image button now functional */}
          <ToolbarButton
            onClick={openImageModal}
            title="Insert Image"
          >
            <ImageIcon fontSize="small" />
          </ToolbarButton>
        </div>
      </div>

      {/* Image Upload Modal */}
      <ImageUploadModal
        isOpen={isImageModalOpen}
        onClose={() => setIsImageModalOpen(false)}
        onInsert={handleImageInsert}
      />
    </>
  );
};

export default ComprehensiveLexicalToolbar;