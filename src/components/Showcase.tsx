import { useEffect, useRef, useState, useCallback, type CSSProperties } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { SHOWCASE_DATA } from '../data/showcase';
import ModuleModal from './ModuleModal';
import {
  FacturacionModule,
  DashboardModule,
  InventarioModule,
  VendedoresModule,
  CRMModule,
  HexiaAIModule,
} from './modules';

const MODULE_COMPONENTS = [
  FacturacionModule,
  DashboardModule,
  InventarioModule,
  VendedoresModule,
  CRMModule,
  HexiaAIModule,
];

export default function Showcase() {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [moduleOpen, setModuleOpen] = useState(false);
  const triggersRef = useRef<(HTMLDivElement | null)[]>([]);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const ob = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setCurrentIdx(parseInt((e.target as HTMLElement).dataset.idx || '0'));
          }
        });
      },
      { threshold: 0, rootMargin: '-45% 0px -45% 0px' },
    );
    triggersRef.current.forEach((t) => { if (t) ob.observe(t); });
    return () => ob.disconnect();
  }, []);

  useEffect(() => {
    const ob = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setVisible(true); },
      { threshold: 0.08 },
    );
    const el = document.getElementById('showcase');
    if (el) ob.observe(el);
    return () => ob.disconnect();
  }, []);

  const openModule = useCallback(() => {
    setModuleOpen(true);
    document.body.style.overflow = 'hidden';
  }, []);

  const closeModule = useCallback(() => {
    setModuleOpen(false);
    document.body.style.overflow = '';
  }, []);

  const goToModule = useCallback((i: number) => {
    setCurrentIdx(i);
    const el = triggersRef.current[i];
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, []);

  const d = SHOWCASE_DATA[currentIdx];
  const cardScale = 1 + currentIdx * 0.05;
  const ModuleComponent = MODULE_COMPONENTS[currentIdx];

  return (
    <>
      <section id="showcase">
        <div className="container">
          <div
            className="show-big-wrap"
            style={{ '--card-scale': cardScale } as CSSProperties}
          >
            <div className={`show-big-hd reveal${visible ? ' v' : ''}`}>
              <div className="tag">Catálogo del Sistema</div>
              <h2 className="sec-title">
                Cada módulo, <span>al detalle</span>
              </h2>
              <p className="sec-sub">
                Interfaz real, sin maquetas. Cada pantalla pertenece al módulo que obtienes al contratar.
              </p>
            </div>

            <div className="showcase-layout">
              {/* LEFT: module info */}
              <div className="showcase-info">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentIdx}
                    className="showcase-info-inner"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <div className="show-big-n">{d.n}</div>
                    <div className="show-big-t">
                      {d.t.split(' ').map((w, i) => (
                        <span key={w + i} className="t-word" style={{ animationDelay: `${i * 0.07}s` }}>
                          {w}{' '}
                        </span>
                      ))}
                    </div>
                    <div className="show-big-d">{d.d}</div>
                    <div className="show-big-chips">
                      {d.chips.map((c) => (
                        <span key={c}>{c}</span>
                      ))}
                    </div>
                    <div className="show-big-cta" onClick={openModule}>
                      Explorar módulo{' '}
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                        <path d="M5 12h14M12 5l7 7-7 7" />
                      </svg>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* CENTER: image card */}
              <div
                className="show-big"
                id="showBig"
                data-idx={currentIdx}
                onClick={openModule}
              >
                <div className="show-big-img">
                  <AnimatePresence mode="popLayout">
                    <motion.img
                      key={d.img}
                      src={d.img}
                      alt={d.t}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                    />
                  </AnimatePresence>
                </div>
                <span className="show-big-badge">Catálogo</span>
              </div>

              {/* RIGHT: module navigation */}
              <div className="showcase-modules">
                <h4>Explorar módulos</h4>
                <div className="module-list">
                  {SHOWCASE_DATA.map((item, i) => (
                    <button
                      key={item.t}
                      type="button"
                      className={`module-item${i === currentIdx ? ' active' : ''}`}
                      onClick={() => goToModule(i)}
                    >
                      <span className="module-num">{String(i + 1).padStart(2, '0')}</span>
                      <span className="module-name">{item.t}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {SHOWCASE_DATA.map((_, i) => (
            <div
              key={i}
              className="show-trigger"
              data-idx={i}
              ref={(el) => { triggersRef.current[i] = el; }}
            />
          ))}
        </div>
      </section>

      <ModuleModal
        isOpen={moduleOpen}
        onClose={closeModule}
        title={d.t}
        subtitle={d.n}
      >
        {ModuleComponent && <ModuleComponent />}
      </ModuleModal>
    </>
  );
}
