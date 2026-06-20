import type { FormEvent } from 'react';
import { useState, useCallback } from 'react';
import { motion } from 'motion/react';

export default function Newsletter() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();
      if (!email.trim() || loading) return;
      setLoading(true);
      try {
        const res = await fetch('/api/newsletter', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: email.trim() }),
        });
        if (!res.ok) throw new Error('Error');
        setSubmitted(true);
        setTimeout(() => {
          setSubmitted(false);
          setEmail('');
        }, 3000);
      } catch {
        alert('Error al enviar. Intenta de nuevo.');
      } finally {
        setLoading(false);
      }
    },
    [email, loading],
  );

  return (
    <section id="newsletter">
      <div className="container">
        <motion.div
          className="nl-box reveal"
          initial={{ opacity: 0, y: 20, filter: 'blur(10px)' }}
          whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="tag">Newsletter</div>
          <h2 className="sec-title">
            Mantente <span>informado</span>
          </h2>
          <p className="sec-sub">
            Novedades, actualizaciones y consejos sobre HEXIA directo a tu correo. Sin spam, solo información útil.
          </p>
          <form className="nl-form" onSubmit={handleSubmit}>
            <input
              type="email"
              className="nl-input"
              placeholder="tu@correo.com"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={submitted || loading}
            />
            <button type="submit" className="nl-submit" disabled={submitted || loading}>
              {loading ? 'Enviando...' : submitted ? '¡Gracias!' : 'Suscribirme '}
              {!submitted && !loading && (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              )}
            </button>
          </form>
          <p className="nl-note">Prometemos no enviar spam. Solo info relevante para tu negocio.</p>
        </motion.div>
      </div>
    </section>
  );
}
