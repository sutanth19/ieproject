// LinkNode.tsx - Updated to use your CSS variable system
import React from 'react';
import {
  $applyNodeReplacement,
  $getSelection,
  $isRangeSelection,
  DOMConversionMap,
  DOMConversionOutput,
  DOMExportOutput,
  EditorConfig,
  ElementNode,
  LexicalNode,
  NodeKey,
  RangeSelection,
  SerializedElementNode,
  Spread,
  $isElementNode,
} from 'lexical';

export interface LinkAttributes {
  target?: string | null;
  rel?: string | null;
  title?: string | null;
}

export interface SerializedLinkNode extends Spread<{
  url: string;
  target?: string | null;
  rel?: string | null;
  title?: string | null;
}, SerializedElementNode> {
  type: 'link';
  version: 1;
}

export class LinkNode extends ElementNode {
  __url: string;
  __target: string | null;
  __rel: string | null;
  __title: string | null;

  static getType(): string {
    return 'link';
  }

  static clone(node: LinkNode): LinkNode {
    return new LinkNode(
      node.__url,
      { 
        target: node.__target, 
        rel: node.__rel, 
        title: node.__title 
      },
      node.__key,
    );
  }

  constructor(
    url: string,
    attributes: { target?: string | null; rel?: string | null; title?: string | null } = {},
    key?: NodeKey,
  ) {
    super(key);
    const { target = null, rel = null, title = null } = attributes;
    this.__url = url;
    this.__target = target;
    this.__rel = rel;
    this.__title = title;
  }

  createDOM(config: EditorConfig): HTMLAnchorElement {
    const element = document.createElement('a');
    element.href = this.__url;
    if (this.__target !== null) {
      element.target = this.__target;
    }
    if (this.__rel !== null) {
      element.rel = this.__rel;
    }
    if (this.__title !== null) {
      element.title = this.__title;
    }
    
    // Use CSS variables for consistent styling
    element.style.cssText = [
      'color: var(--color-light-mode)',
      'text-decoration: underline',
      'cursor: pointer',
      'transition: var(--standard-transition)',
    ].join('; ');
    
    // Add hover effect using CSS
    element.addEventListener('mouseenter', () => {
      element.style.color = 'var(--primary-button-hover)';
    });
    
    element.addEventListener('mouseleave', () => {
      element.style.color = 'var(--color-light-mode)';
    });
    
    return element;
  }

  updateDOM(
    prevNode: LinkNode,
    dom: HTMLAnchorElement,
    config: EditorConfig,
  ): boolean {
    const url = this.__url;
    const target = this.__target;
    const rel = this.__rel;
    const title = this.__title;
    
    if (url !== prevNode.__url) {
      dom.href = url;
    }

    if (target !== prevNode.__target) {
      if (target) {
        dom.target = target;
      } else {
        dom.removeAttribute('target');
      }
    }

    if (rel !== prevNode.__rel) {
      if (rel) {
        dom.rel = rel;
      } else {
        dom.removeAttribute('rel');
      }
    }

    if (title !== prevNode.__title) {
      if (title) {
        dom.title = title;
      } else {
        dom.removeAttribute('title');
      }
    }
    return false;
  }

  static importDOM(): DOMConversionMap | null {
    return {
      a: (node: Node) => ({
        conversion: convertAnchorElement,
        priority: 1,
      }),
    };
  }

  static importJSON(serializedNode: SerializedLinkNode): LinkNode {
    const node = $createLinkNode(serializedNode.url, {
      target: serializedNode.target || null,
      rel: serializedNode.rel || null,
      title: serializedNode.title || null,
    });
    node.setFormat(serializedNode.format);
    node.setIndent(serializedNode.indent);
    node.setDirection(serializedNode.direction);
    return node;
  }

  exportDOM(): DOMExportOutput {
    const element = document.createElement('a');
    element.href = this.__url;
    if (this.__target !== null) {
      element.target = this.__target;
    }
    if (this.__rel !== null) {
      element.rel = this.__rel;
    }
    if (this.__title !== null) {
      element.title = this.__title;
    }
    
    // Apply your design system styling for export
    element.style.cssText = [
      'color: #46BFE8', // Use hardcoded color for export since CSS vars may not be available
      'text-decoration: underline',
      'cursor: pointer',
      'transition: all 0.3s ease',
    ].join('; ');
    
    return { element };
  }

  exportJSON(): SerializedLinkNode {
    return {
      ...super.exportJSON(),
      rel: this.getRel(),
      target: this.getTarget(),
      title: this.getTitle(),
      type: 'link',
      url: this.getURL(),
      version: 1,
    };
  }

  getURL(): string {
    return this.getLatest().__url;
  }

  setURL(url: string): void {
    const writable = this.getWritable();
    writable.__url = url;
  }

  getTarget(): string | null {
    return this.getLatest().__target;
  }

  setTarget(target: string | null): void {
    const writable = this.getWritable();
    writable.__target = target;
  }

  getRel(): string | null {
    return this.getLatest().__rel;
  }

  setRel(rel: string | null): void {
    const writable = this.getWritable();
    writable.__rel = rel;
  }

  getTitle(): string | null {
    return this.getLatest().__title;
  }

  setTitle(title: string | null): void {
    const writable = this.getWritable();
    writable.__title = title;
  }

  insertNewAfter(
    selection: RangeSelection,
    restoreSelection = true,
  ): null | ElementNode {
    const element = this.getParentOrThrow().insertNewAfter(
      selection,
      restoreSelection,
    );
    if (element && $isElementNode(element)) {
      const linkNode = $createLinkNode(this.__url, {
        rel: this.__rel,
        target: this.__target,
        title: this.__title,
      });
      element.append(linkNode);
      return linkNode;
    }
    return null;
  }

  canInsertTextBefore(): false {
    return false;
  }

  canInsertTextAfter(): false {
    return false;
  }

  canBeEmpty(): false {
    return false;
  }

  isInline(): true {
    return true;
  }

  extractWithChild(
    child: LexicalNode,
    selection: RangeSelection,
    destination: 'clone' | 'html',
  ): boolean {
    if (!$isRangeSelection(selection)) {
      return false;
    }

    const anchorNode = selection.anchor.getNode();
    const focusNode = selection.focus.getNode();

    return (
      this.isParentOf(anchorNode) &&
      this.isParentOf(focusNode) &&
      selection.getTextContent().length > 0
    );
  }
}

function convertAnchorElement(domNode: Node): null | DOMConversionOutput {
  let node = null;
  if (domNode instanceof HTMLAnchorElement) {
    const content = domNode.textContent;
    if ((content !== null && content !== '') || domNode.children.length > 0) {
      node = $createLinkNode(domNode.getAttribute('href') || '', {
        rel: domNode.getAttribute('rel'),
        target: domNode.getAttribute('target'),
        title: domNode.getAttribute('title'),
      });
    }
  }
  return { node };
}

export function $createLinkNode(
  url: string,
  attributes?: LinkAttributes,
): LinkNode {
  return $applyNodeReplacement(new LinkNode(url, attributes));
}

export function $isLinkNode(
  node: LexicalNode | null | undefined,
): node is LinkNode {
  return node instanceof LinkNode;
}