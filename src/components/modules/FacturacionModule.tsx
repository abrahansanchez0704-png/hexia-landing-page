import { useState, useMemo, useRef, useEffect } from 'react';
import {
  Calculator, Search, Plus, Trash2, User, ShoppingCart, Package,
  CreditCard, Banknote, Smartphone, Receipt, Save, FileText,
  Printer, RotateCcw, ChevronDown, Check, AlertCircle, TrendingUp,
  Calendar, Clock
} from 'lucide-react';
import { productosMock, clientesMock, TASA, type Producto, type Cliente } from '../../data/mockData';

interface Linea {
  producto: Producto;
  cantidad: number;
  descuento: number;
  iva: boolean;
}

const METODOS_PAGO = [
  { id: 'efectivo', label: 'Efectivo $', icon: Banknote },
  { id: 'efectivobs', label: 'Efectivo Bs', icon: Banknote },
  { id: 'pagoMovil', label: 'Pago Móvil', icon: Smartphone },
  { id: 'transferencia', label: 'Transferencia', icon: TrendingUp },
  { id: 'tarjeta', label: 'Tarjeta', icon: CreditCard },
  { id: 'credito', label: 'Crédito', icon: Receipt },
] as const;

export default function FacturacionModule() {
  const [busqueda, setBusqueda] = useState('');
  const [lineas, setLineas] = useState<Linea[]>([
    { producto: productosMock[0], cantidad: 2, descuento: 0, iva: true },
    { producto: productosMock[4], cantidad: 5, descuento: 5, iva: false },
  ]);
  const [cliente, setCliente] = useState<Cliente>(clientesMock[0]);
  const [mostrarClientes, setMostrarClientes] = useState(false);
  const [mostrarProductos, setMostrarProductos] = useState(false);
  const [metodoPago, setMetodoPago] = useState<string>('efectivo');
  const [porEntregar, setPorEntregar] = useState(false);
  const [credito, setCredito] = useState(false);
  const [descuentoGlobal, setDescuentoGlobal] = useState(0);
  const [fecha] = useState(new Date().toLocaleDateString('es-VE'));
  const [hora] = useState(new Date().toLocaleTimeString('es-VE', { hour: '2-digit', minute: '2-digit' }));

  const inputRef = useRef<HTMLInputElement>(null);
  const clienteRef = useRef<HTMLDivElement>(null);
  const productoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (clienteRef.current && !clienteRef.current.contains(e.target as Node)) {
        setMostrarClientes(false);
      }
      if (productoRef.current && !productoRef.current.contains(e.target as Node)) {
        setMostrarProductos(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const sugerencias = useMemo(() => {
    if (!busqueda.trim()) return [];
    return productosMock.filter((p) =>
      p.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      p.codigo.toLowerCase().includes(busqueda.toLowerCase())
    );
  }, [busqueda]);

  const agregarProducto = (p: Producto) => {
    setLineas((prev) => {
      const existe = prev.find((l) => l.producto.id === p.id);
      if (existe) {
        return prev.map((l) => l.producto.id === p.id ? { ...l, cantidad: l.cantidad + 1 } : l);
      }
      return [...prev, { producto: p, cantidad: 1, descuento: 0, iva: true }];
    });
    setBusqueda('');
    setMostrarProductos(false);
    inputRef.current?.focus();
  };

  const actualizarCantidad = (id: number, delta: number) => {
    setLineas((prev) =>
      prev
        .map((l) => l.producto.id === id ? { ...l, cantidad: Math.max(1, l.cantidad + delta) } : l)
        .filter((l) => l.cantidad > 0)
    );
  };

  const actualizarDescuentoLinea = (id: number, valor: number) => {
    setLineas((prev) =>
      prev.map((l) => l.producto.id === id ? { ...l, descuento: Math.max(0, Math.min(100, valor)) } : l)
    );
  };

  const toggleIvaLinea = (id: number) => {
    setLineas((prev) => prev.map((l) => l.producto.id === id ? { ...l, iva: !l.iva } : l));
  };

  const eliminarLinea = (id: number) => {
    setLineas((prev) => prev.filter((l) => l.producto.id !== id));
  };

  const subtotal = lineas.reduce((acc, l) => acc + l.producto.pvp * l.cantidad, 0);
  const descuentoLineas = lineas.reduce((acc, l) => acc + (l.producto.pvp * l.cantidad * l.descuento / 100), 0);
  const descuentoGlobalMonto = (subtotal - descuentoLineas) * (descuentoGlobal / 100);
  const baseImponible = lineas
    .filter((l) => l.iva)
    .reduce((acc, l) => acc + l.producto.pvp * l.cantidad * (1 - l.descuento / 100), 0) * (1 - descuentoGlobal / 100);
  const ivaMonto = baseImponible * 0.16;
  const totalUsd = subtotal - descuentoLineas - descuentoGlobalMonto + ivaMonto;
  const totalBs = totalUsd * TASA;

  return (
    <div className="factura-wrap">
      {/* Top bar */}
      <div className="factura-topbar">
        <div className="factura-brand">
          <div className="factura-logo"><Calculator size={20} /></div>
          <div>
            <div className="factura-title">Facturación Inteligente</div>
            <div className="factura-subtitle">Punto de venta profesional</div>
          </div>
        </div>
        <div className="factura-meta">
          <span><Calendar size={12} /> {fecha}</span>
          <span><Clock size={12} /> {hora}</span>
          <span className="factura-tasa">Tasa: Bs {TASA.toFixed(2)}</span>
        </div>
      </div>

      <div className="factura-grid">
        {/* Left column */}
        <div className="factura-main">
          {/* Client card */}
          <div className={`factura-card factura-card-visible ${mostrarClientes ? 'factura-card-active' : ''}`}>
            <div className="factura-card-header">
              <User size={14} />
              <span>Datos del Cliente</span>
            </div>
            <div className="factura-cliente">
              <div className="factura-cliente-info">
                <div className="factura-cliente-avatar">{cliente.nombre.charAt(0)}</div>
                <div className="factura-cliente-datos">
                  <div className="factura-cliente-nombre">{cliente.nombre}</div>
                  <div className="factura-cliente-rif">RIF/CI: {cliente.cedula} · {cliente.telefono}</div>
                  <div className="factura-cliente-dir">{cliente.direccion}</div>
                </div>
              </div>
              <div className="factura-cliente-actions">
                <div className="factura-search-cliente" ref={clienteRef}>
                  <button
                    type="button"
                    className="factura-cliente-select"
                    onClick={() => setMostrarClientes((v) => !v)}
                  >
                    <span>{cliente.nombre}</span>
                    <ChevronDown size={14} className={mostrarClientes ? 'open' : ''} />
                  </button>
                  {mostrarClientes && (
                    <div className="factura-dropdown">
                      {clientesMock.map((c) => (
                        <button
                          key={c.id}
                          className={`factura-dropdown-item ${cliente.id === c.id ? 'active' : ''}`}
                          onClick={() => { setCliente(c); setMostrarClientes(false); }}
                        >
                          <span>{c.nombre}</span>
                          <small>{c.cedula}</small>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <button className="factura-btn-icon" title="Nuevo cliente"><Plus size={16} /></button>
              </div>
            </div>
          </div>

          {/* Product search */}
          <div className={`factura-card factura-card-visible ${mostrarProductos ? 'factura-card-active' : ''}`}>
            <div className="factura-card-header factura-card-header-gold">
              <ShoppingCart size={14} />
              <span>Agregar Productos</span>
            </div>
            <div className="factura-buscar-prod">
              <div className="factura-search-prod" ref={productoRef}>
                <Search size={16} />
                <input
                  ref={inputRef}
                  type="text"
                  placeholder="Buscar por código, nombre o categoría..."
                  value={busqueda}
                  onChange={(e) => { setBusqueda(e.target.value); setMostrarProductos(true); }}
                />
                {mostrarProductos && sugerencias.length > 0 && (
                  <div className="factura-dropdown factura-dropdown-prod">
                    {sugerencias.map((p) => (
                      <button
                        key={p.id}
                        className="factura-dropdown-item"
                        onClick={() => agregarProducto(p)}
                      >
                        <span>{p.nombre}</span>
                        <span className="factura-prod-code">{p.codigo}</span>
                        <span className="factura-prod-precio">${p.pvp.toFixed(2)}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <button className="factura-btn factura-btn-gold"><Plus size={16} /> Producto</button>
            </div>
          </div>

          {/* Items table desktop */}
          <div className="factura-card factura-table-card d-only">
            <div className="factura-card-header">
              <Package size={14} />
              <span>Artículos de la Venta</span>
              <span className="factura-items-count">{lineas.length} ítems</span>
            </div>
            <div className="factura-table-wrap">
              <table className="factura-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Descripción</th>
                    <th className="text-center">Cant.</th>
                    <th className="text-right">Precio</th>
                    <th className="text-center">Dsct%</th>
                    <th className="text-center">IVA</th>
                    <th className="text-right">Total Bs</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {lineas.length === 0 && (
                    <tr>
                      <td colSpan={8} className="factura-empty">
                        <Package size={32} />
                        <p>Agrega productos para comenzar la factura</p>
                      </td>
                    </tr>
                  )}
                  {lineas.map((l, idx) => {
                    const sub = l.producto.pvp * l.cantidad * (1 - l.descuento / 100);
                    const conIva = l.iva ? sub * 1.16 : sub;
                    return (
                      <tr key={l.producto.id}>
                        <td className="factura-num">{idx + 1}</td>
                        <td>
                          <div className="factura-prod-nombre">{l.producto.nombre}</div>
                          <div className="factura-prod-code">{l.producto.codigo} · Stock: {l.producto.stock}</div>
                        </td>
                        <td className="text-center">
                          <div className="factura-qty">
                            <button onClick={() => actualizarCantidad(l.producto.id, -1)}>-</button>
                            <input
                              type="number"
                              min={1}
                              value={l.cantidad}
                              onChange={(e) => {
                                const val = parseInt(e.target.value) || 1;
                                setLineas((prev) => prev.map((x) => x.producto.id === l.producto.id ? { ...x, cantidad: Math.max(1, val) } : x));
                              }}
                            />
                            <button onClick={() => actualizarCantidad(l.producto.id, 1)}>+</button>
                          </div>
                        </td>
                        <td className="text-right">${l.producto.pvp.toFixed(2)}</td>
                        <td className="text-center">
                          <input
                            type="number"
                            className="factura-dsct-input"
                            value={l.descuento}
                            onChange={(e) => actualizarDescuentoLinea(l.producto.id, parseFloat(e.target.value) || 0)}
                            min={0}
                            max={100}
                          />
                        </td>
                        <td className="text-center">
                          <button
                            className={`factura-iva-badge ${l.iva ? 'active' : ''}`}
                            onClick={() => toggleIvaLinea(l.producto.id)}
                          >
                            {l.iva ? '16%' : 'Exento'}
                          </button>
                        </td>
                        <td className="text-right factura-total-bs">Bs {(conIva * TASA).toFixed(2)}</td>
                        <td className="text-center">
                          <button className="factura-delete" onClick={() => eliminarLinea(l.producto.id)}>
                            <Trash2 size={14} />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Items cards mobile */}
          <div className="factura-card factura-mobile-items m-only">
            <div className="factura-card-header">
              <Package size={14} />
              <span>Artículos</span>
              <span className="factura-items-count">{lineas.length} ítems</span>
            </div>
            <div className="factura-mobile-list">
              {lineas.length === 0 && (
                <div className="factura-empty">
                  <Package size={32} />
                  <p>Agrega productos para comenzar la factura</p>
                </div>
              )}
              {lineas.map((l) => {
                const sub = l.producto.pvp * l.cantidad * (1 - l.descuento / 100);
                const conIva = l.iva ? sub * 1.16 : sub;
                return (
                  <div key={l.producto.id} className="factura-mobile-item">
                    <div className="factura-mobile-main">
                      <div className="factura-mobile-qty">
                        <button onClick={() => actualizarCantidad(l.producto.id, -1)}>-</button>
                        <input
                          type="number"
                          min={1}
                          value={l.cantidad}
                          onChange={(e) => {
                            const val = parseInt(e.target.value) || 1;
                            setLineas((prev) => prev.map((x) => x.producto.id === l.producto.id ? { ...x, cantidad: Math.max(1, val) } : x));
                          }}
                        />
                        <button onClick={() => actualizarCantidad(l.producto.id, 1)}>+</button>
                      </div>
                      <div className="factura-mobile-info">
                        <div className="factura-prod-nombre">{l.producto.nombre}</div>
                        <div className="factura-prod-code">{l.producto.codigo} · Stock {l.producto.stock}</div>
                      </div>
                      <div className="factura-mobile-total">
                        <strong>Bs {(conIva * TASA).toFixed(2)}</strong>
                      </div>
                    </div>
                    <div className="factura-mobile-footer">
                      <button className="factura-delete" onClick={() => eliminarLinea(l.producto.id)}>
                        <Trash2 size={12} />
                      </button>
                      <span className="factura-mobile-unit">${l.producto.pvp.toFixed(2)} c/u</span>
                      <div className="factura-mobile-edits">
                        <input
                          type="number"
                          className="factura-dsct-input"
                          value={l.descuento}
                          onChange={(e) => actualizarDescuentoLinea(l.producto.id, parseFloat(e.target.value) || 0)}
                          min={0}
                          max={100}
                        />
                        <button
                          className={`factura-iva-badge ${l.iva ? 'active' : ''}`}
                          onClick={() => toggleIvaLinea(l.producto.id)}
                        >
                          {l.iva ? '16%' : 'Exento'}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right column */}
        <div className="factura-side">
          {/* Totals card */}
          <div className="factura-card factura-totals">
            <div className="factura-card-header factura-card-header-red">
              <Receipt size={14} />
              <span>Totales</span>
            </div>
            <div className="factura-totals-body">
              <div className="factura-total-row">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="factura-total-row">
                <span>Descuento líneas</span>
                <span className="factura-discount">-${descuentoLineas.toFixed(2)}</span>
              </div>
              {descuentoGlobal > 0 && (
                <div className="factura-total-row">
                  <span>Desc. global ({descuentoGlobal}%)</span>
                  <span className="factura-discount">-${descuentoGlobalMonto.toFixed(2)}</span>
                </div>
              )}
              <div className="factura-total-row">
                <span>IVA (16%)</span>
                <span>${ivaMonto.toFixed(2)}</span>
              </div>
              <div className="factura-total-row factura-total-grand">
                <span>Total USD</span>
                <span>${totalUsd.toFixed(2)}</span>
              </div>
              <div className="factura-total-row factura-total-bsf">
                <span>Total Bs</span>
                <span>Bs {totalBs.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Options */}
          <div className="factura-card">
            <div className="factura-card-header">
              <AlertCircle size={14} />
              <span>Opciones de Venta</span>
            </div>
            <div className="factura-options">
              <label className={`factura-option ${porEntregar ? 'active' : ''}`}>
                <input type="checkbox" checked={porEntregar} onChange={(e) => setPorEntregar(e.target.checked)} />
                <div className="factura-option-check"><Check size={12} /></div>
                <span>Por Entregar</span>
              </label>
              <label className={`factura-option ${credito ? 'active' : ''}`}>
                <input type="checkbox" checked={credito} onChange={(e) => setCredito(e.target.checked)} />
                <div className="factura-option-check"><Check size={12} /></div>
                <span>Crédito / Apartado</span>
              </label>
              <div className="factura-option-input">
                <span>Descuento global</span>
                <div className="factura-dsct-global">
                  <input
                    type="number"
                    value={descuentoGlobal}
                    onChange={(e) => setDescuentoGlobal(Math.max(0, Math.min(100, parseFloat(e.target.value) || 0)))}
                    min={0}
                    max={100}
                  />
                  <span>%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Payment methods */}
          <div className="factura-card">
            <div className="factura-card-header">
              <CreditCard size={14} />
              <span>Método de Pago</span>
            </div>
            <div className="factura-pagos">
              {METODOS_PAGO.map((m) => {
                const Icon = m.icon;
                return (
                  <button
                    key={m.id}
                    className={`factura-pago ${metodoPago === m.id ? 'active' : ''}`}
                    onClick={() => setMetodoPago(m.id)}
                  >
                    <Icon size={18} />
                    <span>{m.label}</span>
                    {metodoPago === m.id && <Check size={12} className="factura-pago-check" />}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom actions */}
      <div className="factura-actions">
        <button className="factura-action factura-action-ghost" onClick={() => { setLineas([]); setCliente(clientesMock[0]); setDescuentoGlobal(0); }}>
          <RotateCcw size={16} /> Limpiar
        </button>
        <div className="factura-actions-main">
          <button className="factura-action factura-action-secondary"><Save size={16} /> Guardar Nota</button>
          <button className="factura-action factura-action-secondary"><FileText size={16} /> Presupuesto</button>
          <button className="factura-action factura-action-secondary"><Printer size={16} /> Proforma</button>
          <button className="factura-action factura-action-primary"><Receipt size={16} /> Factura + IVA</button>
        </div>
      </div>
    </div>
  );
}
