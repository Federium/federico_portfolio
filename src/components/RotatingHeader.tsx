'use client';

import { ReactNode, useEffect, useRef } from 'react';
import { gsap } from 'gsap';

interface RotatingHeaderProps {
  children: ReactNode;
}

export const RotatingHeader = ({ children }: RotatingHeaderProps) => {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    if (!headerRef.current) return;

    const resetFall = () => {
      // Cancella l'animazione precedente se esiste
      if (animationRef.current) {
        animationRef.current.kill();
      }
      
      // Ritorna immediatamente alla posizione originale
      gsap.to(headerRef.current, {
        y: 0,
        rotation: 0,
        opacity: 1,
        duration: 0.4,
        ease: 'back.out(1.7)',
      });
      
      // Cancella il timeout precedente
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      
      // Imposta un nuovo timeout per iniziare la caduta dopo 10 secondi
      timeoutRef.current = setTimeout(() => {
        if (!headerRef.current) return;
        
        // Trova il footer
        const footer = document.querySelector('footer');
        let fallDistance = window.innerHeight;
        
        if (footer) {
          // Calcola la distanza tra l'header e il footer
          const headerRect = headerRef.current.getBoundingClientRect();
          const footerRect = footer.getBoundingClientRect();
          // Il bottom del testo deve sbattere sul top del footer
          // Quindi sottrai l'altezza del testo stesso
          fallDistance = footerRect.top - headerRect.top - headerRect.height;
        }
        
        // Crea una timeline per la caduta con gravità
        animationRef.current = gsap.timeline();
        
        animationRef.current.to(headerRef.current, {
          y: fallDistance,
          duration: 1.2,
          ease: 'power2.in', // Accelerazione come gravità
        })
        // Aggiungi un piccolo rimbalzo
        .to(headerRef.current, {
          y: fallDistance - 20, // Rimbalza su di 20px
          duration: 0.15,
          ease: 'power1.out',
        })
        .to(headerRef.current, {
          y: fallDistance,
          duration: 0.1,
          ease: 'power1.in',
        });
      }, 10000); 
    };

    // Avvia il timer iniziale
    resetFall();

    // Aggiungi listener per il movimento del mouse
    window.addEventListener('mousemove', resetFall);
    
    // Cleanup
    return () => {
      window.removeEventListener('mousemove', resetFall);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      if (animationRef.current) {
        animationRef.current.kill();
      }
    };
  }, []);

  return (
    <div
      ref={headerRef}
      style={{
        mixBlendMode: 'difference',
      }}
    >
      {children}
    </div>
  );
};
