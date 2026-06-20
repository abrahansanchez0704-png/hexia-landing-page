import type { FormEvent, ChangeEvent } from 'react';
import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface ProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const steps = [
  'Contacto',
  'Industria',
  'Proyecto',
  'Documento',
  'NDA',
  'Agendar',
];

const industries = [
  'Retail / Tienda física',
  'E-commerce',
  'Servicios profesionales',
  'Restaurantes / Food',
  'Manufactura',
  'Distribución / Mayorista',
  'Tecnología',
  'Salud',
  'Otra',
];

const projectTypes = [
  'Implementación de HEXIA',
  'Migración desde otro sistema',
  'Desarrollo a medida',
  'Integraciones',
  'Consultoría',
  'No estoy seguro',
];

const docs = [
  'Facturas actuales',
  'Base de clientes',
  'Base de productos',
  'Estados de cuenta',
  'Ninguno aún',
];

export default function ProjectModal({ isOpen, onClose }: ProjectModalProps) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    countryCode: '+58',
    company: '',
    role: '',
    industry: '',
    projectType: '',
    projectDetails: '',
    documents: [] as string[],
    nda: false,
    budget: '',
  });

  const updateField = useCallback((field: string, value: string | boolean | string[]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }, []);

  const handleChange = useCallback((e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      updateField(name, checked);
    } else {
      updateField(name, value);
    }
  }, [updateField]);

  const toggleDocument = useCallback((doc: string) => {
    setFormData((prev) => {
      const has = prev.documents.includes(doc);
      const next = has ? prev.documents.filter((d) => d !== doc) : [...prev.documents, doc];
      return { ...prev, documents: next };
    });
  }, []);

  const nextStep = useCallback(() => {
    setStep((s) => Math.min(s + 1, steps.length));
  }, []);

  const prevStep = useCallback(() => {
    setStep((s) => Math.max(s - 1, 1));
  }, []);

  const handleSubmit = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();
      if (step < steps.length) {
        nextStep();
      } else if (!loading) {
        setLoading(true);
        try {
          const res = await fetch('/api/projects', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData),
          });
          if (!res.ok) throw new Error('Error');
          setDone(true);
        } catch {
          alert('Error al enviar. Intenta de nuevo.');
        } finally {
          setLoading(false);
        }
      }
    },
    [step, formData, nextStep, loading],
  );

  const isStepValid = useCallback(() => {
    if (step === 1) {
      return formData.name.trim() && formData.email.trim() && formData.phone.trim();
    }
    if (step === 2) return !!formData.industry;
    if (step === 3) return !!formData.projectType && formData.projectDetails.trim().length > 10;
    return true;
  }, [step, formData]);

  return (
    <AnimatePresence>
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
              className="pm-modal pointer-events-auto"
              initial={{ opacity: 0, y: 40, scale: 0.95, filter: 'blur(20px)' }}
              animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: 40, scale: 0.95, filter: 'blur(20px)' }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              role="dialog"
              aria-modal="true"
              aria-labelledby="pm-title"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="pm-close"
                aria-label="Cerrar"
                onClick={onClose}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>

              <div className="pm-head">
                <div className="tag">Empezar Proyecto</div>
                <h2 id="pm-title" className="pm-title">
                  Cuéntanos sobre tu <span>proyecto</span>
                </h2>
                <p className="pm-sub">Completa los pasos y agenda tu consultoría gratuita.</p>
              </div>

              <div className="pm-steps">
                {steps.map((label, i) => {
                  const n = i + 1;
                  const active = n === step;
                  const done = n < step;
                  return (
                    <div key={label} className={`pm-step${active ? ' active' : ''}${done ? ' done' : ''}`}>
                      <div className="pm-step-num">{done ? '✓' : n}</div>
                      <span className="pm-step-label">{label}</span>
                    </div>
                  );
                })}
              </div>

              <form className="pm-form" onSubmit={handleSubmit}>
                <AnimatePresence mode="wait">
                  {step === 1 && (
                    <motion.div
                      key="step1"
                      className="pm-step-body"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.25 }}
                    >
                      <div className="pm-field">
                        <label htmlFor="pm-name">Nombre completo <em>*</em></label>
                        <input
                          id="pm-name"
                          name="name"
                          type="text"
                          placeholder="Ej: María González"
                          value={formData.name}
                          onChange={handleChange}
                          required
                          autoFocus
                        />
                      </div>
                      <div className="pm-field">
                        <label htmlFor="pm-email">Correo electrónico <em>*</em></label>
                        <input
                          id="pm-email"
                          name="email"
                          type="email"
                          placeholder="tu@empresa.com"
                          value={formData.email}
                          onChange={handleChange}
                          required
                        />
                      </div>
                      <div className="pm-field">
                        <label htmlFor="pm-phone">Teléfono <em>*</em></label>
                        <div className="pm-phone">
                          <select
                            name="countryCode"
                            value={formData.countryCode}
                            onChange={handleChange}
                            aria-label="Código de país"
                          >
                            <option value="+58">🇻🇪 +58</option>
                            <option value="+1">🇺🇸 +1</option>
                            <option value="+34">🇪🇸 +34</option>
                            <option value="+57">🇨🇴 +57</option>
                            <option value="+51">🇵🇪 +51</option>
                            <option value="+56">🇨🇱 +56</option>
                            <option value="+54">🇦🇷 +54</option>
                            <option value="+52">🇲🇽 +52</option>
                            <option value="+other">Otro</option>
                          </select>
                          <input
                            id="pm-phone"
                            name="phone"
                            type="tel"
                            placeholder="412 345 6789"
                            value={formData.phone}
                            onChange={handleChange}
                            required
                          />
                        </div>
                      </div>
                      <div className="pm-row">
                        <div className="pm-field">
                          <label htmlFor="pm-company">Empresa <span>(opcional)</span></label>
                          <input
                            id="pm-company"
                            name="company"
                            type="text"
                            placeholder="Ej: Innovatech Labs"
                            value={formData.company}
                            onChange={handleChange}
                          />
                        </div>
                        <div className="pm-field">
                          <label htmlFor="pm-role">Cargo <span>(opcional)</span></label>
                          <input
                            id="pm-role"
                            name="role"
                            type="text"
                            placeholder="Ej: Director de Tecnología"
                            value={formData.role}
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {step === 2 && (
                    <motion.div
                      key="step2"
                      className="pm-step-body"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.25 }}
                    >
                      <p className="pm-step-q">¿A qué industria pertenece tu negocio?</p>
                      <div className="pm-options">
                        {industries.map((ind) => (
                          <label key={ind} className={`pm-option${formData.industry === ind ? ' selected' : ''}`}>
                            <input
                              type="radio"
                              name="industry"
                              value={ind}
                              checked={formData.industry === ind}
                              onChange={handleChange}
                            />
                            {ind}
                          </label>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {step === 3 && (
                    <motion.div
                      key="step3"
                      className="pm-step-body"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.25 }}
                    >
                      <p className="pm-step-q">¿Qué tipo de proyecto necesitas?</p>
                      <div className="pm-options">
                        {projectTypes.map((pt) => (
                          <label key={pt} className={`pm-option${formData.projectType === pt ? ' selected' : ''}`}>
                            <input
                              type="radio"
                              name="projectType"
                              value={pt}
                              checked={formData.projectType === pt}
                              onChange={handleChange}
                            />
                            {pt}
                          </label>
                        ))}
                      </div>
                      <div className="pm-field" style={{ marginTop: '16px' }}>
                        <label htmlFor="pm-details">Describe tu proyecto, objetivos y necesidades <em>*</em></label>
                        <textarea
                          id="pm-details"
                          name="projectDetails"
                          rows={4}
                          placeholder="Cuéntanos qué quieres lograr, cuántos usuarios/equipos tienes, y cualquier detalle importante..."
                          value={formData.projectDetails}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </motion.div>
                  )}

                  {step === 4 && (
                    <motion.div
                      key="step5"
                      className="pm-step-body"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.25 }}
                    >
                      <p className="pm-step-q">¿Qué información puedes compartir para la evaluación?</p>
                      <div className="pm-options pm-options-multi">
                        {docs.map((doc) => (
                          <label key={doc} className={`pm-option${formData.documents.includes(doc) ? ' selected' : ''}`}>
                            <input
                              type="checkbox"
                              value={doc}
                              checked={formData.documents.includes(doc)}
                              onChange={() => toggleDocument(doc)}
                            />
                            {doc}
                          </label>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {step === 5 && (
                    <motion.div
                      key="step5"
                      className="pm-step-body"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.25 }}
                    >
                      <p className="pm-step-q">Acuerdo de confidencialidad (NDA)</p>
                      <label className={`pm-nda${formData.nda ? ' selected' : ''}`}>
                        <input
                          type="checkbox"
                          name="nda"
                          checked={formData.nda}
                          onChange={handleChange}
                        />
                        <div>
                          <strong>Solicitar NDA</strong>
                          <span>Quiero que firmemos un acuerdo de confidencialidad antes de compartir información sensible.</span>
                        </div>
                      </label>
                    </motion.div>
                  )}

                  {step === 6 && !done && (
                    <motion.div
                      key="step6"
                      className="pm-step-body"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.25 }}
                    >
                      <p className="pm-step-q">¿Cuál es tu rango de inversión estimado?</p>
                      <div className="pm-options">
                        {['Menos de $500', '$500 – $1,500', '$1,500 – $3,000', '$3,000 – $5,000', 'Más de $5,000', 'Prefiero discutirlo'].map((b) => (
                          <label key={b} className={`pm-option${formData.budget === b ? ' selected' : ''}`}>
                            <input
                              type="radio"
                              name="budget"
                              value={b}
                              checked={formData.budget === b}
                              onChange={handleChange}
                            />
                            {b}
                          </label>
                        ))}
                      </div>
                      <p className="pm-step-note">Recibiremos tu información y te contactaremos pronto.</p>
                    </motion.div>
                  )}

                  {done && (
                    <motion.div
                      key="done"
                      className="pm-step-body"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div style={{ textAlign: 'center', padding: '40px 0' }}>
                        <div style={{ fontSize: 48, marginBottom: 16 }}>✅</div>
                        <h3 style={{ fontSize: 20, marginBottom: 8 }}>¡Proyecto recibido!</h3>
                        <p style={{ color: '#9AA3B5', marginBottom: 24 }}>
                          Gracias, {formData.name}. Hemos recibido tu información y te contactaremos pronto.
                        </p>
                        <button type="button" className="pm-btn pm-btn-primary" onClick={onClose}>
                          Cerrar
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="pm-actions">
                  {step > 1 && !done && (
                    <button type="button" className="pm-btn pm-btn-secondary" onClick={prevStep}>
                      Atrás
                    </button>
                  )}
                  {!done && (
                    <button
                      type="submit"
                      className="pm-btn pm-btn-primary"
                      disabled={!isStepValid() || loading}
                      style={{ marginLeft: step === 1 ? 'auto' : undefined }}
                    >
                      {loading ? 'Enviando...' : step === steps.length ? 'Enviar proyecto' : 'Siguiente'}
                      {!loading && (
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M5 12h14M12 5l7 7-7 7" />
                        </svg>
                      )}
                    </button>
                  )}
                </div>
              </form>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
