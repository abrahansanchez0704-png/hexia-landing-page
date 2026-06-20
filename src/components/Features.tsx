import { useEffect, useRef } from 'react';

const GLOW_STYLES = `
  [data-glow]::before,
  [data-glow]::after {
    pointer-events: none;
    content: "";
    position: absolute;
    inset: calc(var(--border-size) * -1);
    border: var(--border-size) solid transparent;
    border-radius: calc(var(--radius) * 1px);
    background-attachment: fixed;
    background-size: calc(100% + (2 * var(--border-size))) calc(100% + (2 * var(--border-size)));
    background-repeat: no-repeat;
    background-position: 50% 50%;
    mask: linear-gradient(transparent, transparent), linear-gradient(white, white);
    mask-clip: padding-box, border-box;
    mask-composite: intersect;
    -webkit-mask: linear-gradient(transparent, transparent), linear-gradient(white, white);
    -webkit-mask-clip: padding-box, border-box;
    -webkit-mask-composite: source-in;
  }

  [data-glow]::before {
    background-image: radial-gradient(
      calc(var(--spotlight-size) * 0.75) calc(var(--spotlight-size) * 0.75) at
      calc(var(--x, 0) * 1px) calc(var(--y, 0) * 1px),
      hsl(var(--hue, 0) 100% 50% / var(--border-spot-opacity, 1)),
      transparent 100%
    );
    filter: brightness(2);
  }

  [data-glow]::after {
    background-image: radial-gradient(
      calc(var(--spotlight-size) * 0.5) calc(var(--spotlight-size) * 0.5) at
      calc(var(--x, 0) * 1px) calc(var(--y, 0) * 1px),
      hsl(0 100% 100% / var(--border-light-opacity, 1)),
      transparent 100%
    );
  }

  [data-glow] [data-glow] {
    position: absolute;
    inset: 0;
    will-change: filter;
    opacity: var(--outer, 1);
    border-radius: calc(var(--radius) * 1px);
    border-width: calc(var(--border-size) * 20);
    filter: blur(calc(var(--border-size) * 10));
    background: none;
    pointer-events: none;
    border: none;
  }

  [data-glow] > [data-glow]::before {
    inset: -10px;
    border-width: 10px;
  }
`;

function FeatCard({
  icon,
  badge,
  title,
  desc,
  tags,
  span,
  idx,
}: {
  key?: string;
  icon: string;
  badge: string;
  title: string;
  desc: string;
  tags: string[];
  span?: boolean;
  idx: number;
}) {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;
    card.style.setProperty('--base', '0');
    card.style.setProperty('--spread', '200');
    card.style.setProperty('--radius', '14');
    card.style.setProperty('--border', '3');
    card.style.setProperty('--size', '200');
    card.style.setProperty('--outer', '1');
    card.style.setProperty('--backdrop', 'hsla(0 0% 60% / 0.08)');
    card.style.setProperty('--backup-border', 'var(--backdrop)');
    card.style.setProperty('--border-size', 'calc(var(--border, 2) * 1px)');
    card.style.setProperty('--spotlight-size', 'calc(var(--size, 150) * 1px)');
    card.style.setProperty('--hue', 'calc(var(--base) + (var(--xp, 0) * var(--spread, 0)))');
    card.style.border = 'var(--border-size) solid var(--backup-border)';
    card.style.backgroundImage =
      'radial-gradient(var(--spotlight-size, 200px) var(--spotlight-size, 200px) at calc(var(--x, 0) * 1px) calc(var(--y, 0) * 1px), hsl(calc(var(--base, 0) + (var(--xp, 0) * var(--spread, 200))) 100% 70% / 0.1), transparent)';
    card.style.backgroundAttachment = 'fixed';
    card.style.backgroundSize = 'calc(100% + 6px) calc(100% + 6px)';
    card.style.backgroundPosition = '50% 50%';
  }, []);

  return (
    <div
      ref={cardRef}
      data-glow
      className={`feat-card reveal d${(idx % 4) + 1}${span ? ' span-2' : ''}`}
    >
      <div data-glow />
      <div className="dot-overlay" />
      <div className="feat-head">
        <div className="feat-icon" dangerouslySetInnerHTML={{ __html: icon }} />
        <span className="feat-badge">{badge}</span>
      </div>
      <div className="feat-body">
        <h4>{title}</h4>
        <p>{desc}</p>
      </div>
      <div className="feat-tags">
        {tags.map((t) => (<span key={t}>{t}</span>))}
      </div>
      <div className="feat-cta">Explorar &rarr;</div>
    </div>
  );
}

export default function Features() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isDesktop = useRef(
    typeof window !== 'undefined' && window.matchMedia('(hover: hover) and (pointer: fine)').matches
  );

  useEffect(() => {
    if (!isDesktop.current) return;
    const glowEls = [...document.querySelectorAll<HTMLElement>('#feats [data-glow]')];
    let frameId: number | null = null;
    let lastX = 0, lastY = 0;

    const tick = () => {
      frameId = null;
      const xp = (lastX / window.innerWidth).toFixed(2);
      const yp = (lastY / window.innerHeight).toFixed(2);
      const xs = lastX.toFixed(2), ys = lastY.toFixed(2);
      for (const card of glowEls) {
        card.style.setProperty('--x', xs);
        card.style.setProperty('--xp', xp);
        card.style.setProperty('--y', ys);
        card.style.setProperty('--yp', yp);
      }
    };

    const syncPointer = (e: PointerEvent) => {
      lastX = e.clientX;
      lastY = e.clientY;
      if (frameId === null) frameId = requestAnimationFrame(tick);
    };

    document.addEventListener('pointermove', syncPointer);
    return () => {
      document.removeEventListener('pointermove', syncPointer);
      if (frameId !== null) cancelAnimationFrame(frameId);
    };
  }, []);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) (e.target as HTMLElement).classList.add('v');
        });
      },
      { threshold: 0.08 },
    );
    el.querySelectorAll('.reveal').forEach((r) => obs.observe(r));
    return () => obs.disconnect();
  }, []);

  const cards = [
    {
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 3v18h18"/><path d="M7 16l4-8 4 4 4-6"/></svg>',
      badge: 'En Vivo', title: 'Dashboard Financiero',
      desc: 'Deja de esperar al fin de mes para saber si ganaste. HEXIA te muestra en vivo tu utilidad neta, ingresos vs costos y gráficos de 30 días. Sin fórmulas, sin Excel, sin esperar.',
      tags: ['KPIs', 'Utilidad Neta', 'Gráficos', 'Exportar'], span: true, idx: 0,
    },
    {
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2a4 4 0 0 1 4 4v2a4 4 0 0 1-8 0V6a4 4 0 0 1 4-4z"/><path d="M16 14H8"/><path d="M8 18h8"/><path d="M4 22h16"/></svg>',
      badge: 'Local', title: 'Asistente HEXIA AI',
      desc: 'Olvídate de filtros complicados y reportes eternos. Pregúntale a HEXIA en español cuánto vendiste ayer o qué producto se vende más. IA local, 100% privada, sin internet.',
      tags: ['Sin Conexión', 'Análisis', 'Reportes'], idx: 1,
    },
    {
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/></svg>',
      badge: 'Offline', title: 'Modo Local',
      desc: 'Los sistemas en la nube se caen cuando más los necesitas. HEXIA funciona completo en tu red local, sin internet. Cero latencia, cero cortes, cero riesgos.',
      tags: ['Sin Internet', 'SQLite', '0 Latencia'], idx: 2,
    },
    {
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="8" rx="2"/><rect x="2" y="14" width="20" height="8" rx="2"/></svg>',
      badge: 'Dual', title: 'Dual Currency',
      desc: 'Trabaja en dólares y bolívares simultáneamente. Tasa actualizable al instante. Tickets y reportes con ambos precios visibles.',
      tags: ['$ + Bs', 'Tasa en Vivo', 'Dual Ticket'], idx: 3,
    },
    {
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><path d="M12 22V12"/><path d="M3.3 7l8.7 5 8.7-5"/></svg>',
      badge: 'Stock', title: 'Control de Inventario',
      desc: 'No más hojas de cálculo perdidas ni stock que no sabes que tienes. HEXIA te alerta cuando algo está por agotarse, gestiona proveedores y organiza tu inventario con fotos y búsqueda inteligente.',
      tags: ['Alertas', 'Proveedores', 'Fotos'], idx: 4,
    },
    {
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2a10 10 0 1 0 10 10"/><path d="M12 6v6l4 2"/></svg>',
      badge: 'Cobranza', title: 'Clientes a Crédito',
      desc: 'Deja de perseguir clientes con libretas y recibos. HEXIA lleva el control de abonos, saldos pendientes y vencimientos, y te recuerda automáticamente quién debe y cuánto.',
      tags: ['Abonos', 'Recordatorios', 'Estados', 'Cartera'], span: true, idx: 5,
    },
    {
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>',
      badge: 'Roles', title: 'Vendedores + Roles',
      desc: 'Sin libros de registro ni papeles. Cada vendedor con su perfil, acceso por rol y comisiones automatizadas. Sabes quién vendió, cuánto y cuándo, en tiempo real.',
      tags: ['Perfiles', 'Comisiones', 'Cierre', 'Acceso'], idx: 6,
    },
    {
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>',
      badge: '24/7', title: 'Soporte Directo',
      desc: 'Asistencia vía WhatsApp con tiempos de respuesta en minutos. Resolvemos en el día, no en semanas. Todos los planes incluyen soporte.',
      tags: ['WhatsApp', 'Respuesta Rápida', 'Incluido'], idx: 7,
    },
  ];

  return (
    <section id="feats" ref={sectionRef}>
      {isDesktop.current && <style dangerouslySetInnerHTML={{ __html: GLOW_STYLES }} />}
      <div className="container">
        <div className="reveal">
          <div className="tag">Características</div>
          <h2 className="sec-title">
            Todo lo que <span>necesitas</span>
          </h2>
          <p className="sec-sub">
            Olvídate del cuaderno, Excel y sistemas que no entienden tu día a día. HEXIA está construido para el comercio real en Venezuela.
          </p>
        </div>

        <div className="feat-grid">
          {cards.map((c) => (
            <FeatCard key={c.title} {...c} />
          ))}
        </div>
      </div>
    </section>
  );
}
