'use client';

import { useEffect, useRef } from 'react';

interface Particle {
  x: number; y: number;
  vx: number; vy: number;
  size: number;
  alpha: number;
  pulse: number;
  phase: number;
  type: 'node' | 'orbit';
  orbitAngle?: number;
  orbitRadius?: number;
  orbitCenterX?: number;
  orbitCenterY?: number;
  orbitSpeed?: number;
}

export default function AnimatedBackground() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const w = window.innerWidth;
    const h = window.innerHeight;
    const particles: Particle[] = [];
    const count = Math.min(40, Math.floor(w / 50));

    for (let i = 0; i < count; i++) {
      const type = Math.random() > 0.6 ? 'orbit' : 'node';
      if (type === 'orbit') {
        const cx = Math.random() * w;
        const cy = Math.random() * h;
        const r = 20 + Math.random() * 60;
        particles.push({
          x: cx + r, y: cy,
          vx: 0, vy: 0, size: 1.5 + Math.random() * 2,
          alpha: 0.08 + Math.random() * 0.12,
          pulse: 0.3 + Math.random() * 0.5,
          phase: Math.random() * Math.PI * 2,
          type: 'orbit',
          orbitAngle: Math.random() * Math.PI * 2,
          orbitRadius: r,
          orbitCenterX: cx,
          orbitCenterY: cy,
          orbitSpeed: (0.3 + Math.random() * 0.5) * (Math.random() > 0.5 ? 1 : -1),
        });
      } else {
        particles.push({
          x: Math.random() * w, y: Math.random() * h,
          vx: (Math.random() - 0.5) * 0.15,
          vy: (Math.random() - 0.5) * 0.15,
          size: 1 + Math.random() * 1.5,
          alpha: 0.06 + Math.random() * 0.1,
          pulse: 0.3 + Math.random() * 0.5,
          phase: Math.random() * Math.PI * 2,
          type: 'node',
        });
      }
    }

    // Add a few larger "anchor" nodes
    for (let i = 0; i < 3; i++) {
      particles.push({
        x: w * (0.2 + Math.random() * 0.6), y: h * (0.2 + Math.random() * 0.6),
        vx: 0, vy: 0, size: 3 + Math.random() * 3,
        alpha: 0.1 + Math.random() * 0.1,
        pulse: 0.2 + Math.random() * 0.3,
        phase: Math.random() * Math.PI * 2,
        type: 'node',
      });
    }

    let frame: number;
    let time = 0;

    function animate() {
      time += 0.008;
      const dark = document.documentElement.classList.contains('dark');
      if (!dark) { el!.innerHTML = ''; frame = requestAnimationFrame(animate); return; }

      let svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" class="w-full h-full">`;

      // Update positions and draw particles
      for (const p of particles) {
        if (p.type === 'orbit') {
          p.orbitAngle! += p.orbitSpeed! * 0.01;
          p.x = p.orbitCenterX! + Math.cos(p.orbitAngle!) * p.orbitRadius!;
          p.y = p.orbitCenterY! + Math.sin(p.orbitAngle!) * p.orbitRadius!;
        } else {
          p.x += p.vx;
          p.y += p.vy;
          if (p.x < -20) p.x = w + 20;
          if (p.x > w + 20) p.x = -20;
          if (p.y < -20) p.y = h + 20;
          if (p.y > h + 20) p.y = -20;
        }

        const pulse = 0.6 + Math.sin(time * 1.5 + p.phase) * 0.4 * p.pulse;
        const sz = p.size * pulse;
        const alpha = (p.alpha * pulse) * 0.6;

        svg += `<circle cx="${p.x}" cy="${p.y}" r="${Math.max(sz, 0.3)}" fill="rgba(129,140,248,${alpha})" />`;
      }

      // Draw connections between nearby particles
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 180 && dist > 0) {
            const alpha = (1 - dist / 180) * 0.04;
            svg += `<line x1="${particles[i].x}" y1="${particles[i].y}" x2="${particles[j].x}" y2="${particles[j].y}" stroke="rgba(129,140,248,${alpha})" stroke-width="0.5" />`;
          }
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
