'use client';

import { useEffect, useRef, useId } from 'react';
import { gsap } from 'gsap';
import { cn } from '@/lib/utils';

interface LiquidImageRevealProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  duration?: number;
  delay?: number;
  className?: string;
  centerX?: number;
  centerY?: number;
  turbulenceFrequency?: number;
  turbulenceOctaves?: number;
  displacementScale?: number;
  maxRadius?: number;
}


const LiquidImageReveal: React.FC<LiquidImageRevealProps> = ({
  src,
  width = 600,
  height = 400,
  duration = 2,
  delay = 0,
  className = '',
  centerX,
  centerY,
  turbulenceFrequency = 0.03,
  turbulenceOctaves = 10,
  displacementScale = 100,
  maxRadius,
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const circleRef = useRef<SVGCircleElement>(null);
  const id = useId();
  

  const maskId = `liquid-mask-${id}`;
  const filterId = `liquid-filter-${id}`;


  const defaultCenterX = centerX ?? width / 2;
  const defaultCenterY = centerY ?? height / 2;
  // Increase radius to ensure full coverage - use diagonal distance plus some buffer
  const defaultMaxRadius = maxRadius ?? Math.sqrt(width * width + height * height) * 0.6;

  useEffect(() => {
    if (!circleRef.current) return;

    // GSAP animation for the circle radius
    const tl = gsap.timeline({ delay });
    
    tl.fromTo(circleRef.current, 
      { 
        attr: { r: 0 } 
      },
      {
        attr: { r: defaultMaxRadius },
        duration,
        ease: "power2.out"
      }
    );

    return () => {
      tl.kill();
    };
  }, [duration, delay, defaultMaxRadius]);

  return (
    <div className={cn("inline-block", className)}>
      <svg 
        ref={svgRef}
        width={width} 
        height={height} 
        xmlns="http://www.w3.org/2000/svg"
        viewBox={`0 0 ${width} ${height}`}
      >
        <defs>
          {/* Liquid effect filter - now rendered for all browsers */}
          <filter id={filterId}>
            <feTurbulence 
              type="fractalNoise" 
              baseFrequency={turbulenceFrequency} 
              numOctaves={turbulenceOctaves} 
              result="noise" 
            />
            <feDisplacementMap 
              in="SourceGraphic" 
              in2="noise" 
              scale={displacementScale} 
              xChannelSelector="R" 
              yChannelSelector="G" 
            />
          </filter>

          {/* Circle mask with liquid filter applied */}
          <mask id={maskId}>
            <circle 
              ref={circleRef}
              cx={defaultCenterX} 
              cy={defaultCenterY} 
              r="0" 
              fill="white" 
              filter={`url(#${filterId})`}
            />
          </mask>
        </defs>

        {/* Image with mask applied */}
        <image 
          href={src}
          mask={`url(#${maskId})`}
          width={width} 
          height={height}
          preserveAspectRatio="xMidYMid slice"
        />
      </svg>
    </div>
  );
};

export default LiquidImageReveal;
