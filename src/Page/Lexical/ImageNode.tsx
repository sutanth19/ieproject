// Enhanced ImageNode.tsx - Click to show tools instead of hover
import React, { useRef, useState, useCallback } from 'react';
import {
  DecoratorNode,
  NodeKey,
  LexicalNode,
  EditorConfig,
  SerializedLexicalNode,
  Spread,
  $getNodeByKey,
  DOMExportOutput,
} from 'lexical';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';

export interface ImagePayload {
  altText: string;
  height?: number;
  maxWidth?: number;
  src: string;
  width?: number;
  alignment?: 'left' | 'center' | 'right';
  key?: NodeKey;
}

export interface SerializedImageNode extends Spread<{
  altText: string;
  height?: number;
  maxWidth?: number;
  src: string;
  width?: number;
  alignment?: 'left' | 'center' | 'right';
}, SerializedLexicalNode> {
  type: 'image';
  version: 1;
}

export class ImageNode extends DecoratorNode<React.ReactElement> {
  __src: string;
  __altText: string;
  __width: number | undefined;
  __height: number | undefined;
  __maxWidth: number | undefined;
  __alignment: 'left' | 'center' | 'right';

  static getType(): string {
    return 'image';
  }

  static clone(node: ImageNode): ImageNode {
    return new ImageNode(
      node.__src,
      node.__altText,
      node.__maxWidth,
      node.__width,
      node.__height,
      node.__alignment,
      node.__key,
    );
  }

  constructor(
    src: string,
    altText: string,
    maxWidth?: number,
    width?: number,
    height?: number,
    alignment: 'left' | 'center' | 'right' = 'left',
    key?: NodeKey,
  ) {
    super(key);
    this.__src = src;
    this.__altText = altText;
    this.__maxWidth = maxWidth;
    this.__width = width;
    this.__height = height;
    this.__alignment = alignment;
  }

  exportJSON(): SerializedImageNode {
    return {
      altText: this.getAltText(),
      height: this.__height,
      maxWidth: this.__maxWidth,
      src: this.getSrc(),
      alignment: this.__alignment,
      type: 'image',
      version: 1,
      width: this.__width,
    };
  }

  exportDOM(): DOMExportOutput {
    const element = document.createElement('img');
    element.setAttribute('src', this.__src);
    element.setAttribute('alt', this.__altText);
    
    const styles = [
      'max-width: 100%',
      'height: auto',
      'display: block',
      'margin: 1em auto',
      'border-radius: 8px',
      'box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1)',
      'transition: all 0.3s ease'
    ];
    
    if (this.__maxWidth) {
      styles.push(`max-width: ${this.__maxWidth}px`);
    }
    if (this.__width) {
      styles.push(`width: ${this.__width}px`);
    }
    if (this.__height) {
      styles.push(`height: ${this.__height}px`);
    }
    
    element.setAttribute('style', styles.join('; '));
    
    return { element };
  }

  static importJSON(serializedNode: SerializedImageNode): ImageNode {
    const { altText, height, width, maxWidth, src, alignment } = serializedNode;
    const node = $createImageNode({
      altText,
      height,
      maxWidth,
      src,
      width,
      alignment,
    });
    return node;
  }

  getSrc(): string {
    return this.__src;
  }

  getAltText(): string {
    return this.__altText;
  }

  setAltText(altText: string): void {
    const writable = this.getWritable();
    writable.__altText = altText;
  }

  getAlignment(): 'left' | 'center' | 'right' {
    return this.__alignment;
  }

  setAlignment(alignment: 'left' | 'center' | 'right'): void {
    const writable = this.getWritable();
    writable.__alignment = alignment;
  }

  setWidthAndHeight(width: number, height: number): void {
    const writable = this.getWritable();
    writable.__width = width;
    writable.__height = height;
  }

  createDOM(config: EditorConfig): HTMLElement {
    const span = document.createElement('span');
    const theme = config.theme;
    if (theme && theme.image) {
      span.className = theme.image;
    }
    return span;
  }

  updateDOM(): false {
    return false;
  }

  decorate(): React.ReactElement {
    return (
      <ImageComponent
        src={this.__src}
        altText={this.__altText}
        width={this.__width}
        height={this.__height}
        maxWidth={this.__maxWidth}
        alignment={this.__alignment}
        nodeKey={this.getKey()}
      />
    );
  }
}

interface ImageComponentProps {
  altText: string;
  height?: number;
  maxWidth?: number;
  nodeKey: NodeKey;
  src: string;
  width?: number;
  alignment: 'left' | 'center' | 'right';
}

const ImageComponent: React.FC<ImageComponentProps> = ({
  src,
  altText,
  nodeKey,
  width,
  height,
  maxWidth,
  alignment,
}) => {
  const [editor] = useLexicalComposerContext();
  const [isSelected, setIsSelected] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [aspectRatio, setAspectRatio] = useState(1);
  const imageRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Detect dark mode using your system's approach
  const [isDarkMode, setIsDarkMode] = useState(false);
  

  
  React.useEffect(() => {
    const checkDarkMode = () => {
      const container = imageRef.current?.closest('.home-container');
      const editorContainer = imageRef.current?.closest('.lexical-editor-container');
      
      setIsDarkMode(
        container?.classList.contains('dark-mode') || 
        editorContainer?.classList.contains('dark-mode') || 
        document.body.classList.contains('dark-mode') ||
        false
      );
    };
    
    checkDarkMode();
    const observer = new MutationObserver(checkDarkMode);
    if (imageRef.current) {
      observer.observe(document.body, { 
        attributes: true, 
        attributeFilter: ['class'],
        subtree: true 
      });
    }
    
    return () => observer.disconnect();
  }, []);

  // NEW: Listen for alignment changes
  React.useEffect(() => {
    const handleAlignmentChange = (event: CustomEvent) => {
      const { nodeKey: eventNodeKey, alignment: newAlignment, keepSelected } = event.detail;
      
      if (eventNodeKey === nodeKey) {
        // This is for our image, update alignment
        editor.update(() => {
          const node = $getNodeByKey(nodeKey) as ImageNode;
          if (node && node.setAlignment) {
            node.setAlignment(newAlignment);
          }
        });
        
        // Keep the image selected if requested
        if (keepSelected) {
          setIsSelected(true);
        }
      }
    };

    window.addEventListener('imageAlignmentChange', handleAlignmentChange as EventListener);
    
    return () => {
      window.removeEventListener('imageAlignmentChange', handleAlignmentChange as EventListener);
    };
  }, [editor, nodeKey]);

  // UPDATED: Click outside to deselect - IMPROVED to prevent conflicts with toolbar and resize handles
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      
      // Don't deselect if clicking on toolbar buttons, resize handles, or during resize
      if (isResizing ||
          target.closest('.lexical-toolbar') || 
          target.closest('.toolbar-button') ||
          target.closest('[role="button"]') ||
          target.classList.contains('toolbar-button') ||
          target.closest('.editor-image')) { // Don't deselect when clicking resize handles
        return;
      }
      
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        if (isSelected) {
          setIsSelected(false);
          
          // NEW: Dispatch deselection event
          const customEvent = new CustomEvent('imageSelectionChange', {
            detail: {
              imageNode: null,
              isSelected: false
            }
          });
          window.dispatchEvent(customEvent);
        }
      }
    };

    if (isSelected) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isSelected, isResizing]);

  const onDelete = () => {
    editor.update(() => {
      const node = $getNodeByKey(nodeKey);
      if (node) {
        node.remove();
      }
    });
  };

  const getAlignmentStyles = () => {
    switch (alignment) {
      case 'left':
        return {
          margin: '8px 16px 8px 0',
          textAlign: 'left' as const,
          float: 'left' as const,
        };
      case 'right':
        return {
          margin: '8px 0 8px 16px',
          textAlign: 'right' as const,
          float: 'right' as const,
        };
      case 'center':
      default:
        return {
          margin: '8px auto',
          textAlign: 'center' as const,
          float: 'none' as const,
        };
    }
  };

  const handleImageLoad = () => {
    if (imageRef.current && !width && !height) {
      const img = imageRef.current;
      const containerWidth = img.parentElement?.offsetWidth || 400;
      
      // Calculate aspect ratio
      const ratio = img.naturalHeight / img.naturalWidth;
      setAspectRatio(ratio);
    
      let newWidth = img.naturalWidth;
      let newHeight = img.naturalHeight;
      
      const maxDisplayWidth = Math.min(300, containerWidth * 0.8);
      const maxDisplayHeight = 250;
      
      if (img.naturalWidth > maxDisplayWidth) {
        newWidth = maxDisplayWidth;
        newHeight = newWidth * ratio;
      }
      
      if (newHeight > maxDisplayHeight) {
        newHeight = maxDisplayHeight;
        newWidth = newHeight / ratio;
      }
      
      editor.update(() => {
        const node = $getNodeByKey(nodeKey) as ImageNode;
        if (node && node.setWidthAndHeight) {
          node.setWidthAndHeight(Math.round(newWidth), Math.round(newHeight));
        }
      });
    } else if (imageRef.current && width && height) {
      // Set aspect ratio from existing dimensions
      setAspectRatio(height / width);
    }
  };

  // Resize handler for corner handles (maintains aspect ratio) - FIXED
  const handleCornerResize = useCallback((direction: 'nw' | 'ne' | 'sw' | 'se', startX: number, startY: number) => {
    if (!containerRef.current) return;

    const startWidth = width || imageRef.current?.offsetWidth || 200;
    const startHeight = height || imageRef.current?.offsetHeight || 200;
    
    setIsResizing(true);

    const handleMouseMove = (e: MouseEvent) => {
      e.preventDefault();
      
      const deltaX = e.clientX - startX;
      const deltaY = e.clientY - startY;
      
      let newWidth = startWidth;
      let newHeight = startHeight;
      
      // Calculate new dimensions based on corner direction
      switch (direction) {
        case 'se': // Bottom-right
          newWidth = Math.max(50, startWidth + deltaX);
          break;
        case 'sw': // Bottom-left
          newWidth = Math.max(50, startWidth - deltaX);
          break;
        case 'ne': // Top-right
          newWidth = Math.max(50, startWidth + deltaX);
          break;
        case 'nw': // Top-left
          newWidth = Math.max(50, startWidth - deltaX);
          break;
      }
      
      // Maintain aspect ratio
      newHeight = newWidth * aspectRatio;
      
      // Apply max constraints
      const maxWidth = 800;
      const maxHeight = 600;
      
      if (newWidth > maxWidth) {
        newWidth = maxWidth;
        newHeight = newWidth * aspectRatio;
      }
      
      if (newHeight > maxHeight) {
        newHeight = maxHeight;
        newWidth = newHeight / aspectRatio;
      }
      
      // Update the image node
      editor.update(() => {
        const node = $getNodeByKey(nodeKey) as ImageNode;
        if (node && node.setWidthAndHeight) {
          node.setWidthAndHeight(Math.round(newWidth), Math.round(newHeight));
        }
      });
    };

    const handleMouseUp = () => {
      setIsResizing(false);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = 'default';
      document.body.style.userSelect = 'auto';
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    document.body.style.cursor = `${direction}-resize`;
    document.body.style.userSelect = 'none';
  }, [editor, nodeKey, width, height, aspectRatio]);

  // UPDATED: Handle image click to select/deselect
  const handleImageClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    const newSelectedState = !isSelected;
    setIsSelected(newSelectedState);
    
    // NEW: Dispatch custom event to notify toolbar
    const event = new CustomEvent('imageSelectionChange', {
      detail: {
        imageNode: {
          getKey: () => nodeKey,
          getAlignment: () => alignment
        },
        isSelected: newSelectedState
      }
    });
    window.dispatchEvent(event);
  };

  // Resize handle component
  const ResizeHandle: React.FC<{ 
    position: 'nw' | 'ne' | 'sw' | 'se';
    onMouseDown: (e: React.MouseEvent) => void;
  }> = ({ position, onMouseDown }) => {
    const getPositionStyles = () => {
      const baseStyles = {
        position: 'absolute' as const,
        width: '8px',
        height: '8px',
        backgroundColor: 'var(--color-light-mode)',
        border: '1px solid white',
        borderRadius: '1px',
        cursor: `${position}-resize`,
        zIndex: 20,
        transition: 'var(--standard-transition)',
      };

      switch (position) {
        case 'nw':
          return { ...baseStyles, top: '-4px', left: '-4px' };
        case 'ne':
          return { ...baseStyles, top: '-4px', right: '-4px' };
        case 'sw':
          return { ...baseStyles, bottom: '-4px', left: '-4px' };
        case 'se':
          return { ...baseStyles, bottom: '-4px', right: '-4px' };
      }
    };

    return (
      <div
        style={getPositionStyles()}
        onMouseDown={onMouseDown}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = 'var(--primary-button-hover)';
          e.currentTarget.style.transform = 'scale(1.2)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = 'var(--color-light-mode)';
          e.currentTarget.style.transform = 'scale(1)';
        }}
      />
    );
  };

  return (
    <div 
      ref={containerRef}
      className={`editor-image ${isDarkMode ? 'dark-mode' : ''}`}
      style={{
        position: 'relative',
        display: 'block',
        border: isSelected 
          ? '2px solid var(--color-light-mode)' 
          : '2px solid transparent',
        borderRadius: '8px',
        cursor: isResizing ? 'none' : 'pointer',
        maxWidth: alignment === 'center' ? '100%' : maxWidth ? `${maxWidth}px` : '300px',
        transition: 'var(--standard-transition)',
        background: 'transparent',
        padding: 0,
        clear: alignment === 'center' ? 'both' : 'none',
        ...getAlignmentStyles(),
        boxShadow: isSelected 
          ? (isDarkMode 
              ? '0 4px 12px rgba(70, 191, 232, 0.4)' 
              : '0 4px 12px rgba(70, 191, 232, 0.3)')
          : (isDarkMode 
              ? '0 2px 8px rgba(0, 0, 0, 0.3)' 
              : '0 2px 8px rgba(0, 0, 0, 0.1)'),
      }}
      // UPDATED: Use onClick instead of onMouseEnter/onMouseLeave for selection
      onClick={handleImageClick}
    >
      <img
        ref={imageRef}
        src={src}
        alt={altText}
        style={{
          maxWidth: '100%', 
          width: width ? `${width}px` : 'auto',
          height: height ? `${height}px` : 'auto',
          display: 'block',
          borderRadius: '8px',
          objectFit: 'contain',
          margin: 0,
          padding: 0,
          filter: isDarkMode ? 'brightness(0.95)' : 'none',
          // UPDATED: Add subtle hover effect for better UX
          transition: 'all 0.2s ease',
        }}
        onLoad={handleImageLoad}
        draggable={false}
        // UPDATED: Prevent image drag interfering with click
        onMouseDown={(e) => e.preventDefault()}
      />
      
      {/* UPDATED: Show resize handles only when clicked/selected (not on hover) */}
      {isSelected && !isResizing && (
        <>
          <ResizeHandle 
            position="nw" 
            onMouseDown={(e) => {
              e.stopPropagation();
              handleCornerResize('nw', e.clientX, e.clientY);
            }}
          />
          <ResizeHandle 
            position="ne" 
            onMouseDown={(e) => {
              e.stopPropagation();
              handleCornerResize('ne', e.clientX, e.clientY);
            }}
          />
          <ResizeHandle 
            position="sw" 
            onMouseDown={(e) => {
              e.stopPropagation();
              handleCornerResize('sw', e.clientX, e.clientY);
            }}
          />
          <ResizeHandle 
            position="se" 
            onMouseDown={(e) => {
              e.stopPropagation();
              handleCornerResize('se', e.clientX, e.clientY);
            }}
          />
        </>
      )}
      
      {/* UPDATED: Show delete button only when clicked/selected (not on hover) */}
      {isSelected && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          style={{
            position: 'absolute',
            top: '-12px',
            right: '-12px',
            backgroundColor: 'rgba(255, 59, 48, 0.9)',
            color: 'white',
            border: '2px solid white',
            borderRadius: '50%',
            width: '24px',
            height: '24px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: 'bold',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'var(--standard-transition)',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3)',
            zIndex: 30,
          }}
          title="Delete image"
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(255, 59, 48, 1)';
            e.currentTarget.style.transform = 'scale(1.15)';
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(255, 59, 48, 0.4)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(255, 59, 48, 0.9)';
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.3)';
          }}
        >
          ×
        </button>
      )}
    </div>
  );
};

export function $createImageNode({
  altText,
  height,
  maxWidth = 300, 
  src,
  width,
  alignment = 'left',
  key,
}: ImagePayload): ImageNode {
  return new ImageNode(src, altText, maxWidth, width, height, alignment, key);
}

export function $isImageNode(node: LexicalNode | null | undefined): node is ImageNode {
  return node instanceof ImageNode;
}