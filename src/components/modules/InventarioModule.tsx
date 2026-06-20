import { useState, useMemo } from 'react';
import { PackageSearch, Search, Plus } from 'lucide-react';
import { productosMock, type Producto } from '../../data/mockData';

export default function InventarioModule() {
  const [busqueda, setBusqueda] = useState('');
  const [productos, setProductos] = useState(productosMock);
  const [modal, setModal] = useState<Producto | null>(null);
  const [nuevo, setNuevo] = useState(false);

  const filtrados = useMemo(() => {
    return productos.filter((p) =>
      p.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      p.codigo.toLowerCase().includes(busqueda.toLowerCase())
    );
  }, [busqueda, productos]);

  const guardarProducto = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setModal(null);
    setNuevo(false);
  };

  return (
    <div className="mod-wrap">
      <div className="mod-toolbar">
        <div className="mod-title"><PackageSearch size={18} /> Control de Stock</div>
        <div className="flex gap-2 flex-1 justify-end">
          <div className="mod-search">
            <Search size={16} />
            <input placeholder="Buscar producto, código..." value={busqueda} onChange={(e) => setBusqueda(e.target.value)} />
          </div>
          <button className="mod-btn mod-btn-primary" onClick={() => setNuevo(true)}><Plus size={14} /> Nuevo</button>
        </div>
      </div>

      <div className="mod-card">
        <table className="mod-table">
          <thead>
            <tr>
              <th>Código</th>
              <th>Producto</th>
              <th className="text-center">Stock</th>
              <th className="text-right">Costo $</th>
              <th className="text-right">PVP $</th>
              <th className="text-center">Acción</th>
            </tr>
          </thead>
          <tbody>
            {filtrados.map((p) => (
              <tr key={p.id}>
                <td className="font-mono text-xs">{p.codigo}</td>
                <td>
                  <div className="font-bold">{p.nombre}</div>
                  <div className="text-[10px] text-gray-500">{p.categoria}</div>
                </td>
                <td className="text-center">
                  <span className={`mod-badge ${p.stock < 20 ? 'mod-badge-danger' : 'mod-badge-success'}`}>{p.stock}</span>
                </td>
                <td className="text-right">${p.costo.toFixed(2)}</td>
                <td className="text-right font-bold">${p.pvp.toFixed(2)}</td>
                <td className="text-center">
                  <button className="mod-btn mod-btn-secondary py-1 px-2 text-[10px]" onClick={() => setModal(p)}>Editar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {(modal || nuevo) && (
        <div className="mod-modal-overlay" onClick={() => { setModal(null); setNuevo(false); }}>
          <div className="mod-modal" onClick={(e) => e.stopPropagation()}>
            <div className="mod-modal-header">
              <h4>{nuevo ? 'Nuevo Producto' : 'Editar Producto'}</h4>
              <button className="mod-close-btn" onClick={() => { setModal(null); setNuevo(false); }}>×</button>
            </div>
            <form onSubmit={guardarProducto}>
              <div className="mod-modal-body mod-form-grid">
                <div>
                  <label>Código</label>
                  <input className="mod-input" defaultValue={modal?.codigo || ''} />
                </div>
                <div>
                  <label>Nombre</label>
                  <input className="mod-input" defaultValue={modal?.nombre || ''} />
                </div>
                <div>
                  <label>Costo $</label>
                  <input className="mod-input" type="number" step="0.01" defaultValue={modal?.costo || ''} />
                </div>
                <div>
                  <label>Margen %</label>
                  <input className="mod-input" type="number" defaultValue="30" />
                </div>
                <div>
                  <label>PVP $</label>
                  <input className="mod-input" type="number" step="0.01" defaultValue={modal?.pvp || ''} />
                </div>
                <div>
                  <label>Stock</label>
                  <input className="mod-input" type="number" defaultValue={modal?.stock || ''} />
                </div>
                <div className="mod-full">
                  <label>Descripción</label>
                  <textarea className="mod-input" rows={2} defaultValue={modal?.categoria || ''} />
                </div>
              </div>
              <div className="mod-modal-footer">
                <button type="button" className="mod-btn mod-btn-secondary" onClick={() => { setModal(null); setNuevo(false); }}>Cancelar</button>
                <button type="submit" className="mod-btn mod-btn-primary">Guardar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
