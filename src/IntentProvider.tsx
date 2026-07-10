import React, { createContext, useEffect, useRef } from 'react';

export interface RegisteredLink {
  element: HTMLElement;
  callback: () => void;
  rect: DOMRect;
}

export const IntentContext = createContext<Map<HTMLElement, RegisteredLink>>(new Map());

export const IntentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const registry = useRef(new Map<HTMLElement, RegisteredLink>());
  const mouse = useRef<{ x: number; y: number; last: number | null }>({ x: 0, y: 0, last: null });

  useEffect(() => {
    let rafId: number | null = null;
    const currentRegistry = registry.current;

    const updateRects = () => {
      currentRegistry.forEach((item) => {
        item.rect = item.element.getBoundingClientRect();
      });
    };

    const handleMouseMove = (e: MouseEvent) => {
      const now = e.timeStamp;
      if (mouse.current.last === null) {
        mouse.current = { x: e.clientX, y: e.clientY, last: now };
        return;
      }

      const dt = now - mouse.current.last;
      if (dt <= 0) {
        mouse.current.x = e.clientX;
        mouse.current.y = e.clientY;
        return;
      }

      const vx = (e.clientX - mouse.current.x) / dt;
      const vy = (e.clientY - mouse.current.y) / dt;
      mouse.current = { x: e.clientX, y: e.clientY, last: now };

      const px = e.clientX + vx * 300;
      const py = e.clientY + vy * 300;

      currentRegistry.forEach(({ rect, callback }) => {
        if (px >= rect.left && px <= rect.right && py >= rect.top && py <= rect.bottom) {
          callback();
        }
      });
    };

    const setDirty = () => {
      if (rafId === null) {
        rafId = requestAnimationFrame(() => {
          updateRects();
          rafId = null;
        });
      }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('scroll', setDirty, { passive: true });
    window.addEventListener('resize', setDirty, { passive: true });

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', setDirty);
      window.removeEventListener('resize', setDirty);
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
      }
    };
  }, []);

  return (
    <IntentContext.Provider value={registry.current}>
      {children}
    </IntentContext.Provider>
  );
};
