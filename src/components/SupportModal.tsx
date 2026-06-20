import type { FormEvent, ChangeEvent } from 'react';
import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface SupportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const priorities = [
  { value: 'baja', label: 'Baja' },
  { value: 'normal', label: 'Normal' },
  { value: 'alta', label: 'Alta' },
  { value: 'urgente', label: 'Urgente' },
];

export default function SupportModal({ isOpen, onClose }: SupportModalProps) {
  const [form, setForm] = useState({
    client_name: '',
    client_email: '',
    client_phone: '',
    company: '',
    subject: '',
    description: '',
    priority: 'normal',
  });
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const handleChange = useCallback((e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }, []);

  const handleSubmit = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();
      if (loading) return;
      setLoading(true);
      try {
        const res = await fetch('/api/tickets', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form),
        });
        if (!res.ok) throw new Error('Error');
        setDone(true);
        setTimeout(() => {
          setDone(false);
          onClose();
        }, 3000);
      } catch {
        alert('Error al enviar. Intenta de nuevo.');
      } finally {
        setLoading(false);
      }
    },
    [form, loading, onClose],
  );

  const resetForm = useCallback(() => {
    setForm({ client_name: '', client_email: '', client_phone: '', company: '', subject: '', description: '', priority: 'normal' });
    setDone(false);
  }, []);

  return (
    <AnimatePresence onExitComplete={resetForm}>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 z-[200] bg-black/75 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={onClose}
            aria-hidden="true"
          />
          <motion.div
            className="fixed inset-0 z-[200] flex items-center justify-center p-4 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="pointer-events-auto"
              style={{
                background: '#13151A',
                border: '1px solid #1E2128',
                borderRadius: 16,
                width: '100%',
                maxWidth: 520,
                maxHeight: '90vh',
                overflow: 'auto',
              }}
              initial={{ opacity: 0, y: 40, scale: 0.95, filter: 'blur(20px)' }}
              animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: 40, scale: 0.95, filter: 'blur(20px)' }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              role="dialog"
              aria-modal="true"
              onClick={(e) => e.stopPropagation()}
            >
              <div style={{ padding: 24, position: 'relative' }}>
                <button
                  onClick={onClose}
                  style={{
                    position: 'absolute', top: 16, right: 16, background: 'none', border: 'none',
                    color: '#9AA3B5', cursor: 'pointer', padding: 4,
                  }}
                  aria-label="Cerrar"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                    <path d="M18 6L6 18M6 6l12 12" />
                  </svg>
                </button>

                <div style={{ marginBottom: 20 }}>
                  <div className="tag" style={{ display: 'inline-flex', marginBottom: 10 }}>Soporte</div>
                  <h2 style={{ fontSize: 20, fontWeight: 900, lineHeight: 1.15, letterSpacing: '-0.03em', marginBottom: 6 }}>
                    Abre un <span style={{ color: '#CC0000' }}>ticket</span>
                  </h2>
                  <p style={{ fontSize: 13, color: '#9AA3B5' }}>
                    ¿Tienes un problema o consulta? Te responderemos a la brevedad.
                  </p>
                </div>

                {done ? (
                  <div style={{ textAlign: 'center', padding: '30px 0' }}>
                    <div style={{ fontSize: 40, marginBottom: 12 }}>✅</div>
                    <h3 style={{ fontSize: 18, marginBottom: 8 }}>¡Ticket enviado!</h3>
                    <p style={{ color: '#9AA3B5', fontSize: 14 }}>
                      Te contactaremos pronto a {form.client_email}.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                      <input
                        className="nl-input"
                        name="client_name"
                        placeholder="Nombre completo"
                        value={form.client_name}
                        onChange={handleChange}
                        required
                        disabled={loading}
                        style={{ borderRadius: 8, width: '100%' }}
                      />
                      <input
                        className="nl-input"
                        name="client_email"
                        type="email"
                        placeholder="Correo electrónico"
                        value={form.client_email}
                        onChange={handleChange}
                        required
                        disabled={loading}
                        style={{ borderRadius: 8, width: '100%' }}
                      />
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                      <input
                        className="nl-input"
                        name="client_phone"
                        placeholder="Teléfono (opcional)"
                        value={form.client_phone}
                        onChange={handleChange}
                        disabled={loading}
                        style={{ borderRadius: 8, width: '100%' }}
                      />
                      <input
                        className="nl-input"
                        name="company"
                        placeholder="Empresa (opcional)"
                        value={form.company}
                        onChange={handleChange}
                        disabled={loading}
                        style={{ borderRadius: 8, width: '100%' }}
                      />
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '3fr 1fr', gap: 10 }}>
                      <input
                        className="nl-input"
                        name="subject"
                        placeholder="Asunto"
                        value={form.subject}
                        onChange={handleChange}
                        required
                        disabled={loading}
                        style={{ borderRadius: 8, width: '100%' }}
                      />
                      <select
                        className="nl-input"
                        name="priority"
                        value={form.priority}
                        onChange={handleChange}
                        disabled={loading}
                        style={{ borderRadius: 8, cursor: 'pointer', appearance: 'auto', width: '100%' }}
                      >
                        {priorities.map((p) => (
                          <option key={p.value} value={p.value}>{p.label}</option>
                        ))}
                      </select>
                    </div>
                    <textarea
                      className="nl-input"
                      name="description"
                      placeholder="Describe tu problema o consulta en detalle..."
                      value={form.description}
                      onChange={handleChange}
                      required
                      disabled={loading}
                      rows={4}
                      style={{ borderRadius: 8, resize: 'vertical', minHeight: 80, width: '100%' }}
                    />
                    <button
                      type="submit"
                      className="nl-submit"
                      disabled={loading}
                      style={{ width: '100%', marginTop: 4 }}
                    >
                      {loading ? 'Enviando...' : 'Enviar ticket '}
                      {!loading && (
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                          <path d="M5 12h14M12 5l7 7-7 7" />
                        </svg>
                      )}
                    </button>
                  </form>
                )}
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
