'use client';

import React, { useRef, useEffect, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { useLenisScroll, getScroller } from '@/contexts/LenisContext';

gsap.registerPlugin(ScrollTrigger);

const DEFAULT_POSITIONS = [
  { x: -0.8, y: -0.6 }, { x: 0.7, y: 0.4 }, { x: -0.5, y: 0.7 }, { x: 0.6, y: -0.5 },
  { x: -0.8, y: 0.2 }, { x: 0.8, y: -0.3 }, { x: -0.6, y: -0.8 }, { x: 0.4, y: 0.6 },
  { x: -0.7, y: 0.5 }, { x: 0.5, y: -0.7 }, { x: -0.4, y: -0.4 }, { x: 0.3, y: 0.8 },
  { x: -0.8, y: 0.3 }, { x: 0.6, y: 0.2 }, { x: -0.2, y: -0.7 }, { x: 0.7, y: -0.6 },
  { x: -0.5, y: 0.4 }, { x: 0.4, y: -0.4 }, { x: -0.6, y: 0.6 }, { x: 0.8, y: 0.5 },
  { x: -0.3, y: -0.5 }, { x: 0.5, y: 0.3 }, { x: -0.7, y: -0.2 }, { x: 0.2, y: 0.7 },
  { x: -0.4, y: 0.8 }, { x: 0.6, y: -0.8 }, { x: -0.8, y: 0.1 }, { x: 0, y: 0 },
];

export interface ImagesFlowProps {
  introTitle: string;
  introSubtitle?: string;
  flowText?: string;
  outroTitle: string;
  outroSubtitle?: string;
  images: string[];
  className?: string;
}

const ImagesFlow: React.FC<ImagesFlowProps> = ({
  introTitle,
  introSubtitle,
  flowText = 'Every moment holds a universe waiting to be discovered',
  outroTitle,
  outroSubtitle,
  images,
  className,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const flowRef = useRef<HTMLDivElement>(null);
  const imageRefs = useRef<(HTMLDivElement | null)[]>([]);
  const lenisContext = useLenisScroll();
  const scroller = getScroller(lenisContext);
  const [dimensions, setDimensions] = useState({ width: 1200, height: 800 });

  useEffect(() => {
    const update = () =>
      setDimensions({
        width: typeof window !== 'undefined' ? window.innerWidth : 1200,
        height: typeof window !== 'undefined' ? window.innerHeight : 800,
      });
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  useEffect(() => {
    const flow = flowRef.current;
    const imgElements = imageRefs.current.filter(Boolean);
    if (!flow || imgElements.length === 0 || !lenisContext.isReady) return;

    const isMobile = dimensions.width < 800;
    const spread = isMobile ? 1.5 : 0.7;
    const screenHeight = dimensions.height;
    const screenWidth = dimensions.width;

    const positions = DEFAULT_POSITIONS.slice(0, Math.max(images.length, DEFAULT_POSITIONS.length));
    while (positions.length < images.length) {
      positions.push({
        x: (Math.random() - 0.5) * 2,
        y: (Math.random() - 0.5) * 2,
      });
    }

    const initPos = images.map(() => ({
      xPercent: -50,
      yPercent: -50,
      x: 0,
      y: 0,
      z: -1000,
      scale: 0,
    }));
    const finalPos = images.map((_, i) => ({
      xPercent: -50,
      yPercent: -50,
      x: (positions[i]?.x ?? 0) * screenWidth * spread,
      y: (positions[i]?.y ?? 0) * screenHeight * spread,
      z: 2000,
      scale: 1,
    }));

    imgElements.forEach((el, i) => gsap.set(el, initPos[i]));

    const st = ScrollTrigger.create({
      trigger: flow,
      start: 'top top',
      end: `+=${screenHeight * 10}px`,
      pin: true,
      pinSpacing: true,
      scrub: 1,
      scroller: scroller || undefined,
      onUpdate: (self) => {
        const progress = self.progress;

        imgElements.forEach((eachImage, index) => {
          const imgDelay = index * 0.03;
          const imgProgress = Math.max(0, (progress - imgDelay) * 4);

          const start = initPos[index];
          const end = finalPos[index];

          let x = gsap.utils.interpolate(start.x, end.x, imgProgress);
          let y = gsap.utils.interpolate(start.y, end.y, imgProgress);
          let z = gsap.utils.interpolate(start.z, end.z, imgProgress);
          const scale = gsap.utils.interpolate(start.scale, end.scale, imgProgress);

          if (index === images.length - 1) {
            x = 0;
            y = 0;
            z = z * 0.4;
          }

          gsap.set(eachImage, {
            xPercent: -50,
            yPercent: -50,
            x,
            y,
            z,
            scale,
          });
        });
      },
    });

    return () => st.kill();
  }, [images, lenisContext.isReady, scroller, dimensions]);

  return (
    <main ref={containerRef} className={cn('w-full overflow-x-hidden', className)}>
      {/* Intro */}
      <section className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden bg-[#0B0B0F]">
        <div className="pointer-events-none absolute left-1/2 top-1/2 z-[100] -translate-x-1/2 -translate-y-1/2 text-center">
          <h1
            className="mb-4 bg-gradient-to-br from-white to-white/60 bg-clip-text font-extralight uppercase tracking-[0.3em] text-transparent"
            style={{ fontSize: 'clamp(2rem, 8vw, 6rem)' }}
          >
            {introTitle}
          </h1>
          {introSubtitle && (
            <p
              className="font-light tracking-[0.15em] text-white/70"
              style={{ fontSize: 'clamp(0.75rem, 2vw, 1.2rem)' }}
            >
              {introSubtitle}
            </p>
          )}
        </div>
      </section>

      {/* Flow */}
      <section
        ref={flowRef}
        className="relative min-h-screen overflow-hidden bg-[#1c1c1c]"
      >
        <div className="pointer-events-none absolute left-1/2 top-1/2 z-[100] w-full -translate-x-1/2 -translate-y-1/2 text-center text-white">
          <p
            className="whitespace-pre-line opacity-80"
            style={{ fontSize: 'clamp(1.5rem, 5vw, 2rem)', letterSpacing: '0.05em' }}
          >
            {flowText}
          </p>
        </div>
        <div
          className="absolute left-0 top-0 h-full w-full"
          style={{ perspective: 2000, transformStyle: 'preserve-3d' }}
        >
          {images.map((src, index) => (
            <div
              key={index}
              ref={(el) => {
                if (el) imageRefs.current[index] = el;
              }}
              className={cn(
                'absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2',
                index === images.length - 1
                  ? 'h-full w-full'
                  : 'h-[350px] w-[500px] max-w-[90vw]'
              )}
              style={{ transformStyle: 'preserve-3d' }}
            >
              <div
                className={cn(
                  'relative h-full w-full overflow-hidden',
                  index === images.length - 1 && 'after:absolute after:inset-0 after:bg-black/40'
                )}
              >
                <Image
                  src={src}
                  alt=""
                  fill
                  className="object-cover"
                  sizes={index === images.length - 1 ? '100vw' : '500px'}
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Outro */}
      <section className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden bg-[#0B0B0F]">
        <div className="pointer-events-none absolute left-1/2 top-1/2 z-[100] -translate-x-1/2 -translate-y-1/2 text-center">
          <h1
            className="mb-4 bg-gradient-to-br from-white to-white/60 bg-clip-text font-extralight uppercase tracking-[0.3em] text-transparent"
            style={{ fontSize: 'clamp(2rem, 8vw, 6rem)' }}
          >
            {outroTitle}
          </h1>
          {outroSubtitle && (
            <p
              className="font-light tracking-[0.15em] text-white/70"
              style={{ fontSize: 'clamp(0.75rem, 2vw, 1.2rem)' }}
            >
              {outroSubtitle}
            </p>
          )}
        </div>
      </section>
    </main>
  );
};

export default ImagesFlow;
