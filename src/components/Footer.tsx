import { useState, useCallback } from 'react';
import LegalModal from './LegalModal';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const [legalOpen, setLegalOpen] = useState(false);
  const [legalTab, setLegalTab] = useState('terminos');

  const openLegal = useCallback((tab: string) => {
    setLegalTab(tab);
    setLegalOpen(true);
  }, []);

  return (
    <footer>
      <div className="container">
        <div className="f-in">
          <div className="f-br">
            <a href="#" className="logo">
              <img
                src="hexia_logo.png"
                alt=""
                onError={(e) => ((e.target as HTMLImageElement).style.display = 'none')}
                style={{ height: 32 }}
              />
              <span className="logo-t">
                HEX<span>IA</span>
              </span>
            </a>
            <p>
              Tecnología accesible, robusta y sin complicaciones para el comercio venezolano. Simplifica tu facturación, inventario y cobros con un solo sistema.
            </p>
            <div className="f-social">
              <a href="https://wa.me/584122854126" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
              </a>
              <a href="https://www.instagram.com/hexiasoftwaresolutions" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" /><circle cx="12" cy="12" r="5" /><circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" />
                </svg>
              </a>
              <a href="#" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                </svg>
              </a>
              <a href="#" target="_blank" rel="noopener noreferrer" aria-label="Telegram">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21.5 2L2.5 10l7 3 3 7 9-18z" />
                </svg>
              </a>
            </div>
          </div>

          <div className="f-col">
            <h4>Producto</h4>
            <div className="f-links">
              <a href="#showcase">Sistema</a>
              <a href="#feats">Características</a>
              <a href="#planes">Planes</a>
              <a href="#contacto">Contacto</a>
              <a href="#newsletter">Newsletter</a>
            </div>
          </div>

          <div className="f-col">
            <h4>Contacto</h4>
            <div className="f-contact">
              <a href="tel:+584122854126">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                </svg>
                +58 412-2854126
              </a>
              <a href="mailto:hola@hexia.io">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
                hola@hexia.io
              </a>
              <a href="https://wa.me/584122854126" target="_blank" rel="noopener noreferrer">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                WhatsApp de ventas
              </a>
              <span>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                Maturín, Monagas, Venezuela
              </span>
            </div>
          </div>

          <div className="f-col">
            <h4>Soporte</h4>
            <div className="f-links">
              <a href="https://wa.me/584122854126" target="_blank" rel="noopener noreferrer">Centro de ayuda</a>
              <a href="mailto:soporte@hexia.io">soporte@hexia.io</a>
              <a href="https://wa.me/584122854126?text=Tengo%20una%20consulta%20técnica" target="_blank" rel="noopener noreferrer">Reportar un problema</a>
              <a href="https://wa.me/584122854126?text=Quiero%20ser%20distribuidor%20HEXIA" target="_blank" rel="noopener noreferrer">Ser Distribuidor</a>
            </div>
            <div className="f-hours">
              <strong>Horario de atención</strong>
              <span>Lun–Sáb · 24h por WhatsApp</span>
            </div>
          </div>
        </div>

        <div className="f-bot">
          <p>&copy; {currentYear} <em>HEXIA Software</em>. Desarrollado en Maturín, Monagas <em>🇻🇪</em></p>
          <div className="f-legal">
            <a href="#" onClick={(e) => { e.preventDefault(); openLegal('terminos'); }}>Términos</a>
            <a href="#" onClick={(e) => { e.preventDefault(); openLegal('privacidad'); }}>Privacidad</a>
            <a href="#" onClick={(e) => { e.preventDefault(); openLegal('cookies'); }}>Cookies</a>
          </div>
        </div>
      </div>

      <LegalModal isOpen={legalOpen} onClose={() => setLegalOpen(false)} initialTab={legalTab} />
    </footer>
  );
}
