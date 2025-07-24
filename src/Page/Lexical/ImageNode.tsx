// ImageNode.tsx - Clean Custom Lexical Node for Images
import React, { useRef, useState } from 'react';
import {
  DecoratorNode,
  NodeKey,
  LexicalNode,
  EditorConfig,
  SerializedLexicalNode,
  Spread,
  $getNodeByKey,
} from 'lexical';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';

export interface ImagePayload {
  altText: string;
  height?: number;
  maxWidth?: number;
  src: string;
  width?: number;
  key?: NodeKey;
}

export interface SerializedImageNode extends Spread<{
  altText: string;
  height?: number;
  maxWidth?: number;
  src: string;
  width?: number;
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
      node.__key,
    );
  }

  constructor(
    src: string,
    altText: string,
    maxWidth?: number,
    width?: number,
    height?: number,
    key?: NodeKey,
  ) {
    super(key);
    this.__src = src;
    this.__altText = altText;
    this.__maxWidth = maxWidth;
    this.__width = width;
    this.__height = height;
  }

  exportJSON(): SerializedImageNode {
    return {
      altText: this.getAltText(),
      height: this.__height,
      maxWidth: this.__maxWidth,
      src: this.getSrc(),
      type: 'image',
      version: 1,
      width: this.__width,
    };
  }

  static importJSON(serializedNode: SerializedImageNode): ImageNode {
    const { altText, height, width, maxWidth, src } = serializedNode;
    const node = $createImageNode({
      altText,
      height,
      maxWidth,
      src,
      width,
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
        nodeKey={this.getKey()}
      />
    );
  }
}

// Image Component that renders inside the editor
interface ImageComponentProps {
  altText: string;
  height?: number;
  maxWidth?: number;
  nodeKey: NodeKey;
  src: string;
  width?: number;
}

const ImageComponent: React.FC<ImageComponentProps> = ({
  src,
  altText,
  nodeKey,
  width,
  height,
  maxWidth,
}) => {
  const [editor] = useLexicalComposerContext();
  const [isSelected, setIsSelected] = useState(false);
  const imageRef = useRef<HTMLImageElement>(null);

  const onDelete = () => {
    editor.update(() => {
      const node = $getNodeByKey(nodeKey);
      if (node) {
        node.remove();
      }
    });
  };

  const handleImageLoad = () => {
    if (imageRef.current && !width && !height) {
      const img = imageRef.current;
      // Auto-resize large images
      if (img.naturalWidth > 800) {
        const ratio = img.naturalHeight / img.naturalWidth;
        const newWidth = 800;
        const newHeight = newWidth * ratio;
        
        editor.update(() => {
          const node = $getNodeByKey(nodeKey) as ImageNode;
          if (node && node.setWidthAndHeight) {
            node.setWidthAndHeight(newWidth, newHeight);
          }
        });
      }
    }
  };

  return (
    <div
      style={{
        position: 'relative',
        display: 'inline-block',
        border: isSelected ? '2px solid #3b82f6' : '2px solid transparent',
        borderRadius: '4px',
        margin: '8px 0',
        cursor: 'pointer',
      }}
      onClick={() => setIsSelected(!isSelected)}
    >
      <img
        ref={imageRef}
        src={src}
        alt={altText}
        style={{
          maxWidth: maxWidth ? `${maxWidth}px` : '100%',
          width: width ? `${width}px` : 'auto',
          height: height ? `${height}px` : 'auto',
          display: 'block',
          borderRadius: '4px',
        }}
        onLoad={handleImageLoad}
        draggable={false}
      />
      
      {isSelected && (
        <div
          style={{
            position: 'absolute',
            top: '8px',
            right: '8px',
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            borderRadius: '4px',
            padding: '4px',
          }}
        >
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            style={{
              background: 'none',
              border: 'none',
              color: 'white',
              cursor: 'pointer',
              fontSize: '14px',
              padding: '2px 6px',
              borderRadius: '2px',
            }}
            title="Delete image"
          >
            ×
          </button>
        </div>
      )}
    </div>
  );
};

// Helper function to create image nodes
export function $createImageNode({
  altText,
  height,
  maxWidth = 800,
  src,
  width,
  key,
}: ImagePayload): ImageNode {
  return new ImageNode(src, altText, maxWidth, width, height, key);
}

export function $isImageNode(node: LexicalNode | null | undefined): node is ImageNode {
  return node instanceof ImageNode;
}