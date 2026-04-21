'use client';

import { useRef } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { cn } from '@/lib/utils';

interface TextLoaderProps {
  text?: string;
  className?: string;
  onComplete?: () => void;
  gradientColors?: string[];
  backgroundColor?: string;
  duration?: {
    slideUp?: number;
    reveal?: number;
    slideDown?: number;
  };
  delays?: {
    stagger?: number;
    betweenAnimations?: number;
    beforeSlideDown?: number;
  };
}

const TextLoader: React.FC<TextLoaderProps> = ({
  text = 'DIMAAC',
  className = '',
  onComplete,
  gradientColors = ['#ff0000', '#ff3333', '#ff6600', '#cc0000'],
  backgroundColor = '#17171A',
  duration = {
    slideUp: 0.6,
    reveal: 0.8,
    slideDown: 0.6,
  },
  delays = {
    stagger: 0.05,
    betweenAnimations: 0.3,
    beforeSlideDown: 0.5,
  },
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!textRef.current) return;

    const letters = textRef.current.querySelectorAll('.letter');
    const tl = gsap.timeline({
      onComplete: () => {
        onComplete?.();
      }
    });

    // Set initial state
    gsap.set(letters, {
      y: 100,
      '--clipPath': 'inset(100% 0 0 0)',
    });

    // Animation sequence
    tl.to(letters, {
      duration: duration.slideUp,
      y: 0,
      stagger: delays.stagger,
      ease: 'power2.out',
    })
    .to(letters, {
      '--clipPath': 'inset(0% 0 0 0)',
      duration: duration.reveal,
      delay: delays.betweenAnimations,
      ease: 'power1.inOut',
    })
    .to(letters, {
      duration: duration.slideDown,
      y: -100,
      stagger: delays.stagger,
      delay: delays.beforeSlideDown,
      ease: 'power2.in',
    })
    .to(containerRef.current, {
      y: '-100%',
      duration: 0.8,
      ease: 'power2.inOut',
      delay: 0.3,
    }, '-=0.2');
  }, { scope: containerRef, dependencies: [text, duration, delays, onComplete] });

  const gradientString = `linear-gradient(45deg, ${gradientColors.join(', ')})`;

  return (
    <div 
      ref={containerRef}
      className={cn("fixed inset-0 flex items-center justify-center overflow-hidden z-50", className)}
      style={{ backgroundColor }}
    >
      <div 
        ref={textRef}
        className="text-container flex relative overflow-hidden"
        style={{
          fontFamily: '"Oswald", "Bebas Neue", sans-serif',
          fontSize: 'clamp(3rem, 12vw, 6.5rem)',
          fontWeight: 700,
          lineHeight: 1,
        }}
      >
        {text.split('').map((char, index) => (
          <span
            key={`${char}-${index}`}
            className="letter inline-block relative"
            data-text={char}
            style={{
              color: 'rgba(255, 255, 255, 0.2)',
              transform: 'translateY(100px)',
              '--clipPath': 'inset(100% 0 0 0)',
            } as React.CSSProperties}
          >
            {char}
            <span
              className="absolute left-0 top-0 w-full h-full"
              style={{
                content: `"${char}"`,
                backgroundImage: gradientString,
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                clipPath: 'var(--clipPath)',
                WebkitClipPath: 'var(--clipPath)',
                transition: 'clip-path 0s',
              }}
            >
              {char}
            </span>
          </span>
        ))}
      </div>

      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Oswald:wght@700&display=swap');
        
        .text-container {
          /* Responsive font sizing */
          font-size: clamp(2.5rem, 8vw, 6.5rem);
        }
        
        @media (max-width: 640px) {
          .text-container {
            font-size: clamp(2rem, 10vw, 4rem);
          }
        }
        
        @media (max-width: 480px) {
          .text-container {
            font-size: clamp(1.5rem, 12vw, 3rem);
          }
        }
        
        @media (max-width: 360px) {
          .text-container {
            font-size: clamp(1.2rem, 14vw, 2.5rem);
          }
        }
        
        /* Ensure proper spacing on mobile */
        @media (max-width: 768px) {
          .letter {
            letter-spacing: -0.02em;
          }
        }
      `}</style>
    </div>
  );
};

export default TextLoader;


/*
'use client';

import { useState } from 'react';
import TextLoader from '@/ui/components/loaders/TextLoader';

const TextLoaderDemo = () => {
  const [activeDemo, setActiveDemo] = useState<number | null>(null);

  const demos = [
    {
      id: 1,
      title: 'Red Gradient',
      text: 'DIMAAC',
      gradientColors: ['#ff0000', '#ff3333', '#ff6600', '#cc0000'],
      backgroundColor: '#17171A',
    },
    {
      id: 2,
      title: 'Blue Ocean',
      text: 'OCEAN',
      gradientColors: ['#0066ff', '#3399ff', '#00ccff', '#0099cc'],
      backgroundColor: '#001122',
    },
    {
      id: 3,
      title: 'Purple Sunset',
      text: 'SUNSET',
      gradientColors: ['#8B5CF6', '#A78BFA', '#C084FC', '#DDD6FE'],
      backgroundColor: '#1F1B24',
    },
    {
      id: 4,
      title: 'Green Forest',
      text: 'FOREST',
      gradientColors: ['#22c55e', '#16a34a', '#15803d', '#166534'],
      backgroundColor: '#0a0f0a',
    },
  ];

  const handleStart = (demoId: number) => {
    setActiveDemo(demoId);
  };

  const handleComplete = () => {
    setActiveDemo(null);
  };

  return (
    <div className="flex items-center justify-center w-full p-8">
      <div className="flex flex-wrap gap-4 justify-center">
        {demos.map((demo) => (
          <button
            key={demo.id}
            onClick={() => handleStart(demo.id)}
            disabled={activeDemo !== null}
            className="px-6 py-3 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-medium text-gray-700"
          >
            {activeDemo === demo.id ? 'Running...' : demo.title}
          </button>
        ))}
      </div>

      {activeDemo && (
        <TextLoader
          {...demos.find(d => d.id === activeDemo)!}
          onComplete={handleComplete}
          duration={{
            slideUp: 0.8,
            reveal: 1.2,
            slideDown: 0.8,
          }}
          delays={{
            stagger: 0.08,
            betweenAnimations: 0.4,
            beforeSlideDown: 0.8,
          }}
        />
      )}
    </div>
  );
};

export { TextLoaderDemo }

*/