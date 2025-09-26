'use client';

import { useEffect, useRef, ReactNode } from 'react';

interface AnimatedTextProps {
  children: ReactNode;
  className?: string;
}

const AnimatedText = ({ children, className }: AnimatedTextProps) => {
  const textRef = useRef<HTMLHeadingElement>(null);
  const animationsRef = useRef<Map<HTMLElement, NodeJS.Timeout>>(new Map());
  
  // Set di caratteri per l'animazione
  const characterSet = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{}|;:,.<>?";

  const animateCharacter = (element: HTMLElement) => {
    if (animationsRef.current.has(element)) {
      clearInterval(animationsRef.current.get(element));
    }

    const interval = setInterval(() => {
      const randomChar = characterSet[Math.floor(Math.random() * characterSet.length)];
      element.textContent = randomChar;
    }, 50);
    
    animationsRef.current.set(element, interval);
  };

  const stopAnimation = (element: HTMLElement) => {
    // Continua l'animazione per un po' dopo aver tolto il mouse
    setTimeout(() => {
      const interval = animationsRef.current.get(element);
      if (interval) {
        clearInterval(interval);
        animationsRef.current.delete(element);
        // Ottieni il carattere originale dall'attributo data
        const originalChar = element.getAttribute('data-original-char') || '';
        element.textContent = originalChar;
      }
    }, 1000); // Continua per 1000ms dopo aver tolto il mouse
  };

  useEffect(() => {
    const element = textRef.current;
    if (!element) return;

    const wrapCharacters = (element: HTMLElement) => {
      const walker = document.createTreeWalker(
        element,
        NodeFilter.SHOW_TEXT
      );

      const textNodes: Text[] = [];
      let node: Text | null;
      
      while (node = walker.nextNode() as Text) {
        if (node.textContent && node.textContent.trim()) {
          textNodes.push(node);
        }
      }

      textNodes.forEach(textNode => {
        const text = textNode.textContent || '';
        const parent = textNode.parentElement;
        
        if (!parent) return;
        
        const isInsideLink = parent.tagName === 'A' || parent.closest('a') !== null;
        const fragment = document.createDocumentFragment();
        
        [...text].forEach(char => {
          if (char === ' ') {
            fragment.appendChild(document.createTextNode(' '));
          } else {
            const span = document.createElement('span');
            span.textContent = char;
            span.style.display = 'inline-block';
            span.style.cursor = isInsideLink ? 'pointer' : 'default';
            span.style.userSelect = 'none';
            span.style.webkitUserSelect = 'none';
            span.setAttribute('data-original-char', char);
            
            // Se è dentro un link, mantieni l'underline e migliora l'interazione
            if (isInsideLink) {
              span.style.textDecoration = 'underline';
              span.style.textUnderlineOffset = '2px';
              
              // Permetti hover sui singoli caratteri e lascia che il <a> gestisca il click normalmente
              span.style.pointerEvents = 'auto';
              // Fix per Safari: forza il click sul <a> quando il trackpad non lo propaga
              span.addEventListener('mouseup', () => {
                const link = parent.closest('a');
                if (link) {
                  link.click();
                }
              });
            }
            
            span.addEventListener('mouseenter', () => {
              animateCharacter(span);
            });
            
            span.addEventListener('mouseleave', () => {
              stopAnimation(span);
            });
            
            fragment.appendChild(span);
          }
        });
        
        parent.replaceChild(fragment, textNode);
      });
    };

    // Usa setTimeout per assicurarti che il DOM sia pronto
    const timer = setTimeout(() => {
      wrapCharacters(element);
    }, 100);

    // Copia il ref corrente per evitare warning
    const currentAnimations = animationsRef.current;

    return () => {
      clearTimeout(timer);
      currentAnimations.forEach((interval) => clearInterval(interval));
      currentAnimations.clear();
    };
  }, [children]);

  return (
    <h1 ref={textRef} className={className}>
      {children}
    </h1>
  );
};

export default AnimatedText;