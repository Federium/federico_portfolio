"use client";

import { FC, useState, useEffect, ReactNode } from "react";
import { Content } from "@prismicio/client";
import { PrismicNextLink } from "@prismicio/next";
import { PrismicRichText, SliceComponentProps } from "@prismicio/react";

type HeaderProps = SliceComponentProps<Content.HeaderSlice>;

// Componente per l'animazione typewriter su "federico morsia"
const TypewriterText: FC<{ text: string }> = ({ text }) => {
  const [mounted, setMounted] = useState(false);
  const [displayedText, setDisplayedText] = useState("");
  const [showRest, setShowRest] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    // Controlla la preferenza per animazioni ridotte
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    
    if (prefersReducedMotion) {
      setDisplayedText("federico morsia");
      setShowRest(true);
      setIsAnimating(false);
      return;
    }

    setIsAnimating(true);
    const targetText = "federico morsia";
    let currentIndex = 0;

    const typewriterInterval = setInterval(() => {
      if (currentIndex <= targetText.length) {
        setDisplayedText(targetText.slice(0, currentIndex));
        currentIndex++;
      } else {
        clearInterval(typewriterInterval);
        setIsAnimating(false);
        // Mostra il resto del testo dopo un breve delay
        setTimeout(() => {
          setShowRest(true);
        }, 200);
      }
    }, 80); // Velocità di scrittura (80ms per carattere)

    return () => clearInterval(typewriterInterval);
  }, [mounted]);

  // Estrae il testo senza "federico morsia"
  const textWithoutName = text.replace(/federico morsia/i, '').trim();

  // Durante il SSR o prima del mount, mostra tutto il testo per evitare layout shift
  if (!mounted) {
    return <span>{text}</span>;
  }

  return (
    <span>
      <span className="inline-block">
        {displayedText}
        {isAnimating && (
          <span className="inline-block w-[2px] h-[1em] bg-primary ml-[2px] animate-pulse" />
        )}
      </span>
      {textWithoutName && (
        <span
          className={`transition-opacity duration-700 ${
            showRest ? 'opacity-100' : 'opacity-0'
          }`}
        >
          {' '}{textWithoutName}
        </span>
      )}
    </span>
  );
};

// Funzione helper per estrarre testo da ReactNode
const extractTextFromChildren = (children: ReactNode): string => {
  if (typeof children === 'string') return children;
  if (Array.isArray(children)) {
    return children.map(child => {
      if (typeof child === 'string') return child;
      if (child && typeof child === 'object' && 'props' in child) {
        return extractTextFromChildren(child.props.children);
      }
      return '';
    }).join('');
  }
  if (children && typeof children === 'object' && 'props' in children) {
    return extractTextFromChildren((children as any).props.children);
  }
  return '';
};

const Header: FC<HeaderProps> = ({ slice }) => {
  return (
    <section>
      <PrismicRichText
                field={slice.primary.RichText}
                components={{
                  heading1: ({ children }) => {
                    // Controlla se il testo contiene "federico morsia"
                    const text = extractTextFromChildren(children);
                    const hasFedericoMorsia = /Federico Morsia/i.test(text);
                    
                    console.log('H1 - Text:', text);
                    console.log('H1 - Has Federico Morsia:', hasFedericoMorsia);

                    return (
                      <h1
                        className="text-base sm:text-lg md:text-2xl lg:text-3xl xl:text-4xl text-primary !leading-normal font-mono mb-8"
                        style={{ mixBlendMode: 'difference' }}
                      >
                        {hasFedericoMorsia ? <TypewriterText text={text} /> : children}
                      </h1>
                    );
                  },
                  heading2: ({ children }) => (
                    <h2
                      className="text-base sm:text-lg md:text-2xl lg:text-3xl xl:text-4xl text-primary !leading-normal font-mono mt-8"
                      style={{ mixBlendMode: 'difference' }}
                    >
                      {children}
                    </h2>
                  ),
                  paragraph: ({ children }) => {
                    // Controlla se il testo contiene "federico morsia"
                    const text = extractTextFromChildren(children);
                    const hasFedericoMorsia = /federico morsia/i.test(text);
                    
                    console.log('P - Text:', text);
                    console.log('P - Has Federico Morsia:', hasFedericoMorsia);

                    return (
                      <p className="text-xs sm:text-sm md:text-base text-primary"
                        style={{ mixBlendMode: 'difference' }}
                      >
                        {hasFedericoMorsia ? <TypewriterText text={text} /> : children}
                      </p>
                    );
                  },
                  hyperlink: ({ node, children }) => (
                    <PrismicNextLink 
                      field={node.data}
                      className="underline underline-offset-2 text-primary hover:text-accent"
                      style={{ mixBlendMode: 'difference' }}
                    >
                      {children}
                    </PrismicNextLink>
                  )
                }}
              />
    </section>
  );
};

export default Header;