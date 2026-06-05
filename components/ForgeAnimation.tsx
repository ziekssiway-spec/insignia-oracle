'use client';

import { useEffect, useRef, useState } from 'react';

const FORGE_MESSAGES = [
  { line1: 'Choosing the gold…', line2: 'Reading the soul' },
  { line1: 'Casting the band…', line2: 'Shaping the form' },
  { line1: 'Setting the seal…', line2: 'Finding your centre' },
  { line1: 'Beginning the engraving…', line2: 'The Oracle is listening' },
  { line1: 'Carving your symbol…', line2: 'Each mark deliberate' },
  { line1: 'Cutting the deep lines…', line2: 'Nothing accidental' },
  { line1: 'Polishing the high points…', line2: 'Almost yours' },
];

interface Props {
  firstName?: string;
}

export default function ForgeAnimation({ firstName }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [msgIndex, setMsgIndex] = useState(0);
  const [msgVisible, setMsgVisible] = useState(true);

  // Cycle messages
  useEffect(() => {
    const interval = setInterval(() => {
      setMsgVisible(false);
      setTimeout(() => {
        setMsgIndex(i => (i + 1) % FORGE_MESSAGES.length);
        setMsgVisible(true);
      }, 400);
    }, 3200);
    return () => clearInterval(interval);
  }, []);

  // Canvas forge animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let tick = 0;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();

    const W = () => canvas.width;
    const H = () => canvas.height;
    const cx = () => W() / 2;
    const cy = () => H() / 2;

    // Embers / sparks
    type Ember = {
      x: number; y: number; vx: number; vy: number;
      life: number; maxLife: number; r: number; gold: boolean;
    };
    const embers: Ember[] = [];

    const spawnEmbers = () => {
      const count = Math.random() > 0.7 ? 3 : 1;
      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 2.5 + 0.5;
        embers.push({
          x: cx() + (Math.random() - 0.5) * 60,
          y: cy() + (Math.random() - 0.5) * 60,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - Math.random() * 1.5,
          life: 0,
          maxLife: 60 + Math.random() * 80,
          r: Math.random() * 2.5 + 0.5,
          gold: Math.random() > 0.4,
        });
      }
    };

    // Rune symbols that appear and fade
    type Rune = { char: string; x: number; y: number; life: number; maxLife: number; size: number };
    const runes: Rune[] = [];
    const RUNE_CHARS = ['✦', '◈', '⊕', '⋈', '✧', '◉', '⌖', '⊗', '❋', '✺', '⊛', '◎'];

    const spawnRune = () => {
      const angle = Math.random() * Math.PI * 2;
      const radius = 80 + Math.random() * 60;
      runes.push({
        char: RUNE_CHARS[Math.floor(Math.random() * RUNE_CHARS.length)],
        x: cx() + Math.cos(angle) * radius,
        y: cy() + Math.sin(angle) * radius,
        life: 0,
        maxLife: 80 + Math.random() * 60,
        size: 12 + Math.random() * 10,
      });
    };

    const draw = () => {
      tick++;
      const w = W(), h = H(), x0 = cx(), y0 = cy();

      ctx.clearRect(0, 0, w, h);

      // Deep galaxy background
      const bg = ctx.createRadialGradient(x0, y0 * 0.8, 0, x0, y0, Math.max(w, h) * 0.9);
      bg.addColorStop(0, '#0a0818');
      bg.addColorStop(0.4, '#05040f');
      bg.addColorStop(1, '#020208');
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, w, h);

      // Nebula glow — purple/blue
      const nebulaGlow = ctx.createRadialGradient(x0 * 0.6, y0 * 0.5, 0, x0 * 0.6, y0 * 0.5, w * 0.5);
      nebulaGlow.addColorStop(0, `rgba(80,40,160,${0.08 + Math.sin(tick * 0.012) * 0.04})`);
      nebulaGlow.addColorStop(1, 'transparent');
      ctx.fillStyle = nebulaGlow;
      ctx.fillRect(0, 0, w, h);

      const nebulaGlow2 = ctx.createRadialGradient(x0 * 1.4, y0 * 1.3, 0, x0 * 1.4, y0 * 1.3, w * 0.4);
      nebulaGlow2.addColorStop(0, `rgba(20,80,160,${0.07 + Math.sin(tick * 0.009 + 1) * 0.03})`);
      nebulaGlow2.addColorStop(1, 'transparent');
      ctx.fillStyle = nebulaGlow2;
      ctx.fillRect(0, 0, w, h);

      // Central gold pulse — the crest being forged
      const breathe = 0.5 + 0.5 * Math.sin(tick * 0.025);
      const goldGlow = ctx.createRadialGradient(x0, y0, 0, x0, y0, 120 + breathe * 30);
      goldGlow.addColorStop(0, `rgba(220,180,60,${0.2 + breathe * 0.12})`);
      goldGlow.addColorStop(0.3, `rgba(160,100,200,${0.06 + breathe * 0.04})`);
      goldGlow.addColorStop(1, 'transparent');
      ctx.fillStyle = goldGlow;
      ctx.fillRect(0, 0, w, h);

      // Outer ring — materializing (draws more of the circle over time, but loops)
      const ringProgress = (Math.sin(tick * 0.015) * 0.5 + 0.5);
      const ringRadius = 90;

      // Outer decorative ring
      ctx.beginPath();
      ctx.arc(x0, y0, ringRadius + 12, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(120,80,220,${0.15 + breathe * 0.08})`;
      ctx.lineWidth = 1;
      ctx.stroke();

      // Main ring arc — slowly completing
      ctx.beginPath();
      ctx.arc(x0, y0, ringRadius, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * ringProgress);
      ctx.strokeStyle = `rgba(220,170,50,${0.6 + breathe * 0.3})`;
      ctx.lineWidth = 2.5;
      ctx.stroke();

      // Ring glow
      ctx.beginPath();
      ctx.arc(x0, y0, ringRadius, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * ringProgress);
      ctx.strokeStyle = `rgba(255,210,80,${0.15 + breathe * 0.1})`;
      ctx.lineWidth = 8;
      ctx.stroke();

      // Inner ring
      ctx.beginPath();
      ctx.arc(x0, y0, ringRadius - 18, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(160,110,20,${0.2 + breathe * 0.1})`;
      ctx.lineWidth = 1;
      ctx.stroke();

      // Rotating tick marks around ring
      for (let i = 0; i < 24; i++) {
        const a = (i / 24) * Math.PI * 2 + tick * 0.003;
        const inner = ringRadius - 8;
        const outer = ringRadius + 2;
        const x1 = x0 + Math.cos(a) * inner;
        const y1 = y0 + Math.sin(a) * inner;
        const x2 = x0 + Math.cos(a) * outer;
        const y2 = y0 + Math.sin(a) * outer;
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.strokeStyle = `rgba(200,150,40,${0.3 + Math.sin(tick * 0.05 + i) * 0.2})`;
        ctx.lineWidth = i % 6 === 0 ? 1.5 : 0.5;
        ctx.stroke();
      }

      // Cross-hatch lines inside ring — like engraving being carved
      ctx.save();
      ctx.beginPath();
      ctx.arc(x0, y0, ringRadius - 20, 0, Math.PI * 2);
      ctx.clip();
      const lineCount = 8;
      for (let i = 0; i < lineCount; i++) {
        const progress = ((tick * 0.008 + i / lineCount) % 1);
        const yLine = y0 - (ringRadius - 20) + progress * (ringRadius - 20) * 2;
        ctx.beginPath();
        ctx.moveTo(x0 - (ringRadius - 20), yLine);
        ctx.lineTo(x0 + (ringRadius - 20), yLine);
        ctx.strokeStyle = `rgba(200,150,40,${0.06 + Math.sin(progress * Math.PI) * 0.08})`;
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }
      ctx.restore();

      // Central star — pulsing
      const starSize = 16 + breathe * 6;
      ctx.save();
      ctx.translate(x0, y0);
      ctx.rotate(tick * 0.008);
      ctx.beginPath();
      for (let i = 0; i < 8; i++) {
        const a = (i / 8) * Math.PI * 2;
        const r = i % 2 === 0 ? starSize : starSize * 0.4;
        if (i === 0) ctx.moveTo(Math.cos(a) * r, Math.sin(a) * r);
        else ctx.lineTo(Math.cos(a) * r, Math.sin(a) * r);
      }
      ctx.closePath();
      ctx.fillStyle = `rgba(255,200,60,${0.5 + breathe * 0.4})`;
      ctx.fill();
      ctx.restore();

      // Spawn & draw embers
      if (tick % 3 === 0) spawnEmbers();
      for (let i = embers.length - 1; i >= 0; i--) {
        const e = embers[i];
        e.x += e.vx; e.y += e.vy;
        e.vx *= 0.98; e.vy *= 0.98;
        e.life++;
        if (e.life > e.maxLife) { embers.splice(i, 1); continue; }
        const alpha = Math.sin((e.life / e.maxLife) * Math.PI) * 0.9;
        ctx.beginPath();
        ctx.arc(e.x, e.y, e.r, 0, Math.PI * 2);
        ctx.fillStyle = e.gold
          ? `rgba(220,190,80,${alpha})`
          : `rgba(140,100,255,${alpha * 0.8})`;
        ctx.fill();
        // Tiny trail
        ctx.beginPath();
        ctx.arc(e.x - e.vx * 2, e.y - e.vy * 2, e.r * 0.5, 0, Math.PI * 2);
        ctx.fillStyle = e.gold
          ? `rgba(255,230,120,${alpha * 0.3})`
          : `rgba(180,140,255,${alpha * 0.2})`;
        ctx.fill();
      }

      // Spawn & draw runes
      if (tick % 40 === 0) spawnRune();
      for (let i = runes.length - 1; i >= 0; i--) {
        const r = runes[i];
        r.life++;
        if (r.life > r.maxLife) { runes.splice(i, 1); continue; }
        const alpha = Math.sin((r.life / r.maxLife) * Math.PI) * 0.6;
        ctx.font = `${r.size}px serif`;
        ctx.fillStyle = `rgba(220,180,60,${alpha})`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(r.char, r.x, r.y);
      }

      // Vignette
      const vig = ctx.createRadialGradient(x0, y0, 60, x0, y0, Math.max(w, h) * 0.7);
      vig.addColorStop(0, 'transparent');
      vig.addColorStop(1, 'rgba(0,0,0,0.7)');
      ctx.fillStyle = vig;
      ctx.fillRect(0, 0, w, h);

      animId = requestAnimationFrame(draw);
    };

    draw();
    window.addEventListener('resize', resize);
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  const msg = FORGE_MESSAGES[msgIndex];

  return (
    <div style={{
      position: 'absolute', inset: 0,
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      overflow: 'hidden',
    }}>
      <canvas
        ref={canvasRef}
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
      />

      {/* Text overlay */}
      <div style={{
        position: 'relative', zIndex: 2,
        textAlign: 'center', padding: '0 24px',
        marginTop: '160px',
      }}>
        {firstName && (
          <div style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: '13px',
            letterSpacing: '0.3em',
            textTransform: 'uppercase',
            color: 'rgba(200,160,60,0.6)',
            marginBottom: '12px',
          }}>
            {firstName}'s crest
          </div>
        )}
        <div style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: '28px',
          fontStyle: 'italic',
          color: '#f0ece4',
          marginBottom: '8px',
          opacity: msgVisible ? 1 : 0,
          transform: msgVisible ? 'translateY(0)' : 'translateY(6px)',
          transition: 'opacity 0.4s ease, transform 0.4s ease',
        }}>
          {msg.line1}
        </div>
        <div style={{
          fontFamily: "'Inter', sans-serif",
          fontSize: '11px',
          letterSpacing: '0.22em',
          textTransform: 'uppercase',
          color: 'rgba(200,160,60,0.7)',
          opacity: msgVisible ? 1 : 0,
          transition: 'opacity 0.4s ease 0.1s',
        }}>
          {msg.line2}
        </div>
      </div>
    </div>
  );
}
