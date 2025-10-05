'use client';

import { ReactNode, useEffect, useRef, useState } from 'react';

interface FallingTextProps {
  children: ReactNode;
}

interface Letter {
  char: string;
  x: number;
  y: number;
  originalX: number;
  originalY: number;
  velocity: number;
  velocityX: number;
  rotation: number;
  rotationSpeed: number;
  isFalling: boolean;
  fontSize: number;
  mass: number;
}

export const FallingText = ({ children }: FallingTextProps) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [p5Loaded, setP5Loaded] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const p5Instance = useRef<any>(null);
  const letters = useRef<Letter[]>([]);
  const footerY = useRef<number>(0);

  // Carica p5 solo lato client
  useEffect(() => {
    import('p5')
      .then((p5Module) => {
        setP5Loaded(true);
      })
      .catch((error) => {
        console.error('Error loading p5:', error);
      });
  }, []);

  useEffect(() => {
    if (!p5Loaded) return;

    const resetAnimation = async () => {
      setIsAnimating(false);
      letters.current = [];
      
      if (p5Instance.current) {
        p5Instance.current.remove();
        p5Instance.current = null;
      }
      
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(async () => {
        if (!textRef.current || !canvasRef.current) return;

        // Ottieni la posizione del footer
        const footer = document.querySelector('footer');
        if (footer) {
          const footerRect = footer.getBoundingClientRect();
          footerY.current = footerRect.top + window.scrollY;
        } else {
          footerY.current = window.innerHeight + window.scrollY;
        }

        // Estrai le lettere dal testo
        const extractedLetters: Letter[] = [];
        
        // Funzione ricorsiva per estrarre le lettere da tutti i nodi di testo
        const extractLettersFromNode = (node: Node, parentElement: HTMLElement) => {
          if (node.nodeType === Node.TEXT_NODE) {
            const text = node.textContent || '';
            const computedStyle = window.getComputedStyle(parentElement);
            const fontSize = parseFloat(computedStyle.fontSize);

            for (let i = 0; i < text.length; i++) {
              const char = text[i];
              if (char.trim()) {
                try {
                  const range = document.createRange();
                  range.setStart(node, i);
                  range.setEnd(node, i + 1);
                  const charRect = range.getBoundingClientRect();

                  if (charRect.width > 0 && charRect.height > 0) {
                    extractedLetters.push({
                      char,
                      x: charRect.left + charRect.width / 2,
                      y: charRect.top + window.scrollY + charRect.height / 2,
                      originalX: charRect.left + charRect.width / 2,
                      originalY: charRect.top + window.scrollY + charRect.height / 2,
                      velocity: Math.random() * 2, // Velocità iniziale casuale
                      velocityX: (Math.random() - 0.5) * 3, // Velocità orizzontale casuale
                      rotation: Math.random() * 360, // Rotazione iniziale casuale
                      rotationSpeed: (Math.random() - 0.5) * 10, // Velocità di rotazione casuale
                      isFalling: true,
                      fontSize: fontSize,
                      mass: 0.8 + Math.random() * 0.4, // Massa casuale tra 0.8 e 1.2
                    });
                  }
                } catch (e) {
                  // Ignora errori di range non validi
                  console.warn('Error creating range for character:', e);
                }
              }
            }
          } else if (node.nodeType === Node.ELEMENT_NODE) {
            // Processa ricorsivamente i nodi figli
            const element = node as HTMLElement;
            node.childNodes.forEach((child) => {
              extractLettersFromNode(child, element);
            });
          }
        };

        // Estrai le lettere da tutti i nodi
        if (textRef.current) {
          textRef.current.childNodes.forEach((child) => {
            extractLettersFromNode(child, textRef.current as HTMLElement);
          });
        }

        letters.current = extractedLetters;
        setIsAnimating(true);

        // Importa p5 e crea l'istanza
        try {
          const p5Module = await import('p5');
          const p5 = p5Module.default;

          const sketch = (p: any) => {
            p.setup = () => {
              const canvas = p.createCanvas(window.innerWidth, document.body.scrollHeight);
              canvas.style('pointer-events', 'none');
              p.textAlign(p.CENTER, p.CENTER);
            };

          p.draw = () => {
            p.clear();
            p.fill(255);

            const gravity = 0.6;
            const bounce = 0.4;
            const airResistance = 0.99;
            const rotationDamping = 0.98;

            letters.current.forEach((letter) => {
              if (letter.isFalling) {
                // Applica gravità (proporzionale alla massa)
                letter.velocity += gravity * letter.mass;
                
                // Applica resistenza dell'aria
                letter.velocityX *= airResistance;
                letter.velocity *= airResistance;
                
                // Aggiorna posizione
                letter.y += letter.velocity;
                letter.x += letter.velocityX;
                
                // Aggiorna rotazione
                letter.rotation += letter.rotationSpeed;
                letter.rotationSpeed *= rotationDamping;

                // Controlla collisione con il footer
                const footerCollision = footerY.current - letter.fontSize;
                if (letter.y >= footerCollision) {
                  letter.y = footerCollision;
                  letter.velocity *= -bounce;
                  letter.velocityX *= 0.8; // Rallenta il movimento orizzontale
                  letter.rotationSpeed *= 0.5; // Rallenta la rotazione

                  // Ferma il rimbalzo se troppo lento
                  if (Math.abs(letter.velocity) < 0.5) {
                    letter.velocity = 0;
                    letter.velocityX = 0;
                    letter.rotationSpeed *= 0.5;
                    letter.isFalling = false;
                  }
                }
              }

              // Disegna la lettera con rotazione
              p.push();
              p.translate(letter.x, letter.y - window.scrollY);
              p.rotate(p.radians(letter.rotation));
              p.textSize(letter.fontSize);
              p.text(letter.char, 0, 0);
              p.pop();
            });
          };
        };

        if (canvasRef.current) {
          p5Instance.current = new p5(sketch, canvasRef.current);
        }
        } catch (error) {
          console.error('Error creating p5 instance:', error);
          setIsAnimating(false);
        }
      }, 5000);
    };

    resetAnimation();

    window.addEventListener('mousemove', resetAnimation);
    
    const handleScroll = () => {
      if (p5Instance.current) {
        p5Instance.current.redraw();
      }
    };
    
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('mousemove', resetAnimation);
      window.removeEventListener('scroll', handleScroll);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      if (p5Instance.current) {
        p5Instance.current.remove();
      }
    };
  }, [children, p5Loaded]);

  return (
    <div ref={containerRef} style={{ position: 'relative' }}>
      <div
        ref={textRef}
        style={{
          opacity: isAnimating ? 0 : 1,
          transition: 'opacity 0.3s',
        }}
      >
        {children}
      </div>
      <div
        ref={canvasRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
          zIndex: 9999,
          mixBlendMode: 'difference',
          display: isAnimating ? 'block' : 'none',
        }}
      />
    </div>
  );
};
