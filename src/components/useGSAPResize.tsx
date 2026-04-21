import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger, ScrollSmoother } from 'gsap/all';

interface UseGSAPResizeOptions {
  debounceMs?: number;
  refreshScrollTrigger?: boolean;
  refreshScrollSmoother?: boolean;
  onResize?: () => void;
  dependencies?: unknown[];
}

/**
 * Custom hook that handles GSAP resize issues
 * Automatically refreshes ScrollTrigger and ScrollSmoother on window resize
 */
export function useGSAPResize({
  debounceMs = 150,
  refreshScrollTrigger = true,
  refreshScrollSmoother = true,
  onResize,
  dependencies = []
}: UseGSAPResizeOptions = {}) {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isResizingRef = useRef(false);

  useEffect(() => {
    const handleResize = () => {
      // Clear existing timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      isResizingRef.current = true;

      // Debounced resize handler
      timeoutRef.current = setTimeout(() => {
        // Refresh ScrollTrigger instances
        if (refreshScrollTrigger && ScrollTrigger) {
          ScrollTrigger.refresh();
        }

        // Refresh ScrollSmoother if it exists
        if (refreshScrollSmoother && ScrollSmoother) {
          const smoother = ScrollSmoother.get();
          if (smoother) {
            smoother.refresh();
          }
        }

        // Call custom resize handler
        if (onResize) {
          onResize();
        }

        isResizingRef.current = false;
      }, debounceMs);
    };

    // Add event listener
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [...dependencies]);

  return {
    // eslint-disable-next-line react-hooks/refs
    isResizing: isResizingRef.current
  };
}

/**
 * Enhanced version that also handles orientation change and device pixel ratio changes
 */
export function useGSAPAdvancedResize({
  debounceMs = 150,
  refreshScrollTrigger = true,
  refreshScrollSmoother = true,
  onResize,
  dependencies = []
}: UseGSAPResizeOptions = {}) {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isResizingRef = useRef(false);

  useEffect(() => {
    let currentDevicePixelRatio = window.devicePixelRatio;

    const handleResize = () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      isResizingRef.current = true;

      timeoutRef.current = setTimeout(() => {
        // Check if device pixel ratio changed (zoom)
        if (window.devicePixelRatio !== currentDevicePixelRatio) {
          currentDevicePixelRatio = window.devicePixelRatio;
        }

        // Kill and recreate ScrollSmoother if it exists (more reliable for complex cases)
        if (refreshScrollSmoother && ScrollSmoother) {
          const smoother = ScrollSmoother.get();
          if (smoother) {
            smoother.kill();
            // Small delay to ensure cleanup
            gsap.delayedCall(0.1, () => {
              // Recreate with basic config - user should handle complex configs themselves
              ScrollSmoother.create({
                smooth: 1,
                effects: true
              });
            });
          }
        }

        // Refresh ScrollTrigger after ScrollSmoother recreation
        if (refreshScrollTrigger && ScrollTrigger) {
          gsap.delayedCall(0.15, () => {
            ScrollTrigger.refresh();
          });
        }

        // Call custom resize handler
        if (onResize) {
          gsap.delayedCall(0.2, onResize);
        }

        isResizingRef.current = false;
      }, debounceMs);
    };

    // Multiple event listeners for comprehensive coverage
    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleResize);
    
    // Handle zoom changes
    const mediaQuery = window.matchMedia('(resolution: 1dppx)');
    const handleMediaChange = () => handleResize();
    
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleMediaChange);
    } else {
      // Fallback for older browsers
      mediaQuery.addListener(handleMediaChange);
    }

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
      
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener('change', handleMediaChange);
      } else {
        mediaQuery.removeListener(handleMediaChange);
      }
      
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [...dependencies]);

  return {
    isResizing: isResizingRef.current
  };
}

/**
 * Utility function to safely create ScrollSmoother with resize handling
 */
export function createResizeAwareScrollSmoother(config: Record<string, unknown>, resizeOptions?: UseGSAPResizeOptions) {
  // Store the config for recreation
  const scrollSmootherConfig = { ...config };
  
  // Create initial ScrollSmoother
  ScrollSmoother.create(scrollSmootherConfig);
  
  let timeoutRef: NodeJS.Timeout;
  
  const handleResize = () => {
    if (timeoutRef) clearTimeout(timeoutRef);
    
    timeoutRef = setTimeout(() => {
      const existingSmoother = ScrollSmoother.get();
      if (existingSmoother) {
        existingSmoother.kill();
      }
      
      // Recreate with same config
      gsap.delayedCall(0.1, () => {
        ScrollSmoother.create(scrollSmootherConfig);
        ScrollTrigger.refresh();
        
        if (resizeOptions?.onResize) {
          resizeOptions.onResize();
        }
      });
    }, resizeOptions?.debounceMs || 150);
  };
  
  window.addEventListener('resize', handleResize);
  
  // Return cleanup function
  return () => {
    window.removeEventListener('resize', handleResize);
    if (timeoutRef) clearTimeout(timeoutRef);
    const existingSmoother = ScrollSmoother.get();
    if (existingSmoother) existingSmoother.kill();
  };
}