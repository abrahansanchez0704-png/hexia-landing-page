import { useState, useRef, useEffect } from 'react';
import {
  Brain, RotateCcw, Send, Crown, Store, FileText, Boxes,
  ChartLine, AlertTriangle, Percent, HandCoins, Search, Printer,
  Keyboard, User, ClipboardList, Undo2, FileSearch, ShoppingCart,
  CreditCard, Banknote, Wallet, Camera, PlusCircle, SlidersHorizontal,
  Check, ArrowUpDown, Tag, Barcode, Truck, Building, Users,
  Calculator, Key, Bell, DollarSign, Undo
} from 'lucide-react';
import { faqDataAI } from '../../data/mockData';

interface Mensaje {
  rol: 'user' | 'bot';
  texto: string;
  hora: string;
}

const ICONS: Record<string, React.ElementType> = {
  building: Building, users: Users, 'chart-line': ChartLine, calculator: Calculator,
  'cash-register': Store, key: Key, brain: Brain, undo: Undo, bell: Bell,
  'dollar-sign': DollarSign, 'file-invoice': FileText, percent: Percent,
  'hand-holding-usd': HandCoins, 'piggy-bank': Wallet, search: Search, print: Printer,
  'chart-simple': ChartLine, 'calendar-alt': CalendarIcon, keyboard: Keyboard,
  'user-tie': User, 'clipboard-list': ClipboardList, 'undo-alt': Undo2,
  'file-search': FileSearch, 'shopping-cart': ShoppingCart, 'credit-card': CreditCard,
  'money-bill-wave': Banknote, wallet: Wallet, camera: Camera, 'plus-circle': PlusCircle,
  'sliders-h': SlidersHorizontal, 'check-double': Check, 'arrows-alt-v': ArrowUpDown,
  'exclamation-triangle': AlertTriangle, edit: SlidersHorizontal, tag: Tag,
  barcode: Barcode, truck: Truck, crown: Crown, store: Store, boxes: Boxes,
};

function CalendarIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
  );
}

const ROLES = [
  { key: 'Admin', label: 'Admin', icon: Crown, color: 'yellow' },
  { key: 'Vendedor', label: 'Vendedor', icon: Store, color: 'blue' },
  { key: 'Facturador', label: 'Facturador', icon: FileText, color: 'purple' },
  { key: 'Almacenista', label: 'Almacenista', icon: Boxes, color: 'emerald' },
] as const;

const SUGERENCIAS = [
  { label: '¿Cuánto vendimos hoy?', icon: ChartLine },
  { label: '¿Qué productos están agotados?', icon: AlertTriangle },
  { label: '¿Cómo creo una factura?', icon: FileText },
  { label: '¿Cuál es mi margen de ganancia?', icon: Percent },
];

function horaActual() {
  const d = new Date();
  return `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`;
}

function renderMarkdown(texto: string) {
  return texto
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\n/g, '<br/>')
    .replace(/- (.*?)(<br\/>|$)/g, '• $1$2');
}

export default function HexiaAIModule() {
  const [mensajes, setMensajes] = useState<Mensaje[]>([
    {
      rol: 'bot',
      texto: '¡Hola! Soy **Ferre AI** 🤖. Tu asistente experto del sistema POS. Puedo responder preguntas sobre cualquier módulo o puedes explorar las guías rápidas por rol.',
      hora: horaActual(),
    },
  ]);
  const [input, setInput] = useState('');
  const [escribiendo, setEscribiendo] = useState(false);
  const [rolActivo, setRolActivo] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [mensajes, escribiendo]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const toggleRol = (rol: string) => {
    setRolActivo((prev) => (prev === rol ? null : rol));
  };

  const nuevoChat = () => {
    setMensajes([
      {
        rol: 'bot',
        texto: '¡Hola! Soy **Ferre AI** 🤖. Tu asistente experto del sistema POS. Puedo responder preguntas sobre cualquier módulo o puedes explorar las guías rápidas por rol.',
        hora: horaActual(),
      },
    ]);
    setRolActivo(null);
  };

  const enviar = (texto: string) => {
    if (!texto.trim()) return;
    const t = horaActual();
    setMensajes((prev) => [...prev, { rol: 'user', texto, hora: t }]);
    setInput('');
    setEscribiendo(true);
    setTimeout(() => {
      setEscribiendo(false);
      setMensajes((prev) => [
        ...prev,
        {
          rol: 'bot',
          texto: 'Entendido. Como **demo frontend** no tengo acceso a datos reales, pero en producción consultaría tu base de datos y generaría el reporte o respuesta solicitada.',
          hora: horaActual(),
        },
      ]);
    }, 1200);
  };

  const enviarFAQ = (faq: { q: string; a: string }) => {
    const t = horaActual();
    setMensajes((prev) => [...prev, { rol: 'user', texto: faq.q, hora: t }]);
    setEscribiendo(true);
    setTimeout(() => {
      setEscribiendo(false);
      setMensajes((prev) => [...prev, { rol: 'bot', texto: faq.a, hora: horaActual() }]);
    }, 800);
  };

  return (
    <div className="ai-wrap">
      {/* Header */}
      <div className="ai-header">
        <div className="ai-brand">
          <div className="ai-logo"><Brain size={20} /></div>
          <div>
            <div className="ai-title">Ferre AI Business <span className="ai-badge">Beta</span></div>
            <div className="ai-subtitle">Asistente inteligente del sistema POS</div>
          </div>
        </div>
        <div className="ai-actions">
          <kbd className="ai-kbd d-only">Ctrl+K</kbd>
          <button className="ai-action" onClick={nuevoChat}><RotateCcw size={14} /> Nuevo chat</button>
        </div>
      </div>

      {/* Chat panel */}
      <div className="ai-panel">
        <div ref={scrollRef} className="ai-body">
          {/* Welcome */}
          <div className="ai-welcome">
            <div className="ai-bot-avatar"><Brain size={18} /></div>
            <div>
              <div className="ai-welcome-title">¡Hola! Soy Ferre AI 🤖</div>
              <div className="ai-welcome-sub">Tu asistente experto del sistema POS. Puedo responder preguntas sobre cualquier módulo o puedes explorar las guías rápidas por rol.</div>
            </div>
          </div>

          {/* Quick suggestions */}
          <div className="ai-suggestions">
            {SUGERENCIAS.map((s) => {
              const Icon = s.icon;
              return (
                <button key={s.label} className="ai-suggest-chip" onClick={() => enviar(s.label)}>
                  <Icon size={12} /> {s.label}
                </button>
              );
            })}
          </div>

          {/* Role cards */}
          <div className="ai-roles">
            {ROLES.map((r) => {
              const Icon = r.icon;
              const active = rolActivo === r.key;
              return (
                <button
                  key={r.key}
                  className={`ai-role-card ${active ? 'active' : ''} ${r.color}`}
                  onClick={() => toggleRol(r.key)}
                >
                  <div className="ai-role-icon"><Icon size={18} /></div>
                  <div className="ai-role-label">{r.label}</div>
                  <div className="ai-role-count">{faqDataAI[r.key]?.length || 0} guías</div>
                </button>
              );
            })}
          </div>

          {/* FAQ chips accordion */}
          <div className={`ai-faq-chips ${rolActivo ? 'open' : ''}`}>
            <div className="ai-faq-inner">
              {rolActivo && faqDataAI[rolActivo]?.map((faq, i) => {
                const Icon = ICONS[faq.icon] || Brain;
                return (
                  <button
                    key={i}
                    className="ai-faq-chip"
                    style={{ transitionDelay: `${i * 35}ms` }}
                    onClick={() => enviarFAQ(faq)}
                  >
                    <Icon size={12} /> {faq.q}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Messages */}
          <div className="ai-messages">
            {mensajes.slice(1).map((m, i) => (
              <div key={i} className={m.rol === 'user' ? 'ai-msg-user-wrap' : 'ai-msg-bot-wrap'}>
                {m.rol === 'bot' && <div className="ai-bot-avatar small"><Brain size={14} /></div>}
                <div className={`ai-msg ${m.rol === 'user' ? 'user' : 'bot'}`}>
                  <span dangerouslySetInnerHTML={{ __html: renderMarkdown(m.texto) }} />
                  <span className="ai-msg-time">{m.hora}</span>
                </div>
              </div>
            ))}
            {escribiendo && (
              <div className="ai-msg-bot-wrap">
                <div className="ai-bot-avatar small"><Brain size={14} /></div>
                <div className="ai-typing">
                  <span /><span /><span />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Input bar */}
        <div className="ai-inputbar">
          <div className="ai-inputbox">
            <input
              ref={inputRef}
              type="text"
              placeholder="Pregúntame lo que necesites..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && enviar(input)}
            />
            <button className="ai-send" onClick={() => enviar(input)}><Send size={16} /></button>
          </div>
        </div>
      </div>
    </div>
  );
}
