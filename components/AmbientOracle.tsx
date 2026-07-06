'use client';

import { useEffect, useRef } from 'react';

// ============================================================
// AmbientOracle — the living atmosphere for the whole rite, in one
// delegated layer so the quiz screens barely change:
//   - incense-ember dust drifting up (gold + amethyst) behind content
//   - a candle-glow that follows the cursor through the starlit void
//   - a shared --flicker engine (10Hz) so every gold glow wavers as one
//   - 3D tilt + candlelight sheen on option and symbol cards
//   - magnetic lean on the gold buttons
//   - singing-bowl ripples on every meaningful press
//   - a rare shooting star
// All pointer effects run only on fine-pointer/hover; nothing runs
// under prefers-reduced-motion.
// ============================================================

interface Mote {
  x: number; y: number; vx: number; vy: number;
  r: number; o: number; phase: number; amethyst: boolean; bright: boolean;
  life: number;
}

const TILT_SEL = '.option, .symbol-card';
const RIPPLE_SEL = '.option, .symbol-card, .btn, .tool-btn, .threshold-btn';

export default function AmbientOracle() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const canvas = canvasRef.current;
    const glow = glowRef.current;
    if (!canvas || !glow) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);

    let w = 0, h = 0;
    const resize = () => {
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener('resize', resize);

    // pre-rendered glow sprite (gold)
    const sprite = document.createElement('canvas');
    sprite.width = sprite.height = 32;
    const sctx = sprite.getContext('2d');
    if (sctx) {
      const g = sctx.createRadialGradient(16, 16, 0, 16, 16, 16);
      g.addColorStop(0, 'rgba(232, 199, 122, 0.9)');
      g.addColorStop(0.4, 'rgba(212, 175, 55, 0.35)');
      g.addColorStop(1, 'rgba(212, 175, 55, 0)');
      sctx.fillStyle = g;
      sctx.fillRect(0, 0, 32, 32);
    }

    const ambientCount = finePointer ? 38 : 22;
    const emberCap = 26;
    const motes: Mote[] = Array.from({ length: ambientCount }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: 0,
      vy: -(0.05 + Math.random() * 0.2),
      r: 0.5 + Math.random() * 1.4,
      o: 0.05 + Math.random() * 0.22,
      phase: Math.random() * Math.PI * 2,
      amethyst: Math.random() < 0.35,
      bright: Math.random() < 0.1,
      life: 1,
    }));

    let meteor: { x: number; y: number; vx: number; vy: number; life: number } | null = null;
    let nextMeteorAt = performance.now() + 18000 + Math.random() * 40000;

    // cursor + hover state
    let mx = w / 2, my = h / 2, gx = mx, gy = my;
    let lastMove = 0, lastSpawnX = mx, lastSpawnY = my;
    let hoverRaf = 0;
    let tiltedEl: HTMLElement | null = null;
    let magnetEl: HTMLElement | null = null;

    const resetTilt = (el: HTMLElement) => {
      el.style.setProperty('--rx', '0deg');
      el.style.setProperty('--ry', '0deg');
      el.dataset.tilting = 'false';
    };
    // Only clear the transform — the ease is owned by the .btn CSS transition,
    // so we never overwrite the button's own box-shadow/background easing.
    const resetMagnet = (el: HTMLElement) => {
      el.style.transform = '';
    };

    const updateHover = (cx: number, cy: number, target: EventTarget | null) => {
      const t = target as HTMLElement | null;
      // 3D tilt on option/symbol cards
      const card = t?.closest?.(TILT_SEL) as HTMLElement | null;
      if (card !== tiltedEl) {
        if (tiltedEl) resetTilt(tiltedEl);
        tiltedEl = card;
      }
      if (card) {
        const rect = card.getBoundingClientRect();
        const nx = (cx - rect.left) / rect.width - 0.5;
        const ny = (cy - rect.top) / rect.height - 0.5;
        card.style.setProperty('--rx', `${(-ny * 7).toFixed(2)}deg`);
        card.style.setProperty('--ry', `${(nx * 7).toFixed(2)}deg`);
        card.style.setProperty('--mx', `${((nx + 0.5) * 100).toFixed(1)}%`);
        card.style.setProperty('--my', `${((ny + 0.5) * 100).toFixed(1)}%`);
        card.dataset.tilting = 'true';
      }
      // magnetic lean on gold buttons
      const btn = t?.closest?.('.btn') as HTMLElement | null;
      if (btn !== magnetEl) {
        if (magnetEl) resetMagnet(magnetEl);
        magnetEl = btn;
      }
      if (btn && !(btn as HTMLButtonElement).disabled) {
        const rect = btn.getBoundingClientRect();
        const dx = cx - (rect.left + rect.width / 2);
        const dy = cy - (rect.top + rect.height / 2);
        const cap = 7;
        const tx = Math.max(-cap, Math.min(cap, dx * 0.2));
        const ty = Math.max(-cap, Math.min(cap, dy * 0.2));
        btn.style.transform = `translate(${tx.toFixed(1)}px, ${ty.toFixed(1)}px)`;
      }
    };

    const onMove = (e: PointerEvent) => {
      mx = e.clientX; my = e.clientY; lastMove = performance.now();
      const dist = Math.hypot(mx - lastSpawnX, my - lastSpawnY);
      if (dist > 52 && motes.length < ambientCount + emberCap) {
        lastSpawnX = mx; lastSpawnY = my;
        motes.push({
          x: mx + (Math.random() - 0.5) * 22,
          y: my + (Math.random() - 0.5) * 22,
          vx: (Math.random() - 0.5) * 0.3,
          vy: -(0.3 + Math.random() * 0.45),
          r: 0.6 + Math.random() * 1.1,
          o: 0.5, phase: Math.random() * Math.PI * 2,
          amethyst: Math.random() < 0.3, bright: true, life: 0.9,
        });
      }
      cancelAnimationFrame(hoverRaf);
      const cx = e.clientX, cy = e.clientY, tgt = e.target;
      hoverRaf = requestAnimationFrame(() => updateHover(cx, cy, tgt));
    };
    if (finePointer) window.addEventListener('pointermove', onMove, { passive: true });

    // singing-bowl ripple
    const onDown = (e: PointerEvent) => {
      // A press settles any leaned button so its magnet transform never
      // lingers after the screen advances (the button node is reused).
      if (magnetEl) { resetMagnet(magnetEl); magnetEl = null; }
      const target = (e.target as HTMLElement | null)?.closest?.(RIPPLE_SEL) as HTMLElement | null;
      if (!target || (target as HTMLButtonElement).disabled) return;
      const rect = target.getBoundingClientRect();
      const x = e.clientX - rect.left, y = e.clientY - rect.top;
      for (let i = 0; i < 2; i++) {
        const ring = document.createElement('span');
        ring.className = 'oracle-ripple';
        ring.style.left = `${x}px`;
        ring.style.top = `${y}px`;
        if (i === 1) { ring.style.animationDelay = '0.15s'; ring.style.opacity = '0.5'; }
        ring.addEventListener('animationend', () => ring.remove());
        target.appendChild(ring);
      }
    };
    document.addEventListener('pointerdown', onDown);

    let raf = 0, running = true, t = 0;
    let lastFrame = performance.now(), lastFlickerWrite = 0, lastFlickerVal = '';

    const loop = (now: number) => {
      if (!running) return;
      const dt = Math.min((now - lastFrame) / 1000, 0.05);
      lastFrame = now;
      t += dt;
      const fs = dt * 60;

      const f = 0.92 + 0.06 * Math.sin(t * 1.1) + 0.04 * Math.sin(t * 3.7) + 0.03 * Math.sin(t * 7.3);
      if (now - lastFlickerWrite > 100) {
        lastFlickerWrite = now;
        const v = f.toFixed(2);
        if (v !== lastFlickerVal) {
          lastFlickerVal = v;
          document.documentElement.style.setProperty('--flicker', v);
        }
      }

      ctx.clearRect(0, 0, w, h);
      for (let i = motes.length - 1; i >= 0; i--) {
        const p = motes[i];
        p.x += (p.vx + Math.sin(t * 0.6 + p.phase) * 0.12) * fs;
        p.y += p.vy * fs;
        if (p.life < 1) {
          p.life -= 0.008 * fs;
          if (p.life <= 0) { motes.splice(i, 1); continue; }
        }
        if (p.y < -10 || p.x < -10 || p.x > w + 10) { p.y = h + 5; p.x = Math.random() * w; }
        const alpha = p.o * (p.life < 1 ? p.life : 0.75 + 0.25 * Math.sin(t + p.phase)) * f;
        if (p.bright) {
          const s = p.r * 10;
          ctx.globalAlpha = alpha;
          ctx.drawImage(sprite, p.x - s / 2, p.y - s / 2, s, s);
          ctx.globalAlpha = 1;
        } else {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
          ctx.fillStyle = p.amethyst
            ? `rgba(141,111,208,${alpha.toFixed(3)})`
            : `rgba(212,175,55,${alpha.toFixed(3)})`;
          ctx.fill();
        }
      }

      if (!meteor && now > nextMeteorAt) {
        const fromLeft = Math.random() < 0.5;
        meteor = {
          x: fromLeft ? w * 0.1 + Math.random() * w * 0.3 : w * 0.6 + Math.random() * w * 0.3,
          y: h * (0.04 + Math.random() * 0.1),
          vx: (fromLeft ? 1 : -1) * (6 + Math.random() * 4),
          vy: 2 + Math.random() * 1.5, life: 1,
        };
        nextMeteorAt = now + 30000 + Math.random() * 40000;
      }
      if (meteor) {
        meteor.x += meteor.vx * fs;
        meteor.y += meteor.vy * fs;
        meteor.life -= 0.016 * fs;
        if (meteor.life <= 0 || meteor.y > h * 0.4) {
          meteor = null;
        } else {
          const tx = meteor.x - meteor.vx * 9, ty = meteor.y - meteor.vy * 9;
          const streak = ctx.createLinearGradient(meteor.x, meteor.y, tx, ty);
          streak.addColorStop(0, `rgba(244,237,223,${(meteor.life * 0.8).toFixed(3)})`);
          streak.addColorStop(0.3, `rgba(212,175,55,${(meteor.life * 0.4).toFixed(3)})`);
          streak.addColorStop(1, 'rgba(212,175,55,0)');
          ctx.beginPath();
          ctx.moveTo(meteor.x, meteor.y);
          ctx.lineTo(tx, ty);
          ctx.strokeStyle = streak;
          ctx.lineWidth = 1.2;
          ctx.stroke();
        }
      }

      if (finePointer) {
        const k = 1 - Math.pow(0.93, fs);
        gx += (mx - gx) * k;
        gy += (my - gy) * k;
        const idle = now - lastMove > 2500;
        glow.style.opacity = idle ? '0' : (0.9 * f).toFixed(3);
        glow.style.transform = `translate3d(${(gx - 300).toFixed(1)}px, ${(gy - 300).toFixed(1)}px, 0)`;
      }

      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    const onVis = () => {
      const shouldRun = !document.hidden;
      if (shouldRun && !running) { running = true; lastFrame = performance.now(); raf = requestAnimationFrame(loop); }
      else if (!shouldRun) { running = false; cancelAnimationFrame(raf); }
    };
    document.addEventListener('visibilitychange', onVis);

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      cancelAnimationFrame(hoverRaf);
      window.removeEventListener('resize', resize);
      document.removeEventListener('pointerdown', onDown);
      document.removeEventListener('visibilitychange', onVis);
      if (finePointer) window.removeEventListener('pointermove', onMove);
    };
  }, []);

  return (
    <>
      <canvas ref={canvasRef} className="oracle-dust" aria-hidden="true" />
      <div ref={glowRef} className="oracle-glow" aria-hidden="true" />
    </>
  );
}
