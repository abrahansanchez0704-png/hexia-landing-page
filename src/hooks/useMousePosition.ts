import type { PointerEvent } from 'react';
import { useRef, useCallback } from 'react';

export function useMousePosition() {
  const posRef = useRef({ x: 50, y: 50 });

  const handlePointerMove = useCallback((e: PointerEvent<HTMLElement>) => {
    const target = e.currentTarget;
    const rect = target.getBoundingClientRect();
    posRef.current = {
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    };
    target.style.setProperty('--rx', posRef.current.x.toFixed(1));
    target.style.setProperty('--ry', posRef.current.y.toFixed(1));
  }, []);

  return { posRef, handlePointerMove };
}
