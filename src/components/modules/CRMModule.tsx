import { useState, useMemo } from 'react';
import {
  Users, Search, HandCoins, FileSpreadsheet, RotateCcw, Calendar,
  Eye, Printer, Trash2, XCircle, Wallet, Plus, ArrowUpDown
} from 'lucide-react';
import { creditosMock, saldosFavorMock, TASA, type Credito, type SaldoFavor } from '../../data/mockData';

const MESES = [
  { value: '', label: 'Todos los meses' },
  { value: '2026-06', label: 'Junio 2026' },
  { value: '2026-05', label: 'Mayo 2026' },
  { value: '2026-04', label: 'Abril 2026' },
  { value: '2026-03', label: 'Marzo 2026' },
];

type OrdenCampo = 'id' | 'cliente' | 'fecha' | 'total' | 'abonado' | 'pendiente';

function fmt(n: number) {
  return '$ ' + n.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
}

function diasDesde(fecha: string) {
  const hoy = new Date('2026-06-19');
  const partes = fecha.split(' ')[0].split('-');
  const f = new Date(Number(partes[0]), Number(partes[1]) - 1, Number(partes[2]));
  return Math.floor((hoy.getTime() - f.getTime()) / (1000 * 60 * 60 * 24));
}

function badgeAntiguedad(dias: number) {
  if (dias <= 30) return { label: 'Al día', class: 'crm-badge green' };
  if (dias <= 60) return { label: '30-60 días', class: 'crm-badge yellow' };
  return { label: '+60 días', class: 'crm-badge red' };
}

export default function CRMModule() {
  const [busqueda, setBusqueda] = useState('');
  const [mes, setMes] = useState('');
  const [orden, setOrden] = useState<{ campo: OrdenCampo; asc: boolean }>({ campo: 'fecha', asc: false });
  const [activeTab, setActiveTab] = useState<'cuentas' | 'saldos'>('cuentas');
  const [abonoModal, setAbonoModal] = useState<{ open: boolean; credito: Credito | null }>({ open: false, credito: null });

  const filtrados = useMemo(() => {
    let data = [...creditosMock];
    if (mes) {
      data = data.filter((c) => c.fecha.startsWith(mes));
    }
    if (busqueda.trim()) {
      const q = busqueda.toLowerCase();
      data = data.filter((c) =>
        String(c.id).includes(q) ||
        c.clienteNombre.toLowerCase().includes(q) ||
        c.clienteCedula.toLowerCase().includes(q)
      );
    }
    data.sort((a, b) => {
      let va: string | number;
      let vb: string | number;
      switch (orden.campo) {
        case 'id': va = a.id; vb = b.id; break;
        case 'cliente': va = a.clienteNombre.toLowerCase(); vb = b.clienteNombre.toLowerCase(); break;
        case 'fecha': va = a.fecha; vb = b.fecha; break;
        case 'total': va = a.totalUsd; vb = b.totalUsd; break;
        case 'abonado': va = a.abonadoUsd; vb = b.abonadoUsd; break;
        case 'pendiente': va = a.pendienteUsd; vb = b.pendienteUsd; break;
        default: return 0;
      }
      if (va < vb) return orden.asc ? -1 : 1;
      if (va > vb) return orden.asc ? 1 : -1;
      return 0;
    });
    return data;
  }, [busqueda, mes, orden]);

  const totales = useMemo(() => {
    return filtrados.reduce((acc, c) => ({
      facturas: acc.facturas + 1,
      deuda: acc.deuda + c.totalUsd,
      abonado: acc.abonado + c.abonadoUsd,
      pendiente: acc.pendiente + c.pendienteUsd,
    }), { facturas: 0, deuda: 0, abonado: 0, pendiente: 0 });
  }, [filtrados]);

  const handleSort = (campo: OrdenCampo) => {
    setOrden((prev) => ({ campo, asc: prev.campo === campo ? !prev.asc : true }));
  };

  const exportarCSV = () => {
    let csv = 'Nota,Cliente,Cedula,Fecha,Deuda Orig.,Abonado,Pendiente\n';
    filtrados.forEach((c) => {
      csv += `${c.id},"${c.clienteNombre}","${c.clienteCedula}",${c.fecha.split(' ')[0]},${c.totalUsd.toFixed(2)},${c.abonadoUsd.toFixed(2)},${c.pendienteUsd.toFixed(2)}\n`;
    });
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cuentas_por_cobrar_${mes || 'todos'}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="crm-wrap">
      {/* Header */}
      <div className="crm-header">
        <div className="crm-brand">
          <div className="crm-logo"><HandCoins size={20} /></div>
          <div>
            <div className="crm-title">Créditos a Clientes</div>
            <div className="crm-subtitle">Cuentas por cobrar y saldos a favor</div>
          </div>
        </div>
        <div className="crm-actions">
          <button className="crm-action crm-action-green" onClick={exportarCSV}><FileSpreadsheet size={14} /> Exportar</button>
        </div>
      </div>

      {/* Tabs */}
      <div className="crm-tabs">
        <button className={`crm-tab ${activeTab === 'cuentas' ? 'active' : ''}`} onClick={() => setActiveTab('cuentas')}>
          <HandCoins size={14} /> Cuentas por Cobrar <span className="crm-tab-badge">{creditosMock.filter(c => c.pendienteUsd > 0).length}</span>
        </button>
        <button className={`crm-tab ${activeTab === 'saldos' ? 'active' : ''}`} onClick={() => setActiveTab('saldos')}>
          <Wallet size={14} /> Clientes con Crédito <span className="crm-tab-badge green">{saldosFavorMock.length}</span>
        </button>
      </div>

      {activeTab === 'cuentas' && (
        <>
          {/* Totals */}
          <div className="crm-totals">
            <div>
              <span>Facturas</span>
              <strong>{totales.facturas}</strong>
            </div>
            <div>
              <span>Deuda Original</span>
              <strong>{fmt(totales.deuda)}</strong>
            </div>
            <div>
              <span>Abonado</span>
              <strong className="green">{fmt(totales.abonado)}</strong>
            </div>
            <div>
              <span>Pendiente</span>
              <strong className="red">{fmt(totales.pendiente)}</strong>
            </div>
          </div>

          {/* Filters */}
          <div className="crm-filters">
            <div className="crm-search">
              <Search size={14} />
              <input
                type="text"
                placeholder="Buscar por cliente, cédula o nota..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
              />
            </div>
            <div className="crm-filter-actions">
              <div className="crm-month">
                <Calendar size={12} />
                <select value={mes} onChange={(e) => setMes(e.target.value)}>
                  {MESES.map((m) => <option key={m.value} value={m.value}>{m.label}</option>)}
                </select>
              </div>
              <button className="crm-btn-icon" onClick={() => { setBusqueda(''); setMes(''); }} title="Limpiar"><RotateCcw size={14} /></button>
            </div>
          </div>

          {/* Desktop table */}
          <div className="crm-table-card d-only">
            <div className="crm-table-scroll">
              <table className="crm-table">
                <thead>
                  <tr>
                    <th onClick={() => handleSort('id')}>Nota <ArrowUpDown size={10} /></th>
                    <th onClick={() => handleSort('cliente')}>Cliente <ArrowUpDown size={10} /></th>
                    <th onClick={() => handleSort('fecha')}>Emisión <ArrowUpDown size={10} /></th>
                    <th className="text-right" onClick={() => handleSort('total')}>Deuda Orig. <ArrowUpDown size={10} /></th>
                    <th className="text-right" onClick={() => handleSort('abonado')}>Abonado <ArrowUpDown size={10} /></th>
                    <th className="text-right" onClick={() => handleSort('pendiente')}>Pendiente <ArrowUpDown size={10} /></th>
                    <th className="text-center">Estado</th>
                    <th className="text-center">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {filtrados.length === 0 && (
                    <tr>
                      <td colSpan={8} className="crm-empty">
                        <HandCoins size={32} />
                        <p>No hay créditos activos con los filtros aplicados.</p>
                      </td>
                    </tr>
                  )}
                  {filtrados.map((c) => {
                    const dias = diasDesde(c.fecha);
                    const badge = badgeAntiguedad(dias);
                    return (
                      <tr key={c.id}>
                        <td className="crm-nota">#{c.id}</td>
                        <td>
                          <div className="crm-cliente">{c.clienteNombre}</div>
                          <div className="crm-cedula">{c.clienteCedula}</div>
                        </td>
                        <td>
                          <div>{c.fecha.split(' ')[0]}</div>
                          <div className="crm-hora">{c.fecha.split(' ')[1]}</div>
                        </td>
                        <td className="text-right">{fmt(c.totalUsd)}</td>
                        <td className="text-right green">{fmt(c.abonadoUsd)}</td>
                        <td className="text-right crm-pendiente">{fmt(c.pendienteUsd)}</td>
                        <td className="text-center"><span className={badge.class}>{badge.label}</span></td>
                        <td className="text-center">
                          <div className="crm-actions-row">
                            {c.pendienteUsd > 0.01 && (
                              <button className="crm-btn-primary" onClick={() => setAbonoModal({ open: true, credito: c })}>Abonar</button>
                            )}
                            <button className="crm-btn-icon" title="Ver"><Eye size={14} /></button>
                            <button className="crm-btn-icon" title="Reimprimir"><Printer size={14} /></button>
                            <button className="crm-btn-icon danger" title="Anular"><Trash2 size={14} /></button>
                            {c.pendienteUsd < 0.01 && <button className="crm-btn-icon danger" title="Cerrar"><XCircle size={14} /></button>}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile cards */}
          <div className="crm-cards m-only">
            {filtrados.length === 0 && (
              <div className="crm-empty">
                <HandCoins size={32} />
                <p>No hay créditos activos con los filtros aplicados.</p>
              </div>
            )}
            {filtrados.map((c) => {
              const dias = diasDesde(c.fecha);
              const badge = badgeAntiguedad(dias);
              return (
                <div key={c.id} className="crm-card">
                  <div className="crm-card-head">
                    <div>
                      <span className="crm-card-nota">#{c.id}</span>
                      <span className={badge.class}>{badge.label}</span>
                    </div>
                    <span className="crm-card-fecha">{c.fecha.split(' ')[0]}</span>
                  </div>
                  <div className="crm-card-cliente">{c.clienteNombre}</div>
                  <div className="crm-card-cedula">{c.clienteCedula}</div>
                  <div className="crm-card-amounts">
                    <div>
                      <span>Deuda</span>
                      <strong>{fmt(c.totalUsd)}</strong>
                    </div>
                    <div>
                      <span>Abonado</span>
                      <strong className="green">{fmt(c.abonadoUsd)}</strong>
                    </div>
                    <div>
                      <span>Pendiente</span>
                      <strong className="red">{fmt(c.pendienteUsd)}</strong>
                    </div>
                  </div>
                  <div className="crm-card-actions">
                    {c.pendienteUsd > 0.01 && <button className="crm-btn-primary" onClick={() => setAbonoModal({ open: true, credito: c })}>Abonar</button>}
                    <button className="crm-btn-icon"><Eye size={14} /></button>
                    <button className="crm-btn-icon"><Printer size={14} /></button>
                    <button className="crm-btn-icon danger"><Trash2 size={14} /></button>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {activeTab === 'saldos' && (
        <div className="crm-saldos">
          <div className="crm-saldos-header">
            <p>Saldos a favor generados por devoluciones o anulaciones.</p>
            <button className="crm-action crm-action-blue"><Plus size={14} /> Generar Crédito</button>
          </div>
          <div className="crm-table-card">
            <div className="crm-table-scroll">
              <table className="crm-table">
                <thead>
                  <tr>
                    <th>Cédula/RIF</th>
                    <th>Cliente</th>
                    <th>Teléfono</th>
                    <th className="text-right">Disponible</th>
                    <th className="text-center">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {saldosFavorMock.map((s) => (
                    <tr key={s.cedula}>
                      <td className="crm-cedula">{s.cedula}</td>
                      <td className="crm-cliente">{s.nombre}</td>
                      <td>{s.telefono}</td>
                      <td className="text-right green font-black">{fmt(s.saldoUsd)}</td>
                      <td className="text-center">
                        <div className="crm-actions-row">
                          <button className="crm-btn-primary green">Usar Saldo</button>
                          <button className="crm-btn-icon danger"><Trash2 size={14} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Abono modal */}
      {abonoModal.open && abonoModal.credito && (
        <div className="crm-modal-overlay" onClick={() => setAbonoModal({ open: false, credito: null })}>
          <div className="crm-modal" onClick={(e) => e.stopPropagation()}>
            <div className="crm-modal-head">
              <h3><HandCoins size={16} /> Registrar Abono</h3>
              <button className="crm-btn-icon" onClick={() => setAbonoModal({ open: false, credito: null })}><XCircle size={16} /></button>
            </div>
            <div className="crm-modal-body">
              <div className="crm-modal-deuda">
                <span>Resta por cobrar</span>
                <strong>{fmt(abonoModal.credito.pendienteUsd)}</strong>
              </div>
              <label>Monto a abonar ($)</label>
              <input type="number" className="crm-input" placeholder="0.00" min={0} step={0.01} defaultValue={abonoModal.credito.pendienteUsd} />
              <label>Método de pago</label>
              <select className="crm-input">
                <option>Efectivo $ (Abono)</option>
                <option>Efectivo Bs (Abono)</option>
                <option>Transferencia $ (Abono)</option>
                <option>Pago Móvil (Abono)</option>
                <option>Zelle (Abono)</option>
              </select>
              <button className="crm-action crm-action-blue w-full justify-center" onClick={() => setAbonoModal({ open: false, credito: null })}>Guardar Abono</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
