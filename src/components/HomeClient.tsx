'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import ParticleBackground from './ParticleBackground';
import AvatarSection from './AvatarSection';
import ChatInterface, { Message } from './ChatInterface';
import InfoPanel from './InfoPanel';

const LINKS = [
  { label: 'View my Resume',    href: '/Indrani_Inapakolla.pdf',                emoji: '📄' },
  { label: 'Visit my LinkedIn', href: 'https://www.linkedin.com/in/indrani-i/', emoji: '💼' },
  { label: 'View my GitHub',    href: 'https://github.com/indrani-19',          emoji: '🐙' },
  { label: 'Read my Articles',  href: 'https://medium.com/@indhuinapakolla',    emoji: '✍️' },
];

const CARD_LABELS = ['Profile', 'Chat', 'Resume'];

export default function HomeClient() {
  const [messages,    setMessages]    = useState<Message[]>([]);
  const [isLoading,   setIsLoading]   = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isSpeaking,  setIsSpeaking]  = useState(false);
  const [speakingId,  setSpeakingId]  = useState<number | null>(null);
  const [lastAIMsg,   setLastAIMsg]   = useState('');
  const [greeted,     setGreeted]     = useState(false);
  const [active,      setActive]      = useState(1); // 0=Profile, 1=Chat, 2=Resume
  const recognitionRef = useRef<any>(null);
  const total = CARD_LABELS.length;

  const prev = () => setActive((a) => (a - 1 + total) % total);
  const next = () => setActive((a) => (a + 1) % total);

  // Keyboard navigation
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft')  prev();
      if (e.key === 'ArrowRight') next();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  // Auto-greet — hard-coded so it's instant and consistent
  useEffect(() => {
    if (greeted) return;
    setGreeted(true);
    const greeting = "Hi there! 👋 I'm Indrani's AI clone — think of me as her digital twin, but with faster responses and zero need for sleep. I'm glad you're here. Feel free to ask me anything about my work, skills, or experience!";
    const aiMsg: Message = { role: 'assistant', content: greeting, isTyping: true };
    setMessages([aiMsg]);
    setLastAIMsg(greeting);
  }, []);

  const toggleRecording = useCallback(() => {
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) { alert('Try Chrome for voice input.'); return; }
    if (isRecording) { recognitionRef.current?.stop(); setIsRecording(false); return; }
    const r = new SR();
    r.lang = 'en-US'; r.interimResults = false;
    r.onresult = (e: any) => { /* handled by ChatInterface */ };
    r.onend = () => setIsRecording(false);
    r.onerror = () => setIsRecording(false);
    recognitionRef.current = r; r.start(); setIsRecording(true);
  }, [isRecording]);

  // Compute style for each card based on distance from active
  const getCardStyle = (i: number): React.CSSProperties => {
    let diff = i - active;
    if (diff > total / 2)  diff -= total;
    if (diff < -total / 2) diff += total;

    if (diff === 0) return {
      transform: 'translateX(0) scale(1)',
      opacity: 1, zIndex: 10,
      boxShadow: '0 24px 80px rgba(0,0,0,0.5), 0 0 60px rgba(99,102,241,0.1)',
      border: '1px solid rgba(99,102,241,0.18)',
      pointerEvents: 'all',
    };
    if (diff === 1 || diff === -(total - 1)) return {
      transform: 'translateX(58%) scale(0.86)',
      opacity: 0.55, zIndex: 5,
      boxShadow: '0 12px 40px rgba(0,0,0,0.4)',
      border: '1px solid rgba(255,255,255,0.06)',
      cursor: 'pointer', pointerEvents: 'all',
    };
    if (diff === -1 || diff === (total - 1)) return {
      transform: 'translateX(-58%) scale(0.86)',
      opacity: 0.55, zIndex: 5,
      boxShadow: '0 12px 40px rgba(0,0,0,0.4)',
      border: '1px solid rgba(255,255,255,0.06)',
      cursor: 'pointer', pointerEvents: 'all',
    };
    return {
      transform: `translateX(${diff * 80}%) scale(0.72)`,
      opacity: 0, zIndex: 1, pointerEvents: 'none',
    };
  };

  const cards = [
    <AvatarSection key="avatar" lastAIMessage={lastAIMsg} isSpeaking={isSpeaking} isRecording={isRecording} isLoading={isLoading} onToggleTalk={toggleRecording} />,
    <ChatInterface key="chat" messages={messages} setMessages={setMessages} isLoading={isLoading} setIsLoading={setIsLoading}
      isRecording={isRecording} setIsRecording={setIsRecording} isSpeaking={isSpeaking} setIsSpeaking={setIsSpeaking}
      speakingId={speakingId} setSpeakingId={setSpeakingId} onAIMessage={setLastAIMsg} />,
    <InfoPanel key="resume" />,
  ];

  return (
    <div className="relative flex flex-col overflow-hidden" style={{
      position: 'fixed', inset: 12,
      background: '#090d1c',
      borderRadius: 16,
      border: '1px solid rgba(255,255,255,0.06)',
      boxShadow: '0 0 0 1px rgba(99,102,241,0.05), 0 32px 80px rgba(0,0,0,0.55)',
    }}>
      <div className="orb orb-1" /><div className="orb orb-2" /><div className="orb orb-3" />
      <ParticleBackground />

      {/* ── Header ── */}
      <header className="relative z-10 shrink-0 text-center py-4 px-6"
        style={{ borderBottom: '1px solid rgba(255,255,255,0.08)', background: 'rgba(9,13,28,0.9)', backdropFilter: 'blur(12px)' }}>
        <h1 className="text-xl font-extrabold tracking-tight header-glow" style={{ color: '#e0e7ff' }}>
          👩‍💻 <span className="gradient-text-soft">Talk to Indrani&apos;s AI Clone</span>
        </h1>
        <div className="flex items-center justify-center gap-5 mt-2 flex-wrap">
          {LINKS.map(({ label, href, emoji }) => (
            <a key={label} href={href} target="_blank" rel="noopener noreferrer"
              className="text-sm text-slate-400 hover:text-indigo-300 transition-colors flex items-center gap-1.5 underline underline-offset-2 decoration-slate-600 hover:decoration-indigo-400">
              <span>{emoji}</span><span>{label}</span>
            </a>
          ))}
        </div>
      </header>

      {/* ── Card stack ── */}
      <div className="relative z-10 flex-1 min-h-0 flex flex-col" style={{ paddingTop: 28 }}>

        {/* Stack area */}
        <div className="flex-1 min-h-0 relative flex items-center justify-center" style={{ overflow: 'hidden' }}>

          {/* Left arrow */}
          <button onClick={prev}
            className="absolute left-4 z-20 flex items-center justify-center transition-all hover:scale-110"
            style={{
              width: 44, height: 44, borderRadius: '50%',
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.1)',
              backdropFilter: 'blur(8px)',
              color: 'rgba(255,255,255,0.6)',
              fontSize: 18,
            }}>
            ‹
          </button>

          {/* Cards */}
          {cards.map((card, i) => (
            <div
              key={i}
              onClick={() => i !== active && setActive(i)}
              style={{
                position: 'absolute',
                width: 'min(420px, 80vw)',
                height: '88%',
                borderRadius: 20,
                overflow: 'hidden',
                background: 'rgba(255,255,255,0.025)',
                backdropFilter: 'blur(20px)',
                transition: 'all 0.45s cubic-bezier(0.4, 0, 0.2, 1)',
                padding: 10,
                ...getCardStyle(i),
              }}
            >
              <div style={{ width: '100%', height: '100%', borderRadius: 12, overflow: 'hidden' }}>
                {card}
              </div>
            </div>
          ))}

          {/* Right arrow */}
          <button onClick={next}
            className="absolute right-4 z-20 flex items-center justify-center transition-all hover:scale-110"
            style={{
              width: 44, height: 44, borderRadius: '50%',
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.1)',
              backdropFilter: 'blur(8px)',
              color: 'rgba(255,255,255,0.6)',
              fontSize: 18,
            }}>
            ›
          </button>
        </div>

        {/* ── Dot indicators + label ── */}
        <div className="shrink-0 flex flex-col items-center gap-2 py-3">
          <p className="text-xs font-semibold gradient-text-soft tracking-widest uppercase">
            {CARD_LABELS[active]}
          </p>
          <div className="flex items-center gap-2">
            {CARD_LABELS.map((_, i) => (
              <button key={i} onClick={() => setActive(i)}
                className="rounded-full transition-all"
                style={{
                  width: active === i ? 24 : 7,
                  height: 7,
                  background: active === i
                    ? 'linear-gradient(135deg, #6366f1, #8b5cf6)'
                    : 'rgba(255,255,255,0.15)',
                  boxShadow: active === i ? '0 0 8px rgba(99,102,241,0.4)' : 'none',
                }} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
