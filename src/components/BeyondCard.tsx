'use client';

import { useEffect, useRef } from 'react';

/* ── Mini routing animation ──────────────────────────────── */
interface Node { x: number; y: number }
interface Bot  { from: number; to: number; t: number; speed: number; color: string }

const BOT_COLORS = ['#6366f1', '#8b5cf6', '#a78bfa', '#38bdf8', '#34d399'];

function RouteCanvas() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width  = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();

    const W = () => canvas.width;
    const H = () => canvas.height;

    // Build a small grid of nodes
    const cols = 5, rows = 3;
    const nodes = (): Node[] => {
      const ns: Node[] = [];
      for (let r = 0; r < rows; r++)
        for (let c = 0; c < cols; c++)
          ns.push({ x: (c + 1) * W() / (cols + 1), y: (r + 1) * H() / (rows + 1) });
      return ns;
    };

    // Edges: connect neighbours (horizontal + vertical + some diagonal)
    const edges = (ns: Node[]) => {
      const es: [number, number][] = [];
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const i = r * cols + c;
          if (c < cols - 1) es.push([i, i + 1]);           // right
          if (r < rows - 1) es.push([i, i + cols]);         // down
          if (r < rows - 1 && c < cols - 1) es.push([i, i + cols + 1]); // diag
        }
      }
      return es;
    };

    // Spawn bots on random edges
    const makeBots = (es: [number, number][]): Bot[] =>
      Array.from({ length: 6 }, (_, k) => {
        const e = es[Math.floor(Math.random() * es.length)];
        return { from: e[0], to: e[1], t: Math.random(), speed: 0.004 + Math.random() * 0.006, color: BOT_COLORS[k % BOT_COLORS.length] };
      });

    let ns = nodes();
    let es = edges(ns);
    let bots = makeBots(es);
    let raf = 0;

    const draw = () => {
      ctx.clearRect(0, 0, W(), H());

      // Edges
      ctx.lineWidth = 1;
      for (const [a, b] of es) {
        ctx.beginPath();
        ctx.strokeStyle = 'rgba(99,102,241,0.18)';
        ctx.moveTo(ns[a].x, ns[a].y);
        ctx.lineTo(ns[b].x, ns[b].y);
        ctx.stroke();
      }

      // Nodes
      for (const n of ns) {
        ctx.beginPath();
        ctx.arc(n.x, n.y, 3, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(129,140,248,0.5)';
        ctx.fill();
        ctx.beginPath();
        ctx.arc(n.x, n.y, 1.5, 0, Math.PI * 2);
        ctx.fillStyle = '#a5b4fc';
        ctx.fill();
      }

      // Bots
      for (const bot of bots) {
        bot.t += bot.speed;
        if (bot.t >= 1) {
          // pick next edge from current node
          const cur = bot.to;
          const next = es.filter(([a, b]) => a === cur || b === cur);
          if (next.length) {
            const e = next[Math.floor(Math.random() * next.length)];
            bot.from = e[0] === cur ? e[0] : e[1];
            bot.to   = e[0] === cur ? e[1] : e[0];
          }
          bot.t = 0;
        }
        const fx = ns[bot.from].x, fy = ns[bot.from].y;
        const tx = ns[bot.to].x,   ty = ns[bot.to].y;
        const bx = fx + (tx - fx) * bot.t;
        const by = fy + (ty - fy) * bot.t;

        // glow
        const g = ctx.createRadialGradient(bx, by, 0, bx, by, 8);
        g.addColorStop(0, bot.color.replace(')', ',0.6)').replace('rgb', 'rgba'));
        g.addColorStop(1, 'transparent');
        ctx.beginPath(); ctx.arc(bx, by, 8, 0, Math.PI * 2);
        ctx.fillStyle = g; ctx.fill();

        ctx.beginPath(); ctx.arc(bx, by, 3.5, 0, Math.PI * 2);
        ctx.fillStyle = bot.color; ctx.fill();
        ctx.beginPath(); ctx.arc(bx, by, 1.5, 0, Math.PI * 2);
        ctx.fillStyle = '#fff'; ctx.fill();
      }

      raf = requestAnimationFrame(draw);
    };

    const onResize = () => { resize(); ns = nodes(); es = edges(ns); bots = makeBots(es); };
    window.addEventListener('resize', onResize);
    draw();
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', onResize); };
  }, []);

  return (
    <canvas ref={ref} style={{ width: '100%', height: '100%', display: 'block' }} />
  );
}

/* ── Main card ───────────────────────────────────────────── */
const INTERESTS = [
  { icon: '⚽', label: 'Sports' },
  { icon: '🏊', label: 'Swimming' },
  { icon: '📚', label: 'Reading' },
  { icon: '🥾', label: 'Hiking' },
];

export default function BeyondCard() {
  return (
    <div className="panel-scroll h-full py-5 px-4 flex flex-col gap-5">

      {/* Header */}
      <div style={{ textAlign: 'center' }}>
        <h2 style={{ fontSize: 14, fontWeight: 800, background: 'linear-gradient(135deg,#a5b4fc,#c4b5fd,#bae6fd)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
          Beyond the Code
        </h2>
        <p style={{ fontSize: 10, color: '#64748b', marginTop: 2 }}>What I&apos;m building · What drives me</p>
        <div className="shimmer-line mt-3" />
      </div>

      {/* Robot routing viz */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
          <span style={{ fontSize: 13 }}>🗺️</span>
          <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(167,139,250,0.7)' }}>Side Project · Proximity & Routing</span>
        </div>
        <div className="glass rounded-xl overflow-hidden" style={{ height: 130, borderColor: 'rgba(99,102,241,0.15)', position: 'relative' }}>
          <RouteCanvas />
          <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: '10px 12px', background: 'linear-gradient(to top, rgba(9,13,28,0.85) 0%, transparent 60%)', pointerEvents: 'none' }}>
            <p style={{ fontSize: 10, fontWeight: 600, color: '#c7d2fe' }}>Nearest-Match Routing Engine</p>
            <p style={{ fontSize: 9, color: '#64748b', marginTop: 2 }}>Obsessed with the problem of who goes where, fastest — spatial matching, shortest paths, real-time dispatch</p>
          </div>
        </div>
      </div>

      {/* Thrift store */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
          <span style={{ fontSize: 13 }}>🛍️</span>
          <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(167,139,250,0.7)' }}>Currently Building</span>
        </div>
        <a href="https://www.instagram.com/thesecondcloset___/" target="_blank" rel="noopener noreferrer"
          className="glass rounded-xl p-3.5 block" style={{ borderColor: 'rgba(99,102,241,0.12)', textDecoration: 'none' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
            <p style={{ fontSize: 11, fontWeight: 700, color: '#f1f5f9' }}>The Second Closet · India</p>
            <span style={{ fontSize: 9, padding: '2px 8px', borderRadius: 999, background: 'rgba(225,48,108,0.12)', color: '#f472b6', border: '1px solid rgba(225,48,108,0.25)' }}>📸 Instagram</span>
          </div>
          <p style={{ fontSize: 10, color: '#94a3b8', lineHeight: 1.6 }}>
            My own thrift store — curating pre-loved fashion and giving clothes a second life. Sustainability meets style.
          </p>
          <p style={{ fontSize: 10, color: '#a78bfa', marginTop: 6, fontWeight: 600 }}>@thesecondcloset__ ↗</p>
        </a>
      </div>

      {/* Life beyond code */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
          <span style={{ fontSize: 13 }}>🌱</span>
          <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(167,139,250,0.7)' }}>Life Beyond Code</span>
        </div>
        <p style={{ fontSize: 10, color: '#94a3b8', lineHeight: 1.7, marginBottom: 10 }}>
          When I&apos;m not shipping features, you&apos;ll find me on the field, in the pool, on a trail, or deep in a book. I believe the best engineers are curious humans first.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
          {INTERESTS.map(({ icon, label }) => (
            <div key={label} className="glass rounded-xl p-3" style={{ borderColor: 'rgba(99,102,241,0.1)', display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontSize: 22 }}>{icon}</span>
              <span style={{ fontSize: 11, fontWeight: 600, color: '#cbd5e1' }}>{label}</span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
