import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('hexia_consent');
    if (!consent) {
      setTimeout(() => setVisible(true), 500);
    }
  }, []);

  const acceptAll = useCallback(() => {
    localStorage.setItem('hexia_consent', 'all');
    setVisible(false);
  }, []);

  const acceptEssential = useCallback(() => {
    localStorage.setItem('hexia_consent', 'essential');
    setVisible(false);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          style={{
            position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 9999,
            background: '#0D0F13', borderTop: '1px solid #1E2128',
            padding: '16px 20px',
          }}
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        >
          <div style={{
            maxWidth: 1100, margin: '0 auto',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            gap: 16, flexWrap: 'wrap',
          }}>
            <div style={{ flex: 1, minWidth: 200 }}>
              <p style={{ fontSize: 13, color: '#C8CCD0', lineHeight: 1.5, margin: 0 }}>
                <strong style={{ color: '#F0F2F5' }}>🍪 Este sitio usa cookies</strong> — las esenciales para funcionar y analíticas anónimas para mejorar. Al hacer clic en "Aceptar todas", consentís su uso. Podés elegir solo las esenciales.
              </p>
            </div>
            <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
              <button
                onClick={acceptEssential}
                style={{
                  padding: '8px 16px', borderRadius: 8, border: '1px solid #1E2128',
                  background: 'transparent', color: '#9AA3B5', cursor: 'pointer',
                  fontSize: 12, fontWeight: 600, whiteSpace: 'nowrap',
                }}
              >
                Solo esenciales
              </button>
              <button
                onClick={acceptAll}
                style={{
                  padding: '8px 20px', borderRadius: 8, border: 'none',
                  background: '#CC0000', color: 'white', cursor: 'pointer',
                  fontSize: 12, fontWeight: 700, whiteSpace: 'nowrap',
                }}
              >
                Aceptar todas
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
