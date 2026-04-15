'use client';

interface AvatarSectionProps {
  lastAIMessage: string;
  isSpeaking: boolean;
  isRecording: boolean;
  isLoading: boolean;
  onToggleTalk: () => void;
}

function stripMarkdown(text: string) {
  return text
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/[*_`#]/g, '')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .trim();
}

export default function AvatarSection({
  lastAIMessage,
  isSpeaking,
  isRecording,
  isLoading,
  onToggleTalk,
}: AvatarSectionProps) {
  const isActive = isSpeaking || isRecording || isLoading;

  return (
    <div className="flex flex-col items-center justify-center gap-5 h-full px-5 py-6">

      {/* Photo avatar */}
      <div className="relative avatar-float">
        {/* Speaking rings */}
        {isActive && (
          <>
            <div className="speak-ring" style={{ inset: -16 }} />
            <div className="speak-ring" style={{ inset: -30 }} />
            <div className="speak-ring" style={{ inset: -44 }} />
          </>
        )}

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
        <p className="gradient-text-soft text-sm font-semibold mt-0.5">Full Stack Engineer · AI</p>
        <div className="flex items-center justify-center gap-2 mt-2">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 status-pulse" />
          <span className="text-emerald-400 text-xs">Open to opportunities</span>
        </div>
      </div>

      {/* Caption box */}
      <div className="caption-box w-full px-4 py-3 min-h-[80px]">
        <p className="text-[10px] text-indigo-400/60 uppercase tracking-widest mb-1.5 font-semibold">
          {isLoading ? 'Thinking…' : isSpeaking ? 'Speaking' : isRecording ? 'Listening…' : 'Captions'}
        </p>
        <p className="text-xs text-slate-300 leading-relaxed line-clamp-4">
          {lastAIMessage
            ? stripMarkdown(lastAIMessage)
            : 'Ask me anything about my work, skills, or experience!'}
        </p>
      </div>

      {/* Talk button */}
      <button
        onClick={onToggleTalk}
        className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold text-white transition-all ${
          isRecording ? 'recording bg-red-700' : 'neon-btn-pink'
        }`}
      >
        <span>{isRecording ? '🔴' : '🎤'}</span>
        <span>{isRecording ? 'Stop' : 'Talk to Indrani'}</span>
      </button>

    </div>
  );
}
