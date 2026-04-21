'use client';

import Lenis from 'lenis';
import { ReactLenis, useLenis } from 'lenis/react';
import React, { createContext, useContext, ReactNode, useEffect, useState } from 'react';

/**
 * LenisContext implementation for smooth scrolling.
 * Re-exports components and provides utilities for GSAP integration.
 */

interface LenisContextType {
  lenis: Lenis;
  isReady: boolean;
}

const LenisContext = createContext<LenisContextType | null>(null);

export const LenisProvider = ({ children }: { children: ReactNode }) => {
  const [lenisInstance, setLenisInstance] = useState<Lenis | null>(null);
  const [isReady, setIsReady] = useState(false);

  // We use a custom provider to expose the lenis instance as "isReady" 
  // more explicitly if needed, although ReactLenis and useLenis 
  // are the primary ways to interact.
  
  return (
    <ReactLenis root>
      {children}
    </ReactLenis>
  );
};

/**
 * Custom hook to access lenis and its readiness state.
 * Returns the same structure expected by existing components.
 */
export const useLenisScroll = () => {
  const lenis = useLenis();
  return {
    lenis,
    isReady: !!lenis,
  };
};

/**
 * Helper to get the scroller element/instance for GSAP ScrollTrigger.
 */
export const getScroller = (lenisContext: any) => {
  // Lenis instance itself can be used or we can return undefined to use default window.
  // Many GSAP/Lenis setups work best with default scroll if lenis is root.
  return lenisContext?.lenis;
};
