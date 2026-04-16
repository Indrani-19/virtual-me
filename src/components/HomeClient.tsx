'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import ParticleBackground from './ParticleBackground';
import FloatingTech from './FloatingTech';
import AvatarSection from './AvatarSection';
import ChatInterface, { Message } from './ChatInterface';
import InfoPanel from './InfoPanel';
import BeyondCard from './BeyondCard';
import SuggestionBubble from './SuggestionBubble';
import FeedbackWidget from './FeedbackWidget';
import CoffeeBadge from './CoffeeBadge';

const CARD_LABELS = ['Profile', 'Chat', 'Resume', 'Beyond'];

const LINKS_FULL = [
  { label: 'Resume',    href: '/Indrani_Inapakolla.pdf',                emoji: '📄' },
  { label: 'LinkedIn',  href: 'https://www.linkedin.com/in/indrani-i/', emoji: '💼' },
  { label: 'GitHub',    href: 'https://github.com/indrani-19',          emoji: '🐙' },
  { label: 'Articles',  href: 'https://medium.com/@indhuinapakolla',    emoji: '✍️' },
];

function stripMd(text: string) {
  return text
    .replace(/[^\p{L}\p{N}\p{P}\p{Z}\n]/gu, ' ') // strip emojis & non-printable chars
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/[*_`#]/g, '')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/\s+/g, ' ')
    .trim();
}

export default function HomeClient() {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 640);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const [messages,    setMessages]    = useState<Message[]>([]);
  const [isLoading,   setIsLoading]   = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isSpeaking,  setIsSpeaking]  = useState(false);
  const [speakingId,  setSpeakingId]  = useState<number | null>(null);
  const [lastAIMsg,   setLastAIMsg]   = useState('');
  const [volume,      setVolume]      = useState(80);  // 0-100
  const [isMuted,     setIsMuted]     = useState(false);
  const [isPaused,    setIsPaused]    = useState(false);
  const [voiceMode,   setVoiceMode]   = useState(false);
  const greetedRef    = useRef(false);
  const messagesRef   = useRef<Message[]>([]);
  const audioRef      = useRef<HTMLAudioElement | null>(null);
  const audioCtxRef   = useRef<AudioContext | null>(null);
  const gainNodeRef    = useRef<GainNode | null>(null);
  const sourceNodeRef  = useRef<AudioBufferSourceNode | null>(null);
  const abortCtrlRef    = useRef<AbortController | null>(null);
  const wordTimerRef    = useRef<ReturnType<typeof setInterval> | null>(null);
  const utteranceRef    = useRef<SpeechSynthesisUtterance | null>(null);
  const utteranceTextRef = useRef<string>('');
  const [captionWordIndex, setCaptionWordIndex] = useState(-1);
  const [active,      setActive]      = useState(0); // 0=Profile, 1=Chat, 2=Resume
  const recognitionRef = useRef<any>(null);
  const total = CARD_LABELS.length;

  // Volume helpers — work for both AudioContext and browser TTS
  const applyVolume = useCallback((vol: number, muted: boolean) => {
    const gain = muted ? 0 : vol / 100;
    if (gainNodeRef.current) gainNodeRef.current.gain.value = gain;
    if (window.speechSynthesis) {
      // Can't change volume mid-utterance in speechSynthesis; handled at utterance creation
    }
  }, []);

  const handleVolumeChange = useCallback((delta: number) => {
    setVolume(prev => {
      const next = Math.max(0, Math.min(100, prev + delta));
      applyVolume(next, isMuted);
      return next;
    });
  }, [isMuted, applyVolume]);

  const handleMute = useCallback(() => {
    setIsMuted(prev => { applyVolume(volume, !prev); return !prev; });
  }, [volume, applyVolume]);

  const handlePause = useCallback(() => {
    setIsPaused(prev => {
      if (!prev) {
        audioCtxRef.current?.suspend();
        window.speechSynthesis?.pause();
      } else {
        audioCtxRef.current?.resume();
        window.speechSynthesis?.resume();
      }
      return !prev;
    });
  }, []);

  // Keep messagesRef in sync so voice callbacks always see latest messages
  useEffect(() => { messagesRef.current = messages; }, [messages]);

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

  // Touch swipe navigation
  const touchStartX = useRef<number | null>(null);
  const handleTouchStart = (e: React.TouchEvent) => { touchStartX.current = e.touches[0].clientX; };
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(dx) > 50) { dx < 0 ? next() : prev(); }
    touchStartX.current = null;
  };

  // Auto-greet — hard-coded so it's instant and consistent
  useEffect(() => {
    if (greetedRef.current) return;
    greetedRef.current = true;
    const greeting = "Hi there! 👋 I'm Indrani's AI clone — think of me as her digital twin, but with faster responses and zero need for sleep. I'm glad you're here. Feel free to ask me anything about my work, skills, or experience!";
    const aiMsg: Message = { role: 'assistant', content: greeting, isTyping: true };
    setMessages([aiMsg]);
    setLastAIMsg(greeting);
  }, []);

  // Whether the user has an active voice conversation session
  const voiceModeRef    = useRef(false);
  const isLoadingRef    = useRef(false);
  const isSpeakingRef   = useRef(false);
  const isRecordingRef  = useRef(false);
  const gotResultRef    = useRef(false);
  // Stable ref to the listen starter so sendVoiceMessage can call it without circular deps
  const startListenRef = useRef<() => void>(() => {});

  // Keep loading/speaking/recording refs in sync
  useEffect(() => { isLoadingRef.current   = isLoading;   }, [isLoading]);
  useEffect(() => { isSpeakingRef.current  = isSpeaking;  }, [isSpeaking]);
  useEffect(() => { isRecordingRef.current = isRecording; }, [isRecording]);

  const startListening = useCallback(() => {
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR || !voiceModeRef.current) return;
    const r = new SR();
    r.lang = 'en-US';
    r.interimResults = false;
    gotResultRef.current = false;
    r.onspeechend = () => setIsRecording(false); // flip immediately when user stops speaking
    r.onresult = (e: any) => {
      gotResultRef.current = true;
      setIsRecording(false);
      sendVoiceMessageRef.current(e.results[0][0].transcript);
    };
    r.onend = () => {
      setIsRecording(false);
      // If we got a result, sendVoiceMessage handles the next listen — don't double-start
      if (!gotResultRef.current && voiceModeRef.current && !isLoadingRef.current && !isSpeakingRef.current) {
        // No speech detected — restart listening after a short pause
        setTimeout(() => startListenRef.current(), 400);
      }
    };
    r.onerror = (e: any) => {
      setIsRecording(false);
      if (e.error === 'aborted') return; // we called stop() ourselves — ignore
      if ((e.error === 'no-speech' || e.error === 'audio-capture') && voiceModeRef.current) {
        setTimeout(() => startListenRef.current(), 400);
      } else {
        voiceModeRef.current = false;
        setVoiceMode(false); // keep React state in sync so button reflects real state
      }
    };
    recognitionRef.current = r;
    try {
      r.start();
      setIsRecording(true);
    } catch (e) {
      // Chrome throws InvalidStateError if previous session hasn't fully closed yet — retry once
      console.warn('SpeechRecognition start failed, retrying:', e);
      recognitionRef.current = null;
      setTimeout(() => { if (voiceModeRef.current) startListenRef.current(); }, 300);
    }
  }, []);

  // Keep startListenRef pointing at the latest startListening
  useEffect(() => { startListenRef.current = startListening; }, [startListening]);

  const sendVoiceMessage = useCallback(async (transcript: string) => {
    if (!transcript.trim()) return;
    const userMsg: Message = { role: 'user', content: transcript };
    const updated = [...messagesRef.current, userMsg];
    setMessages(updated);
    setIsLoading(true);
    // Create a fresh abort controller for this request
    abortCtrlRef.current?.abort();
    const ctrl = new AbortController();
    abortCtrlRef.current = ctrl;
    try {
      const res  = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: updated }),
        signal: ctrl.signal,
      });
      const data = await res.json();
      const aiMsg: Message = { role: 'assistant', content: data.message, isTyping: true };
      setMessages((prev) => [...prev, aiMsg]);
      setLastAIMsg(data.message);

      // Don't speak if user stopped the conversation
      if (!voiceModeRef.current) return;

      // Speak the reply — try ElevenLabs, fall back to browser TTS
      setIsSpeaking(true);
      setSpeakingId(-1);

      const cleanedMessage = stripMd(data.message);
      const wordList = cleanedMessage.split(/\s+/).filter(Boolean);

      const startWordTimer = (durationMs: number) => {
        if (wordTimerRef.current) clearInterval(wordTimerRef.current);
        setCaptionWordIndex(0);
        const msPerWord = durationMs / Math.max(wordList.length, 1);
        let idx = 0;
        wordTimerRef.current = setInterval(() => {
          idx++;
          if (idx >= wordList.length) {
            if (wordTimerRef.current) { clearInterval(wordTimerRef.current); wordTimerRef.current = null; }
          } else {
            setCaptionWordIndex(idx);
          }
        }, msPerWord);
      };

      const speakWithBrowser = (text: string, vol?: number, mut?: boolean) => {
        window.speechSynthesis.cancel();
        utteranceTextRef.current = text;
        const utter = new SpeechSynthesisUtterance(text);
        utter.rate  = 1.1;
        utter.pitch = 1.05;
        utter.volume = (mut ?? isMuted) ? 0 : (vol ?? volume) / 100;
        const voices = window.speechSynthesis.getVoices();
        const female = voices.find(v => /female|woman|samantha|victoria|karen|moira/i.test(v.name));
        if (female) utter.voice = female;
        utteranceRef.current = utter;
        setCaptionWordIndex(0);
        // Use onboundary (Chrome) to sync word highlight, fallback to interval
        let boundaryWorked = false;
        utter.onboundary = (e: SpeechSynthesisEvent) => {
          if (e.name !== 'word') return;
          boundaryWorked = true;
          let pos = 0;
          for (let i = 0; i < wordList.length; i++) {
            if (pos >= e.charIndex) { setCaptionWordIndex(i); return; }
            if (i === wordList.length - 1) { setCaptionWordIndex(i); return; }
            pos += wordList[i].length + 1;
          }
        };
        utter.onstart = () => {
          // If onboundary didn't fire within 300ms, fall back to interval
          setTimeout(() => {
            if (!boundaryWorked) startWordTimer(wordList.length * 380); // ~380ms/word at 1.1x rate
          }, 300);
        };
        const done = () => {
          utteranceRef.current = null;
          utteranceTextRef.current = '';
          if (wordTimerRef.current) { clearInterval(wordTimerRef.current); wordTimerRef.current = null; }
          setCaptionWordIndex(-1);
          setIsPaused(false); setIsSpeaking(false); setSpeakingId(null); startListenRef.current();
        };
        utter.onend   = done;
        utter.onerror = done;
        window.speechSynthesis.speak(utter);
      };
      // Expose so handleVolumeCommit can restart with new volume
      speakBrowserRef.current = speakWithBrowser;

      try {
        const speakRes = await fetch('/api/speak', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: data.message }),
        });
        if (speakRes.ok) {
          const AC = window.AudioContext || (window as any).webkitAudioContext;
          if (!audioCtxRef.current) audioCtxRef.current = new AC();
          const ctx = audioCtxRef.current;
          await ctx.resume();
          // GainNode for volume control
          const gain = ctx.createGain();
          gain.gain.value = isMuted ? 0 : volume / 100;
          gainNodeRef.current = gain;
          const arrayBuffer = await speakRes.arrayBuffer();
          const audioBuffer = await ctx.decodeAudioData(arrayBuffer);
          const source = ctx.createBufferSource();
          sourceNodeRef.current = source;
          source.buffer = audioBuffer;
          source.playbackRate.value = 1.15;
          source.connect(gain);
          gain.connect(ctx.destination);
          // Start word timer based on actual audio duration (adjusted for playback rate)
          startWordTimer((audioBuffer.duration * 1000) / 1.15);
          source.start(0);
          source.onended = () => {
            sourceNodeRef.current = null;
            if (wordTimerRef.current) { clearInterval(wordTimerRef.current); wordTimerRef.current = null; }
            setCaptionWordIndex(-1);
            setIsPaused(false); setIsSpeaking(false); setSpeakingId(null); startListenRef.current();
          };
        } else {
          speakWithBrowser(cleanedMessage);
        }
      } catch {
        speakWithBrowser(cleanedMessage);
      }
    } catch (err: any) {
      if (err?.name !== 'AbortError') {
        setMessages((prev) => [...prev, { role: 'assistant', content: "Sorry, I couldn't connect. Please try again." }]);
        setIsSpeaking(false); setSpeakingId(null);
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Stable ref so startListening's onresult can always call latest sendVoiceMessage
  const sendVoiceMessageRef = useRef(sendVoiceMessage);
  useEffect(() => { sendVoiceMessageRef.current = sendVoiceMessage; }, [sendVoiceMessage]);

  // Called when the user releases the volume slider.
  // For AudioContext path, gain is already live. For browser TTS, restart with new volume.
  const handleVolumeCommit = useCallback((v: number) => {
    setVolume(v);
    if (v > 0) setIsMuted(false);
    const mut = v === 0;
    // AudioContext gain — already updated live via applyVolume; just ensure it's correct
    if (gainNodeRef.current) gainNodeRef.current.gain.value = mut ? 0 : v / 100;
    // Browser TTS — restart utterance with new volume
    if (utteranceRef.current && utteranceTextRef.current && window.speechSynthesis.speaking) {
      if (wordTimerRef.current) { clearInterval(wordTimerRef.current); wordTimerRef.current = null; }
      // speakWithBrowser is defined inside sendVoiceMessage's closure, so we re-invoke via ref
      speakBrowserRef.current(utteranceTextRef.current, v, mut);
    }
  }, []);

  // Stable ref to speakWithBrowser so handleVolumeCommit can call it without circular deps
  const speakBrowserRef = useRef<(text: string, vol: number, mut: boolean) => void>(() => {});

  const clearWordTimer = useCallback(() => {
    if (wordTimerRef.current) { clearInterval(wordTimerRef.current); wordTimerRef.current = null; }
    setCaptionWordIndex(-1);
  }, []);

  const stopEverything = useCallback(() => {
    voiceModeRef.current = false;
    setVoiceMode(false);
    abortCtrlRef.current?.abort();
    abortCtrlRef.current = null;
    try { sourceNodeRef.current?.stop(); } catch {}
    sourceNodeRef.current = null;
    window.speechSynthesis?.cancel();
    utteranceRef.current = null;
    utteranceTextRef.current = '';
    try { recognitionRef.current?.abort(); } catch {}
    recognitionRef.current = null;
    if (wordTimerRef.current) { clearInterval(wordTimerRef.current); wordTimerRef.current = null; }
    setCaptionWordIndex(-1);
    setIsRecording(false);
    setIsLoading(false);
    setIsSpeaking(false);
    setIsPaused(false);
    setSpeakingId(null);
  }, []);

  const toggleRecording = useCallback(() => {
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) { alert('Try Chrome for voice input.'); return; }

    // Use refs for all conditions — eliminates stale closure issues entirely
    if (voiceModeRef.current) {
      if (isSpeakingRef.current) {
        // Interrupt mid-speech: stop audio, keep voice mode, jump straight to listening
        try { sourceNodeRef.current?.stop(); } catch {}
        sourceNodeRef.current = null;
        window.speechSynthesis?.cancel();
        utteranceRef.current = null;
        utteranceTextRef.current = '';
        if (wordTimerRef.current) { clearInterval(wordTimerRef.current); wordTimerRef.current = null; }
        setCaptionWordIndex(-1);
        setIsPaused(false);
        setIsSpeaking(false);
        setSpeakingId(null);
        setTimeout(() => startListenRef.current(), 150);
      } else if (isRecordingRef.current) {
        // Actively recording → tap ends the whole session
        stopEverything();
      } else {
        // Standby → user tapped to speak.
        // Kill any lingering recognition first (mic may still be held from
        // a previous turn's onspeechend gap or a failed auto-restart).
        voiceModeRef.current = true;
        try { recognitionRef.current?.abort(); } catch {}
        recognitionRef.current = null;
        setIsRecording(false);
        // Small delay so Chrome can release the mic before we re-open it
        setTimeout(() => { if (voiceModeRef.current) startListenRef.current(); }, 200);
      }
      return;
    }

    // Idle → start fresh conversation
    const AC = window.AudioContext || (window as any).webkitAudioContext;
    if (!audioCtxRef.current) audioCtxRef.current = new AC();
    audioCtxRef.current.resume();
    voiceModeRef.current = true;
    setVoiceMode(true);
    setTimeout(() => startListening(), 350);
  }, [startListening, stopEverything]);

  // Send a suggestion as a chat message (no TTS — text-only response)
  const handleSuggestion = useCallback(async (text: string) => {
    setActive(1); // switch to Chat card
    await new Promise(r => setTimeout(r, 80)); // let the card animate in
    sendVoiceMessageRef.current(text);
  }, []);

  // Compute style for each card based on distance from active.
  // Cards are centered via left:0/right:0/margin:auto — translateX offsets are purely
  // for the peek/slide animation and do NOT need a centering component.
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
      // Mobile: push fully off-screen right; desktop: peek right
      transform: isMobile ? 'translateX(115%) scale(0.8)' : 'translateX(58%) scale(0.86)',
      opacity: isMobile ? 0 : 0.55,
      zIndex: 5,
      boxShadow: '0 12px 40px rgba(0,0,0,0.4)',
      border: '1px solid rgba(255,255,255,0.06)',
      cursor: 'pointer', pointerEvents: isMobile ? 'none' : 'all',
    };
    if (diff === -1 || diff === (total - 1)) return {
      // Mobile: push fully off-screen left; desktop: peek left
      transform: isMobile ? 'translateX(-115%) scale(0.8)' : 'translateX(-58%) scale(0.86)',
      opacity: isMobile ? 0 : 0.55,
      zIndex: 5,
      boxShadow: '0 12px 40px rgba(0,0,0,0.4)',
      border: '1px solid rgba(255,255,255,0.06)',
      cursor: 'pointer', pointerEvents: isMobile ? 'none' : 'all',
    };
    return {
      transform: `translateX(${diff * 80}%) scale(0.72)`,
      opacity: 0, zIndex: 1, pointerEvents: 'none',
    };
  };

  const cards = [
    <AvatarSection key="avatar" lastAIMessage={lastAIMsg} isSpeaking={isSpeaking} isRecording={isRecording} isLoading={isLoading} isVoiceMode={voiceMode} onToggleTalk={toggleRecording}
      volume={volume} isMuted={isMuted} isPaused={isPaused}
      onVolumeUp={() => handleVolumeChange(10)} onVolumeDown={() => handleVolumeChange(-10)}
      onVolumeSet={(v) => { setVolume(v); applyVolume(v, isMuted); if (v > 0) setIsMuted(false); }}
      onMute={handleMute} onPause={handlePause} captionWordIndex={captionWordIndex}
      onVolumeCommit={handleVolumeCommit} />,
    <ChatInterface key="chat" messages={messages} setMessages={setMessages} isLoading={isLoading} setIsLoading={setIsLoading}
      isRecording={isRecording} setIsRecording={setIsRecording} isSpeaking={isSpeaking} setIsSpeaking={setIsSpeaking}
      speakingId={speakingId} setSpeakingId={setSpeakingId} onAIMessage={setLastAIMsg} />,
    <InfoPanel key="resume" />,
    <BeyondCard key="beyond" />,
  ];

  return (
    <>
      {/*
        Layout is driven entirely by CSS media queries in globals.css.
        No isMobile state used for any positioning — zero hydration mismatch.
      */}
      <div className="app-container">

        {/* Background effects */}
        <div style={{ position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none' }}>
          <div className="orb orb-1" /><div className="orb orb-2" /><div className="orb orb-3" />
          <ParticleBackground />
        </div>

        {/* Header — always a flex child inside the container */}
        <div className="app-header">
          <h1 className="app-header-title" style={{ fontWeight: 800, letterSpacing: '-0.02em', color: '#e0e7ff' }}>
            👩‍💻 Talk to Indrani&apos;s AI Clone
          </h1>

          {/* Mobile link row — hidden on desktop via CSS */}
          <div className="header-links-mobile">
            {LINKS_FULL.map(({ label, href, emoji }) => (
              <a key={label} href={href} target="_blank" rel="noopener noreferrer"
                style={{ flexShrink: 0, fontSize: 11, color: '#94a3b8', textDecoration: 'none', padding: '5px 11px', borderRadius: 999, border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.03)', whiteSpace: 'nowrap' }}>
                {emoji} {label}
              </a>
            ))}
            <button
              onClick={() => { setActive(2); setTimeout(() => { document.getElementById('cert-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' }); }, 500); }}
              style={{ flexShrink: 0, fontSize: 11, color: '#94a3b8', padding: '5px 11px', borderRadius: 999, border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.03)', cursor: 'pointer', whiteSpace: 'nowrap' }}>
              🏅 Certs
            </button>
          </div>

          {/* Desktop link row — hidden on mobile via CSS */}
          <div className="header-links-desktop">
            {LINKS_FULL.map(({ label, href }) => (
              <a key={label} href={href} target="_blank" rel="noopener noreferrer"
                style={{ fontSize: 12, color: '#94a3b8', textDecoration: 'none', padding: '6px 20px', borderRadius: 999, border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.03)', transition: 'all 0.2s' }}
                onMouseEnter={e => { const el = e.currentTarget as HTMLAnchorElement; el.style.borderColor = 'rgba(99,102,241,0.4)'; el.style.background = 'rgba(99,102,241,0.08)'; el.style.color = '#c7d2fe'; }}
                onMouseLeave={e => { const el = e.currentTarget as HTMLAnchorElement; el.style.borderColor = 'rgba(255,255,255,0.1)'; el.style.background = 'rgba(255,255,255,0.03)'; el.style.color = '#94a3b8'; }}>
                View my {label}
              </a>
            ))}
            <button
              onClick={() => { setActive(2); setTimeout(() => { document.getElementById('cert-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' }); }, 500); }}
              style={{ fontSize: 12, color: '#94a3b8', padding: '6px 20px', borderRadius: 999, border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.03)', transition: 'all 0.2s', cursor: 'pointer' }}
              onMouseEnter={e => { const el = e.currentTarget as HTMLButtonElement; el.style.borderColor = 'rgba(99,102,241,0.4)'; el.style.background = 'rgba(99,102,241,0.08)'; el.style.color = '#c7d2fe'; }}
              onMouseLeave={e => { const el = e.currentTarget as HTMLButtonElement; el.style.borderColor = 'rgba(255,255,255,0.1)'; el.style.background = 'rgba(255,255,255,0.03)'; el.style.color = '#94a3b8'; }}>
              My Certifications
            </button>
          </div>
        </div>

        {/* Cards + dots */}
        <div className="app-body">
          <FloatingTech />

          {/* Carousel track */}
          <div className="carousel-track" onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
            <button onClick={prev} style={{
              position: 'absolute', left: 8, top: '50%', transform: 'translateY(-50%)',
              zIndex: 20, width: 36, height: 36, borderRadius: '50%',
              background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
              backdropFilter: 'blur(8px)', color: 'rgba(255,255,255,0.6)', fontSize: 15, cursor: 'pointer',
            }}>‹</button>

            {cards.map((card, i) => (
              <div key={i} className="carousel-card" onClick={() => i !== active && setActive(i)}
                style={getCardStyle(i)}>
                <div style={{ width: '100%', height: '100%', borderRadius: 10, overflow: 'hidden' }}>
                  {card}
                </div>
              </div>
            ))}

            <button onClick={next} style={{
              position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)',
              zIndex: 20, width: 36, height: 36, borderRadius: '50%',
              background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
              backdropFilter: 'blur(8px)', color: 'rgba(255,255,255,0.6)', fontSize: 15, cursor: 'pointer',
            }}>›</button>
          </div>

          {/* Dots */}
          <div style={{ flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
            <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(167,139,250,0.7)' }}>
              {CARD_LABELS[active]}
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              {CARD_LABELS.map((_, i) => (
                <button key={i} onClick={() => setActive(i)} style={{
                  borderRadius: 999, border: 'none', cursor: 'pointer',
                  width: active === i ? 24 : 7, height: 7,
                  background: active === i ? 'linear-gradient(135deg, #6366f1, #8b5cf6)' : 'rgba(255,255,255,0.15)',
                  boxShadow: active === i ? '0 0 8px rgba(99,102,241,0.4)' : 'none',
                  transition: 'all 0.3s',
                }} />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Suggestion bubble — fixed bottom-left, outside the card container */}
      <SuggestionBubble onSuggest={handleSuggestion} />

      {/* Feedback widget — fixed bottom-right */}
      <FeedbackWidget />

      {/* Coffee badge — fixed top-right */}
      <CoffeeBadge />
    </>
  );
}

// Invisible spacer that mirrors the header height so the card area starts below it
function HeaderSpacer() {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 640);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);
  return (
    <div style={{
      flexShrink: 0,
      padding: isMobile ? '10px 12px' : '16px 24px',
      visibility: 'hidden',
      pointerEvents: 'none',
    }}>
      <div style={{ fontSize: isMobile ? 14 : 18, fontWeight: 800, lineHeight: 1.4 }}>placeholder</div>
      <div style={{ marginTop: isMobile ? 8 : 10, height: isMobile ? 27 : 32 }} />
    </div>
  );
}
