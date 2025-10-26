"use client";

import { FC, useEffect, useRef } from "react";

export const TypewriterName: FC<{ children: React.ReactNode }> = ({ children }) => {
  const containerRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    
    if (prefersReducedMotion || !containerRef.current) {
      return;
    }

    const container = containerRef.current;
    
    // Aspetta che EmojiText finisca il suo lavoro
    setTimeout(() => {
      // Prima trova il text node con "Federico Morsia"
      const walker = document.createTreeWalker(
        container,
        NodeFilter.SHOW_TEXT,
        null
      );

      const textNodes: Text[] = [];
      let node;
      while (node = walker.nextNode()) {
        textNodes.push(node as Text);
      }

      let targetNode: Text | null = null;
      let beforeText = '';
      let afterText = '';
      
      for (const textNode of textNodes) {
        const text = textNode.textContent || '';
        const match = text.match(/(.*?)(Federico Morsia)(.*)/);
        if (match) {
          targetNode = textNode;
          beforeText = match[1];
          afterText = match[3];
          break;
        }
      }

      if (!targetNode) {
        return;
      }

      // Crea gli span per le diverse parti
      const beforeSpan = document.createElement('span');
      beforeSpan.textContent = beforeText;
      beforeSpan.className = 'typewriter-hidden';
      beforeSpan.setAttribute('data-typewriter', 'true');
      beforeSpan.setAttribute('style', 'opacity: 0 !important;');

      const nameSpan = document.createElement('span');
      nameSpan.textContent = '';
      nameSpan.className = 'typewriter-visible';
      nameSpan.setAttribute('data-typewriter', 'true');
      nameSpan.setAttribute('style', 'opacity: 1 !important;');

      const afterSpan = document.createElement('span');
      afterSpan.textContent = afterText;
      afterSpan.className = 'typewriter-hidden';
      afterSpan.setAttribute('data-typewriter', 'true');
      afterSpan.setAttribute('style', 'opacity: 0 !important;');

      // Sostituisci il nodo di testo con i nostri span
      const parent = targetNode.parentNode;
      if (parent) {
        parent.insertBefore(beforeSpan, targetNode);
        parent.insertBefore(nameSpan, targetNode);
        parent.insertBefore(afterSpan, targetNode);
        parent.removeChild(targetNode);
      }

      // ORA nascondi TUTTI gli altri text nodes wrappandoli in span
      // Rifaccio il tree walker per prendere i text nodes aggiornati
      const walker2 = document.createTreeWalker(
        container,
        NodeFilter.SHOW_TEXT,
        null
      );

      const remainingTextNodes: Text[] = [];
      let node2;
      while (node2 = walker2.nextNode()) {
        remainingTextNodes.push(node2 as Text);
      }

      const hiddenTextSpans: HTMLSpanElement[] = [];
      remainingTextNodes.forEach((textNode) => {
        if (textNode.textContent && textNode.textContent.trim()) {
          const span = document.createElement('span');
          span.textContent = textNode.textContent;
          span.className = 'typewriter-hidden';
          span.setAttribute('style', 'opacity: 0 !important;');
          textNode.parentNode?.replaceChild(span, textNode);
          hiddenTextSpans.push(span);
        }
      });

      // Nascondi TUTTI i child elements (eccetto i nostri span di controllo)
      const allElements = container.getElementsByTagName('*');
      const hiddenElements: HTMLElement[] = [];
      
      for (let i = 0; i < allElements.length; i++) {
        const element = allElements[i] as HTMLElement;
        // Non nascondere i nostri span appena creati per Federico Morsia
        if (element !== nameSpan && element !== beforeSpan && element !== afterSpan && 
            !hiddenTextSpans.includes(element as HTMLSpanElement)) {
          
          // NON nascondere elementi che contengono nameSpan come discendente
          if (!element.contains(nameSpan)) {
            element.className = (element.className || '') + ' typewriter-hidden';
            element.setAttribute('style', (element.getAttribute('style') || '') + '; opacity: 0 !important;');
            hiddenElements.push(element);
          }
        }
      }

      // Animazione typewriter per il nome
      const nameText = "Federico Morsia";
      let currentIndex = 0;

      const typewriterInterval = setInterval(() => {
        if (currentIndex <= nameText.length) {
          nameSpan.textContent = nameText.slice(0, currentIndex);
          currentIndex++;
        } else {
          clearInterval(typewriterInterval);
          // Dopo il typewriter, mostra TUTTO il resto del testo con fade-in
          setTimeout(() => {
            beforeSpan.setAttribute('style', 'opacity: 1 !important; transition: opacity 0.7s ease-in;');
            afterSpan.setAttribute('style', 'opacity: 1 !important; transition: opacity 0.7s ease-in;');
            
            // Mostra anche tutti gli altri elementi nascosti
            hiddenElements.forEach((el) => {
              const currentStyle = el.getAttribute('style') || '';
              const styleWithoutOpacity = currentStyle.replace(/opacity:\s*0\s*!important;?/g, '');
              el.setAttribute('style', styleWithoutOpacity + '; opacity: 1 !important; transition: opacity 0.7s ease-in;');
            });
            
            // Mostra anche tutti i text nodes nascosti
            hiddenTextSpans.forEach((span) => {
              span.setAttribute('style', 'opacity: 1 !important; transition: opacity 0.5s ease-in;');
            });
          }, 400);
        }
      }, 80);
    }, 100); // Aumentato il delay per aspettare EmojiText
  }, []);

  return (
    <span ref={containerRef}>
      {children}
    </span>
  );
};
