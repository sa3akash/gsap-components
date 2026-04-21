'use client';

import React, { useRef, useEffect, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { useLenisScroll, getScroller } from '@/contexts/LenisContext';

gsap.registerPlugin(ScrollTrigger);

export interface ProofOfWorkItem {
  image: string;
  imageAlt?: string;
  title: string;
  subtitle: string;
}

interface ProofOfWorkProps {
  title?: string;
  works: ProofOfWorkItem[];
  className?: string;
}

const ProofOfWork: React.FC<ProofOfWorkProps> = ({
  title = 'My Works',
  works,
  className,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRefs = useRef<(HTMLDivElement | null)[]>([]);
  const lenisContext = useLenisScroll();
  const scroller = getScroller(lenisContext);
  const [isDesktop, setIsDesktop] = useState(true);

  useEffect(() => {
    const check = () => setIsDesktop(typeof window !== 'undefined' ? window.innerWidth > 768 : true);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  useEffect(() => {
    const images = imageRefs.current.filter(Boolean);
    if (images.length === 0 || !lenisContext.isReady) return;

    const yOffset = isDesktop ? 500 : 350;
    const startTrigger = isDesktop ? 'top 100%' : 'top 120%';

    const triggers: ScrollTrigger[] = [];

    images.forEach((imgEl, index) => {
      if (!imgEl) return;

      gsap.set(imgEl, {
        rotation: index % 2 === 0 ? -50 : 50,
        transformOrigin: 'center center',
        y: yOffset,
        opacity: 0,
      });

      const st = ScrollTrigger.create({
        trigger: imgEl,
        start: startTrigger,
        scroller: scroller || undefined,
        onEnter: () => {
          gsap.to(imgEl, {
            rotation: 0,
            y: 0,
            opacity: 1,
            duration: 1,
            ease: 'power2.inOut',
            delay: isDesktop && index % 2 === 1 ? 0.25 : 0,
          });
        },
      });
      triggers.push(st);
    });

    return () => triggers.forEach((t) => t.kill());
  }, [works, lenisContext.isReady, scroller, isDesktop]);

  return (
    <div ref={containerRef} className={cn('w-full bg-[#0B0B0F] px-6 py-20 text-white md:px-12 md:py-20', className)}>
      <div className="mx-auto max-w-[1200px]">
        <h1 className="mb-16 text-center text-3xl font-normal md:text-5xl">
          {title}
        </h1>
        <div className="flex flex-wrap gap-16">
          {works.map((work, index) => (
            <div
              key={index}
              className="mt-16 flex w-full flex-col md:w-[calc(50%-2rem)]"
            >
              <div
                ref={(el) => {
                  if (el) imageRefs.current[index] = el;
                }}
                className="relative w-full overflow-hidden"
              >
                <Image
                  src={work.image}
                  alt={work.imageAlt ?? work.title}
                  width={600}
                  height={600}
                  className="aspect-square w-full object-cover object-top"
                />
              </div>
              <p className="mt-2 font-semibold uppercase text-white">{work.title}</p>
              <span className="mt-1 text-sm text-white/70">{work.subtitle}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProofOfWork;


/*


import ProofOfWork from '@/ui/components/scroll/ProofOfWork';

const works = [
  { image: '/gori.png', imageAlt: 'Gori the Gorilla', title: 'Gori', subtitle: 'Jungle Sage' },
  { image: '/crocs2.png', imageAlt: 'Snap the Croc', title: 'Snap', subtitle: 'Swamp King' },
  { image: '/crow.png', imageAlt: 'Crowley the Crow', title: 'Crowley', subtitle: 'Night Watcher' },
  { image: '/foxy.png', imageAlt: 'Foxy the Fox', title: 'Foxy', subtitle: 'Forest Trickster' },
  { image: '/snake.png', imageAlt: 'Slither the Snake', title: 'Slither', subtitle: 'Desert Whisper' },
  { image: '/bear.png', imageAlt: 'Bruno the Bear', title: 'Bruno', subtitle: 'Mountain Guardian' },
  { image: '/owl.png', imageAlt: 'Hoot the Owl', title: 'Hoot', subtitle: 'Wise Watcher' },
  { image: '/crocs.png', imageAlt: 'Chompy the Croc', title: 'Chompy', subtitle: 'River Sentinel' },
  { image: '/tiger.png', imageAlt: 'Rajah the Tiger', title: 'Rajah', subtitle: 'Jungle Emperor' },
  { image: '/bulldog.png', imageAlt: 'Tank the Bulldog', title: 'Tank', subtitle: 'Street Enforcer' },
  { image: '/redPanda.png', imageAlt: 'Rusty the Red Panda', title: 'Rusty', subtitle: 'Smooth Operator' },
  { image: '/tiger2.png', imageAlt: 'Blaze the Tiger', title: 'Blaze', subtitle: 'Street King' },
];

const ProofOfWorkDemo = () => (
  <ProofOfWork title="The Crew" works={works} />
);

export { ProofOfWorkDemo };


*/