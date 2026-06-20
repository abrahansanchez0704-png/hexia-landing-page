import { useEffect, useRef, useState } from 'react';

export function useScrollHeader() {
  const [scrolled, setScrolled] = useState(false);
  const frameRef = useRef<number>(0);

  useEffect(() => {
    const onScroll = () => {
      if (frameRef.current) return;
      frameRef.current = requestAnimationFrame(() => {
        frameRef.current = 0;
        setScrolled(window.scrollY > 20);
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(frameRef.current);
    };
  }, []);

  return scrolled;
}
