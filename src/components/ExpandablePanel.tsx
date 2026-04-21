'use client';

import React, { useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

interface Panel {
  image: string;
  alt?: string;
}

interface ExpandablePanelProps {
  panels: Panel[];
  className?: string;
  panelClassName?: string;
  expandedWidth?: string;
  collapsedWidth?: string;
  minWidth?: string;
  height?: string;
  gap?: string;
  borderRadius?: string;
  transitionDuration?: string;
  defaultExpanded?: number;
}

const ExpandablePanel: React.FC<ExpandablePanelProps> = ({
  panels,
  className,
  panelClassName,
  expandedWidth = '60%',
  collapsedWidth = '10%',
  minWidth = '40px',
  height = '80vh',
  gap = '0.5rem',
  borderRadius = '1rem',
  transitionDuration = '500ms',
  defaultExpanded = 0
}) => {
  const [expandedIndex, setExpandedIndex] = useState(defaultExpanded);
  const panelRef = useRef<HTMLDivElement>(null);

  const handleClick = (index: number) => {
    setExpandedIndex(index);
  };

  // Handle clicks outside the panel
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
        setExpandedIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div 
      ref={panelRef}
      className={cn(
        "flex w-full max-w-7xl items-center justify-center",
        className
      )}
      style={{
        height,
        gap
      }}
    >
      {panels.map((panel, index) => (
        <div
          key={index}
          onClick={() => handleClick(index)}
          className={cn(
            "h-full cursor-pointer transition-all ease-in-out overflow-hidden block",
            panelClassName
          )}
          style={{
            width: expandedIndex === index ? expandedWidth : collapsedWidth,
            minWidth,
            borderRadius,
            transitionDuration
          }}
        >
          <img 
            src={panel.image} 
            alt={panel.alt || `Panel ${index + 1}`}
            className="w-full h-full object-cover object-top"
          />
        </div>
      ))}
    </div>
  );
};

export default ExpandablePanel;
