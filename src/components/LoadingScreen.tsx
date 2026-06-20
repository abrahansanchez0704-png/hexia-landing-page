import { useState, useEffect, useRef } from 'react';

export default function LoadingScreen({ onFinish, hidden }: { onFinish: () => void; hidden?: boolean }) {
  const [fadeOut, setFadeOut] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    timerRef.current = setTimeout(() => {
      setFadeOut(true);
      setTimeout(onFinish, 600);
    }, 2800);
    return () => { clearTimeout(timerRef.current); };
  }, [onFinish]);

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 999999,
        background: '#0A0F1F',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        opacity: hidden ? 0 : (fadeOut ? 0 : 1),
        pointerEvents: hidden ? 'none' : 'auto',
        transition: 'opacity 0.6s cubic-bezier(0.22,1,0.36,1)',
      }}
    >
      <div style={{
        animation: 'loadPulse 1.6s ease-in-out infinite',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <img
          src="/hexia_logo.png"
          alt="HEXIA"
          style={{ width: 130, height: 130, display: 'block' }}
        />
      </div>
      <style>{`
        @keyframes loadPulse {
          0%, 100% { transform: scale(0.7); }
          50% { transform: scale(1.6); }
        }
      `}</style>
    </div>
  );
}
