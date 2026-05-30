'use client';

import { useEffect, useRef, useState, useCallback } from 'react';

const GRAVITY = 0.45;
const JUMP_FORCE = -9;
const MAX_JUMP_HOLD = 300;
const JUMP_HOLD_BOOST = -0.035;
const BASE_SPEED = 2;
const SPEED_INCREMENT = 0.0003;
const MAX_SPEED = 14;
const WRAP_AROUND = 640;
const PLATFORM_GAP_MIN = 55;
const PLATFORM_GAP_MAX = 90;
const BLOCK_W = 30;
const BLOCK_H = 30;
const PLATFORM_SPACING = 48;
const COMBO_TIMEOUT = 2000;

function rand(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

function randInt(min: number, max: number) {
  return Math.floor(rand(min, max + 1));
}

interface Platform {
  x: number;
  y: number;
  blocks: number;
  scored: boolean;
}

interface GameState {
  state: 'menu' | 'playing' | 'gameover';
  player: { x: number; y: number; vy: number; w: number; h: number };
  platforms: Platform[];
  cameraY: number;
  speed: number;
  score: number;
  combo: number;
  bestCombo: number;
  highScore: number;
  jumpHold: number;
  jumpHeld: boolean;
  animFrame: number;
  animTimer: number;
  falling: boolean;
  rotate: number;
  landingFlash: number;
  floorCount: number;
}

const INITIAL: GameState = {
  state: 'menu',
  player: { x: 300, y: 0, vy: 0, w: 30, h: 52 },
  platforms: [],
  cameraY: 0,
  speed: BASE_SPEED,
  score: 0,
  combo: 0,
  bestCombo: 0,
  highScore: 0,
  jumpHold: 0,
  jumpHeld: false,
  animFrame: 0,
  animTimer: 0,
  falling: false,
  rotate: 0,
  landingFlash: 0,
  floorCount: 0,
};

const VOICE_LINES = [
  'good', 'great', 'amazing', 'fantastic', 'splendid',
  'extreme', 'super', 'sweet', 'wow', 'wazup', 'yo',
  'unbelievable', 'cheer', 'aight',
];

function playSound(name: string) {
  try {
    const a = new Audio(`/icy/${name}.ogg`);
    a.volume = 0.5;
    a.play();
  } catch {}
}

export default function ModuleBreak() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gameRef = useRef<GameState>(INITIAL);
  const keysRef = useRef<Set<string>>(new Set());
  const spritesRef = useRef<Record<string, HTMLImageElement>>({});
  const bgmRef = useRef<HTMLAudioElement | null>(null);
  const lastComboRef = useRef(0);
  const [hs, setHs] = useState(0);
  const loadedRef = useRef(false);

  useEffect(() => {
    const names = [
      'idle1', 'idle2', 'idle3',
      'walk1', 'walk2', 'walk3', 'walk4',
      'jump', 'jump1', 'jump2', 'jump3',
      'rotate', 'chock', 'edge1', 'edge2',
    ];
    let loaded = 0;
    const imgs: Record<string, HTMLImageElement> = {};
    names.forEach((n) => {
      const img = new Image();
      img.onload = () => {
        loaded++;
        if (loaded === names.length) loadedRef.current = true;
      };
      img.onerror = () => {
        loaded++;
        if (loaded === names.length) loadedRef.current = true;
      };
      img.src = `/icy/${n}.png`;
      imgs[n] = img;
    });
    spritesRef.current = imgs;
  }, []);

  const startBGM = useCallback(() => {
    if (!bgmRef.current) {
      bgmRef.current = new Audio('/icy/bg_beat.ogg');
      bgmRef.current.loop = true;
      bgmRef.current.volume = 0.3;
    }
    bgmRef.current.currentTime = 0;
    bgmRef.current.play();
  }, []);

  const stopBGM = useCallback(() => {
    bgmRef.current?.pause();
  }, []);

  const resetGame = useCallback(() => {
    const g = gameRef.current;
    g.state = 'playing';
    g.player.x = 300;
    g.player.y = -100;
    g.player.vy = 0;
    g.cameraY = 0;
    g.speed = BASE_SPEED;
    g.score = 0;
    g.combo = 0;
    g.jumpHold = 0;
    g.jumpHeld = false;
    g.falling = false;
    g.rotate = 0;
    g.landingFlash = 0;
    g.floorCount = 0;
    g.animFrame = 0;
    g.animTimer = 0;
    g.platforms = [];

    for (let i = 0; i < 8; i++) {
      const y = -i * PLATFORM_SPACING;
      g.platforms.push({
        x: rand(0, WRAP_AROUND - 200),
        y,
        blocks: randInt(4, 10),
        scored: false,
      });
    }
    g.player.y = g.platforms[0].y - BLOCK_H - 10;
    g.player.x = g.platforms[0].x + 20;
  }, []);

  const getSprite = useCallback((state: string) => {
    const s = spritesRef.current;
    if (state === 'falling') return s['rotate'] || s['idle1'];
    if (state === 'jumping') return s['jump'] || s['idle1'];
    const g = gameRef.current;
    const frame = g.animFrame;
    if (state === 'walking') {
      const w = s[`walk${(frame % 4) + 1}`] || s['walk1'];
      return w;
    }
    return s[`idle${frame % 3 + 1}`] || s['idle1'];
  }, []);

  const drawPlayer = useCallback((ctx: CanvasRenderingContext2D, g: GameState) => {
    const p = g.player;
    const screenY = p.y - g.cameraY;
    const sprite = getSprite(g.falling ? 'falling' : (p.vy < -1 ? 'jumping' : 'walking'));
    ctx.save();
    ctx.translate(p.x + p.w / 2, screenY + p.h / 2);

    if (g.falling) {
      g.rotate += 0.15;
      ctx.rotate(g.rotate);
    } else if (p.vy < -2) {
      ctx.rotate(-0.15);
    }

    try {
      if (sprite && sprite.complete && sprite.naturalWidth > 0) {
        ctx.drawImage(sprite, -p.w / 2, -p.h / 2, p.w, p.h);
      } else {
        ctx.fillStyle = '#7c3aed';
        ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        ctx.fillStyle = '#fff';
        ctx.fillRect(-8, -8, 4, 6);
        ctx.fillRect(4, -8, 4, 6);
      }
    } catch {
      ctx.fillStyle = '#7c3aed';
      ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
    }

    ctx.restore();

    if (g.landingFlash > 0) {
      ctx.save();
      ctx.fillStyle = `rgba(255,255,255,${g.landingFlash * 0.3})`;
      ctx.fillRect(p.x - 5, screenY - 5, p.w + 10, p.h + 10);
      ctx.restore();
    }
  }, [getSprite]);

  const drawPlatform = useCallback((ctx: CanvasRenderingContext2D, plat: Platform, cameraY: number) => {
    const screenY = plat.y - cameraY;
    const s = spritesRef.current;
    const edgeL = s['edge1'];
    const edgeR = s['edge2'];
    const block = s['chock'];

    for (let i = 0; i < plat.blocks; i++) {
      const bx = plat.x + i * BLOCK_W;
      let img: HTMLImageElement | undefined;
      if (i === 0) img = edgeL;
      else if (i === plat.blocks - 1) img = edgeR;
      else img = block;

      try {
        if (img && img.complete && img.naturalWidth > 0) {
          ctx.drawImage(img, bx, screenY, BLOCK_W, BLOCK_H);
        } else {
          ctx.fillStyle = '#6b21a8';
          ctx.fillRect(bx, screenY, BLOCK_W, BLOCK_H);
          ctx.strokeStyle = '#7c3aed';
          ctx.lineWidth = 1;
          ctx.strokeRect(bx, screenY, BLOCK_W, BLOCK_H);
        }
      } catch {
        ctx.fillStyle = '#6b21a8';
        ctx.fillRect(bx, screenY, BLOCK_W, BLOCK_H);
      }
    }
  }, []);

  const generatePlatform = useCallback((g: GameState) => {
    const lastY = g.platforms.length > 0 ? g.platforms[g.platforms.length - 1].y : 0;
    const gap = rand(PLATFORM_GAP_MIN, PLATFORM_GAP_MAX);
    const y = lastY - gap;
    const blocks = randInt(3, 10);
    let x = rand(0, WRAP_AROUND - blocks * BLOCK_W);

    if (g.platforms.length > 0) {
      const prev = g.platforms[g.platforms.length - 1];
      const prevRight = prev.x + prev.blocks * BLOCK_W;
      const overlap = (x < prevRight + 60 && x + blocks * BLOCK_W > prev.x - 60);
      if (overlap) {
        if (Math.random() > 0.5) x = prev.x + prev.blocks * BLOCK_W + rand(20, 80);
        else x = prev.x - blocks * BLOCK_W - rand(20, 80);
      }
    }
    x = Math.max(0, Math.min(x, WRAP_AROUND - blocks * BLOCK_W));

    g.platforms.push({ x, y, blocks, scored: false });
  }, []);

  const gameLoop = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const g = gameRef.current;

    const W = canvas.width;
    const H = canvas.height;

    if (g.state === 'menu') {
      ctx.fillStyle = '#0a0a1a';
      ctx.fillRect(0, 0, W, H);

      ctx.fillStyle = '#7c3aed';
      ctx.font = 'bold 40px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('Icy Tower', W / 2, H / 2 - 80);

      ctx.fillStyle = '#9ca3af';
      ctx.font = '16px Inter, sans-serif';
      ctx.fillText('Take a break from quantum!', W / 2, H / 2 - 30);

      ctx.fillStyle = '#c084fc';
      ctx.font = '18px Inter, sans-serif';
      ctx.fillText('Press SPACE or Click to Start', W / 2, H / 2 + 30);

      if (g.highScore > 0) {
        ctx.fillStyle = '#fbbf24';
        ctx.font = '14px Inter, sans-serif';
        ctx.fillText(`Best: ${Math.floor(g.highScore)} floors`, W / 2, H / 2 + 70);
      }

      ctx.fillStyle = '#6b7280';
      ctx.font = '12px Inter, sans-serif';
      ctx.fillText('Hold SPACE/Click longer = higher jump', W / 2, H - 40);
      return;
    }

    if (g.state === 'gameover') {
      ctx.fillStyle = '#0a0a1a';
      ctx.fillRect(0, 0, W, H);

      ctx.fillStyle = '#ef4444';
      ctx.font = 'bold 36px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('Game Over', W / 2, H / 2 - 80);

      ctx.fillStyle = '#e5e7eb';
      ctx.font = '20px Inter, sans-serif';
      ctx.fillText(`Height: ${Math.floor(g.score)} floors`, W / 2, H / 2 - 25);

      if (g.bestCombo > 1) {
        ctx.fillStyle = '#fbbf24';
        ctx.font = '16px Inter, sans-serif';
        ctx.fillText(`Best Combo: x${g.bestCombo}`, W / 2, H / 2 + 15);
      }

      ctx.fillStyle = '#9ca3af';
      ctx.font = '14px Inter, sans-serif';
      ctx.fillText(`High Score: ${Math.floor(g.highScore)} floors`, W / 2, H / 2 + 50);

      ctx.fillStyle = '#c084fc';
      ctx.font = '16px Inter, sans-serif';
      ctx.fillText('Press SPACE or Click to Retry', W / 2, H / 2 + 100);

      ctx.fillStyle = '#6b7280';
      ctx.font = '11px Inter, sans-serif';
      ctx.fillText('ESC for menu', W / 2, H - 30);
      return;
    }

    const dt = 1;
    const p = g.player;
    const keys = keysRef.current;

    if (keys.has(' ') || keys.has('ArrowUp') || keys.has('KeyW')) {
      if (!g.jumpHeld) {
        g.jumpHeld = true;
        g.jumpHold = 0;
        if (p.vy >= 0 && !g.falling) {
          p.vy = JUMP_FORCE;
          playSound(randInt(0, 2) === 0 ? 'jump_lo' : (randInt(0, 1) === 0 ? 'jump_mid' : 'jump_hi'));
        }
      } else {
        g.jumpHold += dt * 16;
        if (g.jumpHold < MAX_JUMP_HOLD && p.vy < 0) {
          p.vy += JUMP_HOLD_BOOST * dt;
        }
      }
    } else {
      if (g.jumpHeld) g.jumpHeld = false;
    }

    p.vy += GRAVITY * dt;
    p.x += g.speed * dt;

    if (p.x > WRAP_AROUND) p.x -= WRAP_AROUND;
    if (p.x < 0) p.x += WRAP_AROUND;

    let onPlat = false;
    for (const plat of g.platforms) {
      const platRight = plat.x + plat.blocks * BLOCK_W;
      if (
        p.x + p.w > plat.x &&
        p.x < platRight &&
        p.vy >= 0 &&
        p.y + p.h >= plat.y &&
        p.y + p.h <= plat.y + BLOCK_H + Math.abs(p.vy) + 2
      ) {
        p.y = plat.y - p.h;
        p.vy = 0;
        onPlat = true;
        g.falling = false;
        g.rotate = 0;

        if (!plat.scored) {
          plat.scored = true;
          g.floorCount++;
          const now = Date.now();
          if (now - lastComboRef.current < COMBO_TIMEOUT) {
            g.combo++;
            if (g.combo > g.bestCombo) g.bestCombo = g.combo;
            if (g.combo === 2) playSound('good');
            else if (g.combo === 3) playSound('great');
            else if (g.combo >= 4) {
              const vl = VOICE_LINES[randInt(0, VOICE_LINES.length - 1)];
              playSound(vl);
            }
          } else {
            g.combo = 1;
          }
          lastComboRef.current = now;
          g.landingFlash = 1;
          playSound('step');
        }
        break;
      }
    }

    if (!onPlat && g.player.vy > 0) {
      g.falling = true;
    }

    p.y += p.vy * dt;

    const targetCam = p.y - H * 0.35;
    g.cameraY += (targetCam - g.cameraY) * 0.08;

    g.speed = Math.min(MAX_SPEED, g.speed + SPEED_INCREMENT * dt);

    g.score = Math.max(g.score, -g.cameraY / PLATFORM_SPACING);

    if (g.landingFlash > 0) g.landingFlash -= 0.03;
    if (g.landingFlash < 0) g.landingFlash = 0;

    g.animTimer += g.speed * 0.05;
    if (g.animTimer > 1) {
      g.animTimer = 0;
      g.animFrame++;
    }

    g.platforms = g.platforms.filter((plat) => plat.y - g.cameraY < H + 100);

    while (g.platforms.length < 12) {
      generatePlatform(g);
    }

    ctx.fillStyle = '#0f0f23';
    ctx.fillRect(0, 0, W, H);

    const bgGrad = ctx.createLinearGradient(0, 0, 0, H);
    bgGrad.addColorStop(0, '#0a0a2e');
    bgGrad.addColorStop(0.5, '#0f0f23');
    bgGrad.addColorStop(1, '#1a0a2e');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, W, H);

    for (let i = 0; i < 30; i++) {
      const starY = ((i * 137 + 50) % 600) - (g.cameraY * 0.02) % 600;
      const starX = (i * 97 + 30) % W;
      ctx.fillStyle = `rgba(255,255,255,${0.3 + ((i * 7) % 5) * 0.1})`;
      ctx.fillRect(starX, ((starY % 600) + 600) % 600, 1.5, 1.5);
    }

    ctx.save();
    const wide = WRAP_AROUND;
    for (const plat of g.platforms) {
      drawPlatform(ctx, plat, g.cameraY);
      if (plat.x + plat.blocks * BLOCK_W > WRAP_AROUND) {
        const overflow = plat.x + plat.blocks * BLOCK_W - WRAP_AROUND;
        const wrapPlat: Platform = {
          x: 0,
          y: plat.y,
          blocks: Math.ceil(overflow / BLOCK_W),
          scored: plat.scored,
        };
        drawPlatform(ctx, wrapPlat, g.cameraY);
      }
    }
    ctx.restore();

    drawPlayer(ctx, g);

    ctx.fillStyle = 'rgba(0,0,0,0.5)';
    ctx.fillRect(10, 10, 180, 80);
    ctx.strokeStyle = '#7c3aed';
    ctx.lineWidth = 1;
    ctx.strokeRect(10, 10, 180, 80);

    ctx.fillStyle = '#e5e7eb';
    ctx.font = 'bold 14px Inter, sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(`Floor: ${Math.floor(g.score)}`, 22, 32);

    ctx.fillStyle = '#fbbf24';
    ctx.font = 'bold 14px Inter, sans-serif';
    if (g.combo > 1) {
      ctx.fillText(`Combo: x${g.combo}`, 22, 52);
    }

    ctx.fillStyle = '#9ca3af';
    ctx.font = '11px Inter, sans-serif';
    ctx.fillText(`Speed: ${g.speed.toFixed(1)}`, 22, 72);

    if (g.player.y - g.cameraY > H + 100) {
      g.state = 'gameover';
      if (g.score > g.highScore) {
        g.highScore = g.score;
        setHs(g.score);
      }
      playSound('gameover');
      stopBGM();
      requestAnimationFrame(gameLoop);
      return;
    }

    requestAnimationFrame(gameLoop);
  }, [drawPlatform, drawPlayer, generatePlatform, stopBGM]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const resize = () => {
      if (canvas) {
        canvas.width = Math.min(WRAP_AROUND, window.innerWidth - 40);
        canvas.height = Math.min(700, window.innerHeight - 120);
      }
    };
    resize();
    window.addEventListener('resize', resize);

    const handleKey = (e: KeyboardEvent) => {
      keysRef.current.add(e.code === 'Space' ? ' ' : e.code);
      const g = gameRef.current;
      if (g.state === 'menu') {
        if (e.code === 'Space' || e.code === 'Enter') {
          e.preventDefault();
          resetGame();
          startBGM();
        }
      } else if (g.state === 'gameover') {
        if (e.code === 'Space' || e.code === 'Enter') {
          e.preventDefault();
          resetGame();
          startBGM();
        }
        if (e.code === 'Escape') {
          g.state = 'menu';
        }
      }
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      keysRef.current.delete(e.code === 'Space' ? ' ' : e.code);
    };

    const handleClick = () => {
      const g = gameRef.current;
      if (g.state === 'menu') {
        resetGame();
        startBGM();
      } else if (g.state === 'gameover') {
        resetGame();
        startBGM();
      }
    };

    window.addEventListener('keydown', handleKey);
    window.addEventListener('keyup', handleKeyUp);
    canvas.addEventListener('click', handleClick);

    const g = gameRef.current;
    g.state = 'menu';
    g.highScore = hs;

    gameLoop();

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('keydown', handleKey);
      window.removeEventListener('keyup', handleKeyUp);
      canvas.removeEventListener('click', handleClick);
    };
  }, [gameLoop, resetGame, startBGM, hs]);

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <h2 className="text-3xl font-bold text-white mb-2 tracking-tight">Break Time 🧊</h2>
        <p className="text-gray-400 text-sm">
          Climb the Icy Tower. Hold space/click to jump higher. Speed increases as you climb.
        </p>
      </div>

      <div className="bg-quantum-card/40 rounded-xl border border-gray-800/50 overflow-hidden flex items-center justify-center">
        <canvas
          ref={canvasRef}
          className="w-full cursor-pointer"
          style={{ maxWidth: `${WRAP_AROUND}px`, imageRendering: 'pixelated' }}
        />
      </div>

      <div className="grid grid-cols-3 gap-3 text-center text-xs">
        <div className="bg-quantum-card/50 rounded-lg p-3 border border-gray-800/40">
          <span className="text-gray-500 block mb-1">Controls</span>
          <span className="text-gray-300 font-medium">SPACE / Click to Jump</span>
        </div>
        <div className="bg-quantum-card/50 rounded-lg p-3 border border-gray-800/40">
          <span className="text-gray-500 block mb-1">Tip</span>
          <span className="text-gray-300 font-medium">Hold longer = jump higher</span>
        </div>
        <div className="bg-quantum-card/50 rounded-lg p-3 border border-gray-800/40">
          <span className="text-gray-500 block mb-1">Speed</span>
          <span className="text-gray-300 font-medium">Increases as you climb!</span>
        </div>
      </div>
    </div>
  );
}
