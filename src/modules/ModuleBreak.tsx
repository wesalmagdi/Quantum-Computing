'use client';

import { useEffect, useRef, useState } from 'react';

const G = 0.45, JV = -11, JH = -0.28;
const BS = 0.3, SR = 0.00025, MS = 10;
const PH = 52, PW = 30, PHit = 14;
const GAP = [70, 110];
const CM = 2000;

function rnd(a: number, b: number) { return Math.random() * (b - a) + a; }
function ri(a: number, b: number) { return Math.floor(rnd(a, b + 1)); }

function mkPlat(y: number, w: number) {
  return { x: 0, y, w, hit: false };
}

function newG(cw: number) {
  const pl: any[] = [];
  for (let i = 0; i < 14; i++) pl.push(mkPlat(-i * rnd(GAP[0], GAP[1]), cw));
  return {
    s: 'menu', px: cw / 2, py: 0, vy: 0, pl, cam: 0, spd: BS,
    scr: 0, co: 0, bc: 0, hi: 0, ww: cw,
    hd: false, fl: false, rot: 0, fr: 0, ft: 0, dir: 1,
  };
}

const SN = ['idle1','idle2','idle3','walk1','walk2','walk3','walk4','jump','rotate'];
const VL = ['good','great','amazing','fantastic','splendid','extreme','super','sweet','wow','yo','cheer'];

function sfx(n: string) { try { const a = new Audio('/icy/' + n + '.ogg'); a.volume = 0.5; a.play(); } catch {} }

export default function Page() {
  const cv = useRef<HTMLCanvasElement>(null);
  const wr = useRef<HTMLDivElement>(null);
  const g = useRef<any>(null);
  const k = useRef<Set<string>>(new Set());
  const im = useRef<Record<string, HTMLImageElement>>({});
  const bg = useRef<HTMLAudioElement | null>(null);
  const lc = useRef(0);
  const ra = useRef(0);
  const [hi, setHi] = useState(0);
  const [fs, setFs] = useState(false);

  useEffect(() => {
    for (const n of SN) { const i = new Image(); i.src = '/icy/' + n + '.bmp'; im.current[n] = i; }
  }, []);

  useEffect(() => {
    const f = () => setFs(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', f);
    return () => document.removeEventListener('fullscreenchange', f);
  }, []);

  function getWW() {
    return document.fullscreenElement ? window.innerWidth : Math.min(700, window.innerWidth - 48);
  }

  function resize() {
    const c = cv.current; if (!c) return;
    c.width = document.fullscreenElement ? window.innerWidth : getWW();
    c.height = document.fullscreenElement ? window.innerHeight : Math.min(600, window.innerHeight - 280);
  }

  function bgm(on: boolean) {
    if (on) {
      if (!bg.current) { bg.current = new Audio('/icy/bg_beat.ogg'); bg.current.loop = true; bg.current.volume = 0.3; }
      bg.current.currentTime = 0; bg.current.play();
    } else { bg.current?.pause(); }
  }

  function reset() {
    if (!g.current) return;
    const cw = getWW();
    const n = newG(cw); n.hi = g.current.hi;
    Object.assign(g.current, n);
    g.current.s = 'play'; g.current.dir = 1;
    const p = g.current.pl[0];
    if (p) { g.current.px = g.current.ww / 2 - PW / 2; g.current.py = p.y - PH; }
  }

  useEffect(() => {
    const c = cv.current; if (!c) return;
    window.addEventListener('resize', resize); resize();

    g.current = newG(getWW());
    g.current.s = 'menu'; g.current.hi = hi;

    function dk(e: KeyboardEvent) {
      if (e.repeat) return;
      k.current.add(e.code === 'Space' ? ' ' : e.code);
      if (e.code === 'KeyF') { const el = wr.current; if (el) { document.fullscreenElement ? document.exitFullscreen() : el.requestFullscreen(); } return; }
      if (g.current.s === 'menu' && (e.code === 'Space' || e.code === 'Enter')) { e.preventDefault(); reset(); bgm(true); }
      else if (g.current.s === 'over') {
        if (e.code === 'Space' || e.code === 'Enter') { e.preventDefault(); reset(); bgm(true); }
        if (e.code === 'Escape') g.current.s = 'menu';
      }
    }
    function uk(e: KeyboardEvent) { k.current.delete(e.code === 'Space' ? ' ' : e.code); }

    function cl() {
      if (g.current.s === 'menu') { reset(); bgm(true); }
      else if (g.current.s === 'over') { reset(); bgm(true); }
      else if (g.current.s === 'play' && !g.current.fl) {
        g.current.hd = true;
        if (g.current.vy >= 0) { g.current.vy = JV; sfx(['jump_lo','jump_mid','jump_hi'][ri(0,2)]); }
      }
    }

    window.addEventListener('keydown', dk);
    window.addEventListener('keyup', uk);
    c.addEventListener('click', cl);

    function loop() {
      try {
        const cv2 = cv.current; if (!cv2) { ra.current = requestAnimationFrame(loop); return; }
        const x = cv2.getContext('2d'); if (!x) { ra.current = requestAnimationFrame(loop); return; }
        const W = cv2.width, H = cv2.height, t = g.current;

        if (t.ww !== W) {
          const ratio = W / t.ww;
          t.ww = W; t.px *= ratio;
          for (const p of t.pl) { p.x *= ratio; p.w *= ratio; }
        }

        x.fillStyle = '#0a0a1a'; x.fillRect(0, 0, W, H);
        x.textAlign = 'center';

        if (t.s === 'menu') {
          x.fillStyle = '#7c3aed'; x.font = 'bold 38px Inter,sans-serif'; x.fillText('Icy Tower', W / 2, H / 2 - 90);
          x.fillStyle = '#9ca3af'; x.font = '15px Inter,sans-serif'; x.fillText('Take a break from quantum!', W / 2, H / 2 - 45);
          x.fillStyle = '#c084fc'; x.font = '17px Inter,sans-serif'; x.fillText('SPACE or Click to Start', W / 2, H / 2 + 10);
          x.fillStyle = '#6b7280'; x.font = '12px Inter,sans-serif'; x.fillText('Hold longer = higher jump', W / 2, H / 2 + 50);
          if (t.hi > 0) { x.fillStyle = '#fbbf24'; x.font = '14px Inter,sans-serif'; x.fillText('Best: ' + Math.floor(t.hi) + ' floors', W / 2, H / 2 + 80); }
          ra.current = requestAnimationFrame(loop); return;
        }

        if (t.s === 'over') {
          x.fillStyle = '#ef4444'; x.font = 'bold 34px Inter,sans-serif'; x.fillText('Game Over', W / 2, H / 2 - 80);
          x.fillStyle = '#e5e7eb'; x.font = '19px Inter,sans-serif'; x.fillText('Height: ' + Math.floor(t.scr) + ' floors', W / 2, H / 2 - 35);
          if (t.bc > 1) { x.fillStyle = '#fbbf24'; x.font = '15px Inter,sans-serif'; x.fillText('Best Combo: x' + t.bc, W / 2, H / 2 + 5); }
          x.fillStyle = '#9ca3af'; x.font = '14px Inter,sans-serif'; x.fillText('High Score: ' + Math.floor(t.hi) + ' floors', W / 2, H / 2 + 40);
          x.fillStyle = '#c084fc'; x.font = '16px Inter,sans-serif'; x.fillText('SPACE or Click to Retry', W / 2, H / 2 + 90);
          x.fillStyle = '#6b7280'; x.font = '11px Inter,sans-serif'; x.fillText('ESC for menu', W / 2, H - 30);
          ra.current = requestAnimationFrame(loop); return;
        }

        // --- gradual speed ---
        t.spd = Math.min(MS, t.spd + SR);

        // input: character stands still until moved
        const ks = k.current;
        let dx = 0;
        if (ks.has('ArrowLeft') || ks.has('KeyA')) { dx = -t.spd * 0.7; t.dir = -1; }
        else if (ks.has('ArrowRight') || ks.has('KeyD')) { dx = t.spd * 0.7; t.dir = 1; }
        else t.dir = 1;

        if ((ks.has(' ') || ks.has('ArrowUp') || ks.has('KeyW')) && !t.fl) {
          if (!t.hd) { t.hd = true; if (t.vy >= 0) { t.vy = JV; sfx(['jump_lo','jump_mid','jump_hi'][ri(0,2)]); } }
          else if (t.vy < 0) t.vy += JH;
        } else { t.hd = false; }

        t.vy += G; t.px += dx;
        if (t.px < 0) t.px = 0;
        if (t.px > t.ww - PW) t.px = t.ww - PW;

        let ld = false;
        for (const p of t.pl) {
          if (t.vy >= 0 && t.py + PH >= p.y && t.py + PH <= p.y + PHit + Math.abs(t.vy) + 2) {
            t.py = p.y - PH; t.vy = 0; ld = true; t.fl = false; t.rot = 0;
            if (!p.hit) {
              p.hit = true;
              const nw = Date.now();
              if (nw - lc.current < CM) {
                t.co++; if (t.co > t.bc) t.bc = t.co;
                if (t.co === 2) sfx('good'); else if (t.co === 3) sfx('great'); else if (t.co >= 4) sfx(VL[ri(0, VL.length - 1)]);
              } else t.co = 1;
              lc.current = nw;
            }
            break;
          }
        }
        if (!ld && t.vy > 0) t.fl = true;
        t.py += t.vy;

        // camera: follows player up + auto-scroll drift
        const targetCam = t.py - H * 0.3;
        t.cam += (targetCam - t.cam) * 0.08 + t.spd * 0.3;

        t.scr = Math.max(t.scr, t.cam / 80);
        t.ft += t.spd * 0.06; if (t.ft > 1) { t.ft = 0; t.fr++; }

        t.pl = t.pl.filter((p: any) => p.y - t.cam < H + 50);
        while (t.pl.length < 14) {
          const l = t.pl[t.pl.length - 1];
          t.pl.push(mkPlat(l.y - rnd(GAP[0], GAP[1]), t.ww));
        }

        const gr = x.createLinearGradient(0, 0, 0, H);
        gr.addColorStop(0, '#0a0a2e'); gr.addColorStop(0.5, '#0f0f23'); gr.addColorStop(1, '#1a0a2e');
        x.fillStyle = gr; x.fillRect(0, 0, W, H);

        for (let i = 0; i < 25; i++) {
          x.fillStyle = 'rgba(255,255,255,' + (0.2 + ((i * 7) % 5) * 0.1) + ')';
          x.fillRect((i * 97 + 30) % W, ((((i * 137 + 50) % 600) - (t.cam * 0.5) % 600) % 600 + 600) % 600, 1.5, 1.5);
        }

        for (const p of t.pl) {
          const sy = p.y - t.cam;
          if (sy < -20 || sy > H + 20) continue;
          x.fillStyle = '#6d28d9'; x.fillRect(0, sy, t.ww, PHit);
          x.fillStyle = '#8b5cf6'; x.fillRect(0, sy, t.ww, 3);
          x.fillStyle = '#4c1d95';
          for (let j = 0; j < t.ww; j += 10) x.fillRect(j, sy + PHit - 1, 5, 1);
        }

        {
          const sy = t.py - t.cam;
          x.save(); x.translate(t.px + PW / 2, sy + PH / 2);
          if (t.dir < 0) x.scale(-1, 1);
          if (t.fl) { t.rot += 0.15; x.rotate(t.rot); } else if (t.vy < -2) x.rotate(-0.1);
          const sk = t.fl ? 'rotate' : (t.vy < -1 ? 'jump' : 'walk' + ((t.fr % 4) + 1));
          const img = im.current[sk] || im.current['idle1'];
          try { if (img?.complete && img.naturalWidth > 0) x.drawImage(img, -PW/2, -PH/2, PW, PH); else { x.fillStyle='#7c3aed'; x.fillRect(-PW/2, -PH/2, PW, PH); } }
          catch { x.fillStyle='#7c3aed'; x.fillRect(-PW/2, -PH/2, PW, PH); }
          x.restore();
        }

        x.fillStyle = 'rgba(0,0,0,0.5)'; x.fillRect(10, 10, 170, 60);
        x.strokeStyle = '#7c3aed'; x.lineWidth = 1; x.strokeRect(10, 10, 170, 60);
        x.fillStyle = '#e5e7eb'; x.font = 'bold 14px Inter,sans-serif'; x.textAlign = 'left';
        x.fillText('Floor: ' + Math.floor(t.scr), 20, 30);
        if (t.co > 1) { x.fillStyle = '#fbbf24'; x.fillText('Combo: x' + t.co, 20, 50); }
        x.fillStyle = '#9ca3af'; x.font = '10px Inter,sans-serif'; x.textAlign = 'right';
        x.fillText('Arrows:move  F:FS', W - 10, 22);

        if (t.py - t.cam > H * 0.8) {
          t.s = 'over';
          if (t.scr > t.hi) { t.hi = t.scr; setHi(t.scr); }
          sfx('gameover'); bgm(false);
          ra.current = requestAnimationFrame(loop); return;
        }

        ra.current = requestAnimationFrame(loop);
      } catch (e) { console.error('[ICY]', e); ra.current = requestAnimationFrame(loop); }
    }

    ra.current = requestAnimationFrame(loop);
    return () => { cancelAnimationFrame(ra.current); window.removeEventListener('resize', resize); window.removeEventListener('keydown', dk); window.removeEventListener('keyup', uk); c.removeEventListener('click', cl); };
  }, []);

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div><h2 className="text-3xl font-bold text-white mb-2 tracking-tight">Break Time</h2><p className="text-gray-400 text-sm">Climb the tower. Arrows to move, Space/Click to jump. Speed grows gradually.</p></div>
      <div ref={wr} className="bg-quantum-card/40 rounded-xl border border-gray-800/50 overflow-hidden relative flex items-center justify-center [&:fullscreen]:bg-black [&:fullscreen]:rounded-none [&:fullscreen]:border-0 [&:fullscreen]:w-screen [&:fullscreen]:h-screen">
        <canvas ref={cv} className="w-full cursor-pointer" style={{ imageRendering: 'pixelated' }} />
        <button onClick={() => { const el = wr.current; if (el) { document.fullscreenElement ? document.exitFullscreen() : el.requestFullscreen(); } }} className="absolute top-3 right-3 z-10 bg-black/50 hover:bg-black/70 text-gray-300 hover:text-white text-xs px-3 py-1.5 rounded transition-colors border border-gray-700/50">{fs ? 'Exit' : 'FS'}</button>
      </div>
      <div className="grid grid-cols-3 gap-3 text-center text-xs">
        <div className="bg-quantum-card/50 rounded-lg p-3 border border-gray-800/40"><span className="text-gray-500 block mb-1">Jump</span><span className="text-gray-300 font-medium">SPACE / Click</span></div>
        <div className="bg-quantum-card/50 rounded-lg p-3 border border-gray-800/40"><span className="text-gray-500 block mb-1">Move</span><span className="text-gray-300 font-medium">Left / Right arrows</span></div>
        <div className="bg-quantum-card/50 rounded-lg p-3 border border-gray-800/40"><span className="text-gray-500 block mb-1">Difficulty</span><span className="text-gray-300 font-medium">Gradually increases</span></div>
      </div>
    </div>
  );
}
