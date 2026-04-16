'use client';

import { useRef, useEffect } from 'react';

interface AvatarSectionProps {
  lastAIMessage: string;
  isSpeaking: boolean;
  isRecording: boolean;
  isLoading: boolean;
  isVoiceMode: boolean;
  onToggleTalk: () => void;
  volume: number;
  isMuted: boolean;
  isPaused: boolean;
  onVolumeUp: () => void;
  onVolumeDown: () => void;
  onVolumeSet: (v: number) => void;
  onMute: () => void;
  onPause: () => void;
  captionWordIndex: number;
  onVolumeCommit: (v: number) => void;
}

function stripMarkdown(text: string) {
  return text
    .replace(/[^\p{L}\p{N}\p{P}\p{Z}\n]/gu, ' ') // strip emojis
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/[*_`#]/g, '')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/\s+/g, ' ')
    .trim();
}

export default function AvatarSection({
  lastAIMessage,
  isSpeaking,
  isRecording,
  isLoading,
  isVoiceMode,
  onToggleTalk,
  volume,
  isMuted,
  isPaused,
  onVolumeUp,
  onVolumeDown,
  onVolumeSet,
  onMute,
  onPause,
  captionWordIndex,
  onVolumeCommit,
}: AvatarSectionProps) {
  const captionBoxRef = useRef<HTMLDivElement>(null);
  const activeWordRef = useRef<HTMLSpanElement>(null);

  // Auto-scroll caption box so the active word stays visible
  useEffect(() => {
    if (captionWordIndex >= 0 && activeWordRef.current && captionBoxRef.current) {
      activeWordRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [captionWordIndex]);
  const isActive = isSpeaking || isRecording || isLoading;

  return (
    <div className="flex flex-col items-center justify-center gap-5 h-full px-5 py-6">

      {/* Photo avatar */}
      <div className="relative avatar-float">
        {/* Speaking rings — always in DOM, hidden when inactive to avoid flicker */}
        <div className={`speak-ring${isActive ? '' : ' speak-ring-hidden'}`} style={{ inset: -16 }} />
        <div className={`speak-ring${isActive ? '' : ' speak-ring-hidden'}`} style={{ inset: -30 }} />
        <div className={`speak-ring${isActive ? '' : ' speak-ring-hidden'}`} style={{ inset: -44 }} />

        {/* Rotating gradient ring */}
        <div className="avatar-ring" style={{ borderRadius: '50%', padding: 3 }}>
          <div style={{
            width: 200,
            height: 200,
            borderRadius: '50%',
            overflow: 'hidden',
            background: '#030014',
          }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/avatar.png"
              alt="Indrani Inapakolla"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                objectPosition: 'center top',
                filter: isActive
                  ? 'drop-shadow(0 0 12px rgba(255,0,128,0.6))'
                  : 'none',
                transition: 'filter 0.4s ease',
              }}
            />
          </div>
        </div>
      </div>

      {/* Name + title */}
      <div className="text-center">
        <h2 className="font-bold text-white text-lg tracking-tight">Indrani Inapakolla</h2>
        <p className="gradient-text-soft text-sm font-semibold mt-0.5">Software Engineer · Full Stack · AI · Problem Solver</p>
        <div className="flex items-center justify-center gap-2 mt-2">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 status-pulse" />
          <span className="text-emerald-400 text-xs">Open to opportunities</span>
        </div>
      </div>

      {/* Caption box */}
      <div className="caption-box w-full px-4 py-3 min-h-[80px]">
        <p className="text-[10px] uppercase tracking-widest mb-1.5 font-semibold"
          style={{ color: isRecording ? '#f87171' : isLoading ? '#fbbf24' : isSpeaking ? '#34d399' : 'rgba(129,140,248,0.6)' }}>
          {isRecording ? '🎙 Listening…'
            : isLoading  ? '⏳ Processing your message…'
            : isSpeaking ? '🔊 Speaking'
            : 'Captions'}
        </p>
        <div
          ref={captionBoxRef}
          className="text-xs leading-relaxed"
          style={{ maxHeight: 72, overflowY: 'auto', scrollbarWidth: 'none' }}
        >
          {isRecording ? (
            <span className="text-slate-300">Go ahead, I&apos;m listening…</span>
          ) : isLoading ? (
            <span className="text-slate-300">Got it! Thinking of a reply…</span>
          ) : captionWordIndex >= 0 && lastAIMessage ? (
            // Word-by-word highlight while speaking
            (() => {
              const words = stripMarkdown(lastAIMessage).split(/\s+/).filter(Boolean);
              return words.map((word, i) => (
                <span key={i}>
                  <span
                    ref={i === captionWordIndex ? activeWordRef : undefined}
                    style={{
                      color: i === captionWordIndex ? '#a78bfa' : i < captionWordIndex ? 'rgba(148,163,184,0.55)' : '#cbd5e1',
                      fontWeight: i === captionWordIndex ? 600 : 400,
                      transition: 'color 0.1s',
                    }}
                  >{word}</span>
                  {i < words.length - 1 ? ' ' : ''}
                </span>
              ));
            })()
          ) : lastAIMessage ? (
            <span className="text-slate-300">{stripMarkdown(lastAIMessage)}</span>
          ) : (
            <span className="text-slate-400">Ask me anything about my work, skills, or experience!</span>
          )}
        </div>
      </div>

      {/* Audio controls — visible while speaking */}
      {isSpeaking && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, width: '100%', padding: '0 4px' }}>
          {/* Pause / Resume */}
          <button onClick={onPause} title={isPaused ? 'Resume' : 'Pause'}
            style={{ flex: '0 0 auto', width: 34, height: 34, borderRadius: 8, border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.05)', color: '#c7d2fe', fontSize: 14, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {isPaused ? '▶' : '⏸'}
          </button>

          {/* Mute */}
          <button onClick={onMute} title={isMuted ? 'Unmute' : 'Mute'}
            style={{ flex: '0 0 auto', width: 34, height: 34, borderRadius: 8, border: '1px solid rgba(255,255,255,0.1)', background: isMuted ? 'rgba(239,68,68,0.15)' : 'rgba(255,255,255,0.05)', color: isMuted ? '#f87171' : '#c7d2fe', fontSize: 14, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {isMuted ? '🔇' : '🔊'}
          </button>

          {/* Draggable volume slider */}
          <input
            type="range" min={0} max={100} step={1}
            value={isMuted ? 0 : volume}
            onChange={e => onVolumeSet(Number(e.target.value))}
            onPointerUp={e => onVolumeCommit(Number((e.target as HTMLInputElement).value))}
            onMouseUp={e => onVolumeCommit(Number((e.target as HTMLInputElement).value))}
            title={`Volume: ${isMuted ? 0 : volume}%`}
            style={{
              flex: 1, height: 4, cursor: 'pointer', accentColor: '#6366f1',
              WebkitAppearance: 'none', appearance: 'none',
              background: `linear-gradient(to right, #6366f1 ${isMuted ? 0 : volume}%, rgba(255,255,255,0.08) ${isMuted ? 0 : volume}%)`,
              borderRadius: 999, outline: 'none', border: 'none',
            }}
          />

          {/* Volume % */}
          <span style={{ flex: '0 0 auto', fontSize: 9, color: '#64748b', width: 26, textAlign: 'right' }}>{isMuted ? 0 : volume}%</span>
        </div>
      )}

      {/* Talk button */}
      <button
        onClick={onToggleTalk}
        className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold text-white transition-all ${
          isActive ? 'recording bg-red-700' : isVoiceMode ? 'recording bg-indigo-700' : 'neon-btn-pink'
        }`}
      >
        <span>{isRecording ? '🎙️' : isLoading ? '⏳' : isSpeaking ? '🔊' : isVoiceMode ? '👂' : '🎤'}</span>
        <span>{isRecording ? 'Listening… (tap to end)' : isLoading ? 'Processing…' : isSpeaking ? 'Speaking… (tap to interrupt)' : isVoiceMode ? 'Tap to speak' : 'Talk to Indrani'}</span>
      </button>

    </div>
  );
}
