"use client";

import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
// Icons are imported by the user in their menu items
import { cn } from '@/lib/utils';

interface MenuItem {
  id: string;
  label: string;
  icon?: React.ComponentType<{ size?: number }>;
  shortcut?: string;
  action?: (item: MenuItem, event: React.MouseEvent) => void;
  separator?: boolean;
  disabled?: boolean;
}

interface ContextMenuProps {
  children: React.ReactNode;
  menuItems: MenuItem[];
  className?: string;
  menuClassName?: string;
  onItemClick?: (item: MenuItem, event: React.MouseEvent) => void;
}

const ContextMenu: React.FC<ContextMenuProps> = ({ 
  children, 
  menuItems, 
  className = "",
  menuClassName = "",
  onItemClick = () => {} 
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isScrolling, setIsScrolling] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleContextMenu = (event: React.MouseEvent) => {
    event.preventDefault();
    
    // Don't show context menu if currently scrolling
    if (isScrolling) {
      return;
    }
    
    const x = event.clientX;
    const y = event.clientY;
    
    // Adjust position to keep menu within viewport
    const menuWidth = 250;
    const menuHeight = menuItems.length * 40 + 20;
    
    const adjustedX = x + menuWidth > window.innerWidth ? x - menuWidth : x;
    const adjustedY = y + menuHeight > window.innerHeight ? y - menuHeight : y;
    
    setPosition({ x: adjustedX, y: adjustedY });
    setIsVisible(true);
  };

  const handleItemClick = (item: MenuItem, event: React.MouseEvent) => {
    event.stopPropagation();
    
    if (item.disabled) return;
    
    // Execute the item's action if it exists
    if (item.action && typeof item.action === 'function') {
      item.action(item, event);
    }
    
    // Call the parent's onItemClick callback
    onItemClick(item, event);
    
    // Hide the menu
    setIsVisible(false);
  };

  const hideMenu = (event: Event) => {
    if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
      setIsVisible(false);
    }
  };

  const handleScroll = () => {
    setIsScrolling(true);
    setIsVisible(false); // Hide menu immediately when scrolling
    
    // Clear existing timeout
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }
    
    // Set scrolling to false after scroll ends
    scrollTimeoutRef.current = setTimeout(() => {
      setIsScrolling(false);
    }, 150);
  };

  // GSAP Animation when menu appears
  useEffect(() => {
    if (isVisible && menuRef.current) {
      const menuItems = menuRef.current.querySelectorAll('li');
      
      // Reset initial state
      gsap.set(menuRef.current, {
        opacity: 0,
        scale: 0.8,
        transformOrigin: 'top left'
      });
      
      gsap.set(menuItems, {
        opacity: 0,
        x: -10,
        y: -5
      });

      // Animate menu container
      gsap.to(menuRef.current, {
        opacity: 1,
        scale: 1,
        duration: 0.2,
        ease: "back.out(1.7)"
      });

      // Stagger animate menu items
      gsap.to(menuItems, {
        opacity: 1,
        x: 0,
        y: 0,
        duration: 0.3,
        stagger: 0.05,
        ease: "power2.out",
        delay: 0.1
      });
    }
  }, [isVisible]);

  useEffect(() => {
    if (isVisible) {
      document.addEventListener('click', hideMenu);
      document.addEventListener('contextmenu', hideMenu);
    }
    
    return () => {
      document.removeEventListener('click', hideMenu);
      document.removeEventListener('contextmenu', hideMenu);
    };
  }, [isVisible]);

  // Handle scroll events
  useEffect(() => {
    document.addEventListener('scroll', handleScroll, true);
    document.addEventListener('wheel', handleScroll, { passive: true });
    document.addEventListener('touchmove', handleScroll, { passive: true });
    
    return () => {
      document.removeEventListener('scroll', handleScroll, true);
      document.removeEventListener('wheel', handleScroll);
      document.removeEventListener('touchmove', handleScroll);
      
      // Clear timeout on unmount
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, []);

  return (
    <>
      <div
        ref={containerRef}
        onContextMenu={handleContextMenu}
        className={cn("relative", className)}
      >
        {children}
      </div>

      {isVisible && (
        <div
          ref={menuRef}
          className={cn(
            "fixed bg-white dark:bg-gray-800 shadow-lg rounded-lg border border-gray-200 dark:border-gray-700 py-2 z-50 min-w-[200px]",
            menuClassName
          )}
          style={{
            left: `${position.x}px`,
            top: `${position.y}px`,
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
          }}
        >
          <ul className="list-none m-0 p-0">
            {menuItems.map((item, index) => (
              <React.Fragment key={item.id || index}>
                <li
                  className={cn(
                    "px-4 py-2 cursor-pointer flex items-center gap-3 text-sm transition-colors duration-150",
                    item.disabled 
                      ? "text-gray-400 cursor-not-allowed" 
                      : "hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200"
                  )}
                  onClick={(e) => handleItemClick(item, e)}
                >
                  {item.icon && (
                    <span className="flex-shrink-0 w-4 h-4">
                      <item.icon size={16} />
                    </span>
                  )}
                  <span className="flex-grow">{item.label}</span>
                  {item.shortcut && (
                    <small className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-xs text-gray-600 dark:text-gray-400 font-mono">
                      {item.shortcut}
                    </small>
                  )}
                </li>
                {item.separator && (
                  <div className="h-px bg-gray-200 dark:bg-gray-700 mx-2 my-1"></div>
                )}
              </React.Fragment>
            ))}
          </ul>
        </div>
      )}
    </>
  );
};

export default ContextMenu;
