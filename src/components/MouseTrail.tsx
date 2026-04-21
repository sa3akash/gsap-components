'use client';

import React, { useRef, useState, useEffect } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { cn } from '@/lib/utils';

interface MouseTrailProps {
  images: string[];
  containerClassName?: string;
  imageClassName?: string;
  imageWidth?: number;
  imageHeight?: number;
  stagger?: number;
  duration?: number;
  ease?: string;
}

const MouseTrail: React.FC<MouseTrailProps> = ({
  images,
  containerClassName,
  imageClassName,
  imageWidth = 288,
  imageHeight = 384,
  stagger = 0.1,
  duration = 0.3,
  ease = "power2.out"
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const hasMovedRef = useRef(false);
  const containerBoundsRef = useRef<DOMRect | null>(null);
  const rafIdRef = useRef<number | null>(null);

  // Preload images to prevent lag
  useEffect(() => {
    const preloadImages = async () => {
      const imagePromises = images.map((src) => {
        return new Promise<void>((resolve, reject) => {
          const img = new Image();
          img.onload = () => resolve();
          img.onerror = reject;
          img.src = src;
        });
      });

      try {
        await Promise.all(imagePromises);
        setImagesLoaded(true);
      } catch (error) {
        console.warn('Some images failed to preload:', error);
        // Still set to true to allow component to function
        setImagesLoaded(true);
      }
    };

    preloadImages();
  }, [images]);

  useGSAP(() => {
    if (!containerRef.current || !imagesLoaded) return;

    // Cache container bounds
    const updateBounds = () => {
      if (containerRef.current) {
        containerBoundsRef.current = containerRef.current.getBoundingClientRect();
      }
    };

    // Initialize images with better performance
    gsap.set(".trail-img", {
      x: -imageWidth, // Start offscreen to avoid flash
      y: -imageHeight,
      opacity: 0,
      scale: 1,
      force3D: true, // Enable hardware acceleration
      willChange: "transform, opacity"
    });

    // Update bounds initially and on resize/scroll with debouncing
    updateBounds();
    
    let resizeTimeout: NodeJS.Timeout;
    const debouncedUpdateBounds = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(updateBounds, 16); // ~60fps
    };

    window.addEventListener('resize', debouncedUpdateBounds);
    window.addEventListener('scroll', debouncedUpdateBounds, { passive: true });

    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current || !containerBoundsRef.current) return;
      
      // Cancel previous animation frame
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
      }

      // Use requestAnimationFrame for smoother performance
      rafIdRef.current = requestAnimationFrame(() => {
        if (!containerRef.current || !containerBoundsRef.current) return;

        
        const containerRect = containerBoundsRef.current;
        const relativeX = e.clientX - containerRect.left;
        const relativeY = e.clientY - containerRect.top;
        
        const isWithinBounds = 
          relativeX >= 0 && 
          relativeX <= containerRect.width && 
          relativeY >= 0 && 
          relativeY <= containerRect.height;
        
        if (!hasMovedRef.current && isWithinBounds) {
          hasMovedRef.current = true;
        }
        
        // Use higher performance animation settings
        gsap.to(".trail-img", {
          x: relativeX - imageWidth / 2,
          y: relativeY - imageHeight / 2,
          opacity: hasMovedRef.current && isWithinBounds ? 1 : 0,
          stagger: stagger,
          duration: duration,
          ease: ease,
          force3D: true,
          overwrite: "auto" // Prevent animation conflicts
        });
      });
    };

    const handleMouseLeave = () => {
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
      }
      
      gsap.to(".trail-img", {
        opacity: 0,
        duration: 0.3,
        ease: "power2.out",
        force3D: true
      });
      hasMovedRef.current = false;
    };

    document.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);

    // Cleanup
    return () => {
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
      }
      clearTimeout(resizeTimeout);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('resize', debouncedUpdateBounds);
      window.removeEventListener('scroll', debouncedUpdateBounds);
    };
  }, { scope: containerRef, dependencies: [stagger, duration, ease, imageWidth, imageHeight, imagesLoaded] });

  return (
    <div 
      ref={containerRef}
      className={cn(
        "w-full h-full overflow-hidden relative z-10",
        containerClassName
      )}
      style={{
        // Optimize for animations
        willChange: "transform",
        transform: "translateZ(0)" // Force hardware acceleration
      }}
    >
      {/* Loading indicator */}
      {!imagesLoaded && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-gray-500 text-lg">Loading images...</div>
        </div>
      )}
      
      {imagesLoaded && images.map((src, index) => (
        <div
          key={index}
          className={cn(
            "trail-img absolute pointer-events-none",
            imageClassName
          )}
          style={{
            width: `${imageWidth}px`,
            height: `${imageHeight}px`,
            zIndex: images.length - index,
            willChange: "transform, opacity",
            transform: "translateZ(0)" // Force hardware acceleration
          }}
        >
          <img
            src={src}
            alt={`Trail image ${index + 1}`}
            className="w-full h-full object-cover block rounded-lg shadow-lg"
            draggable={false}
            style={{
              // Optimize image rendering
              transform: "translateZ(0)"
            }}
          />
        </div>
      ))}
      
    </div>
  );
};

export default MouseTrail;