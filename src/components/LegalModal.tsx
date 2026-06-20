import { useState, useCallback, type ReactNode } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface LegalModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: string;
}

const tabs = ['terminos', 'privacidad', 'cookies'];

const tabNames: Record<string, string> = {
  terminos: 'Términos de Uso',
  privacidad: 'Política de Privacidad',
  cookies: 'Política de Cookies',
};

export default function LegalModal({ isOpen, onClose, initialTab = 'terminos' }: LegalModalProps) {
  const [tab, setTab] = useState(initialTab);

  const handleClose = useCallback(() => {
    onClose();
  }, [onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 z-[300] bg-black/75 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={handleClose}
          />
          <motion.div
            className="fixed inset-0 z-[300] flex items-center justify-center p-4 pointer-events-none"
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
                maxWidth: 720,
                maxHeight: '90vh',
                display: 'flex',
                flexDirection: 'column',
              }}
              initial={{ opacity: 0, y: 40, scale: 0.95, filter: 'blur(20px)' }}
              animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: 40, scale: 0.95, filter: 'blur(20px)' }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              onClick={(e) => e.stopPropagation()}
            >
              <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '20px 24px', borderBottom: '1px solid #1E2128',
              }}>
                <h2 style={{ fontSize: 18, fontWeight: 700 }}>
                  <span style={{ color: '#CC0000' }}>HEXIA</span> — Legal
                </h2>
                <button onClick={handleClose} style={{
                  background: 'none', border: 'none', color: '#9AA3B5',
                  cursor: 'pointer', padding: 4, fontSize: 20,
                }} aria-label="Cerrar">✕</button>
              </div>

              <div style={{ display: 'flex', borderBottom: '1px solid #1E2128' }}>
                {tabs.map((t) => (
                  <button
                    key={t}
                    onClick={() => setTab(t)}
                    style={{
                      flex: 1, padding: '12px 16px', border: 'none',
                      background: tab === t ? 'transparent' : 'transparent',
                      color: tab === t ? '#CC0000' : '#9AA3B5',
                      borderBottom: tab === t ? '2px solid #CC0000' : '2px solid transparent',
                      cursor: 'pointer', fontSize: 13, fontWeight: 600,
                      transition: 'all 0.2s',
                    }}
                  >
                    {tabNames[t]}
                  </button>
                ))}
              </div>

              <div style={{
                padding: '20px 24px', overflow: 'auto', flex: 1,
                fontSize: 13, lineHeight: 1.7, color: '#C8CCD0',
              }}>
                {tab === 'terminos' && <Terminos />}
                {tab === 'privacidad' && <Privacidad />}
                {tab === 'cookies' && <Cookies />}
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <h3 style={{ fontSize: 15, fontWeight: 700, color: '#F0F2F5', marginBottom: 8 }}>{title}</h3>
      {children}
    </div>
  );
}

function Terminos() {
  return (
    <div>
      <p style={{ marginBottom: 16, color: '#9AA3B5' }}>Última actualización: Junio 2026</p>

      <Section title="1. Aceptación de los Términos">
        <p>Al acceder o utilizar el software HEXIA ("el Sistema"), usted acepta estar sujeto a estos Términos de Uso. Si no está de acuerdo con alguna parte, no debe utilizar el Sistema.</p>
      </Section>

      <Section title="2. Descripción del Servicio">
        <p>HEXIA es un sistema de punto de venta (POS) y gestión empresarial ofrecido como servicio SaaS (Software as a Service). Incluye módulos de facturación, inventario, CRM, administración y otros que serán provistos según el plan contratado.</p>
      </Section>

      <Section title="3. Registro y Cuenta">
        <p>Para usar el Sistema debe registrarse proporcionando información veraz y completa. Usted es responsable de mantener la confidencialidad de sus credenciales y de toda actividad en su cuenta. Debe notificarnos inmediatamente sobre cualquier uso no autorizado.</p>
      </Section>

      <Section title="4. Propiedad Intelectual">
        <p>El Sistema, incluyendo su código, diseño, logotipos y contenido, es propiedad exclusiva de HEXIA Software y está protegido por leyes de propiedad intelectual. No se concede ninguna licencia sobre estos derechos, excepto el derecho limitado a usar el Sistema según estos términos.</p>
      </Section>

      <Section title="5. Obligaciones del Usuario">
        <p>Usted se compromete a: (a) no utilizar el Sistema para actividades ilegales; (b) no intentar vulnerar la seguridad del Sistema; (c) no reproducir, duplicar, copiar o revender el Sistema; (d) no utilizar el Sistema para enviar spam o contenido malicioso; (e) mantener sus datos de facturación actualizados.</p>
      </Section>

      <Section title="6. Datos del Usuario">
        <p>HEXIA almacenará los datos que usted ingrese en el Sistema. Usted conserva todos los derechos sobre sus datos. HEXIA implementa medidas de seguridad razonables para protegerlos, pero no garantiza seguridad absoluta. Usted es responsable de mantener copias de seguridad de su información crítica.</p>
      </Section>

      <Section title="7. Facturación y Pagos">
        <p>Los planes de suscripción se facturan según el período contratado (mensual o anual). El pago es adelantado y no reembolsable, salvo disposición contraria. HEXIA se reserva el derecho de modificar precios con aviso previo de 30 días.</p>
      </Section>

      <Section title="8. Cancelación y Terminación">
        <p>Usted puede cancelar su suscripción en cualquier momento. La cancelación efectiva se dará al final del período facturado. HEXIA puede suspender o terminar el acceso si incumple estos términos. Al terminar, usted perderá el acceso a sus datos almacenados en el Sistema.</p>
      </Section>

      <Section title="9. Limitación de Responsabilidad">
        <p>HEXIA no será responsable por daños indirectos, incidentales o consecuentes derivados del uso o imposibilidad de uso del Sistema. El Sistema se proporciona "tal cual", sin garantías de ningún tipo, ya sean expresas o implícitas. En ningún caso la responsabilidad total de HEXIA excederá el monto pagado por usted en los 12 meses anteriores al reclamo.</p>
      </Section>

      <Section title="10. Disponibilidad del Servicio">
        <p>HEXIA se esfuerza por mantener una disponibilidad del 99.5%, pero no garantiza acceso ininterrumpido. Podrían ocurrir períodos de mantenimiento programado. No nos hacemos responsables por interrupciones causadas por terceros, proveedores de internet, o casos de fuerza mayor.</p>
      </Section>

      <Section title="11. Modificaciones">
        <p>HEXIA se reserva el derecho de modificar estos términos en cualquier momento. Los cambios serán notificados por correo electrónico o mediante aviso en el Sistema. El uso continuado después de los cambios constituye aceptación de los nuevos términos.</p>
      </Section>

      <Section title="12. Ley Aplicable">
        <p>Estos términos se rigen por las leyes de la República Bolivariana de Venezuela. Cualquier disputa será sometida a los tribunales competentes de Maturín, Estado Monagas.</p>
      </Section>

      <Section title="13. Contacto">
        <p>Para consultas sobre estos términos, contáctenos en: <strong style={{ color: '#F0F2F5' }}>legal@hexia.io</strong> o WhatsApp <strong style={{ color: '#F0F2F5' }}>+58 412-2854126</strong>.</p>
      </Section>
    </div>
  );
}

function Privacidad() {
  return (
    <div>
      <p style={{ marginBottom: 16, color: '#9AA3B5' }}>Última actualización: Junio 2026</p>

      <Section title="1. Responsable del Tratamiento">
        <p>HEXIA Software, con domicilio en Maturín, Estado Monagas, Venezuela, es el responsable del tratamiento de sus datos personales. Para ejercer sus derechos, puede contactarnos en <strong style={{ color: '#F0F2F5' }}>legal@hexia.io</strong>.</p>
      </Section>

      <Section title="2. Datos que Recopilamos">
        <p><strong>Datos de registro:</strong> nombre, correo electrónico, teléfono, empresa, cargo.</p>
        <p><strong>Datos de facturación:</strong> información de pago, dirección fiscal, RIF/Jurídico.</p>
        <p><strong>Datos de uso:</strong> estadísticas de uso del Sistema, direcciones IP, tipo de navegador, páginas visitadas.</p>
        <p><strong>Datos de clientes:</strong> información de clientes y transacciones que usted ingrese en el Sistema (de los cuales usted es el responsable del tratamiento).</p>
        <p><strong>Comunicaciones:</strong> registros de tickets de soporte, correos electrónicos y mensajes de WhatsApp.</p>
      </Section>

      <Section title="3. Finalidad del Tratamiento">
        <p>Sus datos se tratan para: (a) proveer, mantener y mejorar el Sistema; (b) procesar pagos y facturación; (c) enviar comunicaciones operativas y actualizaciones; (d) brindar soporte técnico; (e) cumplir obligaciones legales; (f) enviar información comercial (con su consentimiento).</p>
      </Section>

      <Section title="4. Base Legal">
        <p>El tratamiento se basa en: (a) la ejecución del contrato de servicios; (b) su consentimiento explícito; (c) el interés legítimo de mejorar nuestros servicios; (d) obligaciones legales aplicables según la LOPDP Venezolana y el RGPD europeo cuando corresponda.</p>
      </Section>

      <Section title="5. Conservación de Datos">
        <p>Conservamos sus datos mientras mantenga una cuenta activa. Después de la cancelación, conservaremos los datos por un período adicional de 12 meses por obligaciones legales y fiscales, tras el cual serán eliminados de forma segura.</p>
      </Section>

      <Section title="6. Compartición de Datos">
        <p>No vendemos sus datos personales. Podemos compartirlos con: (a) proveedores de servicios esenciales (hosting, pagos, email); (b) autoridades competentes cuando la ley lo requiera; (c) terceros con su consentimiento explícito. Todos los proveedores están sujetos a acuerdos de confidencialidad.</p>
      </Section>

      <Section title="7. Transferencias Internacionales">
        <p>Sus datos pueden ser almacenados y procesados en servidores ubicados en Estados Unidos, Unión Europea u otros países. En todos los casos, implementamos garantías adecuadas mediante cláusulas contractuales tipo u otros mecanismos legalmente reconocidos.</p>
      </Section>

      <Section title="8. Seguridad de los Datos">
        <p>Implementamos medidas técnicas y organizativas para proteger sus datos: cifrado SSL/TLS en todas las comunicaciones, cifrado en reposo de datos sensibles, acceso restringido por roles, auditoría de accesos, y monitoreo continuo de seguridad.</p>
      </Section>

      <Section title="9. Derechos del Usuario">
        <p>De acuerdo con la LOPDP y el RGPD, usted tiene derecho a: (a) acceder a sus datos; (b) rectificar datos inexactos; (c) solicitar la eliminación de sus datos; (d) limitar u oponerse al tratamiento; (e) portabilidad de sus datos; (f) retirar su consentimiento en cualquier momento. Para ejercer estos derechos, escriba a <strong style={{ color: '#F0F2F5' }}>legal@hexia.io</strong>. Responderemos en un plazo máximo de 30 días.</p>
      </Section>

      <Section title="10. Datos de Terceros">
        <p>Si usted ingresa datos de terceros (clientes, empleados, proveedores) en el Sistema, declara tener la autorización necesaria para su tratamiento y exonera a HEXIA de responsabilidad por el incumplimiento de esta obligación.</p>
      </Section>

      <Section title="11. Cambios a esta Política">
        <p>Notificaremos cambios significativos mediante aviso en el Sistema o por correo electrónico con al menos 15 días de antelación.</p>
      </Section>

      <Section title="12. Contacto del Delegado de Protección de Datos">
        <p>Para asuntos de privacidad y protección de datos: <strong style={{ color: '#F0F2F5' }}>legal@hexia.io</strong> | WhatsApp: <strong style={{ color: '#F0F2F5' }}>+58 412-2854126</strong> | Dirección: Maturín, Estado Monagas, Venezuela.</p>
      </Section>
    </div>
  );
}

function Cookies() {
  return (
    <div>
      <p style={{ marginBottom: 16, color: '#9AA3B5' }}>Última actualización: Junio 2026</p>

      <Section title="1. ¿Qué son las Cookies?">
        <p>Las cookies son pequeños archivos de texto que se almacenan en su dispositivo cuando visita un sitio web. Permiten que el sitio recuerde sus preferencias y comportamiento durante un período de tiempo.</p>
      </Section>

      <Section title="2. Tipos de Cookies que Utilizamos">
        <p><strong>Cookies esenciales/técnicas (obligatorias):</strong> Necesarias para el funcionamiento básico del sitio. Permiten la navegación, autenticación y seguridad. No requieren consentimiento explícito.</p>
        <p><strong>Cookies de preferencia:</strong> Recuerdan sus preferencias (idioma, moneda) para mejorar su experiencia.</p>
        <p><strong>Cookies analíticas:</strong> Nos ayudan a entender cómo los visitantes interactúan con el sitio, qué secciones son más visitadas y cómo mejorar. Utilizamos analíticas internas anonimizadas.</p>
        <p><strong>Cookies de marketing:</strong> Se utilizan solo con su consentimiento explícito para mostrar contenido relevante.</p>
      </Section>

      <Section title="3. Cookies Específicas que Usamos">
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #1E2128' }}>
                <th style={{ padding: '8px 12px', textAlign: 'left', color: '#9AA3B5' }}>Cookie</th>
                <th style={{ padding: '8px 12px', textAlign: 'left', color: '#9AA3B5' }}>Tipo</th>
                <th style={{ padding: '8px 12px', textAlign: 'left', color: '#9AA3B5' }}>Propósito</th>
                <th style={{ padding: '8px 12px', textAlign: 'left', color: '#9AA3B5' }}>Duración</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ borderBottom: '1px solid #1E2128' }}>
                <td style={{ padding: '8px 12px' }}>hexia_session</td>
                <td style={{ padding: '8px 12px' }}>Técnica</td>
                <td style={{ padding: '8px 12px' }}>Mantener sesión activa</td>
                <td style={{ padding: '8px 12px' }}>Sesión</td>
              </tr>
              <tr style={{ borderBottom: '1px solid #1E2128' }}>
                <td style={{ padding: '8px 12px' }}>hexia_consent</td>
                <td style={{ padding: '8px 12px' }}>Técnica</td>
                <td style={{ padding: '8px 12px' }}>Recordar preferencia de cookies</td>
                <td style={{ padding: '8px 12px' }}>365 días</td>
              </tr>
              <tr style={{ borderBottom: '1px solid #1E2128' }}>
                <td style={{ padding: '8px 12px' }}>hexia_analytics</td>
                <td style={{ padding: '8px 12px' }}>Analítica</td>
                <td style={{ padding: '8px 12px' }}>Estadísticas anónimas de uso</td>
                <td style={{ padding: '8px 12px' }}>365 días</td>
              </tr>
            </tbody>
          </table>
        </div>
      </Section>

      <Section title="4. Cookies de Terceros">
        <p>No utilizamos cookies de terceros en este sitio. En caso de integrar servicios externos en el futuro (como pasarelas de pago), dichos servicios pueden establecer sus propias cookies sujetas a sus respectivas políticas.</p>
      </Section>

      <Section title="5. Gestión de Cookies">
        <p>Puede gestionar las cookies desde: (a) el banner de consentimiento que aparece al ingresar al sitio; (b) la configuración de su navegador (Chrome, Firefox, Safari, Edge); (c) herramientas de bloqueo de terceros. Tenga en cuenta que deshabilitar cookies esenciales puede afectar el funcionamiento del sistema.</p>
      </Section>

      <Section title="6. Base Legal">
        <p>El uso de cookies esenciales se basa en la necesidad técnica para el funcionamiento del servicio. El uso de cookies no esenciales se basa en su consentimiento, el cual puede retirar en cualquier momento.</p>
      </Section>

      <Section title="7. Actualizaciones">
        <p>Esta política puede actualizarse periódicamente. La fecha de la última actualización se indica al inicio del documento.</p>
      </Section>

      <Section title="8. Contacto">
        <p>Para consultas sobre nuestra política de cookies: <strong style={{ color: '#F0F2F5' }}>legal@hexia.io</strong></p>
      </Section>
    </div>
  );
}
