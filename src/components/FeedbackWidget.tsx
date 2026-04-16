'use client';

import { useState, useEffect } from 'react';

export default function FeedbackWidget() {
  const [open,    setOpen]    = useState(false);
  const [name,    setName]    = useState('');
  const [message, setMessage] = useState('');
  const [status,  setStatus]  = useState<'idle'|'sending'|'sent'|'error'>('idle');
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 2200);
    return () => clearTimeout(t);
  }, []);

  const submit = async () => {
    if (!message.trim() || status === 'sending') return;
    setStatus('sending');
    try {
      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, message }),
      });
      if (!res.ok) throw new Error();
      setMessage('');
      setName('');
      setStatus('sent');
      setTimeout(() => { setStatus('idle'); setOpen(false); }, 2000);
    } catch {
      setStatus('error');
      setTimeout(() => setStatus('idle'), 2500);
    }
  };

  if (!visible) return null;

  return (
    <div style={{
      position: 'fixed',
      bottom: 32,
      right: 28,
      zIndex: 9000,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-end',
      gap: 10,
      pointerEvents: 'none',
    }}>

      {/* ── Panel ── */}
      {open && (
        <div style={{
          width: 300,
          background: 'rgba(10,13,38,0.9)',
          border: '1px solid rgba(99,102,241,0.2)',
          borderRadius: 18,
          backdropFilter: 'blur(28px)',
          WebkitBackdropFilter: 'blur(28px)',
          boxShadow: '0 8px 48px rgba(0,0,0,0.5), 0 0 0 1px rgba(99,102,241,0.06)',
          overflow: 'hidden',
          pointerEvents: 'all',
          animation: 'feedback-panel-in 0.32s cubic-bezier(0.34,1.56,0.64,1) both',
        }}>

          {/* Header */}
          <div style={{
            padding: '14px 16px 12px',
            borderBottom: '1px solid rgba(99,102,241,0.1)',
            background: 'rgba(99,102,241,0.04)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 15 }}>💬</span>
              <span style={{ fontSize: 13, fontWeight: 700, color: '#c7d2fe', letterSpacing: '-0.01em' }}>
                Feedback &amp; Suggestions
              </span>
            </div>
            <p style={{ fontSize: 10.5, color: 'rgba(148,163,184,0.5)', marginTop: 4, lineHeight: 1.4 }}>
              Share ideas, bugs, or thoughts — goes straight to Indrani.
            </p>
          </div>

          {/* Form */}
          <div style={{ padding: '14px' }}>
            <input
              placeholder="Your name (optional)"
              value={name}
              onChange={e => setName(e.target.value)}
              maxLength={50}
              style={{
                width: '100%',
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(99,102,241,0.15)',
                borderRadius: 9,
                padding: '7px 11px',
                fontSize: 12,
                color: '#e2e8f0',
                outline: 'none',
                marginBottom: 8,
                transition: 'border-color 0.15s',
                boxSizing: 'border-box',
              }}
              onFocus={e => { e.currentTarget.style.borderColor = 'rgba(99,102,241,0.45)'; }}
              onBlur={e  => { e.currentTarget.style.borderColor = 'rgba(99,102,241,0.15)'; }}
            />
            <textarea
              placeholder="Share feedback or suggestions…"
              value={message}
              onChange={e => setMessage(e.target.value)}
              maxLength={500}
              rows={4}
              style={{
                width: '100%',
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(99,102,241,0.15)',
                borderRadius: 9,
                padding: '7px 11px',
                fontSize: 12,
                color: '#e2e8f0',
                outline: 'none',
                resize: 'none',
                lineHeight: 1.5,
                marginBottom: 10,
                transition: 'border-color 0.15s',
                fontFamily: 'inherit',
                boxSizing: 'border-box',
              }}
              onFocus={e => { e.currentTarget.style.borderColor = 'rgba(99,102,241,0.45)'; }}
              onBlur={e  => { e.currentTarget.style.borderColor = 'rgba(99,102,241,0.15)'; }}
              onKeyDown={e => { if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) submit(); }}
            />
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 9.5, color: 'rgba(100,116,139,0.55)' }}>
                {status === 'sent'  ? '✓ Sent to Indrani!' :
                 status === 'error' ? '✕ Failed — try again' :
                 message.length > 400 ? `${500 - message.length} left` : '⌘↵ to send'}
              </span>
              <button
                onClick={submit}
                disabled={!message.trim() || status === 'sending'}
                style={{
                  padding: '7px 18px',
                  borderRadius: 9,
                  border: 'none',
                  background: status === 'sent'
                    ? 'rgba(52,211,153,0.2)'
                    : !message.trim() || status === 'sending'
                    ? 'rgba(99,102,241,0.2)'
                    : 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                  color: !message.trim() || status === 'sending' ? 'rgba(199,210,254,0.35)' : '#e0e7ff',
                  fontSize: 12,
                  fontWeight: 600,
                  cursor: !message.trim() || status === 'sending' ? 'not-allowed' : 'pointer',
                  transition: 'all 0.2s',
                  boxShadow: !message.trim() || status === 'sending' ? 'none' : '0 0 12px rgba(99,102,241,0.3)',
                }}
              >
                {status === 'sending' ? '…' : status === 'sent' ? '✓ Sent!' : 'Send'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Trigger button ── */}
      <div style={{ pointerEvents: 'all', position: 'relative' }}>
        {!open && (
          <div style={{
            position: 'absolute', inset: -6, borderRadius: '50%',
            border: '1.5px solid rgba(99,102,241,0.25)',
            animation: 'bubble-ring 2.6s ease-in-out infinite',
            pointerEvents: 'none',
          }} />
        )}
        <button
          onClick={() => setOpen(o => !o)}
          title={open ? 'Close' : 'Send feedback'}
          style={{
            width: 46, height: 46,
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
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#e0e7ff',
            transition: 'all 0.25s cubic-bezier(0.34,1.56,0.64,1)',
            animation: open ? 'none' : 'bubble-float 3.2s ease-in-out infinite',
          }}
        >
          <span style={{
            display: 'inline-block',
            transition: 'transform 0.3s cubic-bezier(0.34,1.56,0.64,1)',
            transform: open ? 'rotate(45deg) scale(0.85)' : 'rotate(0deg) scale(1)',
            fontSize: open ? 15 : 19,
          }}>
            {open ? '✕' : '💬'}
          </span>
        </button>
      </div>

    </div>
  );
}
