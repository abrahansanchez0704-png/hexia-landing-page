import type { MouseEvent } from 'react';
import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useScrollHeader } from '../hooks/useScrollHeader';
import ProjectModal from './ProjectModal';
import SupportModal from './SupportModal';

const navLinks = [
  { href: '#showcase', label: 'Sistema' },
  { href: '#feats', label: 'Características' },
  { href: '#planes', label: 'Planes' },
  { href: '#contacto', label: 'Contacto' },
];

export default function Header() {
  const scrolled = useScrollHeader();
  const [menuOpen, setMenuOpen] = useState(false);
  const [projectOpen, setProjectOpen] = useState(false);
  const [supportOpen, setSupportOpen] = useState(false);

  const closeMenu = useCallback(() => {
    setMenuOpen(false);
    document.body.style.overflow = '';
  }, []);

  const toggleMenu = useCallback(() => {
    setMenuOpen((o) => {
      const next = !o;
      document.body.style.overflow = next ? 'hidden' : '';
      return next;
    });
  }, []);

  const handleNavClick = useCallback(
    (e: MouseEvent<HTMLAnchorElement>) => {
      const href = e.currentTarget.getAttribute('href');
      if (!href || href === '#') return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        window.scrollTo({
          top: target.getBoundingClientRect().top + window.scrollY - 65,
          behavior: 'smooth',
        });
      }
      closeMenu();
    },
    [closeMenu],
  );

  const menuVariants = {
    closed: { x: '100%' },
    open: { x: 0 },
  };

  const backdropVariants = {
    closed: { opacity: 0, visibility: 'hidden' as const },
    open: { opacity: 1, visibility: 'visible' as const },
  };

  const linkVariants = {
    closed: { opacity: 0, x: 24 },
    open: (i: number) => ({
      opacity: 1,
      x: 0,
      transition: { delay: 0.06 + i * 0.05, ease: [0.22, 1, 0.36, 1] },
    }),
  };

  return (
    <>
      <header id="h" className={scrolled ? 's' : ''}>
        <nav>
          <a href="#" className="logo" onClick={handleNavClick}>
            <img src="hexia_logo.png" alt="" onError={(e) => ((e.target as HTMLImageElement).style.display = 'none')} />
            <span className="logo-t">
              HEX<span>IA</span>
            </span>
          </a>
          <ul className="nav-l">
            {navLinks.map((l) => (
              <li key={l.href + l.label}>
                <a href={l.href} onClick={handleNavClick}>
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
          <button
            className="btn btn-p d-only"
            onClick={() => setProjectOpen(true)}
          >
            Empezar Proyecto
          </button>
          <button
            className="ham"
            id="ham"
            aria-label="Menú"
            aria-expanded={menuOpen}
            onClick={toggleMenu}
          >
            <svg viewBox="0 0 32 32">
              <path
                className="ham-line"
                d="M27 10 13 10C10.8 10 9 8.2 9 6 9 3.5 10.8 2 13 2 15.2 2 17 3.8 17 6L17 26C17 28.2 18.8 30 21 30 23.2 30 25 28.2 25 26 25 23.8 23.2 22 21 22L7 22"
              />
              <path className="ham-line" d="M7 16 27 16" />
            </svg>
          </button>
        </nav>
      </header>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="m-backdrop o"
            variants={backdropVariants}
            initial="closed"
            animate="open"
            exit="closed"
            transition={{ duration: 0.35 }}
            onClick={closeMenu}
          />
        )}
      </AnimatePresence>

      <motion.div
        className={`m-menu${menuOpen ? ' o' : ''}`}
        id="mm"
        role="dialog"
        aria-label="Menú de navegación"
        variants={menuVariants}
        initial="closed"
        animate={menuOpen ? 'open' : 'closed'}
        transition={{ ease: [0.22, 1, 0.36, 1], duration: 0.4 }}
      >
        {/* Compact header */}
        <div className="m-head">
          <a href="#" className="m-head-logo" onClick={handleNavClick}>
            <img src="hexia_logo.png" alt="" onError={(e) => ((e.target as HTMLImageElement).style.display = 'none')} />
            <span>HEX<span>IA</span></span>
          </a>
          <button className="m-head-close" aria-label="Cerrar menú" onClick={closeMenu}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Main nav */}
        <nav className="m-nav">
          {[
            { href: '#showcase', label: 'Sistema' },
            { href: '#feats', label: 'Características' },
            { href: '#planes', label: 'Planes' },
            { href: '#contacto', label: 'Contacto' },
          ].map((item, i) => (
            <motion.a
              key={item.label}
              href={item.href}
              className="m-link"
              custom={i}
              variants={linkVariants}
              onClick={handleNavClick}
            >
              <span className="m-label">{item.label}</span>
              <svg className="m-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </motion.a>
          ))}

          {/* Modules grid */}
          <div className="m-modules">
            <div className="m-modules-title">Módulos</div>
            <div className="m-modules-grid">
              {[
                { href: '#showcase', label: 'Facturación', icon: 'M3 3h18v18H3zM9 7h6M7 11h10M7 15h10' },
                { href: '#showcase', label: 'Dashboard', icon: 'M3 3v18h18M7 16l4-8 4 4 4-6' },
                { href: '#showcase', label: 'Inventario', icon: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4' },
                { href: '#showcase', label: 'Crédito', icon: 'M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 7a4 4 0 1 0 8 0 4 4 0 0 0-8 0M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75' },
                { href: '#showcase', label: 'AI Local', icon: 'M12 2a4 4 0 0 1 4 4v2a4 4 0 0 1-8 0V6a4 4 0 0 1 4-4zM16 14H8M8 18h8M4 22h16' },
                { href: '#showcase', label: 'Vendedores', icon: 'M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 7a4 4 0 1 0 8 0 4 4 0 0 0-8 0M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75' },
              ].map((mod) => (
                <a key={mod.label} href={mod.href} className="m-module" onClick={handleNavClick}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d={mod.icon} />
                  </svg>
                  <span>{mod.label}</span>
                </a>
              ))}
            </div>
          </div>
        </nav>

        {/* Footer actions */}
        <div className="m-foot">
          <div className="m-actions">
          <button
            className="btn btn-g d-only"
            style={{ marginRight: 8 }}
            onClick={() => setSupportOpen(true)}
          >
            Soporte
          </button>
          <button
              className="m-action m-action-primary"
              onClick={() => {
                setProjectOpen(true);
                closeMenu();
              }}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <path d="M12 4v16m-8-8h16" />
              </svg>
              Empezar Proyecto
            </button>
            <button
              className="m-action m-action-secondary"
              onClick={() => {
                setSupportOpen(true);
                closeMenu();
              }}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
              Soporte
            </button>
            <a
              href="https://wa.me/584122854126?text=Hola%2C%20me%20interesa%20el%20sistema%20HEXIA"
              target="_blank"
              className="m-action m-action-secondary"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
              </svg>
              WhatsApp
            </a>
          </div>
        </div>
      </motion.div>

      <ProjectModal isOpen={projectOpen} onClose={() => setProjectOpen(false)} />
      <SupportModal isOpen={supportOpen} onClose={() => setSupportOpen(false)} />
    </>
  );
}
