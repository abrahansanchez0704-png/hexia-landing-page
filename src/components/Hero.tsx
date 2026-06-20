import type { CSSProperties } from 'react';
import { motion } from 'motion/react';
import { useCounter } from '../hooks/useCounter';
import HeroPhone from './HeroPhone';

function Stat({ target, label, suffix }: { target: number; label: string; suffix?: string }) {
  const { ref, count } = useCounter(target);
  return (
    <div className="stat" ref={ref}>
      <div className="stat-n">
        {count}
        {suffix || ''}
      </div>
      <div className="stat-l">{label}</div>
    </div>
  );
}

export default function Hero() {
  return (
    <section id="hero">
      <div className="container">
        <div className="hero-in">
          <div>
            <motion.div
              className="hero-badge"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            >
              <span className="p" />
              POS Local · Sin Internet
            </motion.div>

            <h1 className="hero-t">
              {['Facturación', 'inteligente', 'que impulsa', 'tu negocio'].map((word, i) => (
                <motion.span
                  key={word + i}
                  className={`hero-t-w${i < 2 ? ' a' : ''}`}
                  initial={{ opacity: 0, y: 28, scale: 0.93 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ delay: 0.2 + i * 0.09, ease: [0.22, 1, 0.36, 1] }}
                >
                  {word}&nbsp;
                </motion.span>
              ))}
            </h1>

            <motion.p
              className="hero-sub"
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, ease: [0.22, 1, 0.36, 1] }}
            >
              Sistema POS completo para ferreterías y comercios en Venezuela. Factura en dólares y bolívares, controla tu inventario, gestiona créditos y recibe soporte directo por WhatsApp.
            </motion.p>

            <motion.div
              className="hero-acts"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.85, ease: [0.22, 1, 0.36, 1] }}
            >
              <a href="#showcase" className="btn btn-p" style={{ '--i': 0 } as CSSProperties}>
                Explorar Sistema{' '}
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </a>
              <a href="#planes" className="btn btn-g" style={{ '--i': 1 } as CSSProperties}>
                Ver Planes
              </a>
            </motion.div>

            <div className="stats">
              <Stat target={8} label="Módulos" />
              <Stat target={3} label="Planes" />
              <div className="stat">
                <div className="stat-n"><span>24</span>/7</div>
                <div className="stat-l">Soporte</div>
              </div>
            </div>
          </div>

          <motion.div
            className="hero-mock"
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <HeroPhone />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
