import { motion } from 'motion/react';
import { useCounter } from '../hooks/useCounter';

interface PlanProps {
  name: string;
  desc: string;
  price: number;
  featured?: boolean;
  features: string[];
  delay?: number;
  waText: string;
}

function PlanCard({ name, desc, price, featured, features, delay = 0, waText }: PlanProps) {
  const { ref, count } = useCounter(price);

  return (
    <motion.div
      className={`shine-card-wrap reveal${featured ? ' featured' : ''}`}
      initial={{ opacity: 0, y: 20, filter: 'blur(10px)' }}
      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="shine-card-inner">
        <div className="plan-hd">
          <h3>{name}</h3>
          {featured && (
            <span className="plan-badge">
              <svg viewBox="0 0 16 16"><path d="M8 1l1.5 5h5l-4 3 1.5 5L8 11l-4 3 1.5-5-4-3h5z" />
              </svg>
              MÁS POPULAR
            </span>
          )}
        </div>
        <p className="plan-desc">{desc}</p>
        <div className="plan-px" ref={ref}>
          <span className="cur">$</span>
          <span className="amt">{count}</span>
          <span className="note">pago único</span>
        </div>
        <div className="plan-sv" />
        <ul className="plan-fl">
          {features.map((f, i) => (
            <motion.li
              key={f}
              initial={{ opacity: 0, x: -12 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.25 + i * 0.1, ease: [0.22, 1, 0.36, 1] }}
            >
              <span className="ck">
                <svg viewBox="0 0 10 10"><path d="M2 5l2.5 2.5L8 3" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </span>
              <span dangerouslySetInnerHTML={{ __html: f }} />
            </motion.li>
          ))}
        </ul>
        <div className="plan-b">
          <a
            href={`https://wa.me/584122854126?text=${encodeURIComponent(waText)}`}
            target="_blank"
            className={`btn ${featured ? 'btn-p' : 'btn-g'}`}
          >
            Elegir Plan
          </a>
        </div>
      </div>
    </motion.div>
  );
}

export default function Plans() {
  return (
    <section id="planes">
      <div className="container">
        <motion.div
          className="reveal"
          initial={{ opacity: 0, y: 20, filter: 'blur(10px)' }}
          whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="tag">Planes</div>
          <h2 className="sec-title">
            Invierte en tu <span>crecimiento</span>
          </h2>
          <p className="sec-sub">Pago único. Sin mensualidades. Instalación y configuración incluidas.</p>
        </motion.div>

        <div className="plans-g">
          <PlanCard
            name="Básico"
            desc="Deja las facturas en papel. Emite notas y facturas en segundos con precios en $ y Bs. El primer paso hacia un negocio profesional y ordenado."
            price={100}
            features={[
              'Facturación + inventario local',
              'Separación por método de pago',
              'Identificación por Cédula/RIF',
              '2 equipos incluidos',
            ]}
            delay={0}
            waText="Quiero el Plan Básico HEXIA"
          />
          <PlanCard
            name="HEXIA"
            desc="IA local que analiza tus ventas, calcula tu utilidad neta y te recomienda acciones. Dashboard financiero en vivo, acceso remoto y más. El negocio automatizado."
            price={300}
            featured
            features={[
              '<strong style="color:var(--blanco)">Todo lo del Plan Standard</strong>',
              'IA de gestión LOCAL/WEB',
              'Acceso remoto 24/7',
              '4 equipos incluidos',
            ]}
            delay={0.1}
            waText="Quiero el Plan HEXIA - El completo"
          />
          <PlanCard
            name="Standard"
            desc="Toma el control total de tu inventario con alertas de stock crítico, carga de compras y gestión de proveedores. Visibilidad completa de tu operación."
            price={200}
            features={[
              '<strong style="color:var(--blanco)">Todo lo del Plan Básico</strong>',
              'Carga de facturas de compras',
              'Control de inventario avanzado',
              '4 equipos incluidos',
            ]}
            delay={0.2}
            waText="Quiero el Plan Standard HEXIA"
          />
        </div>

        <motion.p
          className="plan-note"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.08 }}
        >
          Todos los planes incluyen: Instalación, configuración inicial y soporte técnico por WhatsApp. ¿Más de 4 equipos?{' '}
          <a href="https://wa.me/584122854126" style={{ color: 'var(--carmesi)', fontWeight: 700 }}>
            Contáctanos
          </a>.
        </motion.p>
      </div>
    </section>
  );
}
