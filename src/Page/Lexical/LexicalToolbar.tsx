// Enhanced LexicalToolbar.tsx with image alignment detection and control
import React, { useCallback, useEffect, useState, useRef } from 'react';
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
  $isElementNode,
  ElementNode,
  LexicalNode,
  $getNodeByKey,
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
import { useTheme } from './../../themes/ThemeContext';
import { INSERT_IMAGE_COMMAND, SET_IMAGE_ALIGNMENT_COMMAND } from './ImageCommands';
import { ImageUploadModal } from './ImageUploadModal';
import { INSERT_LINK_COMMAND } from './LinkCommands';
import { LinkModal } from './LinkModal';
import { $isLinkNode } from './LinkNode';
import { INSERT_CODE_BLOCK_COMMAND } from './CodeBlockCommands';
import { CodeBlockModal } from './CodeBlockModal';
import { ToolbarButton } from './ToolbarButton';
import { ToolbarDropdown } from './ToolbarDropdown';
import { ToolbarDivider } from './ToolbarDivider';
import { $isImageNode, ImageNode } from './ImageNode'; // Import ImageNode
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
import DataObjectIcon from '@mui/icons-material/DataObject';

const useScrollDetection = (threshold: number = 50, editorRef?: React.RefObject<HTMLDivElement | null>) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [shouldStick, setShouldStick] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setIsScrolled(scrollY > threshold);
      
      if (editorRef?.current) {
        const editorRect = editorRef.current.getBoundingClientRect();
        const editorTopInViewport = editorRect.top;
        setShouldStick(editorTopInViewport <= 10);
      } else {
        setShouldStick(scrollY > threshold);
      }
    };

    handleScroll();
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, [threshold, editorRef]);

  return { isScrolled, shouldStick };
};

interface ComprehensiveLexicalToolbarProps {
  isDarkMode?: boolean;
  stickyOffset?: number;
  showMobileCompact?: boolean;
  editorRef?: React.RefObject<HTMLDivElement | null>;
}

const ComprehensiveLexicalToolbar: React.FC<ComprehensiveLexicalToolbarProps> = ({ 
  isDarkMode = false,
  stickyOffset = 0,
  showMobileCompact = true,
  editorRef,
}) => {
  const { darkMode } = useTheme();
  const [editor] = useLexicalComposerContext();
  const toolbarRef = useRef<HTMLDivElement>(null);
  const { isScrolled, shouldStick } = useScrollDetection(100, editorRef);
  const isCurrentlyDarkMode = darkMode;
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);
  const [isCodeBlockModalOpen, setIsCodeBlockModalOpen] = useState(false);
  const [selectedText, setSelectedText] = useState('');
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
  const [isLink, setIsLink] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  
  // NEW: Image selection state
  const [selectedImageNode, setSelectedImageNode] = useState<ImageNode | null>(null);
  const [selectedImageAlignment, setSelectedImageAlignment] = useState<'left' | 'center' | 'right'>('left');

  // NEW: Global image selection handler
  useEffect(() => {
    const handleImageSelection = (event: CustomEvent) => {
      const { imageNode, isSelected } = event.detail;
      
      if (isSelected && imageNode) {
        // Image is selected
        editor.update(() => {
          const node = $getNodeByKey(imageNode.getKey()) as ImageNode;
          if (node) {
            setSelectedImageNode(node);
            setSelectedImageAlignment(node.getAlignment());
          }
        });
      } else {
        // Image is deselected
        setSelectedImageNode(null);
        setSelectedImageAlignment('left');
      }
    };

    // Listen for custom image selection events
    window.addEventListener('imageSelectionChange', handleImageSelection as EventListener);
    
    return () => {
      window.removeEventListener('imageSelectionChange', handleImageSelection as EventListener);
    };
  }, [editor]);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const fontFamilyOptions = [
    { value: '', label: 'Default' },
    { value: 'Arial', label: 'Arial' },
    { value: 'Georgia', label: 'Georgia' },
    { value: 'Times New Roman', label: 'Times' },
    { value: 'Courier New', label: 'Courier' },
    { value: 'Helvetica', label: 'Helvetica' },
    { value: 'Verdana', label: 'Verdana' },
    { value: 'Tahoma', label: 'Tahoma' },
    { value: 'Trebuchet MS', label: 'Trebuchet' },
  ];

  const fontSizeOptions = [
    { value: '10', label: '10px' },
    { value: '12', label: '12px' },
    { value: '14', label: '14px' },
    { value: '16', label: '16px' },
    { value: '18', label: '18px' },
    { value: '20', label: '20px' },
    { value: '24', label: '24px' },
    { value: '28', label: '28px' },
    { value: '32', label: '32px' },
    { value: '36', label: '36px' },
  ];

  const blockTypeOptions = [
    { value: 'paragraph', label: 'Paragraph' },
    { value: 'h1', label: 'Heading 1' },
    { value: 'h2', label: 'Heading 2' },
    { value: 'h3', label: 'Heading 3' },
    { value: 'h4', label: 'Heading 4' },
    { value: 'h5', label: 'Heading 5' },
    { value: 'h6', label: 'Heading 6' },
    { value: 'quote', label: 'Quote' },
  ];

  // NEW: Check if image is selected - IMPROVED
  const checkImageSelection = useCallback(() => {
    const selection = $getSelection();
    if ($isRangeSelection(selection)) {
      // Check all nodes in selection for images
      const nodes = selection.getNodes();
      for (const node of nodes) {
        if ($isImageNode(node)) {
          setSelectedImageNode(node as ImageNode);
          setSelectedImageAlignment((node as ImageNode).getAlignment());
          return true;
        }
        
        // Also check parent nodes (in case image is in a container)
        let parent = node.getParent();
        while (parent) {
          if ($isImageNode(parent)) {
            setSelectedImageNode(parent as ImageNode);
            setSelectedImageAlignment((parent as ImageNode).getAlignment());
            return true;
          }
          parent = parent.getParent();
        }
      }
    }
    
    setSelectedImageNode(null);
    setSelectedImageAlignment('left');
    return false;
  }, []);

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
      // Check if image is selected
      const isImageSelected = checkImageSelection();
      
      if (!isImageSelected) {
        // Normal text selection logic
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

        const node = selection.anchor.getNode();
        const parent = node.getParent();
        setIsLink($isLinkNode(parent));

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
            if (type === 'check') {
              setBlockType('check');
            } else if (type === 'bullet') {
              setBlockType('bullet');
            } else {
              setBlockType('number');
            }
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
    }
  }, [editor, getCurrentFontStyles, checkImageSelection]);

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

  const formatText = (format: TextFormatType) => {
    editor.dispatchCommand(FORMAT_TEXT_COMMAND, format);
  };

  // ENHANCED: Format element with image support
  const formatElement = (format: 'left' | 'center' | 'right' | 'justify') => {
    if (selectedImageNode) {
      // Format image alignment
      if (format !== 'justify') { // Images don't support justify
        editor.dispatchCommand(SET_IMAGE_ALIGNMENT_COMMAND, {
          nodeKey: selectedImageNode.getKey(),
          alignment: format as 'left' | 'center' | 'right'
        });
        setSelectedImageAlignment(format as 'left' | 'center' | 'right');
      }
    } else {
      // Format text element alignment
      editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, format);
      setElementFormat(format);
    }
  };

  const insertList = (listType: 'bullet' | 'number' | 'check') => {
    if (listType === 'bullet') {
      editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined);
    } else if (listType === 'number') {
      editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined);
    } else if (listType === 'check') {
      editor.dispatchCommand(INSERT_CHECK_LIST_COMMAND, undefined);
    }
  };

  const formatHeading = (headingSize: string) => {
    editor.update(() => {
      try {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
          const anchorNode = selection.anchor.getNode();
          const element = anchorNode.getKey() === 'root' 
            ? anchorNode 
            : anchorNode.getTopLevelElementOrThrow();
          
          let newNode: ElementNode;
          
          if (headingSize === 'h1' || headingSize === 'h2' || headingSize === 'h3' || 
              headingSize === 'h4' || headingSize === 'h5' || headingSize === 'h6') {
            newNode = $createHeadingNode(headingSize as HeadingTagType);
          } else if (headingSize === 'quote') {
            newNode = $createQuoteNode();
          } else {
            newNode = $createParagraphNode();
          }
          
          if ($isElementNode(element)) {
            const children = element.getChildren();
            children.forEach((child: LexicalNode) => {
              newNode.append(child);
            });
          }
          
          element.replace(newNode);
          newNode.selectEnd();
        }
      } catch (error) {
        console.warn('Error formatting heading:', error);
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
          selection.insertText('');
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

  const openImageModal = () => {
    setIsImageModalOpen(true);
  };

  const handleImageInsert = (imageData: { src: string; altText: string }) => {
    editor.dispatchCommand(INSERT_IMAGE_COMMAND, {
      src: imageData.src,
      altText: imageData.altText,
      maxWidth: 300,
    });
    setIsImageModalOpen(false);
  };

  const openLinkModal = () => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        setSelectedText(selection.getTextContent());
      }
    });
    setIsLinkModalOpen(true);
  };

  const handleLinkInsert = (linkData: { url: string; text: string }) => {
    editor.dispatchCommand(INSERT_LINK_COMMAND, {
      url: linkData.url,
      text: linkData.text,
    });
    setIsLinkModalOpen(false);
  };

  const openCodeBlockModal = () => {
    setIsCodeBlockModalOpen(true);
  };

  const handleCodeBlockInsert = (codeData: { code: string; language: string }) => {
    editor.dispatchCommand(INSERT_CODE_BLOCK_COMMAND, {
      code: codeData.code,
      language: codeData.language,
    });
    setIsCodeBlockModalOpen(false);
  };

  const getToolbarStyles = (): React.CSSProperties => ({
    position: shouldStick ? 'fixed' : 'sticky',
    top: shouldStick ? `${stickyOffset}px` : '0px',
    left: shouldStick ? '0' : 'auto',
    right: shouldStick ? '0' : 'auto',
    width: shouldStick ? '100%' : 'auto',
    zIndex: shouldStick ? 1000 : 1000, 
    minHeight: shouldStick ? (isMobile ? '80px' : '120px') : (isMobile ? '48px' : '56px'),
    height: 'auto',
    maxHeight: shouldStick ? '150px' : 'none',
    display: 'flex',
    alignItems: shouldStick ? 'flex-start' : 'center', 
    alignContent: shouldStick ? 'flex-start' : 'center',
    justifyContent: 'flex-start',
    gap: isMobile ? '2px' : '4px',
    padding: shouldStick 
      ? (isMobile ? '8px 16px' : '12px 16px') 
      : (isMobile ? '6px 12px' : '8px 16px'),
    
    borderBottom: `1px solid ${isCurrentlyDarkMode ? '#374151' : '#e2e8f0'}`,
    backgroundColor: isCurrentlyDarkMode ? '#1e2e4a' : '#ffffff',
    borderTopLeftRadius: shouldStick ? '0px' : '8px',
    borderTopRightRadius: shouldStick ? '0px' : '8px',
    borderBottomLeftRadius: '0px',
    borderBottomRightRadius: '0px',
    
    boxShadow: shouldStick 
      ? (isCurrentlyDarkMode ? '0 8px 25px rgba(0, 0, 0, 0.5)' : '0 8px 25px rgba(0, 0, 0, 0.2)')
      : (isScrolled 
          ? (isCurrentlyDarkMode ? '0 4px 12px rgba(0, 0, 0, 0.4)' : '0 4px 12px rgba(0, 0, 0, 0.15)')
          : (isCurrentlyDarkMode ? '0 2px 8px rgba(0, 0, 0, 0.3)' : '0 2px 8px rgba(0, 0, 0, 0.1)')),

    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    backdropFilter: shouldStick ? 'blur(12px)' : 'blur(8px)',

    flexWrap: 'wrap',
    overflow: 'visible',
    overflowX: 'visible',
    overflowY: 'visible',

    ...(shouldStick && {
      marginBottom: '0px',
      borderLeft: 'none',
      borderRight: 'none',
    })
  });

  // NEW: Get current alignment based on selection type
  const getCurrentAlignment = () => {
    if (selectedImageNode) {
      return selectedImageAlignment;
    }
    return elementFormat;
  };

  if (isMobile && showMobileCompact) {
    return (
      <>
        <div 
          ref={toolbarRef}
          className={`lexical-toolbar mobile-compact ${isCurrentlyDarkMode ? 'dark-mode' : ''} ${shouldStick ? 'floating' : ''}`}
          style={getToolbarStyles()}
        >
          <div style={{ display: 'flex', gap: '2px', alignItems: 'center' }}>
            <ToolbarButton onClick={undo} disabled={!canUndo} title="Undo" isDarkMode={isCurrentlyDarkMode}>
              <UndoIcon fontSize="small" />
            </ToolbarButton>
            <ToolbarButton onClick={redo} disabled={!canRedo} title="Redo" isDarkMode={isCurrentlyDarkMode}>
              <RedoIcon fontSize="small" />
            </ToolbarButton>
          </div>

          <ToolbarDivider isDarkMode={isCurrentlyDarkMode} />

          <ToolbarDropdown
            value={blockType}
            onChange={formatHeading}
            options={blockTypeOptions}
            isDarkMode={isCurrentlyDarkMode}
            width="100px"
          />

          <ToolbarDivider isDarkMode={isCurrentlyDarkMode} />

          <div style={{ display: 'flex', gap: '2px' }}>
            <ToolbarButton
              onClick={() => formatText('bold')}
              active={activeFormats.bold}
              title="Bold"
              isDarkMode={isCurrentlyDarkMode}
            >
              <FormatBoldIcon fontSize="small" />
            </ToolbarButton>
            
            <ToolbarButton
              onClick={() => formatText('italic')}
              active={activeFormats.italic}
              title="Italic"
              isDarkMode={isCurrentlyDarkMode}
            >
              <FormatItalicIcon fontSize="small" />
            </ToolbarButton>

            <ToolbarButton
              onClick={openLinkModal}
              active={isLink}
              title="Link"
              isDarkMode={isCurrentlyDarkMode}
            >
              <LinkIcon fontSize="small" />
            </ToolbarButton>
          </div>
        </div>

        {shouldStick && (
          <div style={{ height: '64px' }} />
        )}

        <ImageUploadModal
          isOpen={isImageModalOpen}
          onClose={() => setIsImageModalOpen(false)}
          onInsert={handleImageInsert}
          isDarkMode={isCurrentlyDarkMode}
        />

        <LinkModal
          isOpen={isLinkModalOpen}
          onClose={() => setIsLinkModalOpen(false)}
          onInsert={handleLinkInsert}
          initialText={selectedText}
          isDarkMode={isCurrentlyDarkMode}
        />

        <CodeBlockModal
          isOpen={isCodeBlockModalOpen}
          onClose={() => setIsCodeBlockModalOpen(false)}
          onInsert={handleCodeBlockInsert}
          isDarkMode={isCurrentlyDarkMode}
        />
      </>
    );
  }

  return (
    <>
      <div 
        ref={toolbarRef}
        className={`lexical-toolbar ${isCurrentlyDarkMode ? 'dark-mode' : ''} ${isScrolled ? 'scrolled' : ''} ${shouldStick ? 'floating' : ''}`}
        style={getToolbarStyles()}
      >
        <div style={{ display: 'flex', gap: '2px', marginRight: '4px' }}>
          <ToolbarButton onClick={undo} disabled={!canUndo} title="Undo (Ctrl+Z)" isDarkMode={isCurrentlyDarkMode}>
            <UndoIcon fontSize="small" />
          </ToolbarButton>
          <ToolbarButton onClick={redo} disabled={!canRedo} title="Redo (Ctrl+Y)" isDarkMode={isCurrentlyDarkMode}>
            <RedoIcon fontSize="small" />
          </ToolbarButton>
        </div>

        <ToolbarDivider isDarkMode={isCurrentlyDarkMode} />
        
        {/* Show different controls based on selection type */}
        {!selectedImageNode && (
          <div style={{ display: 'flex', gap: '6px', alignItems: 'center', marginRight: '4px' }}>
            <ToolbarDropdown
              value={blockType}
              onChange={formatHeading}
              options={blockTypeOptions}
              isDarkMode={isCurrentlyDarkMode}
              width="120px"
              title="Block Type"
            />

            <ToolbarDropdown
              value={fontFamily}
              onChange={handleFontFamilyChange}
              options={fontFamilyOptions}
              isDarkMode={isCurrentlyDarkMode}
              width="110px"
              title="Font Family"
            />

            <ToolbarDropdown
              value={fontSize}
              onChange={handleFontSizeChange}
              options={fontSizeOptions}
              isDarkMode={isCurrentlyDarkMode}
              width="70px"
              title="Font Size"
            />
          </div>
        )}

        {/* Image selection indicator */}
        {selectedImageNode && (
          <div style={{ 
            display: 'flex', 
            gap: '6px', 
            alignItems: 'center', 
            marginRight: '4px',
            padding: '4px 8px',
            backgroundColor: isCurrentlyDarkMode ? 'rgba(70, 191, 232, 0.2)' : 'rgba(70, 191, 232, 0.1)',
            borderRadius: '4px',
            border: '1px solid var(--color-light-mode)'
          }}>
            <ImageIcon fontSize="small" style={{ color: 'var(--color-light-mode)' }} />
            <span style={{ 
              fontSize: '12px', 
              fontWeight: 500,
              color: 'var(--color-light-mode)'
            }}>
              Image Selected
            </span>
          </div>
        )}

        <ToolbarDivider isDarkMode={isCurrentlyDarkMode} />

        {/* Text formatting - disabled when image is selected */}
        <div style={{ display: 'flex', gap: '2px', marginRight: '4px' }}>
          <ToolbarButton
            onClick={() => formatText('bold')}
            active={!selectedImageNode && activeFormats.bold}
            title="Bold (Ctrl+B)"
            isDarkMode={isCurrentlyDarkMode}
            disabled={!!selectedImageNode}
          >
            <FormatBoldIcon fontSize="small" />
          </ToolbarButton>
          
          <ToolbarButton
            onClick={() => formatText('italic')}
            active={!selectedImageNode && activeFormats.italic}
            title="Italic (Ctrl+I)"
            isDarkMode={isCurrentlyDarkMode}
            disabled={!!selectedImageNode}
          >
            <FormatItalicIcon fontSize="small" />
          </ToolbarButton>
          
          <ToolbarButton
            onClick={() => formatText('underline')}
            active={!selectedImageNode && activeFormats.underline}
            title="Underline (Ctrl+U)"
            isDarkMode={isCurrentlyDarkMode}
            disabled={!!selectedImageNode}
          >
            <FormatUnderlinedIcon fontSize="small" />
          </ToolbarButton>
          
          <ToolbarButton
            onClick={() => formatText('strikethrough')}
            active={!selectedImageNode && activeFormats.strikethrough}
            title="Strikethrough"
            isDarkMode={isCurrentlyDarkMode}
            disabled={!!selectedImageNode}
          >
            <FormatStrikethroughIcon fontSize="small" />
          </ToolbarButton>

          <ToolbarButton
            onClick={() => formatText('code')}
            active={!selectedImageNode && activeFormats.code}
            title="Inline Code"
            isDarkMode={isCurrentlyDarkMode}
            disabled={!!selectedImageNode}
          >
            <CodeIcon fontSize="small" />
          </ToolbarButton>
        </div>

        <ToolbarDivider isDarkMode={isCurrentlyDarkMode} />

        <div style={{ display: 'flex', gap: '2px', marginRight: '4px' }}>
          <ToolbarButton
            onClick={() => formatText('subscript')}
            active={!selectedImageNode && activeFormats.subscript}
            title="Subscript"
            isDarkMode={isCurrentlyDarkMode}
            disabled={!!selectedImageNode}
          >
            <SubscriptIcon fontSize="small" />
          </ToolbarButton>
          
          <ToolbarButton
            onClick={() => formatText('superscript')}
            active={!selectedImageNode && activeFormats.superscript}
            title="Superscript"
            isDarkMode={isCurrentlyDarkMode}
            disabled={!!selectedImageNode}
          >
            <SuperscriptIcon fontSize="small" />
          </ToolbarButton>

          <ToolbarButton
            onClick={clearFormatting}
            title="Clear Formatting"
            isDarkMode={isCurrentlyDarkMode}
            disabled={!!selectedImageNode}
          >
            <FormatClearIcon fontSize="small" />
          </ToolbarButton>
        </div>

        <ToolbarDivider isDarkMode={isCurrentlyDarkMode} />
        
        {/* ENHANCED: Alignment buttons work for both text and images */}
        <div style={{ display: 'flex', gap: '2px', marginRight: '4px' }}>
          <ToolbarButton
            onClick={() => formatElement('left')}
            active={getCurrentAlignment() === 'left'}
            title={selectedImageNode ? "Align Image Left" : "Align Left"}
            isDarkMode={isCurrentlyDarkMode}
          >
            <FormatAlignLeftIcon fontSize="small" />
          </ToolbarButton>
          
          <ToolbarButton
            onClick={() => formatElement('center')}
            active={getCurrentAlignment() === 'center'}
            title={selectedImageNode ? "Center Image" : "Align Center"}
            isDarkMode={isCurrentlyDarkMode}
          >
            <FormatAlignCenterIcon fontSize="small" />
          </ToolbarButton>
          
          <ToolbarButton
            onClick={() => formatElement('right')}
            active={getCurrentAlignment() === 'right'}
            title={selectedImageNode ? "Align Image Right" : "Align Right"}
            isDarkMode={isCurrentlyDarkMode}
          >
            <FormatAlignRightIcon fontSize="small" />
          </ToolbarButton>
          
          <ToolbarButton
            onClick={() => formatElement('justify')}
            active={!selectedImageNode && getCurrentAlignment() === 'justify'}
            title="Justify"
            isDarkMode={isCurrentlyDarkMode}
            disabled={!!selectedImageNode} // Images don't support justify
          >
            <FormatAlignJustifyIcon fontSize="small" />
          </ToolbarButton>
        </div>

        <ToolbarDivider isDarkMode={isCurrentlyDarkMode} />

        {/* List and indent controls - disabled when image is selected */}
        <div style={{ display: 'flex', gap: '2px', marginRight: '4px' }}>
          <ToolbarButton
            onClick={() => insertList('bullet')}
            active={!selectedImageNode && blockType === 'bullet'}
            title="Bullet List"
            isDarkMode={isCurrentlyDarkMode}
            disabled={!!selectedImageNode}
          >
            <FormatListBulletedIcon fontSize="small" />
          </ToolbarButton>
          
          <ToolbarButton
            onClick={() => insertList('number')}
            active={!selectedImageNode && blockType === 'number'}
            title="Numbered List"
            isDarkMode={isCurrentlyDarkMode}
            disabled={!!selectedImageNode}
          >
            <FormatListNumberedIcon fontSize="small" />
          </ToolbarButton>

          <ToolbarButton
            onClick={() => insertList('check')}
            active={!selectedImageNode && blockType === 'check'}
            title="Checklist"
            isDarkMode={isCurrentlyDarkMode}
            disabled={!!selectedImageNode}
          >
            <CheckBoxIcon fontSize="small" />
          </ToolbarButton>

          <ToolbarButton
            onClick={outdentContent}
            title="Decrease Indent"
            isDarkMode={isCurrentlyDarkMode}
            disabled={!!selectedImageNode}
          >
            <FormatIndentDecreaseIcon fontSize="small" />
          </ToolbarButton>
          
          <ToolbarButton
            onClick={indentContent}
            title="Increase Indent"
            isDarkMode={isCurrentlyDarkMode}
            disabled={!!selectedImageNode}
          >
            <FormatIndentIncreaseIcon fontSize="small" />
          </ToolbarButton>
        </div>

        <ToolbarDivider isDarkMode={isCurrentlyDarkMode} />

        <div style={{ display: 'flex', gap: '2px' }}>
          <ToolbarButton
            onClick={() => formatHeading('quote')}
            active={!selectedImageNode && blockType === 'quote'}
            title="Quote"
            isDarkMode={isCurrentlyDarkMode}
            disabled={!!selectedImageNode}
          >
            <FormatQuoteIcon fontSize="small" />
          </ToolbarButton>

          <ToolbarButton
            onClick={insertHorizontalRule}
            title="Horizontal Rule"
            isDarkMode={isCurrentlyDarkMode}
          >
            <HorizontalRuleIcon fontSize="small" />
          </ToolbarButton>

          <ToolbarButton
            onClick={openLinkModal}
            active={!selectedImageNode && isLink}
            title="Insert Link"
            isDarkMode={isCurrentlyDarkMode}
            disabled={!!selectedImageNode}
          >
            <LinkIcon fontSize="small" />
          </ToolbarButton>
          
          <ToolbarButton
            onClick={openImageModal}
            title="Insert Image"
            isDarkMode={isCurrentlyDarkMode}
          >
            <ImageIcon fontSize="small" />
          </ToolbarButton>

          <ToolbarButton
            onClick={openCodeBlockModal}
            title="Insert Code Block"
            isDarkMode={isCurrentlyDarkMode}
          >
            <DataObjectIcon fontSize="small" />
          </ToolbarButton>
        </div>
      </div>

      {shouldStick && (
        <div style={{ height: isMobile ? '48px' : '56px' }} />
      )}

      <ImageUploadModal
        isOpen={isImageModalOpen}
        onClose={() => setIsImageModalOpen(false)}
        onInsert={handleImageInsert}
        isDarkMode={isCurrentlyDarkMode}
      />

      <LinkModal
        isOpen={isLinkModalOpen}
        onClose={() => setIsLinkModalOpen(false)}
        onInsert={handleLinkInsert}
        initialText={selectedText}
        isDarkMode={isCurrentlyDarkMode}
      />

      <CodeBlockModal
        isOpen={isCodeBlockModalOpen}
        onClose={() => setIsCodeBlockModalOpen(false)}
        onInsert={handleCodeBlockInsert}
        isDarkMode={isCurrentlyDarkMode}
      />
    </>
  );
};

export default ComprehensiveLexicalToolbar;