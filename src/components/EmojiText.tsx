'use client';

import { ReactNode, useEffect, useRef } from 'react';

interface EmojiTextProps {
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export const EmojiText = ({ children, className, style }: EmojiTextProps) => {
  const ref = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (!ref.current) return;

    const textNodes: Text[] = [];
    const walker = document.createTreeWalker(
      ref.current,
      NodeFilter.SHOW_TEXT,
      null
    );

    let node;
    while ((node = walker.nextNode())) {
      textNodes.push(node as Text);
    }

    textNodes.forEach((textNode) => {
      // Salta i nodi che sono gestiti dal TypewriterName
      const parent = textNode.parentNode as HTMLElement;
      if (parent && parent.hasAttribute && parent.hasAttribute('data-typewriter')) {
        return;
      }
      
      const text = textNode.textContent || '';
      // Regex più completa per emoji
      const emojiRegex = /(\p{Emoji_Presentation}|\p{Extended_Pictographic}|[\u{1F300}-\u{1F9FF}])/gu;
      
      if (emojiRegex.test(text)) {
        const fragment = document.createDocumentFragment();
        const parts = text.split(emojiRegex);
        
        parts.forEach((part) => {
          if (part && emojiRegex.test(part)) {
            const span = document.createElement('span');
            span.style.mixBlendMode = 'normal';
            span.style.filter = 'invert(1)';
            span.textContent = part;
            fragment.appendChild(span);
          } else if (part) {
            fragment.appendChild(document.createTextNode(part));
          }
        });
        
        textNode.parentNode?.replaceChild(fragment, textNode);
      }
    });
  }, [children]);

  return (
    <h1 ref={ref} className={className} style={style}>
      {children}
    </h1>
  );
};
