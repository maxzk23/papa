"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Lenis from "lenis";

export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [shutterOpen, setShutterOpen] = useState(false);
  const [shutterVisible, setShutterVisible] = useState(true);
  const isTransitioningRef = useRef(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Section Refs for scroll tracking
  const containerRef = useRef<HTMLDivElement>(null);

  const [hideNavbar, setHideNavbar] = useState(false);
  const hideNavbarRef = useRef(false);
  const progressRef = useRef(0);
  const leftTextRef = useRef<HTMLDivElement>(null);
  const videoCardRef = useRef<HTMLDivElement>(null);
  const darkOverlayRef = useRef<HTMLDivElement>(null);
  const videoOverlayTextRef = useRef<HTMLDivElement>(null);
  const section4Ref = useRef<HTMLDivElement>(null);
  const dividerPath4Ref = useRef<SVGPathElement>(null);
  const section5Ref = useRef<HTMLDivElement>(null);
  const dividerPathRef = useRef<SVGPathElement>(null);
  const horizontalTrackRef = useRef<HTMLDivElement>(null);

  const navLinks = [
    { name: "บริการช่างประปา", href: "#services" },
    { name: "วิธีใช้บริการ", href: "#how-it-works" },
    { name: "รีวิวลูกค้า", href: "#reviews" },
    { name: "ติดต่อเรา", href: "#contact" },
  ];

  const triggerShutterTransition = (scrollAction: () => void) => {
    if (isTransitioningRef.current) return;
    isTransitioningRef.current = true;

    // 1. Make shutter visible and block clicks
    setShutterVisible(true);

    // 2. Trigger shutter close (scale-x-100)
    setTimeout(() => {
      setShutterOpen(false);
    }, 50);

    // 3. Scroll instantly when screen is fully covered by the shutter (around 900ms)
    setTimeout(() => {
      scrollAction();
    }, 900);

    // 4. Trigger shutter open (scale-x-0)
    setTimeout(() => {
      setShutterOpen(true);
    }, 1150);

    // 5. Hide the shutter overlay after transition completes
    setTimeout(() => {
      setShutterVisible(false);
      isTransitioningRef.current = false;
    }, 2200);
  };

  const handleNavClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string,
  ) => {
    if (href.startsWith("#")) {
      e.preventDefault();
      const targetId = href.substring(1);

      if (!targetId) {
        triggerShutterTransition(() => {
          window.scrollTo({ top: 0, behavior: "auto" });
        });
        return;
      }

      triggerShutterTransition(() => {
        const targetElement = document.getElementById(targetId);
        if (targetElement) {
          targetElement.scrollIntoView({ behavior: "auto" });
        }
      });
    }
  };

  // Work portfolio sliding marquee images (Plumberz)
  const zrocImages = [
    "/img/หมวดรวม/2.jpg",
    "/img/หมวดรวม/3.jpg",
    "/img/หมวดรวม/4.jpg",
    "/img/หมวดรวม/5.jpg",
    "/img/หมวดรวม/6.jpg",
    "/img/หมวดรวม/7.jpg",
    "/img/หมวดรวม/8.jpg",
    "/img/หมวดรวม/9.jpg",
    "/img/หมวดรวม/10.jpg",
    "/img/หมวดรวม/11.jpg",
    "/img/หมวดรวม/12.jpg",
  ];

  useEffect(() => {
    // Start shutter animation shortly after mount
    const startTimer = setTimeout(() => {
      setShutterOpen(true);
    }, 100);

    // Remove shutter overlay from DOM once animation is fully complete
    // ลดจาก 2200ms → 1200ms ให้เข้าเว็บได้เร็วขึ้น
    const endTimer = setTimeout(() => {
      setShutterVisible(false);
    }, 1200);

    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    checkMobile();

    // Cache layout offsets to prevent layout thrashing (forced reflow)
    const layout = {
      containerTop: 0,
      containerHeight: 0,
      section4Top: 0,
      section4Height: 0,
      section5Top: 0,
      section5Height: 0,
    };

    const updateLayoutCache = () => {
      const scrollY = window.scrollY;
      if (containerRef.current) {
        layout.containerTop = containerRef.current.getBoundingClientRect().top + scrollY;
        layout.containerHeight = containerRef.current.offsetHeight;
      }
      if (section4Ref.current) {
        layout.section4Top = section4Ref.current.getBoundingClientRect().top + scrollY;
        layout.section4Height = section4Ref.current.offsetHeight;
      }
      if (section5Ref.current) {
        layout.section5Top = section5Ref.current.getBoundingClientRect().top + scrollY;
        layout.section5Height = section5Ref.current.offsetHeight;
      }
    };

    // Calculate initial layout offsets
    updateLayoutCache();
    // Re-calculate after 1 second to let any dynamic images finish loading/sizing
    const cacheTimer = setTimeout(updateLayoutCache, 1000);

    const updateVideoStyles = (progress: number) => {
      const mobile = window.innerWidth < 1024;
      const p1 = Math.min(1, progress / 0.4);
      const p2 = Math.max(0, (progress - 0.55) / 0.45);

      // 1. Interpolations for left description text
      if (leftTextRef.current) {
        leftTextRef.current.style.opacity = (1 - p1).toString();
        leftTextRef.current.style.transform = `translate3d(0, ${-p1 * 40}px, 0)`;
      }

      // 2. Interpolations for scaling video card
      if (videoCardRef.current) {
        const startWidth = mobile ? 90 : 55;
        const startHeight = mobile ? 45 : 62;
        const startRadius = mobile ? 16 : 28;
        const startRight = mobile ? 5 : 5;

        const width = startWidth + (100 - startWidth) * p1;
        const height = startHeight + (100 - startHeight) * p1;
        const radius = startRadius - startRadius * p1;
        const right = startRight - startRight * p1;

        videoCardRef.current.style.width = `${width}vw`;
        videoCardRef.current.style.height = `${height}vh`;
        videoCardRef.current.style.borderRadius = `${radius}px`;
        videoCardRef.current.style.right = `${right}vw`;
      }

      // 3. Interpolations for dark overlay and text inside video
      if (darkOverlayRef.current) {
        darkOverlayRef.current.style.opacity = p2.toString();
      }

      if (videoOverlayTextRef.current) {
        videoOverlayTextRef.current.style.opacity = p2.toString();
        videoOverlayTextRef.current.style.transform = `translate3d(0, ${(1 - p2) * 20}px, 0)`;
      }
    };

    const isScrolledRef = { current: false };

    // Unified, optimized scroll handler
    const handleScrollUpdate = (scrollY: number) => {
      // 1. Check top scroll boundary
      const scrolled = scrollY > 50;
      if (scrolled !== isScrolledRef.current) {
        isScrolledRef.current = scrolled;
        setIsScrolled(scrolled);
      }

      // 2. Video Card scale logic
      const scrollTop = scrollY - layout.containerTop;
      const totalScrollable = layout.containerHeight - window.innerHeight;
      let videoProgress = 0;
      if (totalScrollable > 0) {
        videoProgress = Math.max(0, Math.min(1, scrollTop / totalScrollable));
        progressRef.current = videoProgress;
        updateVideoStyles(videoProgress);
      }

      // 3. Update dynamic curve divider as Section 4 scrolls in
      if (section4Ref.current && dividerPath4Ref.current) {
        const rectDivider4Top = layout.section4Top - scrollY;
        const start = window.innerHeight;
        const end = 0;
        const dividerProgress4 = Math.max(
          0,
          Math.min(1, (start - rectDivider4Top) / (start - end)),
        );

        const startY = 120 - 120 * dividerProgress4;
        const controlY = 120 + 120 * dividerProgress4;
        const endY = 120 - 120 * dividerProgress4;

        dividerPath4Ref.current.setAttribute(
          "d",
          `M0,${startY} Q600,${controlY} 1200,${endY} L1200,122 L0,122 Z`,
        );
      }

      // 4. Update dynamic curve divider as Section 5 scrolls in
      if (section5Ref.current && dividerPathRef.current) {
        const rectDividerTop = layout.section5Top - scrollY;
        const start = window.innerHeight;
        const end = 0;
        const dividerProgress = Math.max(
          0,
          Math.min(1, (start - rectDividerTop) / (start - end)),
        );

        const startY = 120 - 120 * dividerProgress;
        const controlY = 120 + 120 * dividerProgress;
        const endY = 120 - 120 * dividerProgress;

        dividerPathRef.current.setAttribute(
          "d",
          `M0,${startY} Q600,${controlY} 1200,${endY} L1200,122 L0,122 Z`,
        );
      }

      // 5. Update horizontal scroll slider in Section 5
      if (section5Ref.current && horizontalTrackRef.current) {
        const scrollTopSlider = scrollY - layout.section5Top;
        const totalScrollableSlider = layout.section5Height - window.innerHeight;
        if (totalScrollableSlider > 0) {
          const horizontalProgress = Math.max(
            0,
            Math.min(1, scrollTopSlider / totalScrollableSlider),
          );
          horizontalTrackRef.current.style.transform = `translate3d(-${horizontalProgress * 300}vw, 0, 0)`;
        }
      }

      // 6. Hide navbar when inside services section (section5 - dark bg)
      if (section5Ref.current) {
        const s5Top = layout.section5Top - scrollY;
        const s5Bottom = s5Top + layout.section5Height;
        const nextHideNavbar = s5Top < window.innerHeight && s5Bottom > 0;
        if (nextHideNavbar !== hideNavbarRef.current) {
          hideNavbarRef.current = nextHideNavbar;
          setHideNavbar(nextHideNavbar);
        }
      }
    };

    let ticking = false;
    let pendingScrollY = 0;

    const onScroll = () => {
      pendingScrollY = window.scrollY;
      if (!ticking) {
        requestAnimationFrame(() => {
          handleScrollUpdate(pendingScrollY);
          ticking = false;
        });
        ticking = true;
      }
    };

    const handleResize = () => {
      checkMobile();
      updateLayoutCache();
      onScroll();
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("scroll", onScroll, { passive: true });

    // Initial styles check
    onScroll();

    // Initialize Lenis smooth scroll
    const isMobileDevice = window.innerWidth < 1024;
    const lenis = new Lenis({
      duration: isMobileDevice ? 0.4 : 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // expo easing
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 1.0,
      touchMultiplier: isMobileDevice ? 5.0 : 1.5,
    });

    let rafId: number;
    const raf = (time: number) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    };
    rafId = requestAnimationFrame(raf);

    // Sync Lenis scroll to our optimized scroll handler
    lenis.on("scroll", (e) => {
      handleScrollUpdate(e.scroll);
    });

    return () => {
      clearTimeout(startTimer);
      clearTimeout(endTimer);
      clearTimeout(cacheTimer);
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("scroll", onScroll);
      lenis.destroy();
    };
  }, []);

  const rowsCount = 4;
  const colsCount = 16;

  return (
    <div className="relative min-h-screen w-full font-sans bg-white text-zinc-950 selection:bg-[#c5d3db] selection:text-[#3d5e86]">
      {/* Shutter Opening/Transition Overlay */}
      {shutterVisible && (
        <div
          className={`fixed inset-0 z-50 flex flex-col select-none transition-all duration-75 ${shutterOpen
              ? "pointer-events-none"
              : "pointer-events-auto bg-transparent"
            }`}
        >
      {Array.from({ length: rowsCount }).map((_, rowIndex) => {
            const isOddRow = rowIndex % 2 === 0;
            return (
              <div key={rowIndex} className="flex-1 w-full flex">
                {Array.from({ length: colsCount }).map((_, colIndex) => {
                  const delay = isOddRow
                    ? (colsCount - 1 - colIndex) * 20
                    : colIndex * 20;

                  return (
                    <div
                      key={colIndex}
                      style={{
                        transitionDelay: `${delay}ms`,
                      }}
                      className={`flex-1 h-full bg-[#dbe8ff] transition-transform duration-500 ease-in-out ${isOddRow ? "origin-left" : "origin-right"
                        } ${shutterOpen ? "scale-x-0" : "scale-x-[101%]"}`}
                    />
                  );
                })}
              </div>
            );
          })}
        </div>
      )}

      {/* FIXED FLOATING BRAND BADGE (Appears on scroll bottom-left) */}
      <div
        className={`fixed bottom-6 left-6 z-40 transition-all duration-500 ease-in-out ${isScrolled
            ? "opacity-100 scale-100 pointer-events-auto"
            : "opacity-0 scale-75 pointer-events-none"
          }`}
      >
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="flex items-center justify-center w-11 h-11 bg-zinc-950 hover:bg-zinc-900 text-white rounded-full shadow-lg hover:scale-105 active:scale-95 transition-all duration-300 group"
          aria-label="Scroll back to top"
        >
          <svg
            viewBox="0 0 100 100"
            className="w-5.5 h-5.5 text-white transition-transform duration-350 group-hover:rotate-6"
            fill="currentColor"
            xmlns="http://www.w3.org/2000/svg"
          >
            <mask id="badge-sphere-mask">
              <circle cx="50" cy="50" r="46" fill="white" />
            </mask>
            <g mask="url(#badge-sphere-mask)">
              <path d="M-10,8 C20,18 80,18 110,8 L110,14 C80,24 20,24 -10,14 Z" />
              <path d="M-10,21 C20,32 80,32 110,21 L110,28 C80,39 20,39 -10,28 Z" />
              <path d="M-10,36 C20,48 80,48 110,36 L110,44 C80,56 20,56 -10,44 Z" />
              <path d="M-10,52 C20,65 80,65 110,52 L110,60 C80,73 20,73 -10,60 Z" />
              <path d="M-10,68 C20,82 82,82 110,68 L110,76 C80,90 20,90 -10,76 Z" />
              <path d="M-10,84 C20,99 80,99 110,84 L110,92 C80,107 20,107 -10,92 Z" />
            </g>
          </svg>
        </button>
      </div>

      {/* STICKY HEADER/NAVBAR */}
      <header
        className={`fixed top-0 left-0 w-full z-40 px-6 py-5 md:px-12 lg:px-16 flex items-center justify-between border-b transition-all duration-500 ${hideNavbar
            ? "opacity-0 pointer-events-none -translate-y-4"
            : "opacity-100 translate-y-0"
          } ${isScrolled
            ? "bg-white/95 backdrop-blur-md shadow-sm border-zinc-100 text-zinc-900"
            : "bg-transparent border-transparent text-white"
          }`}
      >
        {/* Logo and Brand Name */}
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            triggerShutterTransition(() => {
              window.scrollTo({ top: 0, behavior: "auto" });
            });
          }}
          className="flex items-center gap-2.5 group"
        >
          <Image
            src="/logo-removebg-preview.png"
            alt="ช่างประปาด่วน โลโก้"
            width={160}
            height={56}
            priority
            loading="eager"
            className="h-14 w-auto object-contain transition-transform duration-500 group-hover:scale-105"
            style={{ width: "auto", height: "3.5rem" }}
          />
        </a>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-8 xl:gap-10">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onClick={(e) => handleNavClick(e, link.href)}
              className={`text-[15px] font-normal transition-colors duration-250 tracking-wide ${isScrolled
                  ? "text-zinc-600 hover:text-zinc-900"
                  : "text-white/85 hover:text-white"
                }`}
            >
              {link.name}
            </a>
          ))}
        </nav>

        {/* Desktop CTA Buttons */}
        <div className="hidden lg:flex items-center gap-3">
          {/* Facebook Button */}
          <a
            href="https://www.facebook.com"
            target="_blank"
            rel="noopener noreferrer"
            className={`flex items-center gap-2.5 px-4 py-2 rounded-xl transition-all duration-300 active:scale-[0.97] border shadow-sm hover:shadow-md ${isScrolled
                ? "bg-[#1877f2] hover:bg-[#1565d8] text-white border-[#1877f2]"
                : "bg-white/10 backdrop-blur-md hover:bg-white/20 text-white border-white/20"
              }`}
          >
            <div
              className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 transition-colors ${isScrolled
                  ? "bg-white text-[#1877f2]"
                  : "bg-white/20 text-white"
                }`}
            >
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
            </div>
            <span className="text-[13px] font-semibold tracking-wide">
              Facebook
            </span>
          </a>

          {/* Phone Button */}
          <a
            href="tel:0644088510"
            className={`flex items-center gap-3 px-4 py-2 rounded-xl transition-all duration-300 active:scale-[0.97] border shadow-sm hover:shadow-md ${isScrolled
                ? "bg-blue-600 hover:bg-blue-700 text-white border-blue-600"
                : "bg-white/10 backdrop-blur-md hover:bg-white/20 text-white border-white/20"
              }`}
          >
            <div
              className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-colors ${isScrolled ? "bg-white text-blue-600" : "bg-white/20 text-white"
                }`}
            >
              <svg className="w-4.5 h-4.5 fill-current" viewBox="0 0 24 24">
                <path d="M20 15.5c-1.2 0-2.4-.2-3.6-.6-.3-.1-.7 0-1 .3l-2.2 2.2c-2.8-1.4-5.1-3.8-6.6-6.6l2.2-2.2c.3-.3.4-.7.2-1-.3-1.1-.5-2.3-.5-3.6 0-.6-.4-1-1-1H4c-.6 0-1 .4-1 1 0 9.4 7.6 17 17 17 .6 0 1-.4 1-1v-3.5c0-.6-.4-1-1-1z" />
              </svg>
            </div>
            <div className="flex flex-col text-left">
              <span
                className={`text-[9px] font-bold tracking-wider transition-colors leading-none ${isScrolled ? "text-blue-100" : "text-white/80"
                  }`}
              >
                บริการด่วน 24 ชม.
              </span>
              <span className="text-xs md:text-sm font-bold leading-tight mt-0.5 tracking-wide">
                064-408-8510
              </span>
            </div>
          </a>
        </div>

        {/* Mobile CTA Buttons */}
        <div className="flex lg:hidden items-center gap-2 ml-auto mr-2">
          {/* Facebook Icon Button */}
          <a
            href="https://www.facebook.com"
            target="_blank"
            rel="noopener noreferrer"
            className={`w-9 h-9 rounded-lg flex items-center justify-center shadow-sm transition-all active:scale-95 ${isScrolled
                ? "bg-[#1877f2] text-white"
                : "bg-white/10 text-white backdrop-blur-md border border-white/20"
              }`}
            aria-label="Facebook"
          >
            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
            </svg>
          </a>

          {/* Call Icon Button */}
          <a
            href="tel:0644088510"
            className={`w-9 h-9 rounded-lg flex items-center justify-center shadow-sm transition-all active:scale-95 ${isScrolled
                ? "bg-blue-600 text-white"
                : "bg-white/10 text-white backdrop-blur-md border border-white/20"
              }`}
            aria-label="Call emergency number"
          >
            <svg className="w-4.5 h-4.5 fill-current" viewBox="0 0 24 24">
              <path d="M20 15.5c-1.2 0-2.4-.2-3.6-.6-.3-.1-.7 0-1 .3l-2.2 2.2c-2.8-1.4-5.1-3.8-6.6-6.6l2.2-2.2c.3-.3.4-.7.2-1-.3-1.1-.5-2.3-.5-3.6 0-.6-.4-1-1-1H4c-.6 0-1 .4-1 1 0 9.4 7.6 17 17 17 .6 0 1-.4 1-1v-3.5c0-.6-.4-1-1-1z" />
            </svg>
          </a>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden p-2 focus:outline-none z-30"
          aria-label="Toggle navigation menu"
        >
          {mobileMenuOpen ? (
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          ) : (
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16m-7 6h7"
              />
            </svg>
          )}
        </button>
      </header>

      {/* Mobile Drawer Menu */}
      <div
        className={`fixed inset-0 z-10 lg:hidden flex flex-col justify-between bg-black/95 backdrop-blur-xl transition-all duration-350 ease-in-out ${mobileMenuOpen
            ? "opacity-100 translate-y-0"
            : "opacity-0 -translate-y-full pointer-events-none"
          }`}
      >
        <div className="flex flex-col px-6 pt-24 pb-8 space-y-6 overflow-y-auto">
          {navLinks.map((link, index) => (
            <a
              key={link.name}
              href={link.href}
              onClick={(e) => {
                setMobileMenuOpen(false);
                handleNavClick(e, link.href);
              }}
              className="text-2xl font-light text-white/80 hover:text-white transition-colors duration-200 border-b border-white/10 pb-4"
              style={{ transitionDelay: `${index * 50}ms` }}
            >
              {link.name}
            </a>
          ))}
        </div>
        <div className="p-6 border-t border-white/10 bg-black/40">
          <a
            href="#"
            onClick={() => setMobileMenuOpen(false)}
            className="w-full flex items-center justify-center py-4 bg-[#dbe8ff] hover:bg-[#c9dcff] text-[#0f1d3a] font-semibold rounded-xl text-center transition-all duration-200"
          >
            โทร 064-408-8510
          </a>
        </div>
      </div>

      {/* SECTION 1: HERO VIEW */}
      <div className="relative h-screen w-full overflow-hidden flex flex-col justify-end">
        {/* Background: Real team photo */}
        <Image
          src="/img/1.jpg"
          alt="ทีมช่างประปา Plumberz"
          fill
          priority
          className="object-cover object-center select-none pointer-events-none"
          sizes="100vw"
        />

        {/* Soft vignette at bottom and top to make text readable */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/30 pointer-events-none z-10" />

        {/* Main Bottom Display */}
        <div className="relative w-full z-20 flex flex-col items-center justify-end pb-2 md:pb-6">
          {/* Giant Title spanning full width */}
          <h1
            className={`text-[15.5vw] font-bold tracking-tight text-white leading-none select-none uppercase text-center w-full ${shutterOpen ? "animate-slide-up" : "opacity-0"
              }`}
          >
            ช่างปะปาด่วน
          </h1>
        </div>
      </div>

      {/* SECTION 2: INTRO & DEMAND PROJECTIONS */}
      <section className="relative bg-white text-zinc-950 pt-16 pb-20 px-6 md:px-12 lg:px-16 overflow-hidden">
        {/* Demand Projections Grid layout */}
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-start relative z-20">
          {/* Mission label */}
          <div className="lg:col-span-4">
            <span className="text-[11px] font-semibold tracking-wider text-zinc-500 uppercase font-sans">
              ทำไมต้องเลือกเรา
            </span>
          </div>

          {/* Description & CTA button */}
          <div className="lg:col-span-8 flex flex-col items-start">
            <p className="text-xl sm:text-2xl md:text-3.5xl lg:text-[2.2rem] font-light text-zinc-800 leading-snug tracking-tight max-w-[50ch] select-text">
              ช่างประปาด่วน 24 ชั่วโมง ใกล้ฉัน แก้ท่อน้ำรั่ว ท่อแตก ปั๊มน้ำเสีย
              เข้าหน้างานไว รับประกันผลงาน ทั่วกรุงเทพและปริมณฑล
            </p>

            {/* CTA Button */}
            <div className="mt-8 md:mt-10 group">
              <a
                href="tel:0644088510"
                className="inline-flex items-center gap-3"
              >
                {/* Arrow box */}
                <span className="inline-flex items-center justify-center w-11 h-11 rounded-lg bg-[#e2eafd] group-hover:bg-[#d5e3fc] text-[#0f1d3a] transition-all duration-300 transform group-hover:translate-x-0.5 group-hover:translate-y-0.5 shadow-sm">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="none"
                    className="w-5 h-5"
                  >
                    <path
                      d="M3.67242 12.9971V2.5H4.67242V11.9971H15.7824L15.6133 11.9455L12.4346 8.69261L13.1494 7.99339L17.209 12.1477L17.5508 12.4973L17.209 12.8469L13.1494 17.0012L12.4346 16.302L15.6162 13.0452L15.7753 12.9971H3.67242Z"
                      fill="currentColor"
                    />
                  </svg>
                </span>
                {/* Text box */}
                <span className="inline-flex items-center justify-center px-6 py-2.5 bg-white border border-[#e2eafd] group-hover:border-[#cbd7f5] text-[#0f1d3a] text-sm font-semibold rounded-lg shadow-sm transition-colors duration-300">
                  โทรหาช่างเลย: 064-408-8510
                </span>
              </a>
            </div>

            {/* Highlight Badges Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 w-full">
              {/* Badge 1 */}
              <div className="bg-[#f8fafc] border border-[#e2eafd] p-6 rounded-2xl shadow-sm flex items-start gap-4 hover:shadow-md transition-shadow duration-300 text-left">
                <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div>
                  <h4 className="text-lg font-bold text-zinc-900">
                    ถึงหน้างานไว
                  </h4>
                  <p className="text-zinc-600 text-sm font-light mt-1">
                    ช่างประปาเดินทางถึงบ้านคุณภายใน 30 - 60 นาที ทั่วกรุงเทพฯ
                    และปริมณฑล
                  </p>
                </div>
              </div>
              {/* Badge 2 */}
              <div className="bg-[#f8fafc] border border-[#e2eafd] p-6 rounded-2xl shadow-sm flex items-start gap-4 hover:shadow-md transition-shadow duration-300 text-left">
                <div className="w-12 h-12 rounded-xl bg-[#ecfdf5] flex items-center justify-center text-emerald-600 shrink-0">
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                    />
                  </svg>
                </div>
                <div>
                  <h4 className="text-lg font-bold text-zinc-900">
                    รับประกันผลงาน
                  </h4>
                  <p className="text-zinc-600 text-sm font-light mt-1">
                    รับประกันงานซ่อมนาน 30 วัน
                    ดูแลแก้ไขให้ฟรีหากเกิดปัญหาซ้ำจุดเดิม
                  </p>
                </div>
              </div>
              {/* Badge 3 */}
              <div className="bg-[#f8fafc] border border-[#e2eafd] p-6 rounded-2xl shadow-sm flex items-start gap-4 hover:shadow-md transition-shadow duration-300 text-left">
                <div className="w-12 h-12 rounded-xl bg-[#fffbeb] flex items-center justify-center text-amber-600 shrink-0">
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div>
                  <h4 className="text-lg font-bold text-zinc-900">
                    ประเมินราคาฟรี
                  </h4>
                  <p className="text-zinc-600 text-sm font-light mt-1">
                    แจ้งราคาก่อนเริ่มงาน ตรวจสอบหน้างานฟรี
                    ไม่มีค่าธรรมเนียมแอบแฝง
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3: STICKY VIDEO SCALE & REVEAL OVERLAY */}
      <section
        ref={containerRef}
        className="relative h-[180vh] bg-white text-zinc-950"
      >
        <div className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden">
          {/* Description text on left (fades out as video scales) */}
          <div
            ref={leftTextRef}
            className="absolute inset-x-0 z-10 max-w-7xl mx-auto px-6 md:px-12 lg:px-16 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center pointer-events-none"
          >
            <div className="lg:col-span-4 flex flex-col justify-center pointer-events-auto">
              <p className="text-lg md:text-xl lg:text-2xl font-light text-zinc-700 leading-relaxed select-text">
                ช่างประปาด่วน 24 ชั่วโมง พร้อมเข้าหน้างานภายใน 30-60 นาที
                ประเมินราคาฟรี รับประกันผลงาน ทีมช่างชำนาญ 15+ ปี
              </p>
            </div>
            <div className="lg:col-span-8 h-full" />
          </div>

          {/* Scaling Video Card */}
          <div
            ref={videoCardRef}
            style={{
              width: isMobile ? "90vw" : "55vw",
              height: isMobile ? "45vh" : "62vh",
              borderRadius: isMobile ? "16px" : "28px",
              right: isMobile ? "5vw" : "5vw",
              willChange: "width, height, right, border-radius",
            }}
            className="absolute top-1/2 -translate-y-1/2 overflow-hidden shadow-2xl z-20"
          >
            <video
              src="/papa.mp4"
              playsInline
              loop
              autoPlay
              muted
              className="w-full h-full object-cover select-none pointer-events-none"
            />

            {/* Dark contrast layout dim overlay */}
            <div
              ref={darkOverlayRef}
              style={{ opacity: 0 }}
              className="absolute inset-0 bg-black/45 pointer-events-none"
            />

            {/* Overlay description text (ZettaJoule stats, visible when full screen) */}
            <div
              ref={videoOverlayTextRef}
              style={{
                opacity: 0,
                transform: "translateY(20px)",
              }}
              className="absolute inset-x-0 bottom-16 sm:bottom-20 md:bottom-24 lg:bottom-28 xl:bottom-32 max-w-7xl mx-auto px-6 md:px-12 lg:px-16 text-white z-30"
            >
              {/* Horizontal line divider */}
              <div className="w-full h-[1px] bg-white/25 mb-8" />

              {/* Text split row grid */}
              <div className="w-full grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-12 lg:gap-16 items-start">
                <div className="md:col-span-5 flex flex-col">
                  <h3 className="text-3xl md:text-4xl lg:text-5xl font-light tracking-wide select-text"></h3>
                  <span className="text-zinc-300/80 mt-2 font-mono text-sm md:text-base tracking-wider select-text">
                    ช่างประปาด่วน 24 ชั่วโมง
                  </span>
                </div>
                <div className="md:col-span-7">
                  <p className="text-lg md:text-xl lg:text-2xl font-light leading-relaxed text-zinc-100 select-text">
                    โทร 064-408-8510 — แก้ปัญหาน้ำรั่ว ท่อแตก ปั๊มเสีย
                    เข้าหน้างานไว รับประกันผลงาน ทั่วกรุงเทพและปริมณฑล
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 4: DESIGN MEETS RESILIENCE */}
      <section
        ref={section4Ref}
        className="relative bg-white text-zinc-950 py-16 md:py-20 px-6 md:px-12 lg:px-16"
      >
        {/* Dynamic Curved Divider for Section 4 */}
        <div className="absolute top-0 left-0 w-full overflow-hidden leading-[0] transform -translate-y-full pointer-events-none z-20">
          <svg
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
            className="relative block w-full h-[80px] md:h-[120px]"
          >
            <path
              ref={dividerPath4Ref}
              d="M0,120 Q600,120 1200,120 L1200,122 L0,122 Z"
              fill="#ffffff"
            />
          </svg>
        </div>
        <div className="max-w-7xl mx-auto">
          {/* Header Row */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-4">
              <span className="text-[11px] font-semibold tracking-wider text-zinc-500 uppercase">
                ประสบการณ์จริง
              </span>
              <h2 className="text-2xl md:text-3xl font-light text-[#3d5e86] mt-3">
                ทีมช่างมืออาชีพ
              </h2>
            </div>
            <div className="lg:col-span-8">
              <p className="text-2xl md:text-3.5xl lg:text-4xl font-light text-zinc-800 leading-snug tracking-tight max-w-[45ch]">
                ช่างประปาชำนาญการ ประสบการณ์กว่า 15 ปี พร้อมเครื่องมือทันสมัย
              </p>
              <p className="text-base sm:text-lg text-zinc-500 font-light mt-6 max-w-2xl text-left">
                ทีมช่างมิล (ช่าง M) และทีมงาน
                พร้อมให้บริการซ่อมแซมระบบประปาทุกประเภท ตรวจสอบหน้างานฟรี
                แจ้งราคาก่อนเริ่มงาน รับประกันผลงาน 30 วัน
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 5: INTELLIGENT SYSTEMS / REACTOR TECH */}
      <section
        ref={section5Ref}
        id="services"
        className="relative h-[250vh] bg-zinc-950 text-zinc-950"
      >
        {/* Dynamic Curved Divider */}
        <div className="absolute top-0 left-0 w-full overflow-hidden leading-[0] transform -translate-y-full pointer-events-none z-20">
          <svg
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
            className="relative block w-full h-[80px] md:h-[120px]"
          >
            <path
              ref={dividerPathRef}
              d="M0,120 Q600,120 1200,120 L1200,122 L0,122 Z"
              fill="#09090b"
            />
          </svg>
        </div>

        {/* Sticky Container */}
        <div className="sticky top-0 h-screen w-full overflow-hidden bg-zinc-950 flex flex-col">
          {/* Section Header */}
          <div className="absolute top-12 left-6 md:left-12 lg:left-16 z-30 pointer-events-none max-w-xl">
            <span className="text-[11px] font-semibold tracking-wider text-zinc-300 uppercase font-sans">
              ทำไมเลือกเรา
            </span>
            <h2 className="text-3xl md:text-4.5xl font-semibold text-white mt-3 font-sans leading-tight">
              บริการมาตรฐานครบวงจร
            </h2>
          </div>

          {/* Horizontal Slides container */}
          <div
            ref={horizontalTrackRef}
            className="flex h-full w-[400vw] will-change-transform"
            style={{ transform: "translate3d(0, 0, 0)" }}
          >
            {/* Slide 1: ซ่อมท่อ */}
            <div className="w-screen h-full flex-shrink-0 relative flex flex-col justify-end p-8 md:p-16 lg:p-24 bg-zinc-950 text-white">
              <div className="absolute inset-0 w-full h-full bg-zinc-950 z-0">
                <Image
                  src="/img/PPR.jpg"
                  alt="บริการซ่อมท่อน้ำ"
                  fill
                  className="object-cover opacity-50 select-none pointer-events-none transition-all duration-7000 ease-out hover:scale-105"
                  sizes="100vw"
                  priority
                />
                <div className="absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-zinc-950 to-transparent pointer-events-none z-10" />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent pointer-events-none" />
              </div>

              {/* Huge Background Typography */}
              <div className="absolute bottom-6 left-6 md:left-16 lg:left-24 z-0 pointer-events-none select-none">
                <span className="text-[10vw] font-black tracking-tighter leading-none text-white/5 uppercase font-sans">
                  PIPE REPAIR
                </span>
              </div>

              {/* Glassmorphism content card */}
              <div className="relative z-10 max-w-lg bg-zinc-900/70 backdrop-blur-xl border border-white/15 p-6 md:p-10 rounded-2xl shadow-2xl hover:bg-zinc-900/80 hover:border-white/20 transition-all duration-300 transform hover:-translate-y-1">
                <span className="text-[11px] font-mono text-zinc-300 uppercase tracking-wider block mb-2">
                  SERVICES 01
                </span>
                <h3 className="text-2xl md:text-3.5xl font-bold text-white font-sans leading-snug">
                  ซ่อมท่อน้ำรั่ว / น้ำซึม
                </h3>
                <p className="text-zinc-200 font-light mt-4 leading-relaxed font-sans text-sm md:text-base">
                  บริการซ่อมแซมและแก้ไขปัญหาท่อน้ำแตกร้าว ข้อต่อรั่วซึม ท่อ PPR
                  และ PVC ภายในและภายนอกอาคาร
                  ตรวจพบจุดรั่วไหลได้อย่างถูกต้องตรงจุดโดยทีมงานมืออาชีพ
                </p>
                <div className="mt-8 pt-6 border-t border-white/10 flex justify-between items-center group">
                  <a
                    href="tel:0644088510"
                    className="text-sm font-bold text-white group-hover:text-[#8bb1e2] transition-colors flex items-center gap-2"
                  >
                    <span>โทรติดต่อสอบถาม</span>
                    <span className="text-xs font-mono bg-white/10 px-2.5 py-1 rounded text-zinc-200">
                      064-408-8510
                    </span>
                  </a>
                </div>
              </div>
            </div>

            {/* Slide 2: ปั๊มน้ำ */}
            <div className="w-screen h-full flex-shrink-0 relative flex flex-col justify-end p-8 md:p-16 lg:p-24 bg-zinc-950 text-white">
              <div className="absolute inset-0 w-full h-full bg-zinc-950 z-0">
                <Image
                  src="/img/ปรับระบบน้ำ.jpg"
                  alt="ซ่อมและติดตั้งปั๊มน้ำ"
                  fill
                  className="object-cover opacity-50 select-none pointer-events-none transition-all duration-7000 ease-out hover:scale-105"
                  sizes="100vw"
                />
                <div className="absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-zinc-950 to-transparent pointer-events-none z-10" />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent pointer-events-none" />
              </div>

              {/* Huge Background Typography */}
              <div className="absolute bottom-6 left-6 md:left-16 lg:left-24 z-0 pointer-events-none select-none">
                <span className="text-[10vw] font-black tracking-tighter leading-none text-white/5 uppercase font-sans">
                  WATER PUMP
                </span>
              </div>

              {/* Glassmorphism content card */}
              <div className="relative z-10 max-w-lg bg-zinc-900/70 backdrop-blur-xl border border-white/15 p-6 md:p-10 rounded-2xl shadow-2xl hover:bg-zinc-900/80 hover:border-white/20 transition-all duration-300 transform hover:-translate-y-1">
                <span className="text-[11px] font-mono text-zinc-300 uppercase tracking-wider block mb-2">
                  SERVICES 02
                </span>
                <h3 className="text-2xl md:text-3.5xl font-bold text-white font-sans leading-snug">
                  ซ่อม-ติดตั้งปั๊มน้ำ
                </h3>
                <p className="text-zinc-200 font-light mt-4 leading-relaxed font-sans text-sm md:text-base">
                  แก้ปัญหาปั๊มน้ำไม่ทำงาน ปั๊มร้องเสียงดังตลอดเวลา น้ำไหลอ่อน
                  หรือปั๊มตัดบ่อย บริการติดตั้งระบบบายพาส
                  และเปลี่ยนปั๊มน้ำรุ่นใหม่ประหยัดพลังงาน
                </p>
                <div className="mt-8 pt-6 border-t border-white/10 flex justify-between items-center group">
                  <a
                    href="tel:0644088510"
                    className="text-sm font-bold text-white group-hover:text-[#8bb1e2] transition-colors flex items-center gap-2"
                  >
                    <span>โทรติดต่อสอบถาม</span>
                    <span className="text-xs font-mono bg-white/10 px-2.5 py-1 rounded text-zinc-200">
                      064-408-8510
                    </span>
                  </a>
                </div>
              </div>
            </div>

            {/* Slide 3: ท่อตัน */}
            <div className="w-screen h-full flex-shrink-0 relative flex flex-col justify-end p-8 md:p-16 lg:p-24 bg-zinc-950 text-white">
              <div className="absolute inset-0 w-full h-full bg-zinc-950 z-0">
                <Image
                  src="/img/รีโนเวทระบบน้ำใ.jpg"
                  alt="แก้ท่อตัน ส้วมตัน"
                  fill
                  className="object-cover opacity-50 select-none pointer-events-none transition-all duration-7000 ease-out hover:scale-105"
                  sizes="100vw"
                />
                <div className="absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-zinc-950 to-transparent pointer-events-none z-10" />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent pointer-events-none" />
              </div>

              {/* Huge Background Typography */}
              <div className="absolute bottom-6 left-6 md:left-16 lg:left-24 z-0 pointer-events-none select-none">
                <span className="text-[10vw] font-black tracking-tighter leading-none text-white/5 uppercase font-sans">
                  DRAIN CLOG
                </span>
              </div>

              {/* Glassmorphism content card */}
              <div className="relative z-10 max-w-lg bg-zinc-900/70 backdrop-blur-xl border border-white/15 p-6 md:p-10 rounded-2xl shadow-2xl hover:bg-zinc-900/80 hover:border-white/20 transition-all duration-300 transform hover:-translate-y-1">
                <span className="text-[11px] font-mono text-zinc-300 uppercase tracking-wider block mb-2">
                  SERVICES 03
                </span>
                <h3 className="text-2xl md:text-3.5xl font-bold text-white font-sans leading-snug">
                  เดินระบบประปาใหม่
                </h3>
                <p className="text-zinc-200 font-light mt-4 leading-relaxed font-sans text-sm md:text-base">
                  ให้บริการติดตั้งระบบประปาใหม่ งานเดินท่อประปาภายในบ้าน
                  อาคารสำนักงาน ระบบน้ำดื่ม ระบบน้ำใช้
                </p>
                <div className="mt-8 pt-6 border-t border-white/10 flex justify-between items-center group">
                  <a
                    href="tel:0644088510"
                    className="text-sm font-bold text-white group-hover:text-[#8bb1e2] transition-colors flex items-center gap-2"
                  >
                    <span>โทรติดต่อสอบถาม</span>
                    <span className="text-xs font-mono bg-white/10 px-2.5 py-1 rounded text-zinc-200">
                      064-408-8510
                    </span>
                  </a>
                </div>
              </div>
            </div>

            {/* Slide 4: ตรวจน้ำรั่ว */}
            <div className="w-screen h-full flex-shrink-0 relative flex flex-col justify-end p-8 md:p-16 lg:p-24 bg-zinc-950 text-white">
              <div className="absolute inset-0 w-full h-full bg-zinc-950 z-0">
                <Image
                  src="/img/หมวดรวม/20.jpg"
                  alt="ตรวจหาจุดรั่วซึม"
                  fill
                  className="object-cover opacity-50 select-none pointer-events-none transition-all duration-7000 ease-out hover:scale-105"
                  sizes="100vw"
                />
                <div className="absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-zinc-950 to-transparent pointer-events-none z-10" />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent pointer-events-none" />
              </div>

              {/* Huge Background Typography */}
              <div className="absolute bottom-6 left-6 md:left-16 lg:left-24 z-0 pointer-events-none select-none">
                <span className="text-[10vw] font-black tracking-tighter leading-none text-white/5 uppercase font-sans">
                  LEAK CHECK
                </span>
              </div>

              {/* Glassmorphism content card */}
              <div className="relative z-10 max-w-lg bg-zinc-900/70 backdrop-blur-xl border border-white/15 p-6 md:p-10 rounded-2xl shadow-2xl hover:bg-zinc-900/80 hover:border-white/20 transition-all duration-300 transform hover:-translate-y-1">
                <span className="text-[11px] font-mono text-zinc-300 uppercase tracking-wider block mb-2">
                  SERVICES 04
                </span>
                <h3 className="text-2xl md:text-3.5xl font-bold text-white font-sans leading-snug">
                  ตรวจหาน้ำรั่วซึม
                </h3>
                <p className="text-zinc-200 font-light mt-4 leading-relaxed font-sans text-sm md:text-base">
                  บริการตรวจสอบหาจุดน้ำรั่วซึมใต้ดิน ในผนังบ้าน
                  หรือจุดรั่วในโครงสร้างด้วยกล้องอินฟราเรดและอุปกรณ์จับคลื่นความถี่สูง
                  ค้นเจอจุดรั่วแม่นยำ ไม่ทำลายผนัง
                </p>
                <div className="mt-8 pt-6 border-t border-white/10 flex justify-between items-center group">
                  <a
                    href="tel:0644088510"
                    className="text-sm font-bold text-white group-hover:text-[#8bb1e2] transition-colors flex items-center gap-2"
                  >
                    <span>โทรติดต่อสอบถาม</span>
                    <span className="text-xs font-mono bg-white/10 px-2.5 py-1 rounded text-zinc-200">
                      064-408-8510
                    </span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 8: ENERGY AS A SERVICE */}
      <section
        id="how-it-works"
        className="bg-white text-zinc-950 py-16 md:py-20 px-6 md:px-12 lg:px-16 border-t border-zinc-100"
      >
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Copy details */}
          <div className="lg:col-span-5 flex flex-col items-start pr-0 lg:pr-8">
            <span className="text-[11px] font-semibold tracking-wider text-zinc-500 uppercase">
              โมเดลการให้บริการ
            </span>
            <h2 className="text-3xl md:text-4.5xl font-light text-zinc-900 mt-4 leading-tight">
              บริการด่วน 24 ชม. มาถึงบ้านคุณ
            </h2>
            <p className="text-zinc-600 font-light mt-6 leading-relaxed select-text">
              เราให้บริการแบบครบวงจร คุณเพียงแค่โทรแจ้งปัญหา
              ช่างจะเดินทางมาถึงบ้านคุณภายใน 30-60 นาที
              <br />
              <br />
              ตรวจสอบและประเมินราคาฟรี แจ้งค่าใช้จ่ายทั้งหมดก่อนเริ่มงาน
              ไม่มีค่าใช้จ่ายแอบแฝง รับประกันผลงาน 30 วัน
            </p>

            <a
              href="tel:0644088510"
              className="mt-8 inline-flex items-center gap-3 px-6 py-3 bg-[#e2eafd] hover:bg-[#d5e3fc] text-[#0f1d3a] text-sm font-semibold rounded-lg shadow-sm transition-colors duration-250 active:scale-98"
            >
              โทรหาช่างเลย: 064-408-8510
            </a>
          </div>

          {/* Isometric Flow image */}
          <div className="lg:col-span-7 rounded-2xl overflow-hidden shadow-xl aspect-[16/10] relative bg-[#f8fafc] border border-zinc-100 flex items-center justify-center p-6">
            <Image
              src="/img/4.jpg"
              alt="ช่างประปา Plumberz กำลังซ่อมระบบท่อน้ำ"
              fill
              className="object-cover object-top"
              sizes="(max-width: 1024px) 100vw, 55vw"
            />
          </div>
        </div>
      </section>

      {/* SECTION 10: ZROC INFRASTRUCTURE WORKFORCE */}
      <section className="bg-white text-zinc-950 py-16 md:py-20 px-6 md:px-12 lg:px-16 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          {/* Header Row */}
          <div className="mb-16">
            <span className="text-[11px] font-semibold tracking-wider text-zinc-500 uppercase">
              ผลงานของเรา
            </span>
            <h2 className="text-3xl md:text-4.5xl font-light text-zinc-900 mt-3 leading-tight">
              งานซ่อมประปาที่ผ่านมา
            </h2>
          </div>
        </div>

        {/* Endless Marquee Loop Row */}
        <div className="relative w-full overflow-hidden mt-12 py-4">
          <div className="animate-marquee flex gap-6">
            {/* First Set of Images */}
            {zrocImages.map((src, index) => (
              <div
                key={`zroc-1-${index}`}
                className="relative w-[280px] h-[190px] rounded-xl overflow-hidden shadow-md flex-shrink-0 bg-zinc-100"
              >
                <Image
                  src={src}
                  alt={`ผลงานช่างประปา Plumberz งานที่ ${index + 1}`}
                  fill
                  className="object-cover"
                  sizes="280px"
                />
              </div>
            ))}
            {/* Duplicate Second Set of Images for seamless looping */}
            {zrocImages.map((src, index) => (
              <div
                key={`zroc-2-${index}`}
                className="relative w-[280px] h-[190px] rounded-xl overflow-hidden shadow-md flex-shrink-0 bg-zinc-100"
              >
                <Image
                  src={src}
                  alt={`ผลงานช่างประปา Plumberz ชุดที่ ${index + 1}`}
                  fill
                  className="object-cover"
                  sizes="280px"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 11: CUSTOMER REVIEWS */}
      <section
        id="reviews"
        className="relative bg-[#0b1329] text-white py-16 md:py-20 px-6 md:px-12 lg:px-16 overflow-hidden border-t border-white/5"
      >
        <div className="max-w-7xl mx-auto relative z-10">
          {/* Header Row */}
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-white mt-3 leading-tight font-sans text-center w-full">
              รีวิวจากลูกค้าจริง
            </h2>
            <p className="text-[#a8beeb] text-base md:text-lg font-light mt-4 text-center">
              เสียงตอบรับและคำชมเชยที่ตรวจสอบได้จริงจากช่องทางบริการทางสังคมออนไลน์ของทีมงานช่าง
            </p>
          </div>

          {/* Reviews Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Card 1: Line Chat Review */}
            <div className="bg-white/[0.03] border border-white/10 hover:border-green-500/40 hover:bg-white/[0.05] p-6 md:p-8 rounded-2xl transition-all duration-300 flex flex-col justify-between group shadow-xl text-left">
              <div>
                <div className="flex justify-between items-center mb-6">
                  <div className="flex gap-1 text-sky-400">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <svg
                        key={i}
                        className="w-4.5 h-4.5 fill-current"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <span className="text-[10px] font-bold text-green-400 bg-green-500/10 px-2 py-0.5 rounded-full font-sans tracking-wide">
                    💬 LINE CHAT
                  </span>
                </div>
                {/* Line Chat Bubble Box */}
                <div className="bg-[#5c82b1]/15 rounded-2xl p-4 mb-6 border border-blue-500/10">
                  <p className="text-zinc-100 text-sm font-normal leading-relaxed italic">
                    "ท่อประปาแตกใต้ดินหาจุดรั่วยากมาก เรียกช่างมาหลายที่แก้ไม่จบ
                    จนมาเจอทีมช่าง ใช้เครื่องมือสแกนหาจุดรั่วเจอใน 15 นาที
                    ซ่อมเสร็จเร็วและเป็นมืออาชีพมากครับ แนะนำเลย!"
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4 border-t border-white/5 pt-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-600 to-sky-400 flex items-center justify-center text-white font-semibold text-sm">
                  สภ
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-white">
                    คุณสุรศักดิ์
                  </h4>
                  <p className="text-xs text-zinc-400 mt-0.5">
                    กรุงเทพฯ — ตรวจจับน้ำรั่วใต้ดิน
                  </p>
                </div>
              </div>
            </div>

            {/* Card 2: Facebook Review */}
            <a
              href="https://www.facebook.com/share/14G69cGxJar/?mibextid=wwXIfr"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white/[0.03] border border-white/10 hover:border-blue-500/40 hover:bg-white/[0.05] p-6 md:p-8 rounded-2xl transition-all duration-300 flex flex-col justify-between group shadow-xl text-left block"
            >
              <div>
                <div className="flex justify-between items-center mb-6">
                  <div className="flex gap-1 text-sky-400">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <svg
                        key={i}
                        className="w-4.5 h-4.5 fill-current"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <span className="text-[10px] font-bold text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded-full font-sans tracking-wide">
                    👍 FACEBOOK PAGE
                  </span>
                </div>
                <div className="bg-[#3b5998]/10 rounded-2xl p-4 mb-6 border border-blue-600/10">
                  <p className="text-zinc-100 text-sm font-normal leading-relaxed italic">
                    "ปั๊มน้ำเสียกลางดึก น้ำไม่ไหลทั้งบ้าน โทรหา ตอนตีสอง
                    ช่างเข้ามาใน 40 นาที
                    เปลี่ยนอะไหล่และแก้ไขระบบเสร็จรวดเร็วทันใจ
                    บริการสุภาพและราคาเป็นกันเองมากค่ะ"
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4 border-t border-white/5 pt-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-cyan-500 to-teal-400 flex items-center justify-center text-white font-semibold text-sm">
                  ณช
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-white group-hover:text-blue-400 transition-colors">
                    คุณณิชา
                  </h4>
                  <p className="text-xs text-zinc-400 mt-0.5">
                    นนทบุรี — ซ่อมปั๊มน้ำด่วน 24 ชม.
                  </p>
                </div>
              </div>
            </a>

            {/* Card 3: Google maps review */}
            <div className="bg-white/[0.03] border border-white/10 hover:border-yellow-500/40 hover:bg-white/[0.05] p-6 md:p-8 rounded-2xl transition-all duration-300 flex flex-col justify-between group shadow-xl text-left">
              <div>
                <div className="flex justify-between items-center mb-6">
                  <div className="flex gap-1 text-sky-400">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <svg
                        key={i}
                        className="w-4.5 h-4.5 fill-current"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <span className="text-[10px] font-bold text-yellow-400 bg-yellow-500/10 px-2 py-0.5 rounded-full font-sans tracking-wide">
                    ⭐ GOOGLE MAPS
                  </span>
                </div>
                <div className="bg-[#f2a104]/10 rounded-2xl p-4 mb-6 border border-yellow-600/10">
                  <p className="text-zinc-100 text-sm font-normal leading-relaxed italic">
                    "ท่อระบายน้ำที่บ้านอุดตันทำให้น้ำเอ่อล้น
                    ช่างวิชัยเข้ามาใช้เครื่องมือพิเศษจัดการทะลวงท่อ
                    แป๊บเดียวจบเลยครับ สะอาด ไม่มีฝุ่นเลอะเทอะ รับประกันผลงาน 30
                    วันด้วย สบายใจเลยครับ"
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4 border-t border-white/5 pt-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-purple-500 to-indigo-500 flex items-center justify-center text-white font-semibold text-sm">
                  ธพ
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-white">คุณธนพล</h4>
                  <p className="text-xs text-zinc-400 mt-0.5">
                    สมุทรปราการ — แก้ไขท่อส้วม/ท่อตัน
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 11.5: CONTACT US */}
      <section
        id="contact"
        className="relative bg-white text-zinc-900 py-16 md:py-20 px-6 md:px-12 lg:px-16 overflow-hidden border-t border-zinc-100"
      >
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Contact Details Left Column */}
          <div className="lg:col-span-6 flex flex-col items-start">
            <h2 className="text-3xl md:text-5xl font-bold text-zinc-900 mt-4 leading-tight font-sans">
              สอบถามหรือปรึกษาได้เลย
            </h2>
            <p className="text-zinc-600 text-lg font-light mt-4 max-w-lg leading-relaxed">
              บริการซ่อมประปาเร่งด่วน น้ำรั่ว น้ำซึม เดินระบบใหม่ ปั๊มน้ำ
              ตรวจหาจุดรั่วในบ้าน บริการโดยช่างผู้เชี่ยวชาญ
            </p>

            {/* List details */}
            <div className="mt-8 space-y-6 w-full">
              {/* Address detail */}
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 shrink-0 mt-1">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                    ที่อยู่
                  </h4>
                  <p className="text-zinc-700 text-base mt-1 font-medium">
                    48/23 ซอย หิรัญอน 3 แขวงสายไหม เขตสายไหม กรุงเทพมหานคร 10220
                  </p>
                </div>
              </div>

              {/* Phone detail */}
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 shrink-0 mt-1">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.94.725l.548 2.2a1 1 0 01-.321.988l-1.305.98a10.582 10.582 0 004.872 4.872l.98-1.305a1 1 0 01.988-.321l2.2.548a1 1 0 01.725.94V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    />
                  </svg>
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                    โทรศัพท์ (ด่วน 24 ชม.)
                  </h4>
                  <a
                    href="tel:0644088510"
                    className="text-blue-600 hover:text-blue-700 text-xl mt-1 font-bold block transition-colors"
                  >
                    064-408-8510
                  </a>
                </div>
              </div>

              {/* Facebook detail */}
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 shrink-0 mt-1">
                  <svg
                    className="w-5 h-5 fill-currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c4.56-.93 8-4.96 8-9.75z" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                    Facebook Page
                  </h4>
                  <a
                    href="https://www.facebook.com/share/14G69cGxJar/?mibextid=wwXIfr"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-zinc-700 hover:text-blue-600 text-base mt-1 font-medium block transition-colors"
                  >
                    ช่างประปาด่วน 24 ชั่วโมง
                  </a>
                </div>
              </div>

              {/* LINE detail */}
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center text-green-600 shrink-0 mt-1">
                  <svg
                    className="w-5 h-5 fill-none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                    />
                  </svg>
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                    LINE Official
                  </h4>
                  <a
                    href="https://line.me/ti/p/cGh_RMYJky"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-green-600 hover:text-green-700 text-base mt-1 font-medium block transition-colors"
                  >
                    แอดไลน์สอบถามข้อมูล
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Google Map Right Column */}
          <div className="lg:col-span-6 h-[400px] md:h-[450px] w-full rounded-2xl overflow-hidden shadow-xl border border-zinc-200/80 bg-zinc-50 relative">
            <iframe
              className="absolute inset-0 w-full h-full border-0"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3874.4705304310423!2d100.5801413!3d13.8107609!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x30e29db227353f21%3A0xa5695f631f06434b!2s56%2F15%20Lat%20Phrao%2031%20Alley%2C%20Lane%202-1%2C%20Khwaeng%20Chan%20Kasem%2C%20Khet%20Chatuchak%2C%20Krung%20Thep%20Maha%20Nakhon%2010900!5e0!3m2!1sen!2sth!4v1751375392639!5m2!1sen!2sth"
              allowFullScreen={true}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </section>

      {/* SECTION 12: STANDARD FOOTER */}
      <footer className="bg-zinc-950 text-white pt-20 pb-12 px-6 md:px-12 lg:px-16 border-t border-white/5">
        <div className="max-w-7xl mx-auto">
          {/* Main Links Grid */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-8 pb-16 border-b border-white/5">
            {/* Brand Title Column */}
            <div className="md:col-span-5 flex flex-col justify-between">
              <h2 className="text-xl md:text-2xl font-bold tracking-tight text-white leading-tight">
                <br />
                ช่างประปาด่วน 24 ชม.
              </h2>
            </div>

            {/* Links Columns */}
            <div className="md:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-8">
              <div className="flex flex-col gap-3.5">
                <span className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider">
                  เมนูหลัก
                </span>
                <a
                  href="#services"
                  className="text-sm text-zinc-400 hover:text-white transition-colors"
                >
                  บริการช่างประปา
                </a>
                <a
                  href="#how-it-works"
                  className="text-sm text-zinc-400 hover:text-white transition-colors"
                >
                  วิธีใช้บริการ
                </a>
                <a
                  href="#reviews"
                  className="text-sm text-zinc-400 hover:text-white transition-colors"
                >
                  รีวิวลูกค้า
                </a>
                <a
                  href="#contact"
                  className="text-sm text-zinc-400 hover:text-white transition-colors"
                >
                  ติดต่อเรา
                </a>
              </div>
              <div className="flex flex-col gap-3.5">
                <span className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider">
                  ติดต่อ
                </span>
                <a
                  href="tel:0644088510"
                  className="text-sm text-zinc-400 hover:text-white transition-colors"
                >
                  โทร 064-408-8510
                </a>
                <a
                  href="https://line.me/ti/p/cGh_RMYJky"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-zinc-400 hover:text-white transition-colors"
                >
                  LINE Official
                </a>
                <a
                  href="https://www.facebook.com/share/14G69cGxJar/?mibextid=wwXIfr"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-zinc-400 hover:text-white transition-colors"
                >
                  Facebook Page
                </a>
              </div>
              <div className="flex flex-col gap-3.5 col-span-2 sm:col-span-1">
                <span className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider">
                  โซเชียล
                </span>
                <a
                  href="https://www.facebook.com/share/14G69cGxJar/?mibextid=wwXIfr"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-zinc-400 hover:text-white transition-colors"
                >
                  Facebook
                </a>
                <a
                  href="https://line.me/ti/p/cGh_RMYJky"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-zinc-400 hover:text-white transition-colors"
                >
                  LINE Official
                </a>
              </div>
            </div>
          </div>

          {/* Bottom Copyright Row */}
          <div className="pt-12 flex flex-col md:flex-row items-center justify-between gap-6">
            {/* Bottom brand logo */}
            <div className="flex items-center gap-2.5">
              <svg
                viewBox="0 0 100 100"
                className="w-6 h-6 text-white"
                fill="currentColor"
                xmlns="http://www.w3.org/2000/svg"
              >
                <mask id="footer-sphere-mask">
                  <circle cx="50" cy="50" r="46" fill="white" />
                </mask>
                <g mask="url(#footer-sphere-mask)">
                  <path d="M-10,8 C20,18 80,18 110,8 L110,14 C80,24 20,24 -10,14 Z" />
                  <path d="M-10,21 C20,32 80,32 110,21 L110,28 C80,39 20,39 -10,28 Z" />
                  <path d="M-10,36 C20,48 80,48 110,36 L110,44 C80,56 20,56 -10,44 Z" />
                </g>
              </svg>
              <span className="text-lg font-bold tracking-tight text-white select-none">
                ช่างประปาด่วน
              </span>
            </div>

            {/* Legal Links */}
            <div className="flex items-center gap-6 text-xs text-zinc-500">
              <span>© 2026. สงวนลิขสิทธิ์.</span>
              <a href="#" className="hover:text-zinc-300 transition-colors">
                นโยบายความเป็นส่วนตัว
              </a>
              <a href="#" className="hover:text-zinc-300 transition-colors">
                เงื่อนไขการใช้งาน
              </a>
            </div>

            {/* Zypsy attribution */}
            <div className="flex items-center gap-1.5 text-xs text-zinc-500">
              <span>พัฒนาโดย</span>
              <span className="font-semibold text-zinc-400">
                Antigravity AI
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
