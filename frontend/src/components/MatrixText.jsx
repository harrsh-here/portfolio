import { useState, useEffect, useRef } from 'react';

export default function MatrixText({ text, disableHover = false }) {
  const [displayText, setDisplayText] = useState([...text].map((c) => c === ' ' ? ' ' : '0').join(''));
  const [isDecoding, setIsDecoding] = useState(false);
  const containerRef = useRef(null);

  const startDecode = () => {
    if (isDecoding) return;
    setIsDecoding(true);
    let iterations = 0;
    
    const interval = setInterval(() => {
      setDisplayText((current) => {
        return current.split('').map((char, index) => {
          if (index < iterations) {
            return text[index]; // Reveal correct character
          }
          // Scramble with 0s and 1s
          return text[index] === ' ' ? ' ' : (Math.random() > 0.5 ? '1' : '0');
        }).join('');
      });

      if (iterations >= text.length) {
        clearInterval(interval);
        setIsDecoding(false);
      }
      
      iterations += 1 / 2; // Adjust speed of decoding here
    }, 40);
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          startDecode();
          observer.disconnect(); // Only animate once when scrolled into view
        }
      },
      { threshold: 0.1 }
    );
    
    if (containerRef.current) {
      observer.observe(containerRef.current);
    }
    
    return () => observer.disconnect();
  }, [text]); // Add text to dependency array in case it changes

  return (
    <span 
      ref={containerRef}
      onMouseEnter={disableHover ? undefined : startDecode}
      style={{ display: 'inline-block', cursor: 'default', fontFamily: 'inherit' }}
    >
      {displayText}
    </span>
  );
}
