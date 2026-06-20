import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { cn } from "../lib/utils";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const INJECTED_STYLES = `
  .gsap-reveal { visibility: hidden; }

  .film-grain {
      position: absolute; inset: 0; width: 100%; height: 100%;
      pointer-events: none; z-index: 50; opacity: 0.04; mix-blend-mode: overlay;
      background: url('data:image/svg+xml;utf8,<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"><filter id="noiseFilter"><feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" stitchTiles="stitch"/></filter><rect width="100%" height="100%" filter="url(%23noiseFilter)"/></svg>');
  }

  .bg-grid-theme {
      background-size: 60px 60px;
      background-image: 
          linear-gradient(to right, rgba(165, 0, 0, 0.06) 1px, transparent 1px),
          linear-gradient(to bottom, rgba(165, 0, 0, 0.06) 1px, transparent 1px);
      mask-image: radial-gradient(ellipse at center, black 0%, transparent 70%);
      -webkit-mask-image: radial-gradient(ellipse at center, black 0%, transparent 70%);
  }

  .text-silver-matte {
      background: linear-gradient(180deg, #F0F2F5 0%, #9AA3B5 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      transform: translateZ(0);
  }

  .text-card-silver-matte {
      background: linear-gradient(180deg, #FFFFFF 0%, #A1A1AA 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      transform: translateZ(0);
      filter: drop-shadow(0px 12px 24px rgba(0,0,0,0.8)) drop-shadow(0px 4px 8px rgba(0,0,0,0.6));
  }

  .premium-depth-card {
      background: linear-gradient(145deg, #162C6D 0%, #0A0F1F 100%);
      box-shadow: 
          0 40px 100px -20px rgba(0, 0, 0, 0.9),
          0 20px 40px -20px rgba(0, 0, 0, 0.8),
          inset 0 1px 2px rgba(255, 255, 255, 0.2),
          inset 0 -2px 4px rgba(0, 0, 0, 0.8);
      border: 1px solid rgba(255, 255, 255, 0.04);
      position: relative;
  }

  .card-sheen {
      position: absolute; inset: 0; border-radius: inherit; pointer-events: none; z-index: 50;
      background: radial-gradient(800px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(255,255,255,0.06) 0%, transparent 40%);
      mix-blend-mode: screen; transition: opacity 0.3s ease;
  }

  .iphone-bezel {
      background-color: #111;
      box-shadow: 
          inset 0 0 0 2px #52525B, 
          inset 0 0 0 7px #000, 
          0 40px 80px -15px rgba(0,0,0,0.9),
          0 15px 25px -5px rgba(0,0,0,0.7);
      transform-style: preserve-3d;
  }

  .hardware-btn {
      background: linear-gradient(90deg, #404040 0%, #171717 100%);
      box-shadow: 
          -2px 0 5px rgba(0,0,0,0.8),
          inset -1px 0 1px rgba(255,255,255,0.15),
          inset 1px 0 2px rgba(0,0,0,0.8);
      border-left: 1px solid rgba(255,255,255,0.05);
  }
  
  .screen-glare {
      background: linear-gradient(110deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0) 45%);
  }

  .widget-depth {
      background: linear-gradient(180deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.01) 100%);
      box-shadow: 
          0 10px 20px rgba(0,0,0,0.3),
          inset 0 1px 1px rgba(255,255,255,0.05),
          inset 0 -1px 1px rgba(0,0,0,0.5);
      border: 1px solid rgba(255,255,255,0.03);
  }

  .floating-ui-badge {
      background: linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.01) 100%);
      backdrop-filter: blur(24px); 
      -webkit-backdrop-filter: blur(24px);
      box-shadow: 
          0 0 0 1px rgba(255, 255, 255, 0.1),
          0 25px 50px -12px rgba(0, 0, 0, 0.8),
          inset 0 1px 1px rgba(255,255,255,0.2),
          inset 0 -1px 1px rgba(0,0,0,0.5);
  }

  @media (max-width: 767px) {
    .iphone-bezel { transform-style: flat; }
    .floating-ui-badge { backdrop-filter: blur(6px); -webkit-backdrop-filter: blur(6px); }
    .premium-depth-card { box-shadow: 0 20px 60px -15px rgba(0,0,0,0.85), inset 0 1px 1px rgba(255,255,255,0.1); }
    .card-sheen { display: none !important; }
    .film-grain { opacity: 0.015 !important; }
    .hardware-btn { display: none !important; }
    .screen-glare { display: none !important; }
  }

  .cinematic-scroll-hint {
      position: absolute;
      bottom: 24px;
      left: 50%;
      transform: translateX(-50%);
      z-index: 60;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 6px;
      color: rgba(255,255,255,0.3);
      font-size: 0.55rem;
      font-weight: 700;
      letter-spacing: 0.12em;
      text-transform: uppercase;
  }
  .cinematic-scroll-hint .mouse-line {
      width: 1px;
      height: 32px;
      background: linear-gradient(180deg, rgba(255,255,255,0.3) 0%, transparent 100%);
  }
`;

export interface CinematicHeroProps extends React.HTMLAttributes<HTMLDivElement> {
  brandName?: string;
  tagline1?: string;
  tagline2?: string;
  cardHeading?: string;
  cardDescription?: React.ReactNode;
  metricValue?: number;
  metricLabel?: string;
}

export default function CinematicHero({
  brandName = "HEXIA",
  tagline1 = "Menos papeleo,",
  tagline2 = "más ventas.",
  cardHeading = "Todo tu negocio, en una pantalla.",
  cardDescription = <>Facturación en dólares y bolívares, inventario en tiempo real, créditos a clientes y reportes sin internet. <span className="text-white font-semibold">HEXIA</span> lo tiene todo.</>,
  metricValue = 100,
  metricLabel = "Ventas Hoy",
  className,
  ...props
}: CinematicHeroProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mainCardRef = useRef<HTMLDivElement>(null);
  const mockupRef = useRef<HTMLDivElement>(null);
  const requestRef = useRef<number>(0);
  const isMobile = useRef(false);

  useEffect(() => {
    isMobile.current = window.innerWidth < 768;
    const handleResize = () => { isMobile.current = window.innerWidth < 768; };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (window.scrollY > window.innerHeight * 2) return;
      cancelAnimationFrame(requestRef.current);
      requestRef.current = requestAnimationFrame(() => {
        if (mainCardRef.current && mockupRef.current) {
          const rect = mainCardRef.current.getBoundingClientRect();
          const mouseX = e.clientX - rect.left;
          const mouseY = e.clientY - rect.top;
          mainCardRef.current.style.setProperty("--mouse-x", `${mouseX}px`);
          mainCardRef.current.style.setProperty("--mouse-y", `${mouseY}px`);
          const xVal = (e.clientX / window.innerWidth - 0.5) * 2;
          const yVal = (e.clientY / window.innerHeight - 0.5) * 2;
          gsap.to(mockupRef.current, {
            rotationY: xVal * 12,
            rotationX: -yVal * 12,
            ease: "power3.out",
            duration: 1.2,
          });
        }
      });
    };

    let lastOrientationUpdate = 0;
    const handleDeviceOrientation = (e: DeviceOrientationEvent) => {
      if (window.scrollY > window.innerHeight * 2) return;
      if (e.gamma == null || e.beta == null) return;
      const now = performance.now();
      if (now - lastOrientationUpdate < 120) return;
      lastOrientationUpdate = now;
      if (mockupRef.current) {
        const xVal = (e.gamma || 0) / 45;
        const yVal = ((e.beta || 0) - 45) / 45;
        gsap.to(mockupRef.current, {
          rotationY: xVal * 6,
          rotationX: -yVal * 4,
          ease: "none",
          duration: 0.3,
        });
      }
    };

    if (isMobile.current && typeof DeviceOrientationEvent !== "undefined") {
      window.addEventListener("deviceorientation", handleDeviceOrientation);
    } else {
      window.addEventListener("mousemove", handleMouseMove);
    }
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("deviceorientation", handleDeviceOrientation);
      cancelAnimationFrame(requestRef.current);
    };
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set(".text-track", { autoAlpha: 0, y: 60, scale: 0.85, filter: "blur(20px)", rotationX: -20 });
      gsap.set(".text-days", { autoAlpha: 0, y: 40 });
      gsap.set(".main-card", { y: window.innerHeight + 200, autoAlpha: 1, scale: 0.9 });
      gsap.set([".card-left-text", ".card-right-text", ".mockup-scroll-wrapper", ".floating-badge", ".phone-widget"], { autoAlpha: 0 });

      const scrollTl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "+=3600",
          pin: true,
          scrub: 1,
          anticipatePin: 1,
          onLeave: () => {
            if (containerRef.current) {
              gsap.set(containerRef.current, { height: 0, overflow: "hidden", minHeight: 0 });
            }
          },
          onEnterBack: () => {
            if (containerRef.current) {
              gsap.set(containerRef.current, { height: "100vh", overflow: "visible", minHeight: "100vh" });
            }
          },
        },
      });

      const mm = gsap.matchMedia();
      mm.add("(min-width: 768px)", () => {
        scrollTl
          .to(".text-track", { autoAlpha: 1, y: 0, scale: 1, filter: "blur(0px)", rotationX: 0, ease: "expo.out" }, 0)
          .to(".text-days", { autoAlpha: 1, y: 0, ease: "power4.out" }, 0.05)
          .addLabel("cardEnter", 0.12)
          .to(".main-card", { y: 0, scale: 1, ease: "power3.inOut", duration: 0.18 }, "cardEnter")
          .to([".hero-text-wrapper", ".bg-grid-theme"], { scale: 1.15, filter: "blur(20px)", autoAlpha: 0, ease: "power2.inOut", duration: 0.18 }, "cardEnter")
          .to(".main-card", { width: "100%", height: "100%", borderRadius: "0px", ease: "power3.inOut", duration: 0.18 }, 0.22)
          .addLabel("contentIn", 0.34)
          .fromTo(".mockup-scroll-wrapper",
            { y: 300, z: -500, rotationX: 50, rotationY: -30, autoAlpha: 0, scale: 0.6 },
            { y: 0, z: 0, rotationX: 0, rotationY: 0, autoAlpha: 1, scale: 1, ease: "expo.out", duration: 0.26 },
            "contentIn"
          )
          .fromTo(".phone-widget", { y: 40, autoAlpha: 0, scale: 0.95 }, { y: 0, autoAlpha: 1, scale: 1, stagger: 0.02, ease: "back.out(1.2)", duration: 0.18 }, "contentIn+=0.04")
          .fromTo(".floating-badge", { y: 100, autoAlpha: 0, scale: 0.7, rotationZ: -10 }, { y: 0, autoAlpha: 1, scale: 1, rotationZ: 0, ease: "back.out(1.5)", duration: 0.18, stagger: 0.02 }, "contentIn+=0.06")
          .fromTo(".card-left-text", { x: -50, autoAlpha: 0 }, { x: 0, autoAlpha: 1, ease: "power4.out", duration: 0.18 }, "contentIn+=0.1")
          .fromTo(".card-right-text", { x: 50, autoAlpha: 0, scale: 0.8 }, { x: 0, autoAlpha: 1, scale: 1, ease: "expo.out", duration: 0.18 }, "contentIn+=0.1")
          .addLabel("hold", 0.6)
          .to({}, { duration: 0.18 }, "hold")
          .addLabel("exit", 0.78)
          .to(".mockup-scroll-wrapper", { y: -60, scale: 0.8, autoAlpha: 0, ease: "power3.in", duration: 0.12 }, "exit")
          .to([".floating-badge", ".card-left-text", ".card-right-text"], { y: -30, autoAlpha: 0, ease: "power3.in", duration: 0.1, stagger: 0.01 }, "exit+=0.02")
          .to(".main-card", { scale: 0.96, autoAlpha: 0, ease: "power3.in", duration: 0.12 }, "exit+=0.06");
      });

      mm.add("(max-width: 767px)", () => {
        scrollTl
          .to(".text-track", { autoAlpha: 1, y: 0, scale: 1, filter: "blur(0px)", rotationX: 0, ease: "expo.out", duration: 0.06 }, 0)
          .to(".text-days", { autoAlpha: 1, y: 0, ease: "power4.out", duration: 0.05 }, 0.03)
          .addLabel("cardEnter", 0.08)
          .to(".main-card", { y: 0, scale: 1, ease: "power4.out", duration: 0.12 }, "cardEnter")
          .to([".hero-text-wrapper", ".bg-grid-theme"], { scale: 1.08, autoAlpha: 0, ease: "power2.inOut", duration: 0.12 }, "cardEnter")
          .to(".main-card", { width: "100%", height: "100%", borderRadius: "0px", ease: "power3.inOut", duration: 0.12 }, 0.16)
          .addLabel("contentIn", 0.24)
          .fromTo(".mockup-scroll-wrapper",
            { y: 120, autoAlpha: 0, scale: 0.6 },
            { y: 0, autoAlpha: 1, scale: 1, ease: "back.out(1.3)", duration: 0.2 },
            "contentIn"
          )
          .fromTo(".phone-widget", { y: 20, autoAlpha: 0, scale: 0.95 }, { y: 0, autoAlpha: 1, scale: 1, stagger: 0.015, ease: "back.out(1.3)", duration: 0.12 }, "contentIn+=0.02")
          .fromTo(".floating-badge",
            { y: 60, autoAlpha: 0, scale: 0.6, rotationZ: -15 },
            { y: 0, autoAlpha: 1, scale: 1, rotationZ: 0, ease: "back.out(1.7)", duration: 0.14, stagger: 0.04 },
            "contentIn+=0.06"
          )
          .fromTo([".card-left-text", ".card-right-text"], { y: 20, autoAlpha: 0, scale: 0.9 }, { y: 0, autoAlpha: 1, scale: 1, ease: "expo.out", duration: 0.12, stagger: 0.04 }, "contentIn+=0.14")
          .addLabel("hold", 0.55)
          .to({}, { duration: 0.2 }, "hold")
          .addLabel("exit", 0.75)
          .to(".mockup-scroll-wrapper", { y: 40, scale: 0.85, autoAlpha: 0, ease: "power2.in", duration: 0.08 }, "exit")
          .to([".card-left-text", ".card-right-text", ".phone-widget"], { y: -15, autoAlpha: 0, ease: "power2.in", duration: 0.06, stagger: 0.01 }, "exit+=0.02")
          .to(".floating-badge", { y: -20, autoAlpha: 0, ease: "power2.in", duration: 0.06, stagger: 0.01 }, "exit+=0.04")
          .to(".main-card", { scale: 0.94, autoAlpha: 0, ease: "power2.in", duration: 0.08 }, "exit+=0.06");
      });
    }, containerRef);

    return () => ctx.revert();
  }, [metricValue]);

  return (
    <div
      ref={containerRef}
      className={cn("relative w-screen h-screen overflow-hidden flex items-center justify-center bg-transparent text-[#F0F2F5] font-sans antialiased", className)}
      style={{ perspective: "1500px" }}
      {...props}
    >
      <style dangerouslySetInnerHTML={{ __html: INJECTED_STYLES }} />
      <div className="film-grain" aria-hidden="true" />
      <div className="bg-grid-theme absolute inset-0 z-0 pointer-events-none opacity-50" aria-hidden="true" />

      <div className="hero-text-wrapper absolute z-10 flex flex-col items-center justify-start text-center w-[110vw] -ml-[5vw] px-6 pt-[18vh] pb-10 will-change-transform">
        <h1 className="text-track gsap-reveal text-silver-matte text-4xl sm:text-5xl md:text-7xl lg:text-[6rem] font-bold tracking-tight mb-2 leading-tight">
          {tagline1}
        </h1>
        <h1 className="text-days gsap-reveal text-silver-matte text-4xl sm:text-5xl md:text-7xl lg:text-[6rem] font-extrabold tracking-tighter leading-tight">
          {tagline2}
        </h1>
      </div>

      <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none" style={{ perspective: "1500px" }}>
        <div
          ref={mainCardRef}
          className="main-card premium-depth-card relative overflow-hidden gsap-reveal flex items-center justify-center pointer-events-auto w-[92vw] md:w-[85vw] h-[92vh] md:h-[85vh] rounded-[32px] md:rounded-[40px]"
        >
          <div className="card-sheen" aria-hidden="true" />

          <div className="relative w-full h-full max-w-7xl mx-auto px-4 lg:px-12 flex flex-col max-lg:justify-center max-lg:gap-6 justify-between lg:grid lg:grid-cols-3 items-center lg:gap-8 z-10 max-lg:pt-12 max-lg:pb-12 pt-48 pb-4 lg:py-0">

            <div className="card-left-text gsap-reveal order-3 lg:order-1 flex flex-col justify-center text-center lg:text-left z-20 w-full lg:max-w-none px-3 lg:px-0 lg:mt-0 max-lg:mt-3 max-lg:mb-0 mb-24">
              <h3 className="text-white text-lg md:text-3xl lg:text-4xl font-bold mb-0 lg:mb-5 tracking-tight">
                {cardHeading}
              </h3>
              <p className="hidden md:block text-[#BBC4D6]/80 text-sm md:text-base lg:text-lg font-normal leading-relaxed mx-auto lg:mx-0 max-w-sm lg:max-w-none">
                {cardDescription}
              </p>
            </div>

            <div className="mockup-scroll-wrapper order-2 relative w-full h-[320px] md:h-[400px] lg:h-[600px] flex items-center justify-center z-10 lg:mt-0" style={{ perspective: "1000px" }}>
              <div className="relative w-full h-full flex items-center justify-center scale-[0.55] md:scale-85 lg:scale-100">

                <div className="scale-[1.06] flex items-center justify-center">
                <div
                  ref={mockupRef}
                  className="relative w-[280px] h-[580px] rounded-[3rem] iphone-bezel flex flex-col lg:will-change-transform lg:transform-style-3d"
                >
                  <div className="absolute top-[120px] -left-[3px] w-[3px] h-[25px] hardware-btn rounded-l-md z-0" aria-hidden="true" />
                  <div className="absolute top-[160px] -left-[3px] w-[3px] h-[45px] hardware-btn rounded-l-md z-0" aria-hidden="true" />
                  <div className="absolute top-[220px] -left-[3px] w-[3px] h-[45px] hardware-btn rounded-l-md z-0" aria-hidden="true" />
                  <div className="absolute top-[170px] -right-[3px] w-[3px] h-[70px] hardware-btn rounded-r-md z-0 scale-x-[-1]" aria-hidden="true" />

                  <div className="absolute inset-[7px] bg-[#050914] rounded-[2.5rem] overflow-hidden shadow-[inset_0_0_15px_rgba(0,0,0,1)] text-white z-10">
                    <div className="absolute inset-0 screen-glare z-40 pointer-events-none" aria-hidden="true" />

                    <div className="absolute top-[5px] left-1/2 -translate-x-1/2 w-[100px] h-[28px] bg-black rounded-full z-50 flex items-center justify-end px-3 shadow-[inset_0_-1px_2px_rgba(255,255,255,0.1)]">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#A50000] shadow-[0_0_8px_rgba(165,0,0,0.8)] animate-pulse" />
                    </div>

                    <div className="relative w-full h-full pt-10 px-4 pb-6 flex flex-col">
                      <div className="phone-widget flex justify-between items-center mb-4 px-2">
                        <span className="text-[10px] font-bold text-white">9:41</span>
                        <div className="flex items-center gap-1.5">
                          <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                            <path d="M12 3C7.46 3 3.34 4.78.29 7.67c-.18.18-.29.43-.29.71 0 .28.11.53.29.71l11 11c.39.39 1.02.39 1.41 0l11-11c.18-.18.29-.43.29-.71 0-.28-.11-.53-.29-.71C20.66 4.78 16.54 3 12 3z"/>
                          </svg>
                          <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                            <path d="M1 9l2 2c4.97-4.97 13.03-4.97 18 0l2-2C16.93 2.95 7.08 2.95 1 9zm8 8l3 3 3-3a4.237 4.237 0 0 0-6 0zm-4-4l2 2a7.074 7.074 0 0 1 10 0l2-2C15.14 9.14 8.87 9.14 5 13z"/>
                          </svg>
                          <div className="w-5 h-2.5 rounded-[2px] border border-white/30 bg-white/20 relative">
                            <div className="absolute inset-0.5 bg-white rounded-[1px]" />
                          </div>
                        </div>
                      </div>

                      <div className="phone-widget flex items-center justify-between mb-4">
                        <div className="flex flex-col">
                          <span className="text-[10px] text-[#9AA3B5] uppercase tracking-widest font-bold">Hoy</span>
                          <span className="text-xl font-bold tracking-tight text-white">HEXIA POS</span>
                        </div>
                        <div className="w-9 h-9 rounded-full bg-white/5 text-neutral-200 flex items-center justify-center font-bold text-sm border border-white/10">FX</div>
                      </div>

                      <div className="phone-widget relative w-full aspect-[4/5] rounded-2xl overflow-hidden border border-white/10 shadow-lg mb-4">
                        <img src="/telefono.jpg" alt="HEXIA en el teléfono" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#050914]/80 via-transparent to-transparent" />
                        <div className="absolute bottom-3 left-3 right-3">
                          <div className="text-[10px] text-[#9AA3B5] uppercase tracking-widest font-bold mb-0.5">{metricLabel}</div>
                          <div className="text-2xl font-extrabold tracking-tighter text-white">{metricValue}</div>
                        </div>
                      </div>

                      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-[120px] h-[4px] bg-white/20 rounded-full" />
                    </div>
                  </div>
                </div>

                </div>

                <div className="floating-badge absolute flex top-3 lg:top-12 left-[-10px] lg:left-[-80px] floating-ui-badge rounded-xl lg:rounded-2xl p-2 lg:p-4 items-center gap-2 lg:gap-4 z-30">
                  <div className="w-7 h-7 lg:w-10 lg:h-10 rounded-full bg-gradient-to-b from-[#A50000]/20 to-[#0A0F1F]/10 flex items-center justify-center border border-[#A50000]/30 shadow-inner">
                    <span className="text-sm lg:text-xl drop-shadow-lg" aria-hidden="true">📈</span>
                  </div>
                  <div>
                    <p className="text-white text-[11px] lg:text-sm font-bold tracking-tight">Utilidad en vivo</p>
                    <p className="text-[#9AA3B5] text-[9px] lg:text-xs font-medium">+18% vs ayer</p>
                  </div>
                </div>

                <div className="floating-badge absolute flex bottom-8 lg:bottom-20 right-[-10px] lg:right-[-80px] floating-ui-badge rounded-xl lg:rounded-2xl p-2 lg:p-4 items-center gap-2 lg:gap-4 z-30">
                  <div className="w-7 h-7 lg:w-10 lg:h-10 rounded-full bg-gradient-to-b from-[#162C6D]/20 to-[#0A0F1F]/10 flex items-center justify-center border border-[#162C6D]/30 shadow-inner">
                    <span className="text-sm lg:text-lg drop-shadow-lg" aria-hidden="true">⚠️</span>
                  </div>
                  <div>
                    <p className="text-white text-[11px] lg:text-sm font-bold tracking-tight">Stock bajo</p>
                    <p className="text-[#9AA3B5] text-[9px] lg:text-xs font-medium">3 productos</p>
                  </div>
                </div>

              </div>
            </div>

            <div className="card-right-text gsap-reveal order-1 lg:order-3 flex flex-col items-center lg:items-end z-20 w-full">
              <h2 className="text-3xl md:text-[6rem] lg:text-[8rem] font-black uppercase tracking-tighter text-card-silver-matte lg:mt-0 leading-none">
                {brandName}
              </h2>
              <p className="text-[#9AA3B5] text-[10px] mt-1 font-semibold tracking-wider uppercase lg:hidden">
                Facturación inteligente
              </p>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
