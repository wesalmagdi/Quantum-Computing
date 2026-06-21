'use client';

import { useEffect, useRef } from 'react';

export default function AnimatedBackground() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const balls: { x: number; y: number; dx: number; dy: number; r: number; hue: number; sat: number; light: number; alpha: number }[] = [];
    const count = Math.min(6, Math.floor(window.innerWidth / 300));

    for (let i = 0; i < count; i++) {
      balls.push({
        x: Math.random() * 100,
        y: Math.random() * 100,
        dx: (Math.random() - 0.5) * 0.15,
        dy: (Math.random() - 0.5) * 0.15,
        r: 200 + Math.random() * 300,
        hue: 230 + Math.random() * 60,
        sat: 60 + Math.random() * 30,
        light: 60 + Math.random() * 20,
        alpha: 0.03 + Math.random() * 0.04,
      });
    }

    let frame: number;
    function animate() {
      for (const b of balls) {
        b.x += b.dx;
        b.y += b.dy;
        if (b.x < -10 || b.x > 110) b.dx *= -1;
        if (b.y < -10 || b.y > 110) b.dy *= -1;
      }
      const parts = balls.map(b =>
        `<circle cx="${b.x}%" cy="${b.y}%" r="${b.r}" fill="hsla(${b.hue},${b.sat}%,${b.light}%,${b.alpha})" />`
      ).join('\n');
      el!.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" class="w-full h-full">${parts}</svg>`;
      frame = requestAnimationFrame(animate);
    }
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <div ref={ref} className="fixed inset-0 pointer-events-none z-0 opacity-70 dark:opacity-40" style={{ filter: 'blur(80px)' }} />
  );
}
