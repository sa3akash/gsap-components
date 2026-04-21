'use client';

import React, { useRef } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { cn } from '@/lib/utils';

interface MaskRevealOnHoverProps {
  originalContent: React.ReactNode;
  maskContent: React.ReactNode;
  maskSizeSmall?: number;
  maskSizeLarge?: number;
  maskBackground?: string;
  className?: string;
}

const MaskRevealOnHover: React.FC<MaskRevealOnHoverProps> = ({
  originalContent,
  maskContent,
  maskSizeSmall = 20,
  maskSizeLarge = 100,
  maskBackground = '#DDFC3E',
  className,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const maskRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!containerRef.current || !maskRef.current || !contentRef.current) return;

      const container = containerRef.current;
      const mask = maskRef.current;
      const content = contentRef.current;

      const handleMouseMove = (e: MouseEvent) => {
        const rect = container.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        gsap.to(mask, {
          '--mask-x': `${x}px`,
          '--mask-y': `${y}px`,
          duration: 0.6,
          ease: 'back.out(1.7)',
        });
      };

      const handleMouseEnter = () => {
        gsap.to(mask, {
          '--mask-size': `${maskSizeLarge}px`,
          duration: 0.4,
          ease: 'power2.out',
        });
      };

      const handleMouseLeave = () => {
        gsap.to(mask, {
          '--mask-size': `${maskSizeSmall}px`,
          duration: 0.3,
          ease: 'power2.in',
        });
      };

      document.addEventListener('mousemove', handleMouseMove);
      content.addEventListener('mouseenter', handleMouseEnter);
      content.addEventListener('mouseleave', handleMouseLeave);

      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        content.removeEventListener('mouseenter', handleMouseEnter);
        content.removeEventListener('mouseleave', handleMouseLeave);
      };
    },
    { dependencies: [maskSizeSmall, maskSizeLarge] }
  );

  return (
    <div
      ref={containerRef}
      className={cn(
        'relative w-full flex items-center justify-center overflow-hidden cursor-none',
        className
      )}
    >
      <div ref={contentRef} className="relative z-0 flex items-center justify-center w-full">
        {originalContent}
      </div>

      <div
        ref={maskRef}
        className="absolute inset-0 z-10 flex items-center justify-center"
        style={{
          background: maskBackground,
          pointerEvents: 'none',
          maskImage:
            'radial-gradient(circle var(--mask-size, 20px) at var(--mask-x, -50px) var(--mask-y, -50px), black 100%, transparent 100%)',
          WebkitMaskImage:
            'radial-gradient(circle var(--mask-size, 20px) at var(--mask-x, -50px) var(--mask-y, -50px), black 100%, transparent 100%)',
        } as React.CSSProperties}
      >
        {maskContent}
      </div>
    </div>
  );
};

export default MaskRevealOnHover;


/*
import MaskRevealOnHover from '@/ui/components/interactive/MaskRevealOnHover';

const MaskRevealOnHoverDemo = () => {
  return (
    <div className="w-full h-[400px] flex justify-center items-center bg-[#222] rounded-lg">
      <MaskRevealOnHover
        maskBackground="#DDFC3E"
        maskSizeSmall={20}
        maskSizeLarge={80}
        className="h-full"
        originalContent={
          <p className="max-w-[900px] w-full text-2xl text-white/40 font-medium leading-[1.35] px-8 py-6">
            Writing <span className="text-[#DDFC3E]">beautiful code</span> means thinking like an artist
            and debugging like a detective. Every function is a story, every variable a character. Master
            your craft through practice, patience, and endless curiosity about how things work.
          </p>
        }
        maskContent={
          <p className="max-w-[900px] w-full text-2xl text-black font-medium leading-[1.35] px-8 py-6">
            Building <span className="text-red-500">great software</span> requires seeing beyond syntax
            into architecture and design. Test early, refactor often, document clearly. Success comes
            from collaboration, continuous learning, and caring deeply about user experience.
          </p>
        }
      />
    </div>
  );
};

export { MaskRevealOnHoverDemo };

*/