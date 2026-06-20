import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

console.log(
  `%c
  ██╗  ██╗███████╗██╗  ██╗██╗ █████╗
  ██║  ██║██╔════╝╚██╗██╔╝██║██╔══██╗
  ███████║█████╗   ╚███╔╝ ██║███████║
  ██╔══██║██╔══╝   ██╔██╗ ██║██╔══██║
  ██║  ██║███████╗██╔╝ ██╗██║██║  ██║
  ╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝╚═╝╚═╝  ╚═╝`,
  'color: #CC0000; font-weight: bold;',
);
console.log(
  '%c🚀 ¿Curioso/a? ¡Nos encantan las personas como tú!',
  'font-size: 16px; font-weight: bold; color: #F0F2F5;',
);
console.log(
  '%cEn HEXIA construimos el POS inteligente que impulsa negocios en Venezuela.',
  'color: #9AA3B5;',
);
console.log(
  '%cSi te apasiona la tecnología y quieres ser parte de un equipo excepcional, te estamos buscando.',
  'color: #9AA3B5;',
);
console.log(
  '%c👉 Escríbenos: https://wa.me/584122854126?text=Quiero%20trabajar%20en%20HEXIA',
  'color: #CC0000; font-weight: bold;',
);
console.log('%c💡 Think First. Build Smart.', 'color: #F0F2F5; font-style: italic;');
console.log('%c🎮 Psst... dale 3 clicks al logo del footer 👀', 'color: #9AA3B5;');

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
