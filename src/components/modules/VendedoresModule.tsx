import { useState } from 'react';
import { Users, DollarSign, Plus } from 'lucide-react';
import { usuariosMock, type Usuario } from '../../data/mockData';

const roles = ['Admin', 'Vendedor', 'Facturador', 'Almacenista'];
const badgeColor: Record<string, string> = {
  Admin: 'mod-badge-danger',
  Vendedor: 'mod-badge-success',
  Facturador: 'mod-badge-info',
  Almacenista: 'mod-badge-warning',
};

export default function VendedoresModule() {
  const [usuarios, setUsuarios] = useState(usuariosMock);
  const [modal, setModal] = useState<Usuario | null>(null);
  const [nuevo, setNuevo] = useState(false);

  const guardar = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setModal(null);
    setNuevo(false);
  };

  const toggleActivo = (id: number) => {
    setUsuarios((prev) => prev.map((u) => u.id === id ? { ...u, activo: !u.activo } : u));
  };

  return (
    <div className="mod-wrap">
      <div className="mod-toolbar">
        <div className="mod-title"><Users size={18} /> Gestión de Personal</div>
        <div className="flex gap-2">
          <button className="mod-btn mod-btn-secondary"><DollarSign size={14} /> Pagar nómina</button>
          <button className="mod-btn mod-btn-primary" onClick={() => setNuevo(true)}><Plus size={14} /> Nuevo</button>
        </div>
      </div>

      <div className="mod-card">
        <table className="mod-table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Cédula</th>
              <th>Teléfono</th>
              <th>Rol</th>
              <th className="text-right">Fact. semana</th>
              <th className="text-center">Estado</th>
              <th className="text-center">Acción</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.map((u) => (
              <tr key={u.id} className={!u.activo ? 'opacity-50' : ''}>
                <td className="font-bold">{u.nombre}</td>
                <td>{u.cedula}</td>
                <td>{u.telefono}</td>
                <td><span className={`mod-badge ${badgeColor[u.rol]}`}>{u.rol}</span></td>
                <td className="text-right">${u.semana.toFixed(2)}</td>
                <td className="text-center">
                  <button
                    className={`w-9 h-5 rounded-full relative transition-colors ${u.activo ? 'bg-emerald-500' : 'bg-gray-600'}`}
                    onClick={() => toggleActivo(u.id)}
                  >
                    <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-all ${u.activo ? 'left-4.5' : 'left-0.5'}`} />
                  </button>
                </td>
                <td className="text-center">
                  <button className="mod-btn mod-btn-secondary py-1 px-2 text-[10px]" onClick={() => setModal(u)}>Editar</button>
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
              <h4>{nuevo ? 'Nuevo Personal' : 'Editar Personal'}</h4>
              <button className="mod-close-btn" onClick={() => { setModal(null); setNuevo(false); }}>×</button>
            </div>
            <form onSubmit={guardar}>
              <div className="mod-modal-body mod-form-grid">
                <div>
                  <label>Nombre</label>
                  <input className="mod-input" defaultValue={modal?.nombre || ''} />
                </div>
                <div>
                  <label>Cédula</label>
                  <input className="mod-input" defaultValue={modal?.cedula || ''} />
                </div>
                <div>
                  <label>Teléfono</label>
                  <input className="mod-input" defaultValue={modal?.telefono || ''} />
                </div>
                <div>
                  <label>Rol</label>
                  <select className="mod-input" defaultValue={modal?.rol || 'Vendedor'}>
                    {roles.map((r) => <option key={r} value={r}>{r}</option>)}
                  </select>
                </div>
                <div>
                  <label>Sueldo base $</label>
                  <input className="mod-input" type="number" defaultValue="300" />
                </div>
                <div>
                  <label>Contraseña</label>
                  <input className="mod-input" type="password" defaultValue="" />
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
