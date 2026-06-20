import { useEffect, useRef, useState } from 'react';

export function useCounter(target: number, delay = 40) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const counted = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ob = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting && !counted.current) {
          counted.current = true;
          const step = Math.ceil(target / 25);
          let c = 0;
          const id = setInterval(() => {
            c += step;
            if (c >= target) { c = target; clearInterval(id); }
            setCount(c);
          }, delay);
        }
      },
      { threshold: 0.5 },
    );
    ob.observe(el);
    return () => ob.disconnect();
  }, [target, delay]);

  return { ref, count };
}
