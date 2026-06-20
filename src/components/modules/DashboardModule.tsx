import { useState } from 'react';
import {
  TrendingUp, Calculator, Download, FileText, RefreshCw, Calendar,
  ArrowUpRight, ArrowDownRight, Target, PieChart, BarChart3, Zap,
  Users, Package, ShoppingCart, AlertTriangle, CreditCard,
  DollarSign, Wallet, Smartphone, Repeat
} from 'lucide-react';
import { ventasChartData, TASA } from '../../data/mockData';

const PERIODOS = ['Hoy', 'Semana', 'Mes', 'Año'] as const;
type Periodo = typeof PERIODOS[number];

interface FijoPeriodo {
  utilidad: number;
  ingresos: number;
  costos: number;
  gastos: number;
  nomina: number;
  tickets: number;
  variacion: number;
}

const DATOS: Record<Periodo, FijoPeriodo> = {
  Hoy:   { utilidad: 842,   ingresos: 2740,  costos: 1120,  gastos: 420,  nomina: 358,   tickets: 24,  variacion: 12.5 },
  Semana:{ utilidad: 5840,  ingresos: 18250, costos: 8200,  gastos: 2100, nomina: 2500,  tickets: 142, variacion: 8.3 },
  Mes:   { utilidad: 28450, ingresos: 84200, costos: 38400, gastos: 9800, nomina: 7550,  tickets: 612, variacion: 15.7 },
  Año:   { utilidad: 312400,ingresos: 954000,costos: 438000,gastos: 112000,nomina: 91600, tickets: 7420,variacion: 22.4 },
};

const CAJA_HOY = [
  { metodo: 'Efectivo $', icon: DollarSign, monto: 1240 },
  { metodo: 'Pago Móvil', icon: Smartphone, monto: 860 },
  { metodo: 'Transferencia', icon: Repeat, monto: 430 },
  { metodo: 'Efectivo Bs', icon: Wallet, monto: 210 },
];

const DESGLOSE_VENTAS = [
  { label: 'Por Producto', val: 42, color: '#A50000' },
  { label: 'Por Canal', val: 28, color: '#0284c7' },
  { label: 'Por Región', val: 18, color: '#10b981' },
  { label: 'Por Vendedor', val: 12, color: '#f59e0b' },
];

const SPARKLINE = [12, 18, 15, 22, 28, 24, 32, 30, 38, 42, 36, 48];

function fmt(n: number) {
  return '$ ' + n.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
}

function fmtBs(n: number) {
  return 'Bs ' + (n * TASA).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
}

export default function DashboardModule() {
  const [periodo, setPeriodo] = useState<Periodo>('Mes');
  const d = DATOS[periodo];

  const maxVenta = Math.max(...ventasChartData.map((v) => v.monto));

  return (
    <div className="dash-wrap">
      {/* Header */}
      <div className="dash-topbar">
        <div className="dash-brand">
          <div className="dash-logo"><TrendingUp size={20} /></div>
          <div>
            <div className="dash-title">Dashboard Inteligente</div>
            <div className="dash-subtitle">Inteligencia Financiera · Radiografía del negocio</div>
          </div>
        </div>
        <div className="dash-actions">
          <button className="dash-action dash-action-red"><Calculator size={14} /> Ganancia Neta</button>
          <button className="dash-action"><Download size={14} /> Exportar</button>
          <button className="dash-action"><FileText size={14} /> PDF Semanal</button>
          <button className="dash-action dash-action-gold"><RefreshCw size={12} /> {TASA.toFixed(2)} Bs</button>
        </div>
      </div>

      {/* Period selector mobile */}
      <div className="dash-periods">
        {PERIODOS.map((p) => (
          <button
            key={p}
            className={`dash-period ${periodo === p ? 'active' : ''}`}
            onClick={() => setPeriodo(p)}
          >
            {p}
          </button>
        ))}
      </div>

      {/* Balance principal */}
      <div className="dash-balance">
        <div className="dash-balance-header">
          <span className="dash-balance-tag">Balance del Periodo</span>
          <div className="dash-balance-filter">
            <Calendar size={12} />
            <select value={periodo} onChange={(e) => setPeriodo(e.target.value as Periodo)}>
              {PERIODOS.map((p) => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>
        </div>
        <div className="dash-balance-grid">
          <div className="dash-balance-main">
            <span className="dash-balance-label">Utilidad Neta Pura</span>
            <span className={`dash-balance-big ${d.utilidad >= 0 ? 'up' : 'down'}`}>{fmt(d.utilidad)}</span>
            <span className="dash-balance-note">Ingresos restando compras, gastos fijos y nómina</span>
          </div>
          <div className="dash-balance-kpis">
            <div>
              <span className="dash-balance-kpi-label">Ingresos Brutos</span>
              <span className="dash-balance-kpi-val">{fmt(d.ingresos)}</span>
              <span className="dash-balance-kpi-sub up"><ArrowUpRight size={10} /> Entradas tienda</span>
            </div>
            <div>
              <span className="dash-balance-kpi-label">Costo Insumos</span>
              <span className="dash-balance-kpi-val">{fmt(d.costos)}</span>
              <span className="dash-balance-kpi-sub warn"><ShoppingCart size={10} /> Pago proveedores</span>
            </div>
            <div>
              <span className="dash-balance-kpi-label">Gastos Fijos</span>
              <span className="dash-balance-kpi-val">{fmt(d.gastos)}</span>
              <span className="dash-balance-kpi-sub danger"><Zap size={10} /> Operativos</span>
            </div>
            <div>
              <span className="dash-balance-kpi-label">Nómina Liquidada</span>
              <span className="dash-balance-kpi-val">{fmt(d.nomina)}</span>
              <span className="dash-balance-kpi-sub info"><Users size={10} /> Personal</span>
            </div>
          </div>
          <div className="dash-balance-clients">
            <div className="dash-clients-head">
              <Users size={12} /> <span>Clientes Nuevos</span>
            </div>
            <span className="dash-clients-val">48</span>
            <span className="dash-clients-tag up">↑ +12.5%</span>
            <span className="dash-clients-note">vs período anterior</span>
          </div>
        </div>
      </div>

      {/* Botonera gerencial */}
      <div className="dash-cards">
        <div className="dash-gcard g1">
          <div className="dash-gcard-head">
            <span>Estado Actual</span>
            <div className="dash-gauge"><div className="dash-gauge-arc" /><div className="dash-gauge-needle" /></div>
          </div>
          <div className="dash-gcard-body">
            <span className="dash-gcard-monto">{fmt(d.ingresos * 0.12)}</span>
            <span className="dash-gcard-tag up">↑ {d.variacion.toFixed(1)}% vs ayer</span>
          </div>
          <div className="dash-gcard-foot">
            <BarChart3 size={12} />
            <span>Pedidos / hora pico</span>
            <div className="dash-spark">
              {SPARKLINE.map((v, i) => {
                const max = Math.max(...SPARKLINE);
                return <div key={i} style={{ height: `${(v / max) * 100}%` }} />;
              })}
            </div>
          </div>
        </div>

        <div className="dash-gcard g2">
          <div className="dash-gcard-head">
            <span>Comparativa</span>
            <div className="dash-gicon amber"><BarChart3 size={16} /></div>
          </div>
          <div className="dash-gcard-comparativa">
            <div>
              <span className="dash-gcard-c-label">Anterior</span>
              <span className="dash-gcard-c-val">{fmt(d.ingresos * 0.88)}</span>
              <div className="dash-gcard-bar"><div style={{ width: '60%', background: '#94a3b8' }} /></div>
            </div>
            <div>
              <span className="dash-gcard-c-label">Actual</span>
              <span className="dash-gcard-c-val current">{fmt(d.ingresos)}</span>
              <div className="dash-gcard-bar"><div style={{ width: '85%', background: '#f59e0b' }} /></div>
            </div>
            <div className="dash-gcard-c-var">
              <span className="dash-gcard-c-label">Variación</span>
              <span className="dash-gcard-c-porc up">↑ {d.variacion.toFixed(1)}%</span>
              <span className="dash-gcard-c-net">+{fmt(d.ingresos * 0.12).replace('$ ', '')}</span>
            </div>
          </div>
          <div className="dash-gcard-foot">
            <span>Comparar da claridad</span>
            <ArrowUpRight size={12} />
          </div>
        </div>

        <div className="dash-gcard g3">
          <div className="dash-gcard-head">
            <span>Avance Metas</span>
            <Target size={16} className="text-sky-500" />
          </div>
          <div className="dash-gcard-metas">
            <div>
              <span className="dash-gcard-c-label">Actual</span>
              <span className="dash-gcard-c-val current">{fmt(d.ingresos)}</span>
            </div>
            <div>
              <span className="dash-gcard-c-label">Objetivo</span>
              <span className="dash-gcard-c-val">$ 100,000</span>
            </div>
            <div className="dash-gcard-meta-pill">
              <span className="dash-gcard-c-label">Cumplido</span>
              <span className="dash-gcard-c-porc sky">{Math.min(100, Math.round((d.ingresos / 100000) * 100))}%</span>
            </div>
          </div>
          <div className="dash-gcard-progress">
            <div className="dash-gcard-progress-track">
              <div className="dash-gcard-progress-fill" style={{ width: `${Math.min(100, (d.ingresos / 100000) * 100)}%` }} />
              <div className="dash-gcard-progress-mark" />
            </div>
            <div className="dash-gcard-progress-foot">
              <span>Desviación</span>
              <span className="sky">{d.ingresos >= 100000 ? '+' : ''}{fmt(d.ingresos - 100000)}</span>
            </div>
          </div>
        </div>

        <div className="dash-gcard g4">
          <div className="dash-gcard-head">
            <span>Desglose Clave</span>
            <PieChart size={16} className="text-purple-500" />
          </div>
          <div className="dash-gcard-total">
            <div>
              <span className="dash-gcard-c-label">Ingreso Global</span>
              <span className="dash-gcard-c-val current">{fmt(d.ingresos)}</span>
            </div>
            <div className="dash-gcard-bars">
              <span /><span /><span />
            </div>
          </div>
          <div className="dash-gcard-desglose">
            {DESGLOSE_VENTAS.map((it) => (
              <div key={it.label} className="dash-gcard-d-item">
                <div className="dash-gcard-d-top">
                  <span>{it.label}</span>
                  <span>{it.val}%</span>
                </div>
                <div className="dash-gcard-bar"><div style={{ width: `${it.val}%`, background: it.color }} /></div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Caja hoy */}
      <div className="dash-caja">
        <div className="dash-caja-head">
          <div>
            <span className="dash-caja-label">Caja Hoy</span>
            <span className="dash-caja-total">{fmt(2740)}</span>
            <span className="dash-caja-bs">{fmtBs(2740)}</span>
          </div>
          <div className="dash-caja-date">
            <Calendar size={12} />
            <span>{new Date().toLocaleDateString('es-VE')}</span>
          </div>
        </div>
        <div className="dash-caja-grid">
          {CAJA_HOY.map((m) => {
            const Icon = m.icon;
            return (
              <div key={m.metodo} className="dash-caja-item">
                <span className="dash-caja-item-label"><Icon size={12} /> {m.metodo}</span>
                <span className="dash-caja-item-usd">{fmt(m.monto)}</span>
                <span className="dash-caja-item-bs">{fmtBs(m.monto)}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Alertas */}
      <div className="dash-alerts">
        <div className="dash-alert red">
          <div className="dash-alert-icon"><FileText size={20} /></div>
          <div>
            <span className="dash-alert-label">Facturas por Pagar</span>
            <span className="dash-alert-val">$ 8,450</span>
            <span className="dash-alert-note">Deuda total activa</span>
          </div>
        </div>
        <div className="dash-alert green">
          <div className="dash-alert-icon"><CreditCard size={20} /></div>
          <div>
            <span className="dash-alert-label">Créditos a Clientes</span>
            <span className="dash-alert-val">$ 3,420</span>
            <span className="dash-alert-note">12 facturas activas</span>
          </div>
        </div>
        <div className="dash-alert orange">
          <div className="dash-alert-icon"><AlertTriangle size={20} /></div>
          <div>
            <span className="dash-alert-label">Stock Crítico</span>
            <span className="dash-alert-val">5 artículos</span>
            <span className="dash-alert-note">Agotados o bajo mínimo</span>
          </div>
        </div>
        <div className="dash-alert yellow">
          <div className="dash-alert-icon"><ShoppingCart size={20} /></div>
          <div>
            <span className="dash-alert-label">Órdenes Sugeridas</span>
            <span className="dash-alert-val">8 pendientes</span>
            <span className="dash-alert-note">Esperando aprobación</span>
          </div>
        </div>
      </div>

      {/* Ventas + acumulados */}
      <div className="dash-bottom">
        <div className="dash-chart-card">
          <div className="dash-chart-head">
            <span><TrendingUp size={14} /> Ventas</span>
            <span className="dash-chart-pulse"><span /> Últimos 30 días</span>
          </div>
          <div className="dash-chart">
            {ventasChartData.map((v, i) => {
              const h = (v.monto / maxVenta) * 100;
              return (
                <div key={i} className="dash-chart-col">
                  <div className="dash-chart-bar" style={{ height: `${h}%` }}>
                    <span className="dash-chart-tip">${v.monto}</span>
                  </div>
                  <span className="dash-chart-x">{v.dia}</span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="dash-acum">
          <div className="dash-chart-head"><span>Acumulados Históricos</span></div>
          <div className="dash-acum-list">
            <div>
              <span>Esta Semana</span>
              <span className="blue">{fmt(18250)}</span>
              <small>{fmtBs(18250)}</small>
            </div>
            <div>
              <span>Este Mes</span>
              <span className="teal">{fmt(84200)}</span>
              <small>{fmtBs(84200)}</small>
            </div>
            <div>
              <span>Este Año</span>
              <span className="purple">{fmt(954000)}</span>
              <small>{fmtBs(954000)}</small>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
