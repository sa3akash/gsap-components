'use client';

import ExpandablePanel from '@/components/ExpandablePanel';
import { useState, useEffect } from 'react';

const DEMO_IMAGES = [
  { image: "/gori.png", alt: "Gori" },
  { image: "/crocs2.png", alt: "Snap" },
  { image: "/crow.png", alt: "Crowley" },
  { image: "/foxy.png", alt: "Foxy" },
  { image: "/snake.png", alt: "Slither" },
  { image: "/bear.png", alt: "Bruno" },
  { image: "/owl.png", alt: "Hoot" },
  { image: "/bulldog.png", alt: "Tank" },
  { image: "/redPanda.png", alt: "Rusty" },
  { image: "/tiger2.png", alt: "Blaze" },
];

const MOBILE_PANEL_COUNT = 4;

const ExpandablePanelDemo = () => {
  const [panels, setPanels] = useState(DEMO_IMAGES);

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)');
    const update = () => setPanels(mq.matches ? DEMO_IMAGES.slice(0, MOBILE_PANEL_COUNT) : DEMO_IMAGES);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  return (
    <div className="w-full h-full flex items-center justify-center p-4">
      <ExpandablePanel
        panels={panels}
        height="70vh"
        expandedWidth="50%"
        collapsedWidth="8%"
        gap="0.75rem"
        borderRadius="1.5rem"
        transitionDuration="600ms"
        defaultExpanded={-1}
      />
    </div>
  );
};

export { ExpandablePanelDemo };
