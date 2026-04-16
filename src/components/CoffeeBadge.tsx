'use client';

import { useState, useEffect } from 'react';

const DRINKS = [
  { emoji: '☕', label: 'Coffee', color: '#d97706' },
  { emoji: '🍵', label: 'Matcha', color: '#65a30d' },
];

export default function CoffeeBadge() {
  const [open,     setOpen]     = useState(false);
  const [drink,    setDrink]    = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);


  const { emoji, color } = DRINKS[drink];

  const mailtoHref =
    `mailto:indraniinapakolla@gmail.com` +
    `?subject=${encodeURIComponent(`${DRINKS[drink].label} & Code ☕`)}` +
    `&body=${encodeURIComponent(`Hey Indrani,\n\nI'd love to grab a ${DRINKS[drink].label.toLowerCase()} and chat about tech!\n\n`)}`;

  return (
    <div style={{
      position: 'fixed',
      top: 14,
      right: 18,
      zIndex: 10000,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-end',
      gap: 8,
    }}>

      {/* ── Expanded card ── */}
      {open && (
        <div style={{
          width: 260,
          background: 'rgba(10,13,38,0.92)',
          border: `1px solid ${color}33`,
          borderRadius: 16,
          backdropFilter: 'blur(28px)',
          WebkitBackdropFilter: 'blur(28px)',
          boxShadow: `0 8px 40px rgba(0,0,0,0.5), 0 0 0 1px ${color}11`,
          overflow: 'hidden',
          position: 'relative',
          animation: 'coffee-card-in 0.28s cubic-bezier(0.34,1.56,0.64,1) both',
        }}>

          {/* Close button inside card */}
          <button
            onClick={() => setOpen(false)}
            style={{
              position: 'absolute', top: 10, right: 10,
              width: 28, height: 28, borderRadius: '50%',
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.1)',
              color: 'rgba(148,163,184,0.7)',
              fontSize: 13, cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              zIndex: 1,
            }}
          >✕</button>

          {/* Cup + steam */}
          <div style={{
            padding: '18px 18px 12px',
            textAlign: 'center',
            borderBottom: `1px solid ${color}22`,
            background: `${color}08`,
          }}>
            {/* Steam lines */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: 6, marginBottom: 4, height: 16 }}>
              {[0, 1, 2].map(i => (
                <div key={i} style={{
                  width: 2, height: '100%',
                  borderRadius: 4,
                  background: `${color}60`,
                  animation: `steam 1.6s ease-in-out ${i * 0.25}s infinite`,
                }} />
              ))}
            </div>
            <div style={{ fontSize: 36, lineHeight: 1 }}>{emoji}</div>

            {/* Drink toggle */}
            <div style={{
              display: 'inline-flex',
              marginTop: 10,
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 999,
              padding: 3,
              gap: 2,
            }}>
              {DRINKS.map((d, i) => (
                <button key={d.label} onClick={() => setDrink(i)} style={{
                  padding: '3px 10px',
                  borderRadius: 999,
                  border: 'none',
                  background: drink === i ? `${d.color}22` : 'transparent',
                  color: drink === i ? d.color : 'rgba(148,163,184,0.5)',
                  fontSize: 11,
                  fontWeight: drink === i ? 600 : 400,
                  cursor: 'pointer',
                  transition: 'all 0.18s',
                  outline: drink === i ? `1px solid ${d.color}44` : 'none',
                }}>
                  {d.emoji} {d.label}
                </button>
              ))}
            </div>
          </div>

          {/* Body */}
          <div style={{ padding: '14px 18px 16px' }}>
            <p style={{
              fontSize: 13.5,
              fontWeight: 700,
              color: '#e2e8f0',
              marginBottom: 6,
              letterSpacing: '-0.01em',
              lineHeight: 1.3,
            }}>
              Coffee&#8209;Driven&nbsp;Development
            </p>
            <p style={{
              fontSize: 11.5,
              color: 'rgba(148,163,184,0.7)',
              lineHeight: 1.6,
              marginBottom: 14,
            }}>
              I run on {DRINKS[drink].label.toLowerCase()} and curiosity.
              Let&apos;s grab one and talk tech, startups, side projects,
              or whatever&apos;s brewing in your mind.
            </p>

            <a
              href={mailtoHref}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 6,
                padding: '8px 0',
                borderRadius: 10,
                background: `linear-gradient(135deg, ${color}cc, ${color}99)`,
                color: '#fff',
                fontSize: 12,
                fontWeight: 700,
                textDecoration: 'none',
                letterSpacing: '0.01em',
                boxShadow: `0 0 18px ${color}44`,
                transition: 'box-shadow 0.2s, transform 0.15s',
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLAnchorElement).style.boxShadow = `0 0 28px ${color}66`;
                (e.currentTarget as HTMLAnchorElement).style.transform = 'translateY(-1px)';
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLAnchorElement).style.boxShadow = `0 0 18px ${color}44`;
                (e.currentTarget as HTMLAnchorElement).style.transform = 'translateY(0)';
              }}
            >
              {emoji} Let&apos;s set something up
            </a>

            <p style={{
              fontSize: 9.5,
              color: 'rgba(100,116,139,0.45)',
              textAlign: 'center',
              marginTop: 8,
              letterSpacing: '0.03em',
            }}>
              opens your email · no strings attached
            </p>
          </div>
        </div>
      )}

      {/* ── Trigger: icon circle on mobile, full pill on desktop ── */}
      {isMobile ? (
        // Circle button — matches suggestion + feedback floating buttons
        <div style={{ position: 'relative' }}>
          {!open && (
            <div style={{
              position: 'absolute', inset: -6, borderRadius: '50%',
              border: `1.5px solid ${color}33`,
              animation: 'bubble-ring 2.6s ease-in-out infinite',
              pointerEvents: 'none',
            }} />
          )}
          <button
            onClick={() => setOpen(o => !o)}
            title={open ? 'Close' : 'Coffee & Code'}
            style={{
              width: 46, height: 46,
              borderRadius: '50%',
              background: open
                ? 'rgba(10,13,38,0.8)'
                : `linear-gradient(135deg, ${color}cc, ${color}99)`,
              border: open
                ? `1px solid ${color}44`
                : `1px solid ${color}44`,
              boxShadow: open ? 'none' : `0 0 22px ${color}44, 0 4px 16px rgba(0,0,0,0.3)`,
              cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#fff',
              transition: 'all 0.25s cubic-bezier(0.34,1.56,0.64,1)',
              animation: open ? 'none' : 'bubble-float 3.2s ease-in-out infinite',
            }}
          >
            <span style={{
              display: 'inline-block',
              fontSize: open ? 15 : 20,
              transition: 'transform 0.3s cubic-bezier(0.34,1.56,0.64,1)',
              transform: open ? 'rotate(45deg) scale(0.85)' : 'rotate(0deg) scale(1)',
            }}>
              {open ? '✕' : emoji}
            </span>
          </button>
        </div>
      ) : (
        // Full pill — desktop only
        <button
          onClick={() => setOpen(o => !o)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            padding: '6px 13px 6px 10px',
            borderRadius: 999,
            background: open ? 'rgba(10,13,38,0.8)' : 'rgba(10,13,38,0.7)',
            border: `1px solid ${open ? color + '55' : color + '33'}`,
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            boxShadow: open ? `0 0 18px ${color}33` : `0 0 12px ${color}22, 0 2px 8px rgba(0,0,0,0.3)`,
            cursor: 'pointer',
            color: '#e2e8f0',
            fontSize: 12,
            fontWeight: 600,
            letterSpacing: '0.01em',
            transition: 'all 0.22s ease',
            animation: open ? 'none' : 'pill-breathe 3s ease-in-out infinite',
            whiteSpace: 'nowrap',
          }}
          onMouseEnter={e => { if (!open) (e.currentTarget as HTMLButtonElement).style.borderColor = `${color}66`; }}
          onMouseLeave={e => { if (!open) (e.currentTarget as HTMLButtonElement).style.borderColor = `${color}33`; }}
        >
          <span style={{ fontSize: 15, display: 'inline-block', animation: open ? 'none' : 'cup-wobble 3s ease-in-out infinite' }}>
            {emoji}
          </span>
          {!open && (
            <span style={{ color: '#c7d2fe' }}>Coffee &amp; Code?</span>
          )}
          {!open && (
            <span style={{
              width: 5, height: 5, borderRadius: '50%',
              background: color, boxShadow: `0 0 6px ${color}`,
              animation: 'status-pulse 2s ease-in-out infinite', marginLeft: 2,
            }} />
          )}
        </button>
      )}
    </div>
  );
}
