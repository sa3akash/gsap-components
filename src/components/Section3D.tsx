'use client';

import React, { useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { useLenisScroll, getScroller } from '@/contexts/LenisContext';

gsap.registerPlugin(ScrollTrigger);

export interface Section3DCard {
  image: string;
  imageAlt?: string;
  number: string;
  name: string;
  role: string;
  quote: string;
}

interface Section3DProps {
  introTitle: string;
  introDescription?: string;
  cards: Section3DCard[];
  className?: string;
}

const Section3D: React.FC<Section3DProps> = ({
  introTitle,
  introDescription,
  cards,
  className,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const sectionRefs = useRef<HTMLElement[]>([]);
  const lenisContext = useLenisScroll();
  const scroller = getScroller(lenisContext);

  useGSAP(
    () => {
      const sections = sectionRefs.current.filter(Boolean);
      if (sections.length === 0) return;

      const triggers: ScrollTrigger[] = [];

      sections.forEach((sectionEl, index) => {
        const content = sectionEl.querySelector('.section-3d-content');
        if (!content) return;

        if (index < sections.length - 1) {
          triggers.push(
            ScrollTrigger.create({
              trigger: sectionEl,
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
                gsap.set(content, {
                  opacity: 1 - progress,
                  y: `-${25 * progress}%`,
                  z: -800 * progress,
                  rotationX: 80 * progress,
                  transformOrigin: 'center center',
                });
              },
            })
          );
        }
      });

      return () => triggers.forEach((t) => t.kill());
    },
    { scope: containerRef, dependencies: [cards, lenisContext.isReady] }
  );

  return (
    <main ref={containerRef} className={cn('w-full overflow-x-hidden bg-[#160F03]', className)}>
      {/* Intro */}
      <section className="flex min-h-screen flex-col items-center justify-center p-8 text-center">
        <h2 className="mb-4 text-4xl font-bold text-white md:text-5xl">
          {introTitle}
        </h2>
        {introDescription && (
          <p className="max-w-[500px] text-lg text-white/60">
            {introDescription}
          </p>
        )}
      </section>

      {/* Card sections */}
      <div className="w-full">
        {cards.map((card, index) => (
          <section
            key={index}
            ref={(el) => {
              if (el) sectionRefs.current[index] = el;
            }}
            className="flex min-h-screen items-center justify-center p-4 md:p-8"
            style={{ perspective: 1000, transformStyle: 'preserve-3d' }}
          >
            <div
              className="section-3d-content relative h-[80%] w-[92%] min-w-0 max-w-[500px] overflow-hidden rounded-2xl md:h-[80%] md:w-[50%] md:min-w-[280px] md:max-w-[360px] lg:w-[35%] lg:min-w-[380px] lg:max-w-[500px]"
              style={{ aspectRatio: '9/14', transformOrigin: 'center center' }}
            >
              <Image
                src={card.image}
                alt={card.imageAlt ?? card.name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 92vw, (max-width: 1024px) 50vw, 500px"
              />
              <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/90 via-black/40 to-transparent p-6 md:p-10">
                <div>
                  <span className="mb-3 block text-xs font-semibold uppercase tracking-[0.3em] text-white/50">
                    {card.number}
                  </span>
                  <h2 className="mb-2 text-2xl font-extrabold leading-tight tracking-tight text-white md:text-3xl">
                    {card.name}
                  </h2>
                  <p className="text-sm font-medium tracking-wide text-white/70 md:text-base">
                    {card.role}
                  </p>
                  <div className="my-4 h-0.5 w-10 rounded-full bg-gradient-to-r from-[#FF6B35] to-[#F7C59F]" />
                  <p className="text-xs italic leading-relaxed text-white/50 md:text-sm">
                    &quot;{card.quote}&quot;
                  </p>
                </div>
              </div>
            </div>
          </section>
        ))}
      </div>
    </main>
  );
};

export default Section3D;


/*

import Section3D from '@/ui/components/scroll/Section3D';

const cards = [
  { image: '/gori.png', imageAlt: 'Gori the Gorilla', number: '01 / 12', name: 'Gori', role: 'Jungle Sage', quote: "Strength isn't in the muscles. It's in knowing when to hold back." },
  { image: '/crocs2.png', imageAlt: 'Snap the Croc', number: '02 / 12', name: 'Snap', role: 'Swamp King', quote: "Make moves in silence. Let success make the noise." },
  { image: '/crow.png', imageAlt: 'Crowley the Crow', number: '03 / 12', name: 'Crowley', role: 'Night Watcher', quote: "I've seen it all from above. Perspective changes everything." },
  { image: '/foxy.png', imageAlt: 'Foxy the Fox', number: '04 / 12', name: 'Foxy', role: 'Forest Trickster', quote: "Stay sharp. The forest rewards the clever." },
  { image: '/snake.png', imageAlt: 'Slither the Snake', number: '05 / 12', name: 'Slither', role: 'Desert Whisper', quote: "Patience isn't waiting. It's knowing exactly when to strike." },
  { image: '/bear.png', imageAlt: 'Bruno the Bear', number: '06 / 12', name: 'Bruno', role: 'Mountain Guardian', quote: "Protect what matters. Everything else is just noise." },
  { image: '/owl.png', imageAlt: 'Hoot the Owl', number: '07 / 12', name: 'Hoot', role: 'Wise Watcher', quote: "The night holds secrets. I'm just here to observe." },
  { image: '/crocs.png', imageAlt: 'Chompy the Croc', number: '08 / 12', name: 'Chompy', role: 'River Sentinel', quote: "Cool under pressure. Hot when it counts." },
  { image: '/tiger.png', imageAlt: 'Rajah the Tiger', number: '09 / 12', name: 'Rajah', role: 'Jungle Emperor', quote: "Respect isn't given. It's earned in the wild." },
  { image: '/bulldog.png', imageAlt: 'Tank the Bulldog', number: '10 / 12', name: 'Tank', role: 'Street Enforcer', quote: "Loyalty over everything. Once we're in, we're in." },
  { image: '/redPanda.png', imageAlt: 'Rusty the Red Panda', number: '11 / 12', name: 'Rusty', role: 'Smooth Operator', quote: "Whiskey neat. Cigars optional. Class non-negotiable." },
  { image: '/tiger2.png', imageAlt: 'Blaze the Tiger', number: '12 / 12', name: 'Blaze', role: 'Street King', quote: "Stay cool. Stay sharp. The block runs through me." },
];

const Section3DDemo = () => (
  <Section3D
    introTitle="The Crew"
    introDescription="Meet the squad. Each one brings something different to the table—style, wisdom, or straight-up attitude."
    cards={cards}
  />
);

export { Section3DDemo };

*/