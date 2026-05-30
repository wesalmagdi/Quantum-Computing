'use client';

import { useEffect, useRef, useState } from 'react';

const GRAVITY = 0.5;
const JUMP_VEL = -11;
const JUMP_HOLD_VEL = -0.25;
const MAX_HOLD = 350;
const BASE_SPEED = 2;
const SPEED_RATE = 0.0003;
const MAX_SPEED = 12;
const WORLD_W = 600;
const BLOCK = 28;
const P_W = 24;
const P_H = 44;
const GAP_MIN = 70;
const GAP_MAX = 100;
const COMBO_MS = 2000;

function rand(a: number, b: number) { return Math.random() * (b - a) + a; }
function randInt(a: number, b: number) { return Math.floor(rand(a, b + 1)); }

interface Plat { x: number; y: number; w: number; hit: boolean }

function createPlat(y: number, prev?: Plat): Plat {
  let w = randInt(4, 9) * BLOCK;
  let x: number;
  if (prev) {
    x = prev.x + rand(-90, 90);
    x = Math.max(0, Math.min(x, WORLD_W - w));
  } else {
    x = rand(0, WORLD_W - w);
  }
  return { x, y, w, hit: false };
}

function freshState() {
  const plats: Plat[] = [];
  for (let i = 0; i < 10; i++) plats.push(createPlat(-i * rand(GAP_MIN, GAP_MAX)));
  return {
    state: 'menu' as 'menu' | 'play' | 'over',
    px: WORLD_W / 2, py: 0, pvy: 0,
    plats, cam: 0, speed: BASE_SPEED, score: 0,
    combo: 0, bestC: 0, high: 0,
    hold: 0, held: false, fall: false, rot: 0, flash: 0, frame: 0, ft: 0,
  };
}

function play(name: string) {
  try { const a = new Audio(`/icy/${name}.ogg`); a.volume = 0.5; a.play(); } catch {}
}

export default function ModuleBreak() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const gRef = useRef<any>(null);
  const keys = useRef<Set<string>>(new Set());
  const sprites = useRef<Record<string, HTMLImageElement>>({});
  const bgm = useRef<HTMLAudioElement | null>(null);
  const lastCombo = useRef(0);
  const raf = useRef(0);
  const [hs, setHs] = useState(0);
  const [fs, setFs] = useState(false);

  useEffect(() => {
    for (const n of ['idle1','idle2','idle3','walk1','walk2','walk3','walk4','jump','rotate','chock','edge1','edge2']) {
      const i = new Image(); i.src = `/icy/${n}.png`; sprites.current[n] = i;
    }
  }, []);

  useEffect(() => {
    const f = () => setFs(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', f);
    return () => document.removeEventListener('fullscreenchange', f);
  }, []);

  const g = gRef.current || (gRef.current = freshState());

  const resize = () => {
    const c = canvasRef.current;
    if (!c) return;
    if (document.fullscreenElement) {
      c.width = window.innerWidth;
      c.height = window.innerHeight;
    } else {
      c.width = Math.min(WORLD_W, window.innerWidth - 48);
      c.height = Math.min(600, window.innerHeight - 280);
    }
  };

  const startBGM = () => {
    if (!bgm.current) { bgm.current = new Audio('/icy/bg_beat.ogg'); bgm.current.loop = true; bgm.current.volume = 0.3; }
    bgm.current.currentTime = 0;
    bgm.current.play();
  };
  const stopBGM = () => bgm.current?.pause();
  const toggleFs = () => {
    const e = wrapRef.current;
    if (!e) return;
    document.fullscreenElement ? document.exitFullscreen() : e.requestFullscreen();
  };
  const resetGame = () => {
    const s = freshState();
    s.high = g.high;
    Object.assign(g, s);
    const p = g.plats[0];
    g.px = p.x + p.w / 2 - P_W / 2;
    g.py = p.y - P_H;
  };

  const loop = () => {
    const c = canvasRef.current;
    if (!c) return;
    const ctx = c.getContext('2d');
    if (!ctx) return;
    const W = c.width, H = c.height;

    ctx.fillStyle = '#0a0a1a';
    ctx.fillRect(0, 0, W, H);

    if (g.state === 'menu') {
      ctx.fillStyle = '#7c3aed'; ctx.font = 'bold 38px Inter,sans-serif'; ctx.textAlign = 'center';
      ctx.fillText('Icy Tower', W / 2, H / 2 - 90);
      ctx.fillStyle = '#9ca3af'; ctx.font = '15px Inter,sans-serif';
      ctx.fillText('Take a break from quantum!', W / 2, H / 2 - 45);
      ctx.fillStyle = '#c084fc'; ctx.font = '17px Inter,sans-serif';
      ctx.fillText('SPACE or Click to Start', W / 2, H / 2 + 10);
      ctx.fillStyle = '#6b7280'; ctx.font = '12px Inter,sans-serif';
      ctx.fillText('Hold SPACE/Click longer = higher jump', W / 2, H / 2 + 50);
      ctx.fillStyle = '#4b5563'; ctx.font = '11px Inter,sans-serif';
      ctx.fillText('F or button for fullscreen', W / 2, H / 2 + 80);
      if (g.high > 0) { ctx.fillStyle = '#fbbf24'; ctx.font = '14px Inter,sans-serif'; ctx.fillText(`Best: ${Math.floor(g.high)} floors`, W / 2, H / 2 + 115); }
      raf.current = requestAnimationFrame(loop);
      return;
    }

    if (g.state === 'over') {
      ctx.fillStyle = '#ef4444'; ctx.font = 'bold 34px Inter,sans-serif'; ctx.textAlign = 'center';
      ctx.fillText('Game Over', W / 2, H / 2 - 80);
      ctx.fillStyle = '#e5e7eb'; ctx.font = '19px Inter,sans-serif';
      ctx.fillText(`Height: ${Math.floor(g.score)} floors`, W / 2, H / 2 - 35);
      if (g.bestC > 1) { ctx.fillStyle = '#fbbf24'; ctx.font = '15px Inter,sans-serif'; ctx.fillText(`Best Combo: x${g.bestC}`, W / 2, H / 2 + 5); }
      ctx.fillStyle = '#9ca3af'; ctx.font = '14px Inter,sans-serif'; ctx.fillText(`High Score: ${Math.floor(g.high)} floors`, W / 2, H / 2 + 40);
      ctx.fillStyle = '#c084fc'; ctx.font = '16px Inter,sans-serif'; ctx.fillText('SPACE or Click to Retry', W / 2, H / 2 + 90);
      ctx.fillStyle = '#6b7280'; ctx.font = '11px Inter,sans-serif'; ctx.fillText('ESC for menu', W / 2, H - 30);
      raf.current = requestAnimationFrame(loop);
      return;
    }

    // --- input ---
    const k = keys.current;
    if ((k.has(' ') || k.has('ArrowUp') || k.has('KeyW')) && !g.fall) {
      if (!g.held) {
        g.held = true; g.hold = 0;
        if (g.pvy >= 0) {
          g.pvy = JUMP_VEL;
          play(['jump_lo','jump_mid','jump_hi'][randInt(0,2)]);
        }
      } else {
        g.hold += 16;
        if (g.hold < MAX_HOLD && g.pvy < 0) g.pvy += JUMP_HOLD_VEL;
      }
    } else if (g.held) { g.held = false; g.hold = 0; }

    // --- physics ---
    g.pvy += GRAVITY;
    g.px += g.speed;
    if (g.px > WORLD_W) g.px -= WORLD_W;
    if (g.px < 0) g.px += WORLD_W;

    let landed = false;
    for (const p of g.plats) {
      if (g.px + P_W > p.x && g.px < p.x + p.w && g.pvy >= 0 &&
          g.py + P_H >= p.y && g.py + P_H <= p.y + BLOCK + Math.abs(g.pvy) + 2) {
        g.py = p.y - P_H; g.pvy = 0;
        landed = true; g.fall = false; g.rot = 0;
        if (!p.hit) {
          p.hit = true;
          const now = Date.now();
          if (now - lastCombo.current < COMBO_MS) {
            g.combo++;
            if (g.combo > g.bestC) g.bestC = g.combo;
            if (g.combo === 2) play('good');
            else if (g.combo === 3) play('great');
            else if (g.combo >= 4) play(['good','great','amazing','fantastic','splendid','extreme','super','sweet','wow','yo','cheer'][randInt(0,10)]);
          } else { g.combo = 1; }
          lastCombo.current = now;
          g.flash = 1; play('step');
        }
        break;
      }
    }
    if (!landed && g.pvy > 0) g.fall = true;
    g.py += g.pvy;

    // --- speed ---
    g.speed = Math.min(MAX_SPEED, g.speed + SPEED_RATE);

    // --- camera (lerp to player, with upward bias from speed) ---
    const targetCam = g.py - H * 0.35 - g.speed * 8;
    g.cam += (targetCam - g.cam) * 0.06;

    g.score = Math.max(g.score, -g.cam / 80);

    if (g.flash > 0) g.flash -= 0.04;
    g.ft += g.speed * 0.06;
    if (g.ft > 1) { g.ft = 0; g.frame++; }

    // --- platforms ---
    g.plats = g.plats.filter((p: Plat) => p.y - g.cam < H + 50);
    while (g.plats.length < 14) {
      const last = g.plats[g.plats.length - 1];
      g.plats.push(createPlat(last.y - rand(GAP_MIN, GAP_MAX), last));
    }

    // --- draw ---
    const grad = ctx.createLinearGradient(0, 0, 0, H);
    grad.addColorStop(0, '#0a0a2e'); grad.addColorStop(0.5, '#0f0f23'); grad.addColorStop(1, '#1a0a2e');
    ctx.fillStyle = grad; ctx.fillRect(0, 0, W, H);

    for (let i = 0; i < 25; i++) {
      const sx = (i * 97 + 30) % W;
      const sy = ((i * 137 + 50) % 600) - (g.cam * 0.3) % 600;
      ctx.fillStyle = `rgba(255,255,255,${0.2 + ((i * 7) % 5) * 0.1})`;
      ctx.fillRect(sx, ((sy % 600) + 600) % 600, 1.5, 1.5);
    }

    const s = sprites.current;
    for (const p of g.plats) {
      const sy = p.y - g.cam;
      if (sy < -BLOCK || sy > H + 20) continue;
      for (let i = 0; i < p.w / BLOCK; i++) {
        const bx = p.x + i * BLOCK;
        let img: HTMLImageElement | undefined;
        if (i === 0) img = s['edge1'];
        else if (i === Math.floor(p.w / BLOCK) - 1) img = s['edge2'];
        else img = s['chock'];
        try {
          if (img?.complete && img.naturalWidth > 0) ctx.drawImage(img, bx, sy, BLOCK, BLOCK);
          else { ctx.fillStyle = '#6b21a8'; ctx.fillRect(bx, sy, BLOCK, BLOCK); ctx.strokeStyle = '#7c3aed'; ctx.lineWidth = 1; ctx.strokeRect(bx, sy, BLOCK, BLOCK); }
        } catch { ctx.fillStyle = '#6b21a8'; ctx.fillRect(bx, sy, BLOCK, BLOCK); }
      }
      if (p.x + p.w > WORLD_W) {
        const over = p.x + p.w - WORLD_W;
        for (let i = 0; i < Math.ceil(over / BLOCK); i++) {
          ctx.fillStyle = '#6b21a8'; ctx.fillRect(i * BLOCK, sy, BLOCK, BLOCK); ctx.strokeStyle = '#7c3aed'; ctx.lineWidth = 1; ctx.strokeRect(i * BLOCK, sy, BLOCK, BLOCK);
        }
      }
    }

    // player
    {
      const sy = g.py - g.cam;
      ctx.save(); ctx.translate(g.px + P_W / 2, sy + P_H / 2);
      if (g.fall) { g.rot += 0.15; ctx.rotate(g.rot); }
      else if (g.pvy < -2) ctx.rotate(-0.12);
      const sk = g.fall ? 'rotate' : (g.pvy < -1 ? 'jump' : `walk${(g.frame % 4) + 1}`);
      const img = s[sk] || s['idle1'];
      try { if (img?.complete && img.naturalWidth > 0) ctx.drawImage(img, -P_W / 2, -P_H / 2, P_W, P_H); else { ctx.fillStyle = '#7c3aed'; ctx.fillRect(-P_W/2, -P_H/2, P_W, P_H); ctx.fillStyle='#fff'; ctx.fillRect(-6,-8,4,5); ctx.fillRect(2,-8,4,5); } }
      catch { ctx.fillStyle = '#7c3aed'; ctx.fillRect(-P_W/2, -P_H/2, P_W, P_H); }
      ctx.restore();
      if (g.flash > 0) { ctx.save(); ctx.fillStyle = `rgba(255,255,255,${g.flash * 0.3})`; ctx.fillRect(g.px - 3, sy - 3, P_W + 6, P_H + 6); ctx.restore(); }
    }

    ctx.fillStyle = 'rgba(0,0,0,0.5)'; ctx.fillRect(10, 10, 170, 70);
    ctx.strokeStyle = '#7c3aed'; ctx.lineWidth = 1; ctx.strokeRect(10, 10, 170, 70);
    ctx.fillStyle = '#e5e7eb'; ctx.font = 'bold 14px Inter,sans-serif'; ctx.textAlign = 'left';
    ctx.fillText(`Floor: ${Math.floor(g.score)}`, 20, 30);
    if (g.combo > 1) { ctx.fillStyle = '#fbbf24'; ctx.fillText(`Combo: x${g.combo}`, 20, 50); }
    ctx.fillStyle = '#9ca3af'; ctx.font = '11px Inter,sans-serif'; ctx.fillText(`Speed: ${g.speed.toFixed(1)}`, 20, 68);

    if (g.py - g.cam > H * 0.75) {
      g.state = 'over';
      if (g.score > g.high) { g.high = g.score; setHs(g.score); }
      play('gameover'); stopBGM();
      raf.current = requestAnimationFrame(loop);
      return;
    }

    raf.current = requestAnimationFrame(loop);
  };

  useEffect(() => {
    const c = canvasRef.current;
    if (!c) return;
    window.addEventListener('resize', resize);
    resize();

    const onKey = (e: KeyboardEvent) => {
      if (e.repeat) return;
      keys.current.add(e.code === 'Space' ? ' ' : e.code);
      if (e.code === 'KeyF') { toggleFs(); return; }
      if (g.state === 'menu' && (e.code === 'Space' || e.code === 'Enter')) { e.preventDefault(); resetGame(); startBGM(); }
      else if (g.state === 'over') {
        if (e.code === 'Space' || e.code === 'Enter') { e.preventDefault(); resetGame(); startBGM(); }
        if (e.code === 'Escape') g.state = 'menu';
      }
    };
    const onUp = (e: KeyboardEvent) => keys.current.delete(e.code === 'Space' ? ' ' : e.code);
    const onClick = () => {
      if (g.state === 'menu') { resetGame(); startBGM(); }
      else if (g.state === 'over') { resetGame(); startBGM(); }
    };

    window.addEventListener('keydown', onKey);
    window.addEventListener('keyup', onUp);
    c.addEventListener('click', onClick);
    g.state = 'menu'; g.high = hs;
    raf.current = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf.current);
      window.removeEventListener('resize', resize);
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('keyup', onUp);
      c.removeEventListener('click', onClick);
    };
  }, []);

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <h2 className="text-3xl font-bold text-white mb-2 tracking-tight">Break Time</h2>
        <p className="text-gray-400 text-sm">Climb the Icy Tower. Hold space/click to jump higher. Speed increases as you climb.</p>
      </div>
      <div ref={wrapRef} className="bg-quantum-card/40 rounded-xl border border-gray-800/50 overflow-hidden relative flex items-center justify-center [&:fullscreen]:bg-black [&:fullscreen]:rounded-none [&:fullscreen]:border-0 [&:fullscreen]:w-screen [&:fullscreen]:h-screen">
        <canvas ref={canvasRef} className="w-full cursor-pointer" style={{ imageRendering: 'pixelated', maxWidth: `${WORLD_W}px` }} />
        <button onClick={toggleFs} className="absolute top-3 right-3 z-10 bg-black/50 hover:bg-black/70 text-gray-300 hover:text-white text-xs px-3 py-1.5 rounded transition-colors border border-gray-700/50">{fs ? 'Exit FS' : 'Fullscreen'}</button>
      </div>
      <div className="grid grid-cols-3 gap-3 text-center text-xs">
        <div className="bg-quantum-card/50 rounded-lg p-3 border border-gray-800/40"><span className="text-gray-500 block mb-1">Controls</span><span className="text-gray-300 font-medium">SPACE / Click to Jump</span></div>
        <div className="bg-quantum-card/50 rounded-lg p-3 border border-gray-800/40"><span className="text-gray-500 block mb-1">Tip</span><span className="text-gray-300 font-medium">Hold longer = jump higher</span></div>
        <div className="bg-quantum-card/50 rounded-lg p-3 border border-gray-800/40"><span className="text-gray-500 block mb-1">Speed</span><span className="text-gray-300 font-medium">Camera pushes up as speed climbs!</span></div>
      </div>
    </div>
  );
}
