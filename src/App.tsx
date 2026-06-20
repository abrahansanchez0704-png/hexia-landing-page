import { useState, useCallback } from 'react';
import WebGLBackground from './components/WebGLBackground';
import Header from './components/Header';
import Hero from './components/Hero';
import Showcase from './components/Showcase';
import Features from './components/Features';
import CinematicHero from './components/CinematicHero';
import Plans from './components/Plans';
import Contact from './components/Contact';
import Newsletter from './components/Newsletter';
import Footer from './components/Footer';
import WhatsAppFloat from './components/WhatsAppFloat';
import LoadingScreen from './components/LoadingScreen';
import CookieConsent from './components/CookieConsent';

export default function App() {
  const [loading, setLoading] = useState(true);

  const handleFinish = useCallback(() => setLoading(false), []);

  return (
    <>
      <LoadingScreen onFinish={handleFinish} hidden={!loading} />
      <WebGLBackground />
      <Header />
      <main>
        <Hero />
        <Showcase />
        <Features />
        <CinematicHero />
        <Plans />
        <Contact />
        <Newsletter />
      </main>
      <Footer />
      <WhatsAppFloat />
      <CookieConsent />
    </>
  );
}
