"use client"

import Image from 'next/image';
import { gsap } from 'gsap';
import { Draggable } from 'gsap/Draggable';
import { MotionPathPlugin } from 'gsap/MotionPathPlugin';
import { InertiaPlugin } from 'gsap/InertiaPlugin';
import { useGSAP } from '@gsap/react';
import { useRef } from 'react';

gsap.registerPlugin(Draggable, MotionPathPlugin, InertiaPlugin);

interface ImageGalleryProps {
  images: {
    src: string;
    alt: string;
  }[];
  className?: string;
  imageQuality?: number;
  circleSize?: number;
}

const ImageGallery = ({ images, className, imageQuality = 400, circleSize = 400 }: ImageGalleryProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const circlePathRef = useRef<SVGPathElement>(null);
  const imageRefs = useRef<(HTMLDivElement | null)[]>([]);
  // eslint-disable-next-line react-hooks/refs
  imageRefs.current = images.map((_, i) => imageRefs.current[i] || null);
  const imageSize = 100 / images.length; 

  useGSAP(() => {
    if (!circlePathRef.current || !containerRef.current) return;

    const imageElements = imageRefs.current.filter(Boolean);
    const container = containerRef.current;
    
    gsap.set(imageElements, {
      motionPath: {
        path: circlePathRef.current,
        align: circlePathRef.current,
        alignOrigin: [0.5, 0.5],
        end: (i) => i / imageElements.length,
        autoRotate: true
      }
    });

    Draggable.create(container, {
      type: "rotation",
      inertia: true,
      onPress: function() {
        // Kill any wheel animations when starting to drag
        if (isWheeling) {
          gsap.killTweensOf(container);
        }
      }
    });


    let isHovered = false;
    let isWheeling = false;

    const handleWheel = (event: WheelEvent) => {
      if (!isHovered) return; 
      event.preventDefault(); 
      event.stopPropagation(); 
      
      // Set wheeling flag and kill any existing animations
      isWheeling = true;
      gsap.killTweensOf(container);
      
      const currentRotation = gsap.getProperty(container, "rotation") as number;
      const newRotation = currentRotation + event.deltaY * 0.5;
      
      // Apply smooth rotation with gsap.to
      gsap.to(container, {
        rotation: newRotation,
        duration: 0.3,
        ease: "power2.out",
        overwrite: true
      });
      
      // Reset wheeling flag after animation
      setTimeout(() => {
        isWheeling = false;
      }, 300);
    };

    const handleMouseEnter = () => {
      isHovered = true;
    };

    const handleMouseLeave = () => {
      isHovered = false;
    };

    container.addEventListener("wheel", handleWheel, { passive: false });
    container.addEventListener("mouseenter", handleMouseEnter);
    container.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      container.removeEventListener("wheel", handleWheel);
      container.removeEventListener("mouseenter", handleMouseEnter);
      container.removeEventListener("mouseleave", handleMouseLeave);
    };

  }, { 
    scope: containerRef,
    dependencies: [images.length] 
  });

  return (
    <div 
      className={`w-full h-full flex justify-center items-center overflow-hidden ${className || ''}`}
    >
      <div 
        ref={containerRef} 
        className="relative w-full h-full max-w-full max-h-full aspect-square flex justify-center items-center"
      >
        <svg 
          ref={svgRef}
          viewBox={`0 0 ${circleSize} ${circleSize}`}
          className="w-[80%] h-[80%] opacity-0"
        >
          <path 
            ref={circlePathRef}
            id="circle"
            fill="none" 
            stroke="black"
            strokeWidth="1"
            d="M396,200 C396,308.24781 308.24781,396 200,396 91.75219,396 4,308.24781 4,200 4,91.75219 91.75219,4 200,4 308.24781,4 396,91.75219 396,200 z"
          />
        </svg>
        
        {images.map((image, index) => (
          <div  
            key={index} 
            ref={(el) => { imageRefs.current[index] = el; }}
            className="absolute overflow-hidden rounded-lg shadow-lg aspect-square"
            style={{ 
              width: `${imageSize}%`,
              height: `${imageSize}%`
            }}
          >
            <Image 
              src={image.src} 
              alt={image.alt} 
              width={imageQuality} 
              height={imageQuality} 
              priority={index === 0} 
              className="w-full h-full object-cover object-top" 
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImageGallery;