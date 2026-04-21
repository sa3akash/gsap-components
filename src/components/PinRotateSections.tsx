'use client';

import React, { useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { cn } from '@/lib/utils';
import { useLenisScroll, getScroller } from '@/contexts/LenisContext';

gsap.registerPlugin(ScrollTrigger);

export interface PinRotateIntroProps {
  className?: string;
  children: React.ReactNode;
}

export const PinRotateIntro: React.FC<PinRotateIntroProps> = ({ className, children }) => (
  <section
    data-pin-rotate-intro
    className={cn(
      'flex min-h-screen flex-col items-center justify-center bg-[#1a1a1a] px-[8vw] py-0 text-center text-white',
      className
    )}
  >
    {children}
  </section>
);

export interface PinRotateSectionProps {
  className?: string;
  style?: React.CSSProperties;
  children: React.ReactNode;
}

export const PinRotateSection: React.FC<PinRotateSectionProps> = ({
  className,
  style = {},
  children,
}) => (
  <section
    data-pin-rotate-section
    className={cn(
      'relative flex flex-col border-b border-black/25 bg-[#fcfcfc] px-[6vw] py-[5vh] [perspective:1000px] md:flex-row md:justify-between md:gap-0 md:px-[8vw] md:py-[10vh]',
      className
    )}
    style={{ transformStyle: 'preserve-3d', ...style }}
  >
    <div className="pin-rotate-overlay absolute inset-0 bg-black opacity-0 pointer-events-none" />
    {children}
  </section>
);

export interface PinRotateOutroProps {
  className?: string;
  children: React.ReactNode;
}

export const PinRotateOutro: React.FC<PinRotateOutroProps> = ({ className, children }) => (
  <section
    data-pin-rotate-outro
    className={cn(
      'flex min-h-screen flex-col items-center justify-center bg-[#1a1a1a] px-[6vw] py-0 text-center text-white md:px-[8vw]',
      className
    )}
  >
    {children}
  </section>
);

interface PinRotateSectionsProps {
  children: React.ReactNode;
  className?: string;
}

const PinRotateSections: React.FC<PinRotateSectionsProps> = ({ children, className }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const lenisContext = useLenisScroll();
  const scroller = getScroller(lenisContext);

  useGSAP(
    () => {
      if (!lenisContext.isReady || !containerRef.current) return;

      const sections = Array.from(
        containerRef.current.querySelectorAll<HTMLElement>('[data-pin-rotate-section]')
      );
      if (sections.length === 0) return;

      const triggers: ScrollTrigger[] = [];

      sections.forEach((section, index) => {
        if (index < sections.length - 1) {
          triggers.push(
            ScrollTrigger.create({
              trigger: section,
              start: 'top top',
              endTrigger: sections[sections.length - 1],
              end: 'top top',
              pin: true,
              pinSpacing: false,
              scroller: scroller || undefined,
            })
          );

          triggers.push(
            ScrollTrigger.create({
              trigger: sections[index + 1],
              start: 'top bottom',
              end: 'top top',
              scroller: scroller || undefined,
              onUpdate: (self) => {
                const progress = self.progress;
                const overlay = section.querySelector('.pin-rotate-overlay');
                gsap.set(section, {
                  scale: 1 - progress * 0.25,
                  rotation: index % 2 === 0 ? progress * 5 : -progress * 5,
                  rotationX: index % 2 === 0 ? progress * 40 : -progress * 40,
                });
                if (overlay) gsap.set(overlay, { opacity: progress * 0.4 });
              },
            })
          );
        }
      });

      ScrollTrigger.refresh();

      return () => triggers.forEach((t) => t.kill());
    },
    { scope: containerRef, dependencies: [lenisContext.isReady, scroller] }
  );

  return (
    <main ref={containerRef} className={cn('w-full overflow-x-hidden', className)}>
      {children}
    </main>
  );
};

export default PinRotateSections;

/*


import Image from 'next/image';
import PinRotateSections, {
  PinRotateIntro,
  PinRotateSection,
  PinRotateOutro,
} from '@/ui/components/scroll/PinRotateSections';

const MusicSvg = () => (
  <svg className="inline h-[5vw] w-[5vw] md:h-[5vw] md:w-[5vw]" viewBox="0 0 24 24" fill="none">
    <path
      d="M22 12H18L15 21L9 3L6 12H2"
      stroke="currentColor"
      strokeWidth="0.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const HeartSvg = () => (
  <svg className="inline h-[5vw] w-[5vw] md:h-[5vw] md:w-[5vw]" viewBox="0 0 24 24" fill="none">
    <path
      d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
      stroke="currentColor"
      strokeWidth="0.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const PinRotateSectionsDemo = () => (
  <PinRotateSections>
    <PinRotateIntro>
      <h2 className="flex flex-wrap justify-center items-center text-[4vw] md:text-[4vw]">
        Best <span className="ml-[0.8vw] flex items-center font-[100] text-bisque">Games {<MusicSvg />}</span> To Try.
      </h2>
      <p className="mt-4 max-w-[800px] text-lg leading-relaxed opacity-80">
        Here are a few of the most memorable and entertaining games I have enjoyed over the years.
      </p>
    </PinRotateIntro>

    <PinRotateSection>
      <span className="text-[12vw] font-semibold text-black md:text-[8vw]">(01)</span>
      <div className="mt-6 w-full md:mt-0 md:w-[60%] md:flex md:flex-col md:items-start md:justify-start">
        <h2 className="mb-4 text-[8vw] font-medium tracking-tight text-black md:mb-8 md:text-[4vw]">
          RDR 2
        </h2>
        <div className="relative w-full overflow-hidden rounded">
          <Image
            src="https://i.pinimg.com/1200x/6d/c1/51/6dc151fccad84848851615bf7fd5273e.jpg"
            alt="RDR 2"
            width={1200}
            height={675}
            className="max-w-full object-cover"
          />
        </div>
        <p className="mt-4 max-w-[70%] text-sm leading-snug text-black/90 md:mt-6 md:text-base md:leading-relaxed">
          Red Dead Redemption 2 is a celebrated open-world adventure set in the American frontier.
        </p>
      </div>
    </PinRotateSection>

    <PinRotateSection>
      <span className="text-[12vw] font-semibold text-black md:text-[8vw]">(02)</span>
      <div className="mt-6 w-full md:mt-0 md:w-[60%] md:flex md:flex-col md:items-start md:justify-start">
        <h2 className="mb-4 text-[8vw] font-medium tracking-tight text-black md:mb-8 md:text-[4vw]">
          GOW : RAGNAROCK
        </h2>
        <div className="relative w-full overflow-hidden rounded">
          <Image
            src="https://i.pinimg.com/1200x/83/a0/61/83a0611b7dffe9a845b371161da4a6ca.jpg"
            alt="God of War Ragnarök"
            width={1200}
            height={675}
            className="max-w-full object-cover"
          />
        </div>
        <p className="mt-4 max-w-[70%] text-sm leading-snug text-black/90 md:mt-6 md:text-base md:leading-relaxed">
          God of War: Ragnarök is an acclaimed action-adventure game set in Norse mythology.
        </p>
      </div>
    </PinRotateSection>

    <PinRotateSection>
      <span className="text-[12vw] font-semibold text-black md:text-[8vw]">(03)</span>
      <div className="mt-6 w-full md:mt-0 md:w-[60%] md:flex md:flex-col md:items-start md:justify-start">
        <h2 className="mb-4 text-[8vw] font-medium tracking-tight text-black md:mb-8 md:text-[4vw]">
          THE LAST OF US
        </h2>
        <div className="relative w-full overflow-hidden rounded">
          <Image
            src="https://i.pinimg.com/1200x/6f/4a/73/6f4a73124e676232f7790afc347aa7cf.jpg"
            alt="The Last of Us"
            width={1200}
            height={675}
            className="max-w-full object-cover"
          />
        </div>
        <p className="mt-4 max-w-[70%] text-sm leading-snug text-black/90 md:mt-6 md:text-base md:leading-relaxed">
          The Last of Us is a powerful story-driven action game set in a post-apocalyptic world.
        </p>
      </div>
    </PinRotateSection>

    <PinRotateSection>
      <span className="text-[12vw] font-semibold text-black md:text-[8vw]">(04)</span>
      <div className="mt-6 w-full md:mt-0 md:w-[60%] md:flex md:flex-col md:items-start md:justify-start">
        <h2 className="mb-4 text-[8vw] font-medium tracking-tight text-black md:mb-8 md:text-[4vw]">
          SEKIRO
        </h2>
        <div className="relative w-full overflow-hidden rounded">
          <Image
            src="https://i.pinimg.com/1200x/41/a6/6c/41a66c375c827fa9f6b8257ce3a32567.jpg"
            alt="Sekiro"
            width={1200}
            height={675}
            className="max-w-full object-cover"
          />
        </div>
        <p className="mt-4 max-w-[70%] text-sm leading-snug text-black/90 md:mt-6 md:text-base md:leading-relaxed">
          Sekiro: Shadows Die Twice is an intense action game set in feudal Japan.
        </p>
      </div>
    </PinRotateSection>

    <PinRotateSection>
      <span className="text-[12vw] font-semibold text-black md:text-[8vw]">(05)</span>
      <div className="mt-6 w-full md:mt-0 md:w-[60%] md:flex md:flex-col md:items-start md:justify-start">
        <h2 className="mb-4 text-[8vw] font-medium tracking-tight text-black md:mb-8 md:text-[4vw]">
          ELDEN RING
        </h2>
        <div className="relative w-full overflow-hidden rounded">
          <Image
            src="https://i.pinimg.com/1200x/34/ce/01/34ce0128069cab020ce3dce189ef84b9.jpg"
            alt="Elden Ring"
            width={1200}
            height={675}
            className="max-w-full object-cover"
          />
        </div>
        <p className="mt-4 max-w-[70%] text-sm leading-snug text-black/90 md:mt-6 md:text-base md:leading-relaxed">
          Elden Ring is an expansive open-world action RPG crafted by FromSoftware and George R.R. Martin.
        </p>
      </div>
    </PinRotateSection>

    <PinRotateOutro>
      <h2 className="flex flex-wrap justify-center items-center text-[4vw] md:text-[4vw]">
        Happy <span className="ml-[0.8vw] flex items-center font-[100] text-bisque">Gaming {<HeartSvg />}</span> Out There.
      </h2>
      <p className="mt-4 max-w-[800px] text-base leading-relaxed opacity-80 md:text-lg">
        These games have shaped my gaming journey and left a lasting impression.
      </p>
    </PinRotateOutro>
  </PinRotateSections>
);

export { PinRotateSectionsDemo };


*/