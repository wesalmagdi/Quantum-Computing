'use client';

import { useEffect, useRef, useState } from 'react';

const G = 0.5, JV = -11, JH = -0.25, MH = 350;
const BS = 2, SR = 0.0003, MS = 12;
const WW = 600, B = 28, PW = 24, PH = 44;
const GAP = [70, 100];
const CM = 2000;

function rnd(a: number, b: number) { return Math.random() * (b - a) + a; }
function ri(a: number, b: number) { return Math.floor(rnd(a, b + 1)); }

function mkPlat(y: number, prev?: { x: number; w: number }) {
  let w = ri(4, 9) * B;
  let x = prev ? Math.max(0, Math.min(prev.x + rnd(-90, 90), WW - w)) : rnd(0, WW - w);
  return { x, y, w, hit: false };
}

function newG() {
  const pl: any[] = [];
  for (let i = 0; i < 10; i++) pl.push(mkPlat(-i * rnd(GAP[0], GAP[1])));
  return { s: 'menu', px: WW / 2, py: 0, vy: 0, pl, cam: 0, spd: BS, scr: 0, co: 0, bc: 0, hi: 0, hd: false, fl: false, rot: 0, fs: 0, fr: 0, ft: 0 };
}

const SN = ['idle1','idle2','idle3','walk1','walk2','walk3','walk4','jump','rotate','chock','edge1','edge2'];
const VL = ['good','great','amazing','fantastic','splendid','extreme','super','sweet','wow','yo','cheer'];

function sfx(n: string) { try { const a = new Audio('/icy/' + n + '.ogg'); a.volume = 0.5; a.play(); } catch {} }

export default function Page() {
  const cv = useRef<HTMLCanvasElement>(null);
  const wr = useRef<HTMLDivElement>(null);
  const g = useRef<any>(newG());
  const k = useRef<Set<string>>(new Set());
  const im = useRef<Record<string, HTMLImageElement>>({});
  const bg = useRef<HTMLAudioElement | null>(null);
  const lc = useRef(0);
  const ra = useRef(0);
  const [hi, setHi] = useState(0);
  const [fs, setFs] = useState(false);

  useEffect(() => { for (const n of SN) { const i = new Image(); i.src = '/icy/' + n + '.png'; im.current[n] = i; } }, []);
  useEffect(() => { const f = () => setFs(!!document.fullscreenElement); document.addEventListener('fullscreenchange', f); return () => document.removeEventListener('fullscreenchange', f); }, []);

  const resize = () => {
    const c = cv.current; if (!c) return;
    c.width = document.fullscreenElement ? window.innerWidth : Math.min(WW, window.innerWidth - 48);
    c.height = document.fullscreenElement ? window.innerHeight : Math.min(600, window.innerHeight - 280);
  };

  const bgm = (on: boolean) => {
    if (on) {
      if (!bg.current) { bg.current = new Audio('/icy/bg_beat.ogg'); bg.current.loop = true; bg.current.volume = 0.3; }
      bg.current.currentTime = 0; bg.current.play();
    } else { bg.current?.pause(); }
  };

  const reset = () => {
    const n = newG(); n.hi = g.current.hi; Object.assign(g.current, n);
    const p = g.current.pl[0]; g.current.px = p.x + p.w / 2 - PW / 2; g.current.py = p.y - PH;
    g.current.s = 'play';
  };

  const loop = () => {
    const c = cv.current; if (!c) return;
    const x = c.getContext('2d'); if (!x) return;
    const W = c.width, H = c.height, t = g.current;

    x.fillStyle = '#0a0a1a'; x.fillRect(0, 0, W, H);
    x.textAlign = 'center';

    if (t.s === 'menu') {
      x.fillStyle = '#7c3aed'; x.font = 'bold 38px Inter,sans-serif'; x.fillText('Icy Tower', W / 2, H / 2 - 90);
      x.fillStyle = '#9ca3af'; x.font = '15px Inter,sans-serif'; x.fillText('Take a break from quantum!', W / 2, H / 2 - 45);
      x.fillStyle = '#c084fc'; x.font = '17px Inter,sans-serif'; x.fillText('SPACE or Click to Start', W / 2, H / 2 + 10);
      x.fillStyle = '#6b7280'; x.font = '12px Inter,sans-serif'; x.fillText('Hold SPACE/Click longer = higher jump', W / 2, H / 2 + 50);
      x.fillStyle = '#4b5563'; x.font = '11px Inter,sans-serif'; x.fillText('F for fullscreen', W / 2, H / 2 + 80);
      if (t.hi > 0) { x.fillStyle = '#fbbf24'; x.font = '14px Inter,sans-serif'; x.fillText('Best: ' + Math.floor(t.hi) + ' floors', W / 2, H / 2 + 115); }
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

    // --- play ---
    const ks = k.current;
    if ((ks.has(' ') || ks.has('ArrowUp') || ks.has('KeyW')) && !t.fl) {
      if (!t.hd) {
        t.hd = true;
        if (t.vy >= 0) { t.vy = JV; sfx(['jump_lo','jump_mid','jump_hi'][ri(0,2)]); }
      } else {
        if (t.vy < 0) t.vy += JH;
      }
    } else { t.hd = false; }

    t.vy += G; t.px += t.spd;
    if (t.px > WW) t.px -= WW;
    if (t.px < 0) t.px += WW;

    let ld = false;
    for (const p of t.pl) {
      if (t.px + PW > p.x && t.px < p.x + p.w && t.vy >= 0 && t.py + PH >= p.y && t.py + PH <= p.y + B + Math.abs(t.vy) + 2) {
        t.py = p.y - PH; t.vy = 0; ld = true; t.fl = false; t.rot = 0;
        if (!p.hit) {
          p.hit = true;
          const nw = Date.now();
          if (nw - lc.current < CM) {
            t.co++; if (t.co > t.bc) t.bc = t.co;
            if (t.co === 2) sfx('good'); else if (t.co === 3) sfx('great'); else if (t.co >= 4) sfx(VL[ri(0, VL.length - 1)]);
          } else t.co = 1;
          lc.current = nw; t.fs = 1; sfx('step');
        }
        break;
      }
    }
    if (!ld && t.vy > 0) t.fl = true;
    t.py += t.vy;

    t.spd = Math.min(MS, t.spd + SR);
    const tc = t.py - H * 0.35 - t.spd * 8;
    t.cam += (tc - t.cam) * 0.06;
    t.scr = Math.max(t.scr, -t.cam / 80);
    if (t.fs > 0) t.fs -= 0.04;
    t.ft += t.spd * 0.06; if (t.ft > 1) { t.ft = 0; t.fr++; }

    t.pl = t.pl.filter((p: any) => p.y - t.cam < H + 50);
    while (t.pl.length < 14) {
      const l = t.pl[t.pl.length - 1];
      t.pl.push(mkPlat(l.y - rnd(GAP[0], GAP[1]), l));
    }

    const gr = x.createLinearGradient(0, 0, 0, H);
    gr.addColorStop(0, '#0a0a2e'); gr.addColorStop(0.5, '#0f0f23'); gr.addColorStop(1, '#1a0a2e');
    x.fillStyle = gr; x.fillRect(0, 0, W, H);

    for (let i = 0; i < 25; i++) {
      x.fillStyle = 'rgba(255,255,255,' + (0.2 + ((i * 7) % 5) * 0.1) + ')';
      x.fillRect((i * 97 + 30) % W, ((((i * 137 + 50) % 600) - (t.cam * 0.3) % 600) % 600 + 600) % 600, 1.5, 1.5);
    }

    const sp = im.current;
    for (const p of t.pl) {
      const sy = p.y - t.cam;
      if (sy < -B || sy > H + 20) continue;
      for (let i = 0; i < p.w / B; i++) {
        const bx = p.x + i * B;
        let img = i === 0 ? sp['edge1'] : (i === Math.floor(p.w / B) - 1 ? sp['edge2'] : sp['chock']);
        try {
          if (img?.complete && img.naturalWidth > 0) x.drawImage(img, bx, sy, B, B);
          else { x.fillStyle = '#6b21a8'; x.fillRect(bx, sy, B, B); x.strokeStyle = '#7c3aed'; x.lineWidth = 1; x.strokeRect(bx, sy, B, B); }
        } catch { x.fillStyle = '#6b21a8'; x.fillRect(bx, sy, B, B); }
      }
      if (p.x + p.w > WW) for (let i = 0; i < Math.ceil((p.x + p.w - WW) / B); i++) { x.fillStyle = '#6b21a8'; x.fillRect(i * B, sy, B, B); x.strokeStyle = '#7c3aed'; x.lineWidth = 1; x.strokeRect(i * B, sy, B, B); }
    }

    const sy = t.py - t.cam;
    x.save(); x.translate(t.px + PW / 2, sy + PH / 2);
    if (t.fl) { t.rot += 0.15; x.rotate(t.rot); } else if (t.vy < -2) x.rotate(-0.12);
    const sk = t.fl ? 'rotate' : (t.vy < -1 ? 'jump' : 'walk' + ((t.fr % 4) + 1));
    const img = sp[sk] || sp['idle1'];
    try { if (img?.complete && img.naturalWidth > 0) x.drawImage(img, -PW / 2, -PH / 2, PW, PH); else { x.fillStyle = '#7c3aed'; x.fillRect(-PW/2, -PH/2, PW, PH); x.fillStyle='#fff'; x.fillRect(-6,-8,4,5); x.fillRect(2,-8,4,5); } }
    catch { x.fillStyle = '#7c3aed'; x.fillRect(-PW/2, -PH/2, PW, PH); }
    x.restore();
    if (t.fs > 0) { x.save(); x.fillStyle = 'rgba(255,255,255,' + (t.fs * 0.3) + ')'; x.fillRect(t.px - 3, sy - 3, PW + 6, PH + 6); x.restore(); }

    x.fillStyle = 'rgba(0,0,0,0.5)'; x.fillRect(10, 10, 170, 70);
    x.strokeStyle = '#7c3aed'; x.lineWidth = 1; x.strokeRect(10, 10, 170, 70);
    x.fillStyle = '#e5e7eb'; x.font = 'bold 14px Inter,sans-serif'; x.textAlign = 'left';
    x.fillText('Floor: ' + Math.floor(t.scr), 20, 30);
    if (t.co > 1) { x.fillStyle = '#fbbf24'; x.fillText('Combo: x' + t.co, 20, 50); }
    x.fillStyle = '#9ca3af'; x.font = '11px Inter,sans-serif'; x.fillText('Speed: ' + t.spd.toFixed(1), 20, 68);

    if (t.py - t.cam > H * 0.75) {
      t.s = 'over';
      if (t.scr > t.hi) { t.hi = t.scr; setHi(t.scr); }
      sfx('gameover'); bgm(false);
      ra.current = requestAnimationFrame(loop); return;
    }

    ra.current = requestAnimationFrame(loop);
  };

  useEffect(() => {
    const c = cv.current; if (!c) return;
    window.addEventListener('resize', resize); resize();

    const dk = (e: KeyboardEvent) => {
      if (e.repeat) return;
      k.current.add(e.code === 'Space' ? ' ' : e.code);
      if (e.code === 'KeyF') { const el = wr.current; if (el) { document.fullscreenElement ? document.exitFullscreen() : el.requestFullscreen(); } return; }
      const t = g.current;
      if (t.s === 'menu' && (e.code === 'Space' || e.code === 'Enter')) { e.preventDefault(); reset(); bgm(true); }
      else if (t.s === 'over') {
        if (e.code === 'Space' || e.code === 'Enter') { e.preventDefault(); reset(); bgm(true); }
        if (e.code === 'Escape') t.s = 'menu';
      }
    };
    const uk = (e: KeyboardEvent) => k.current.delete(e.code === 'Space' ? ' ' : e.code);
    const cl = () => {
      const t = g.current;
      if (t.s === 'menu') { reset(); bgm(true); }
      else if (t.s === 'over') { reset(); bgm(true); }
      else if (t.s === 'play' && !t.fl) { t.hd = true; if (t.vy >= 0) { t.vy = JV; sfx(['jump_lo','jump_mid','jump_hi'][ri(0,2)]); } }
    };

    window.addEventListener('keydown', dk);
    window.addEventListener('keyup', uk);
    c.addEventListener('click', cl);

    g.current.s = 'menu'; g.current.hi = hi;
    ra.current = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(ra.current);
      window.removeEventListener('resize', resize);
      window.removeEventListener('keydown', dk);
      window.removeEventListener('keyup', uk);
      c.removeEventListener('click', cl);
    };
  }, []);

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div><h2 className="text-3xl font-bold text-white mb-2 tracking-tight">Break Time</h2><p className="text-gray-400 text-sm">Climb the Icy Tower. Hold space/click to jump higher. Speed increases as you climb.</p></div>
      <div ref={wr} className="bg-quantum-card/40 rounded-xl border border-gray-800/50 overflow-hidden relative flex items-center justify-center [&:fullscreen]:bg-black [&:fullscreen]:rounded-none [&:fullscreen]:border-0 [&:fullscreen]:w-screen [&:fullscreen]:h-screen">
        <canvas ref={cv} className="w-full cursor-pointer" style={{ imageRendering: 'pixelated', maxWidth: WW + 'px' }} />
        <button onClick={() => { const el = wr.current; if (el) { document.fullscreenElement ? document.exitFullscreen() : el.requestFullscreen(); } }} className="absolute top-3 right-3 z-10 bg-black/50 hover:bg-black/70 text-gray-300 hover:text-white text-xs px-3 py-1.5 rounded transition-colors border border-gray-700/50">{fs ? 'Exit FS' : 'Fullscreen'}</button>
      </div>
      <div className="grid grid-cols-3 gap-3 text-center text-xs">
        <div className="bg-quantum-card/50 rounded-lg p-3 border border-gray-800/40"><span className="text-gray-500 block mb-1">Controls</span><span className="text-gray-300 font-medium">SPACE / Click to Jump</span></div>
        <div className="bg-quantum-card/50 rounded-lg p-3 border border-gray-800/40"><span className="text-gray-500 block mb-1">Tip</span><span className="text-gray-300 font-medium">Hold longer = jump higher</span></div>
        <div className="bg-quantum-card/50 rounded-lg p-3 border border-gray-800/40"><span className="text-gray-500 block mb-1">Speed</span><span className="text-gray-300 font-medium">Camera pushes up as speed climbs!</span></div>
      </div>
    </div>
  );
}
