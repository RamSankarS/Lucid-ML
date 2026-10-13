import { useState, useEffect } from 'react';

export default function TypewriterText({ text }: { text: string }) {
  const [display, setDisplay] = useState(text);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (text !== display && !isDeleting && !text.startsWith(display)) {
      setIsDeleting(true);
    }
  }, [text, display, isDeleting]);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    
    if (isDeleting) {
      if (display.length > 0) {
        timer = setTimeout(() => setDisplay(prev => prev.slice(0, -1)), 40);
      } else {
        setIsDeleting(false);
      }
    } else if (display.length < text.length) {
      timer = setTimeout(() => setDisplay(text.slice(0, display.length + 1)), 80);
    }
    
    return () => clearTimeout(timer);
  }, [display, isDeleting, text]);

  return <>{display}</>;
}