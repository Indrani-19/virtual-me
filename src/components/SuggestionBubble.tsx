'use client';

import { useState, useEffect } from 'react';

const SUGGESTIONS = [
  { icon: '🚀', text: 'What did you build at Reacher?' },
  { icon: '🤖', text: 'Tell me about the robot routing project' },
  { icon: '🏪', text: "What's The Second Closet?" },
  { icon: '🔍', text: 'How did you build the fraud detection system?' },
  { icon: '📊', text: 'What is Creative Analytics?' },
  { icon: '⚡', text: "What's your go-to tech stack?" },
  { icon: '☁️', text: 'Tell me about your AWS experience' },
  { icon: '📜', text: 'What certifications do you have?' },
  { icon: '💼', text: 'Walk me through your career' },
  { icon: '🏆', text: 'Any notable achievements?' },
  { icon: '🌍', text: 'Where are you based?' },
  { icon: '🧠', text: 'What AI projects have you worked on?' },
];

const BATCH_SIZE = 3;
const TOTAL_BATCHES = Math.ceil(SUGGESTIONS.length / BATCH_SIZE);

interface Props {
  onSuggest: (text: string) => void;
}

export default function SuggestionBubble({ onSuggest }: Props) {
  const [open, setOpen]       = useState(false);
  const [visible, setVisible] = useState(false);
  const [batch, setBatch]     = useState(0);
  const [key, setKey]         = useState(0); // force re-animation on batch change

  // Delay appearance slightly so it doesn't compete with page load
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 1800);
    return () => clearTimeout(t);
  }, []);

  // Auto-rotate suggestions while open
  useEffect(() => {
    if (!open) return;
    const t = setInterval(() => {
      setBatch(b => (b + 1) % TOTAL_BATCHES);
      setKey(k => k + 1);
    }, 9000);
    return () => clearInterval(t);
  }, [open]);

  const nextBatch = () => {
    setBatch(b => (b + 1) % TOTAL_BATCHES);
    setKey(k => k + 1);
  };

  const current = SUGGESTIONS.slice(batch * BATCH_SIZE, batch * BATCH_SIZE + BATCH_SIZE);

  if (!visible) return null;

  return (
    <div style={{
      position: 'fixed',
      bottom: 32,
      left: 28,
      zIndex: 9000,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-start',
      gap: 10,
      pointerEvents: 'none',
    }}>

      {/* Suggestions panel */}
      {open && (
        <div
          key={key}
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 7,
            pointerEvents: 'all',
            // slide up from bottom
            animation: 'suggestions-panel-in 0.3s cubic-bezier(0.34,1.56,0.64,1) both',
          }}
        >
          {/* Header label */}
          <p style={{
            fontSize: 9,
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            color: 'rgba(167,139,250,0.55)',
            paddingLeft: 4,
            marginBottom: 2,
          }}>
            ✦ Try asking
          </p>

          {current.map((s, i) => (
            <button
              key={s.text}
              onClick={() => { onSuggest(s.text); setOpen(false); }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 9,
                padding: '9px 16px',
                borderRadius: 14,
                background: 'rgba(13,17,48,0.75)',
                border: '1px solid rgba(99,102,241,0.22)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                color: '#c7d2fe',
                fontSize: 12.5,
                cursor: 'pointer',
                textAlign: 'left',
                whiteSpace: 'nowrap',
                boxShadow: '0 4px 24px rgba(0,0,0,0.35)',
                animation: `chip-in 0.3s cubic-bezier(0.34,1.56,0.64,1) ${i * 0.07}s both`,
                transition: 'background 0.18s, border-color 0.18s, box-shadow 0.18s, transform 0.15s',
              }}
              onMouseEnter={e => {
                const el = e.currentTarget;
                el.style.background = 'rgba(99,102,241,0.14)';
                el.style.borderColor = 'rgba(139,92,246,0.5)';
                el.style.boxShadow = '0 0 20px rgba(99,102,241,0.22), 0 4px 24px rgba(0,0,0,0.35)';
                el.style.transform = 'translateX(3px)';
              }}
              onMouseLeave={e => {
                const el = e.currentTarget;
                el.style.background = 'rgba(13,17,48,0.75)';
                el.style.borderColor = 'rgba(99,102,241,0.22)';
                el.style.boxShadow = '0 4px 24px rgba(0,0,0,0.35)';
                el.style.transform = 'translateX(0)';
              }}
            >
              <span style={{ fontSize: 15 }}>{s.icon}</span>
              <span>{s.text}</span>
            </button>
          ))}

          {/* Refresh row */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, paddingLeft: 2 }}>
            <button
              onClick={nextBatch}
              style={{
                display: 'flex', alignItems: 'center', gap: 5,
                background: 'none', border: 'none', cursor: 'pointer',
                fontSize: 10.5, color: 'rgba(148,163,184,0.5)',
                letterSpacing: '0.04em', padding: '2px 4px',
                transition: 'color 0.15s',
              }}
              onMouseEnter={e => { (e.currentTarget).style.color = 'rgba(167,139,250,0.8)'; }}
              onMouseLeave={e => { (e.currentTarget).style.color = 'rgba(148,163,184,0.5)'; }}
            >
              <span style={{ fontSize: 12, display: 'inline-block', transition: 'transform 0.3s' }}>↻</span>
              <span>more ideas</span>
            </button>
            <span style={{ fontSize: 9, color: 'rgba(99,102,241,0.35)', letterSpacing: '0.05em' }}>
              {batch + 1}/{TOTAL_BATCHES}
            </span>
          </div>
        </div>
      )}

      {/* Trigger button */}
      <div style={{ pointerEvents: 'all', position: 'relative' }}>
        {/* Outer glow ring — only when closed */}
        {!open && (
          <div style={{
            position: 'absolute',
            inset: -6,
            borderRadius: '50%',
            border: '1.5px solid rgba(99,102,241,0.25)',
            animation: 'bubble-ring 2.4s ease-in-out infinite',
            pointerEvents: 'none',
          }} />
        )}

        <button
          onClick={() => setOpen(o => !o)}
          title={open ? 'Close' : 'Need inspiration?'}
          style={{
            width: 46,
            height: 46,
            borderRadius: '50%',
            background: open
              ? 'rgba(99,102,241,0.12)'
              : 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 60%, #a78bfa 100%)',
            border: open
              ? '1px solid rgba(99,102,241,0.35)'
              : '1px solid rgba(167,139,250,0.3)',
            boxShadow: open
              ? 'none'
              : '0 0 24px rgba(99,102,241,0.4), 0 4px 16px rgba(0,0,0,0.3)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: open ? 16 : 19,
            color: '#e0e7ff',
            transition: 'all 0.25s cubic-bezier(0.34,1.56,0.64,1)',
            animation: open ? 'none' : 'bubble-float 3s ease-in-out infinite',
          }}
        >
          <span style={{
            display: 'inline-block',
            transition: 'transform 0.3s cubic-bezier(0.34,1.56,0.64,1)',
            transform: open ? 'rotate(45deg)' : 'rotate(0deg)',
          }}>
            {open ? '✕' : '✦'}
          </span>
        </button>
      </div>
    </div>
  );
}
