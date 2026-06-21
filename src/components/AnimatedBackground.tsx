'use client';

import { useEffect, useRef } from 'react';

interface Star {
  x: number; y: number; vx: number; vy: number; size: number;
  shape: 'star' | 'circle' | 'diamond'; hue: number; alpha: number; pulse: number; phase: number;
}

export default function AnimatedBackground() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const w = window.innerWidth;
    const h = window.innerHeight;
    const count = Math.min(30, Math.floor(w / 60));
    const stars: Star[] = [];

    const shapes: Star['shape'][] = ['star', 'circle', 'diamond'];
    for (let i = 0; i < count; i++) {
      stars.push({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        size: 4 + Math.random() * 12,
        shape: shapes[Math.floor(Math.random() * shapes.length)],
        hue: [230, 260, 190, 40, 330][Math.floor(Math.random() * 5)],
        alpha: 0.15 + Math.random() * 0.25,
        pulse: 0.5 + Math.random() * 0.5,
        phase: Math.random() * Math.PI * 2,
      });
    }

    let frame: number;
    let time = 0;
    function animate() {
      time += 0.01;
      const dark = document.documentElement.classList.contains('dark');

      let svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" class="w-full h-full">`;
      for (const s of stars) {
        s.x += s.vx;
        s.y += s.vy;
        if (s.x < -20 || s.x > w + 20) s.vx *= -1;
        if (s.y < -20 || s.y > h + 20) s.vy *= -1;

        const pulse = 1 + Math.sin(time * 2 + s.phase) * 0.3 * s.pulse;
        const sz = s.size * pulse;
        const alpha = s.alpha * (dark ? 0.6 : 1);

        if (s.shape === 'star') {
          const pts = 5;
          const outer = sz;
          const inner = sz * 0.4;
          let d = '';
          for (let i = 0; i < pts * 2; i++) {
            const r = i % 2 === 0 ? outer : inner;
            const a = (i * Math.PI) / pts - Math.PI / 2;
            d += `${i === 0 ? 'M' : 'L'}${s.x + r * Math.cos(a)},${s.y + r * Math.sin(a)}`;
          }
          svg += `<path d="${d}Z" fill="hsla(${s.hue},70%,65%,${alpha})" />`;
        } else if (s.shape === 'diamond') {
          svg += `<rect x="${s.x - sz/2}" y="${s.y - sz/2}" width="${sz}" height="${sz}" rx="2" transform="rotate(45,${s.x},${s.y})" fill="hsla(${s.hue},70%,65%,${alpha})" />`;
        } else {
          svg += `<circle cx="${s.x}" cy="${s.y}" r="${sz/2}" fill="hsla(${s.hue},70%,65%,${alpha})" />`;
        }
      }
      svg += '</svg>';
      el!.innerHTML = svg;
      frame = requestAnimationFrame(animate);
    }
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, []);

  return <div ref={ref} className="fixed inset-0 pointer-events-none z-0" />;
}
