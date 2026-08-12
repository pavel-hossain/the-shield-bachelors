import React, { useEffect, useRef } from 'react';
import { useMess } from '../context/MessContext';

export const CustomCursor: React.FC = () => {
  const { customCursorEnabled } = useMess();
  const ringRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!customCursorEnabled) return;
    if (typeof window === 'undefined' || window.matchMedia('(pointer: coarse)').matches) return;

    let targetX = -100;
    let targetY = -100;
    let currentX = -100;
    let currentY = -100;
    let animId: number;

    const onMouseMove = (e: MouseEvent) => {
      targetX = e.clientX;
      targetY = e.clientY;

      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${targetX}px, ${targetY}px, 0)`;
        dotRef.current.style.opacity = '1';
      }

      const target = e.target as HTMLElement | null;
      if (target && ringRef.current) {
        const isInteractive =
          target.closest('button') ||
          target.closest('a') ||
          target.closest('input') ||
          target.closest('select') ||
          target.closest('textarea') ||
          target.closest('.cursor-pointer') ||
          target.closest('[role="button"]') ||
          target.tagName === 'BUTTON' ||
          target.tagName === 'A';

        if (isInteractive) {
          ringRef.current.classList.add('scale-125', 'border-emerald-400');
        } else {
          ringRef.current.classList.remove('scale-125', 'border-emerald-400');
        }
      }
    };

    const render = () => {
      currentX += (targetX - currentX) * 0.22;
      currentY += (targetY - currentY) * 0.22;

      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${currentX}px, ${currentY}px, 0)`;
        ringRef.current.style.opacity = '1';
      }

      animId = requestAnimationFrame(render);
    };

    window.addEventListener('mousemove', onMouseMove);
    animId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      cancelAnimationFrame(animId);
    };
  }, [customCursorEnabled]);

  if (!customCursorEnabled) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
      <div
        ref={ringRef}
        className="fixed top-0 left-0 w-7 h-7 -ml-3.5 -mt-3.5 rounded-full border border-emerald-500/50 bg-emerald-500/5 transition-transform duration-75 opacity-0"
      />
      <div
        ref={dotRef}
        className="fixed top-0 left-0 w-2 h-2 -ml-1 -mt-1 rounded-full bg-emerald-500 opacity-0"
      />
    </div>
  );
};

