'use client';

import React, { useRef, useState, useEffect } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

export interface ProjectItem {
  title: string;
  subtitle: string;
  image: string;
  alt?: string;
}

interface ProjectHoverSectionProps {
  projects: ProjectItem[];
  className?: string;
  thumbnailWidth?: number;
  thumbnailHeight?: number;
}

const ProjectHoverSection: React.FC<ProjectHoverSectionProps> = ({
  projects,
  className,
  thumbnailWidth = 250,
  thumbnailHeight = 300,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const thumbnailRef = useRef<HTMLDivElement>(null);
  const sliderRef = useRef<HTMLDivElement>(null);
  const [isDesktop, setIsDesktop] = useState(true);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const [modal, setModal] = useState<{ active: boolean; index: number }>({ active: false, index: 0 });

  // Detect desktop vs mobile
  useEffect(() => {
    const checkDesktop = () => setIsDesktop(window.innerWidth >= 768);
    checkDesktop();
    window.addEventListener('resize', checkDesktop);
    return () => window.removeEventListener('resize', checkDesktop);
  }, []);

  // GSAP: position follows mouse relative to container
  useGSAP(
    () => {
      if (!isDesktop || !thumbnailRef.current || !sliderRef.current || !containerRef.current) return;

      gsap.set(thumbnailRef.current, {
        scale: 0,
        xPercent: -50,
        yPercent: -50,
        force3D: true,
      });
      gsap.set(sliderRef.current, { y: 0 });

      const xTo = gsap.quickTo(thumbnailRef.current, 'x', { duration: 0.5, ease: 'power3.out' });
      const yTo = gsap.quickTo(thumbnailRef.current, 'y', { duration: 0.5, ease: 'power3.out' });

      // Track whether we've received a mouse position yet
      let hasPosition = false;

      const handleMouseMove = (e: MouseEvent) => {
        const rect = containerRef.current!.getBoundingClientRect();
        const relX = e.clientX - rect.left;
        const relY = e.clientY - rect.top;

        if (!hasPosition) {
          // Jump immediately to mouse position on first move (no tweening)
          gsap.set(thumbnailRef.current, { x: relX, y: relY });
          hasPosition = true;
        } else {
          xTo(relX);
          yTo(relY);
        }
      };

      window.addEventListener('mousemove', handleMouseMove);
      return () => window.removeEventListener('mousemove', handleMouseMove);
    },
    { dependencies: [isDesktop] }
  );

  // GSAP: animate scale + slider when modal state changes
  useGSAP(
    () => {
      if (!isDesktop || !thumbnailRef.current || !sliderRef.current) return;

      if (modal.active) {
        gsap.to(thumbnailRef.current, {
          scale: 1,
          opacity: 1,
          visibility: 'visible',
          duration: 0.4,
          ease: 'power2.out',
          overwrite: 'auto',
        });
        gsap.to(sliderRef.current, {
          y: -modal.index * thumbnailHeight,
          duration: 0.4,
          ease: 'power2.out',
          overwrite: 'auto',
        });
      } else {
        gsap.to(thumbnailRef.current, {
          scale: 0,
          opacity: 0,
          duration: 0.3,
          ease: 'power2.in',
          overwrite: 'auto',
          onComplete: () => {
            gsap.set(thumbnailRef.current, { visibility: 'hidden' });
          },
        });
      }
    },
    { dependencies: [modal.active, modal.index, isDesktop, thumbnailHeight, projects.length] }
  );

  if (isDesktop) {
    return (
      <div
        ref={containerRef}
        onMouseLeave={() => setModal({ active: false, index: 0 })}
        className={cn(
          'relative flex flex-col w-full max-w-[1000px] mx-auto py-12',
          className
        )}
      >
        <div className="flex flex-col w-full">
          {projects.map((project, index) => (
            <div
              key={index}
              onMouseEnter={() => setModal({ active: true, index })}
              className={cn(
                'w-full flex items-center justify-between px-6 md:px-16 py-8 md:py-12 border-t border-white/20 cursor-pointer transition-opacity duration-300',
                modal.active && modal.index === index && 'opacity-60'
              )}
            >
              <h2
                className={cn(
                  'text-2xl md:text-4xl lg:text-5xl font-medium text-white transition-transform duration-500 ease-out',
                  modal.active && modal.index === index && '-translate-x-4'
                )}
              >
                {project.title}
              </h2>
              <p
                className={cn(
                  'text-sm md:text-base text-white/70 transition-transform duration-500 ease-out',
                  modal.active && modal.index === index && 'translate-x-4'
                )}
              >
                {project.subtitle}
              </p>
            </div>
          ))}
          {/* Bottom border */}
          <div className="w-full h-px bg-white/20" />
        </div>

        {/* Thumbnail — absolute inside relative container, pointer-events-none */}
        <div
          ref={thumbnailRef}
          className="absolute top-0 left-0 z-50 overflow-hidden rounded-lg border border-white/20 shadow-2xl"
          style={{
            width: thumbnailWidth,
            height: thumbnailHeight,
            pointerEvents: 'none',
            opacity: 0,
            visibility: 'hidden' as const,
          }}
        >
          <div
            ref={sliderRef}
            className="relative w-full"
            style={{
              height: thumbnailHeight * projects.length,
              pointerEvents: 'none',
            }}
          >
            {projects.map((project, index) => (
              <div
                key={index}
                className="absolute left-0 w-full flex items-center justify-center"
                style={{
                  top: index * thumbnailHeight,
                  width: thumbnailWidth,
                  height: thumbnailHeight,
                  pointerEvents: 'none',
                }}
              >
                <Image
                  src={project.image}
                  alt={project.alt ?? project.title}
                  width={thumbnailWidth}
                  height={thumbnailHeight}
                  className="w-full h-full object-cover object-top"
                  style={{ pointerEvents: 'none' }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Mobile: Clean stacked version with tap-to-expand
  return (
    <div className={cn('flex flex-col w-full max-w-[1000px] mx-auto py-6', className)}>
      {projects.map((project, index) => (
        <div
          key={index}
          className="border-b border-white/20 last:border-b-0"
        >
          <button
            type="button"
            onClick={() => setExpandedIndex(expandedIndex === index ? null : index)}
            className="w-full flex items-center justify-between px-4 py-5 text-left active:opacity-80 transition-opacity"
          >
            <h2 className="text-xl font-medium text-white">{project.title}</h2>
            <p className="text-sm text-white/70">{project.subtitle}</p>
            <span className="ml-2 text-white/50 text-lg">
              {expandedIndex === index ? '−' : '+'}
            </span>
          </button>
          <div
            className={cn(
              'overflow-hidden transition-all duration-300 ease-out',
              expandedIndex === index ? 'max-h-64 opacity-100' : 'max-h-0 opacity-0'
            )}
          >
            <div className="px-4 pb-4">
              <div className="relative w-full aspect-4/3 rounded-lg overflow-hidden border border-white/20">
                <Image
                  src={project.image}
                  alt={project.alt ?? project.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 400px"
                />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProjectHoverSection;



/*
import ProjectHoverSection from '@/ui/components/interactive/ProjectHoverSection';

const ProjectHoverSectionDemo = () => {
  const projects = [
    { title: 'Bruno', subtitle: 'Keeper of the Woods', image: '/bear.png', alt: 'Bruno the Bear' },
    { title: 'Chompy', subtitle: 'Jaws of the Marsh', image: '/crocs.png', alt: 'Chompy the Croc' },
    { title: 'Snap', subtitle: 'Master of the Lagoon', image: '/crocs2.png', alt: 'Snap the Croc' },
    { title: 'Crowley', subtitle: 'Messenger of the Skies', image: '/crow.png', alt: 'Crowley the Crow' },
    { title: 'Foxy', subtitle: 'Cunning and Quick', image: '/foxy.png', alt: 'Foxy the Fox' },
    { title: 'Gori', subtitle: 'Strength and Wisdom', image: '/gori.png', alt: 'Gori the Gorilla' },
    { title: 'Hoot', subtitle: 'Eyes of the Night', image: '/owl.png', alt: 'Hoot the Owl' },
    { title: 'Slither', subtitle: 'Ancient Wisdom', image: '/snake.png', alt: 'Slither the Snake' },
    { title: 'Rajah', subtitle: 'Stripes of Power', image: '/tiger.png', alt: 'Rajah the Tiger' },
    { title: 'Tank', subtitle: 'Street Enforcer', image: '/bulldog.png', alt: 'Tank the Bulldog' },
    { title: 'Rusty', subtitle: 'Smooth Operator', image: '/redPanda.png', alt: 'Rusty the Red Panda' },
    { title: 'Blaze', subtitle: 'Street King', image: '/tiger2.png', alt: 'Blaze the Tiger' },
  ];

  return (
    <div className="w-full min-h-[500px] flex items-center justify-center bg-[#0a0a0a] rounded-lg py-12">
      <ProjectHoverSection projects={projects} />
    </div>
  );
};

export { ProjectHoverSectionDemo };


*/