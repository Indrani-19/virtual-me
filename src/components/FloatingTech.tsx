'use client';

import { useEffect, useRef } from 'react';

const ITEMS = [
  'const ai = new Claude()',
  'async def train()',
  'git push origin main',
  'kubectl apply -f .',
  'npm run deploy',
  'docker build .',
  'SELECT * FROM users',
  'O(log n)',
  '<Component />',
  '{ ...spread }',
  '() => {}',
  'import React',
  'useState()',
  'useEffect()',
  'Promise.all()',
  'kafka.produce()',
  'pg.query()',
  'redis.set()',
  'terraform apply',
  'yarn build',
  'pip install',
  'mvn package',
  'curl -X POST',
  '#!/bin/bash',
  '0x1A2B3C',
  '01101001',
  'λ x → x + 1',
  'F(n) = F(n-1)',
  'REST · gRPC',
  'TCP/IP · UDP',
  'JWT · OAuth',
  'CI/CD ⚙',
  'LangChain 🦜',
  'RAG Pipeline',
  'Vector DB',
  'Embeddings[]',
  'Spring Boot',
  'FastAPI',
  'TypeScript',
  'Kubernetes ☸',
];

interface Particle {
  text: string;
  x: number;
  y: number;
  opacity: number;
  size: number;
  speedX: number;
  speedY: number;
  color: string;
}

const COLORS = [
  'rgba(129,140,248,VAL)',  // indigo-400
  'rgba(167,139,250,VAL)',  // violet-400
  'rgba(196,181,253,VAL)',  // violet-300
  'rgba(148,163,184,VAL)',  // slate-400
  'rgba(56,189,248,VAL)',   // sky-400
];

export default function FloatingTech() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef   = useRef<number>(0);
  const particles = useRef<Particle[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width  = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // Spawn particles
    particles.current = Array.from({ length: 28 }, () => {
      const color = COLORS[Math.floor(Math.random() * COLORS.length)];
      return {
        text:   ITEMS[Math.floor(Math.random() * ITEMS.length)],
        x:      Math.random() * canvas.width,
        y:      Math.random() * canvas.height,
        opacity: 0.04 + Math.random() * 0.1,
        size:   10 + Math.random() * 6,
        speedX: (Math.random() - 0.5) * 0.3,
        speedY: -0.15 - Math.random() * 0.25,
        color,
      };
    });

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (const p of particles.current) {
        ctx.font = `${p.size}px 'SF Mono', 'Fira Code', monospace`;
        ctx.fillStyle = p.color.replace('VAL', String(p.opacity));
        ctx.fillText(p.text, p.x, p.y);

        p.x += p.speedX;
        p.y += p.speedY;

        // Wrap around
        if (p.y < -20)               p.y = canvas.height + 10;
        if (p.x > canvas.width + 80) p.x = -80;
        if (p.x < -80)               p.x = canvas.width + 80;
      }

      animRef.current = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 0,
      }}
    />
  );
}
