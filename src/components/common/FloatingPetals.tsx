import React, { useEffect, useRef, useState } from 'react';
import { Sparkles } from 'lucide-react';

interface Petal {
  x: number;
  y: number;
  size: number;
  speedY: number;
  speedX: number;
  angle: number;
  angularSpeed: number;
  opacity: number;
  petalType: number;
  color: string;
  swayAmplitude: number;
  swaySpeed: number;
  swayPhase: number;
}

interface GoldSpark {
  x: number;
  y: number;
  size: number;
  speedY: number;
  opacity: number;
  pulseSpeed: number;
  pulsePhase: number;
}

const PETAL_COLORS = [
  'rgba(212, 175, 55, 0.45)',  // Soft royal gold
  'rgba(235, 87, 87, 0.55)',   // Rose crimson
  'rgba(184, 30, 60, 0.50)',   // Deep vermilion
  'rgba(244, 143, 177, 0.45)', // Blossom pink
  'rgba(255, 223, 115, 0.50)'  // Champagne gold
];

export const FloatingPetals: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isActive, setIsActive] = useState(true);
  const mouseRef = useRef<{ x: number; y: number; active: boolean }>({ x: -1000, y: -1000, active: false });
  const animFrameRef = useRef<number | null>(null);

  useEffect(() => {
    if (!isActive) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY, active: true };
    };
    const handleMouseLeave = () => {
      mouseRef.current.active = false;
    };
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);

    // Create Petals based on screen size (subtle & elegant density)
    const petalCount = Math.min(28, Math.max(14, Math.floor(width / 60)));
    const petals: Petal[] = [];
    for (let i = 0; i < petalCount; i++) {
      petals.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: 9 + Math.random() * 11,
        speedY: 0.6 + Math.random() * 1.0,
        speedX: -0.4 + Math.random() * 0.8,
        angle: Math.random() * Math.PI * 2,
        angularSpeed: (Math.random() - 0.5) * 0.02,
        opacity: 0.35 + Math.random() * 0.45,
        petalType: Math.floor(Math.random() * 3),
        color: PETAL_COLORS[Math.floor(Math.random() * PETAL_COLORS.length)],
        swayAmplitude: 0.8 + Math.random() * 1.5,
        swaySpeed: 0.01 + Math.random() * 0.015,
        swayPhase: Math.random() * Math.PI * 2,
      });
    }

    // Create Gold Sparks (fairy dust)
    const sparkCount = Math.min(22, Math.max(10, Math.floor(width / 80)));
    const sparks: GoldSpark[] = [];
    for (let i = 0; i < sparkCount; i++) {
      sparks.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: 1.2 + Math.random() * 2.2,
        speedY: 0.2 + Math.random() * 0.4,
        opacity: 0.2 + Math.random() * 0.6,
        pulseSpeed: 0.02 + Math.random() * 0.03,
        pulsePhase: Math.random() * Math.PI * 2,
      });
    }

    let time = 0;

    const drawPetal = (p: Petal) => {
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.angle);
      ctx.scale(Math.cos(p.angle * 0.7) * 0.4 + 0.6, 1);

      ctx.fillStyle = p.color;
      ctx.beginPath();
      // Realistic rose petal shape using bezier curves
      const s = p.size;
      ctx.moveTo(0, -s);
      ctx.bezierCurveTo(s * 0.8, -s * 0.8, s * 1.1, s * 0.3, 0, s);
      ctx.bezierCurveTo(-s * 1.1, s * 0.3, -s * 0.8, -s * 0.8, 0, -s);
      ctx.closePath();
      ctx.fill();

      // Subtle center vein for royal organic realism
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
      ctx.lineWidth = 0.7;
      ctx.beginPath();
      ctx.moveTo(0, -s * 0.8);
      ctx.quadraticCurveTo(s * 0.1, 0, 0, s * 0.85);
      ctx.stroke();

      ctx.restore();
    };

    const render = () => {
      time += 1;
      ctx.clearRect(0, 0, width, height);

      // Render & update sparks
      for (const spark of sparks) {
        spark.y += spark.speedY;
        spark.pulsePhase += spark.pulseSpeed;
        const currentOpacity = spark.opacity * (0.5 + 0.5 * Math.sin(spark.pulsePhase));

        if (spark.y > height + 10) {
          spark.y = -10;
          spark.x = Math.random() * width;
        }

        ctx.fillStyle = `rgba(212, 175, 55, ${currentOpacity.toFixed(2)})`;
        ctx.beginPath();
        ctx.arc(spark.x, spark.y, spark.size, 0, Math.PI * 2);
        ctx.fill();
      }

      // Render & update petals
      for (const p of petals) {
        p.swayPhase += p.swaySpeed;
        p.x += p.speedX + Math.sin(p.swayPhase) * p.swayAmplitude;
        p.y += p.speedY;
        p.angle += p.angularSpeed;

        // Subtle wind repulsion if cursor gets close
        if (mouseRef.current.active) {
          const dx = p.x - mouseRef.current.x;
          const dy = p.y - mouseRef.current.y;
          const distSq = dx * dx + dy * dy;
          if (distSq < 10000 && distSq > 0) {
            const dist = Math.sqrt(distSq);
            const force = (100 - dist) / 100;
            p.x += (dx / dist) * force * 3;
            p.y += (dy / dist) * force * 3;
          }
        }

        // Wrap around smoothly
        if (p.y > height + 25) {
          p.y = -25;
          p.x = Math.random() * width;
        }
        if (p.x < -30) p.x = width + 25;
        if (p.x > width + 30) p.x = -25;

        drawPetal(p);
      }

      animFrameRef.current = requestAnimationFrame(render);
    };

    animFrameRef.current = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [isActive]);

  return (
    <>
      {isActive && (
        <canvas
          ref={canvasRef}
          className="fixed inset-0 pointer-events-none z-20 transition-opacity duration-1000"
          style={{ opacity: 0.92 }}
          aria-hidden="true"
        />
      )}

      {/* Floating Petal Shower Controller Button */}
      <div className="fixed bottom-5 left-5 z-40">
        <button
          onClick={() => setIsActive(prev => !prev)}
          className={`flex items-center space-x-2 px-3 py-2 rounded-full text-xs font-heading font-semibold transition-all duration-300 shadow-md backdrop-blur-md border cursor-pointer ${
            isActive
              ? 'bg-cream/90 text-maroon border-gold/50 hover:border-gold hover:shadow-gold-glow'
              : 'bg-white/80 text-dark-muted border-gold/30 hover:text-maroon'
          }`}
          title={isActive ? 'Pause Floating Petals' : 'Enable Floating Petal Shower'}
          aria-label={isActive ? 'Pause Floating Petals' : 'Enable Floating Petal Shower'}
        >
          <Sparkles className={`w-3.5 h-3.5 ${isActive ? 'text-gold fill-gold animate-spin-slow' : 'text-dark-muted'}`} />
          <span className="hidden sm:inline">
            {isActive ? 'Petals Active' : 'Petals Paused'}
          </span>
        </button>
      </div>
    </>
  );
};
