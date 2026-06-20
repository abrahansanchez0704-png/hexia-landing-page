import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

export default function HeroPhone() {
  const phoneRef = useRef<HTMLDivElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const phone = phoneRef.current;
    const wrap = wrapRef.current;
    if (!phone || !wrap) return;

    // Continuous slow rotation
    const rotationTl = gsap.timeline({ repeat: -1, yoyo: true });
    rotationTl.to(phone, {
      rotationY: 15,
      rotationX: 5,
      duration: 6,
      ease: 'sine.inOut',
    });

    const handleMouseMove = (e: MouseEvent) => {
      const rect = wrap.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const x = (e.clientX - centerX) / rect.width;
      const y = (e.clientY - centerY) / rect.height;

      gsap.to(phone, {
        rotationY: x * 25,
        rotationX: -y * 15,
        duration: 0.8,
        ease: 'power2.out',
        overwrite: 'auto',
      });
    };

    const handleMouseLeave = () => {
      gsap.to(phone, {
        rotationY: 0,
        rotationX: 0,
        duration: 1,
        ease: 'power2.out',
        overwrite: 'auto',
      });
    };

    wrap.addEventListener('mousemove', handleMouseMove);
    wrap.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      rotationTl.kill();
      wrap.removeEventListener('mousemove', handleMouseMove);
      wrap.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <div ref={wrapRef} className="hero-phone-wrap" style={{ perspective: '1200px' }}>
      <div
        ref={phoneRef}
        className="hero-phone"
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* Phone bezel */}
        <div className="hero-phone-bezel">
          {/* Hardware buttons */}
          <div className="hero-phone-btn -left-[3px] top-[100px] h-[28px]" />
          <div className="hero-phone-btn -left-[3px] top-[140px] h-[50px]" />
          <div className="hero-phone-btn -left-[3px] top-[210px] h-[50px]" />
          <div className="hero-phone-btn -right-[3px] top-[160px] h-[70px] scale-x-[-1]" />

          {/* Screen */}
          <div className="hero-phone-screen">
            <div className="hero-phone-glare" />

            {/* Dynamic Island */}
            <div className="hero-phone-notch">
              <div className="hero-phone-dot" />
            </div>

            {/* Content */}
            <div className="hero-phone-content">
              {/* Status bar */}
              <div className="hero-phone-status">
                <span>9:41</span>
                <div className="hero-phone-status-icons">
                  <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 3C7.46 3 3.34 4.78.29 7.67c-.18.18-.29.43-.29.71 0 .28.11.53.29.71l11 11c.39.39 1.02.39 1.41 0l11-11c.18-.18.29-.43.29-.71 0-.28-.11-.53-.29-.71C20.66 4.78 16.54 3 12 3z"/></svg>
                  <svg viewBox="0 0 24 24" fill="currentColor"><path d="M1 9l2 2c4.97-4.97 13.03-4.97 18 0l2-2C16.93 2.95 7.08 2.95 1 9zm8 8l3 3 3-3a4.237 4.237 0 0 0-6 0zm-4-4l2 2a7.074 7.074 0 0 1 10 0l2-2C15.14 9.14 8.87 9.14 5 13z"/></svg>
                  <div className="hero-phone-battery"><div /></div>
                </div>
              </div>

              {/* Header */}
              <div className="hero-phone-header">
                <div>
                  <div className="hero-phone-label">Bienvenido</div>
                  <div className="hero-phone-title">HEXIA POS</div>
                </div>
                <div className="hero-phone-avatar">FX</div>
              </div>

              {/* Stats cards */}
              <div className="hero-phone-cards">
                <div className="hero-phone-card">
                  <div className="hero-phone-card-icon bg-[#A50000]/20 border-[#A50000]/30">
                    <svg className="w-4 h-4 text-[#CC0000]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                  </div>
                  <div>
                    <div className="hero-phone-card-value">$1,240.00</div>
                    <div className="hero-phone-card-label">Ventas hoy</div>
                  </div>
                </div>

                <div className="hero-phone-card">
                  <div className="hero-phone-card-icon bg-[#162C6D]/20 border-[#162C6D]/30">
                    <svg className="w-4 h-4 text-[#9AA3B5]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/></svg>
                  </div>
                  <div>
                    <div className="hero-phone-card-value">847</div>
                    <div className="hero-phone-card-label">Productos</div>
                  </div>
                </div>

                <div className="hero-phone-card">
                  <div className="hero-phone-card-icon bg-amber-500/10 border-amber-500/30">
                    <svg className="w-4 h-4 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
                  </div>
                  <div>
                    <div className="hero-phone-card-value">3</div>
                    <div className="hero-phone-card-label">Stock bajo</div>
                  </div>
                </div>
              </div>

              {/* Bottom indicator */}
              <div className="hero-phone-home" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
