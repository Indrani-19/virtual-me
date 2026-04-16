'use client';

import { useState, useRef, useEffect, useCallback } from 'react';

export interface Message {
  role: 'user' | 'assistant';
  content: string;
  isTyping?: boolean;
  hidden?: boolean;
}

interface ChatInterfaceProps {
  messages: Message[];
  setMessages: (msgs: Message[] | ((prev: Message[]) => Message[])) => void;
  isLoading: boolean;
  setIsLoading: (v: boolean) => void;
  isRecording: boolean;
  setIsRecording: (v: boolean) => void;
  isSpeaking: boolean;
  setIsSpeaking: (v: boolean) => void;
  speakingId: number | null;
  setSpeakingId: (id: number | null) => void;
  onAIMessage: (text: string) => void;
}

const SUGGESTED = [
  'Tell me about yourself',
  'What projects have you built?',
  'What are your top skills?',
  'Are you open to new opportunities?',
];

function renderMarkdown(text: string): React.ReactNode {
  return text.split('\n').map((line, li, arr) => {
    const isBullet = /^[-*•]\s/.test(line);
    const content  = isBullet ? line.replace(/^[-*•]\s/, '') : line;
    const parts    = content.split(/(\*\*[^*]+\*\*)/g);
    const nodes    = parts.map((p, pi) =>
      p.startsWith('**') && p.endsWith('**')
        ? <strong key={pi} className="text-indigo-200 font-semibold">{p.slice(2, -2)}</strong>
        : <span key={pi}>{p}</span>
    );
    if (isBullet) {
      return (
        <div key={li} className="flex gap-2 mt-1">
          <span className="text-indigo-400 shrink-0 mt-0.5">•</span>
          <span>{nodes}</span>
        </div>
      );
    }
    return (
      <span key={li}>
        {nodes}
        {li < arr.length - 1 && line !== '' && <br />}
      </span>
    );
  });
}

function TypingMessage({ text }: { text: string }) {
  const [disp, setDisp] = useState('');
  const [done, setDone] = useState(false);
  const idx = useRef(0);

  useEffect(() => {
    if (!text) { setDone(true); return; }
    idx.current = 0;
    setDisp('');
    setDone(false);
    const tick = () => {
      idx.current++;
      setDisp(text.slice(0, idx.current));
      if (idx.current < text.length) setTimeout(tick, 14);
      else setDone(true);
    };
    const t = setTimeout(tick, 60);
    return () => clearTimeout(t);
  }, [text]);

  return <span className={!done ? 'typing-cursor' : ''}>{renderMarkdown(disp)}</span>;
}

export default function ChatInterface({
  messages,
  setMessages,
  isLoading,
  setIsLoading,
  isRecording,
  setIsRecording,
  isSpeaking,
  setIsSpeaking,
  speakingId,
  setSpeakingId,
  onAIMessage,
}: ChatInterfaceProps) {
  const [inputVal, setInputVal]   = useState('');
  const bottomRef                 = useRef<HTMLDivElement>(null);
  const audioRef                  = useRef<HTMLAudioElement | null>(null);
  const recognitionRef            = useRef<any>(null);
  const inputRef                  = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const el = bottomRef.current;
    const scroller = el?.closest('.chat-scroll') as HTMLElement | null;
    if (scroller) scroller.scrollTop = scroller.scrollHeight;
  }, [messages, isLoading]);

  const sendMessage = useCallback(
    async (text: string) => {
      if (!text.trim() || isLoading) return;
      const userMsg: Message = { role: 'user', content: text };
      const updated = [...messages, userMsg];
      setMessages(updated);
      setInputVal('');
      setIsLoading(true);
      try {
        const res  = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ messages: updated }),
        });
        const data = await res.json();
        const aiMsg: Message = { role: 'assistant', content: data.message, isTyping: true };
        setMessages((prev) => [...prev, aiMsg]);
        onAIMessage(data.message);
      } catch {
        const errMsg: Message = { role: 'assistant', content: "Sorry, I couldn't connect. Please try again." };
        setMessages((prev) => [...prev, errMsg]);
        onAIMessage(errMsg.content);
      } finally {
        setIsLoading(false);
      }
    },
    [messages, isLoading]
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(inputVal);
  };

  const speakMessage = async (text: string, index: number) => {
    if (isSpeaking) {
      audioRef.current?.pause();
      setIsSpeaking(false);
      setSpeakingId(null);
      if (speakingId === index) return;
    }
    setSpeakingId(index);
    setIsSpeaking(true);
    try {
      const res  = await fetch('/api/speak', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });
      const blob = await res.blob();
      const url  = URL.createObjectURL(blob);
      const audio = new Audio(url);
      audioRef.current = audio;
      audio.play();
      audio.onended = () => { setIsSpeaking(false); setSpeakingId(null); };
    } catch {
      setIsSpeaking(false);
      setSpeakingId(null);
    }
  };

  const toggleRecording = () => {
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) { alert('Try Chrome for voice input.'); return; }
    if (isRecording) { recognitionRef.current?.stop(); setIsRecording(false); return; }
    const r = new SR();
    r.lang = 'en-US';
    r.interimResults = false;
    r.onresult = (e: any) => sendMessage(e.results[0][0].transcript);
    r.onend  = () => setIsRecording(false);
    r.onerror = () => setIsRecording(false);
    recognitionRef.current = r;
    r.start();
    setIsRecording(true);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Messages */}
      <div className="flex-1 chat-scroll px-4 py-5 space-y-4">
        {messages.length === 0 && !isLoading && (
          <div className="flex flex-col items-center justify-center h-full gap-5 text-center">
            <div>
              <p className="text-slate-300 font-medium">Ask me anything</p>
              <p className="text-slate-600 text-sm mt-1">about Indrani&apos;s work and experience</p>
            </div>
            <div className="flex flex-wrap gap-2 justify-center max-w-sm">
              {SUGGESTED.map((q) => (
                <button key={q} onClick={() => sendMessage(q)}
                  className="suggest-pill px-4 py-2 text-sm rounded-full text-purple-300 font-medium">
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.filter(m => !m.hidden).map((msg, i) => (
          <div key={i} className={`message-in flex gap-2.5 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            {msg.role === 'assistant' && (
              <div className="avatar-ring-sm w-8 h-8 shrink-0 mt-1">
                <div className="w-full h-full rounded-full flex items-center justify-center"
                  style={{ background: 'linear-gradient(135deg, #1e1b4b, #0f0c29)' }}>
                  <span style={{ fontSize: 11, fontWeight: 800, background: 'linear-gradient(135deg, #818cf8, #a78bfa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>II</span>
                </div>
              </div>
            )}
            <div className="flex flex-col gap-1 max-w-[78%]">
              <div
                className={`rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                  msg.role === 'user' ? 'rounded-tr-sm text-white' : 'glass rounded-tl-sm text-slate-100'
                }`}
                style={
                  msg.role === 'user'
                    ? { background: 'linear-gradient(135deg, #4f46e5, #7c3aed)', boxShadow: '0 4px 20px rgba(99,102,241,0.2)' }
                    : { borderColor: 'rgba(99,102,241,0.1)', boxShadow: '0 4px 20px rgba(0,0,0,0.25)' }
                }
              >
                {msg.role === 'assistant' && msg.isTyping
                  ? <TypingMessage text={msg.content ?? ''} />
                  : msg.role === 'assistant'
                  ? renderMarkdown(msg.content ?? '')
                  : msg.content}
              </div>
              {msg.role === 'assistant' && (
                <button onClick={() => speakMessage(msg.content, i)}
                  className="self-start ml-1 flex items-center gap-1 text-[11px] text-slate-600 hover:text-indigo-400 transition-colors">
                  {speakingId === i ? <><StopIcon /> Stop</> : <><SpeakerIcon /> Listen</>}
                </button>
              )}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="message-in flex gap-2.5">
            <div className="avatar-ring-sm w-8 h-8 shrink-0 mt-1">
              <div className="w-full h-full rounded-full flex items-center justify-center text-base"
                style={{ background: 'radial-gradient(ellipse, #1e1b4b, #090d1c)' }}>
                👩‍💻
              </div>
            </div>
            <div className="glass rounded-2xl rounded-tl-sm px-4 py-3.5 flex gap-1.5 items-center"
              style={{ borderColor: 'rgba(99,102,241,0.1)' }}>
              <div className="typing-dot" /><div className="typing-dot" /><div className="typing-dot" />
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input bar */}
      <div className="glass border-t px-4 py-3" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
        <form onSubmit={handleSubmit} className="flex gap-2 items-center">
          {/* Mic only shown on mobile — desktop uses the avatar panel's Talk button */}
          <button type="button" onClick={toggleRecording}
            className={`md:hidden w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-all ${
              isRecording ? 'recording bg-red-600 text-white' : 'glass text-slate-400 hover:text-indigo-400'
            }`}>
            <MicIcon />
          </button>
          <input
            ref={inputRef}
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            placeholder={isRecording ? 'Listening…' : 'Type your question…'}
            disabled={isLoading || isRecording}
            className="flex-1 rounded-full px-4 py-2.5 text-sm text-slate-100 placeholder-slate-600
              focus:outline-none transition-all disabled:opacity-40"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
            onFocus={e => (e.target.style.borderColor = 'rgba(99,102,241,0.4)')}
            onBlur={e  => (e.target.style.borderColor = 'rgba(255,255,255,0.08)')}
          />
          <button type="submit" disabled={!inputVal.trim() || isLoading}
            className="neon-btn-pink w-10 h-10 rounded-full flex items-center justify-center shrink-0 text-white cursor-pointer">
            <SendIcon />
          </button>
        </form>
      </div>
    </div>
  );
}

function MicIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 10v2a7 7 0 0 1-14 0v-2M12 19v4M8 23h8" />
    </svg>
  );
}
function SendIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
    </svg>
  );
}
function SpeakerIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.536 8.464a5 5 0 0 1 0 7.072M12 6v12l-4-4H5a1 1 0 0 1-1-1v-2a1 1 0 0 1 1-1h3l4-4z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.07 4.929a10 10 0 0 1 0 14.142" />
    </svg>
  );
}
function StopIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
      <rect x="4" y="4" width="16" height="16" rx="2" />
    </svg>
  );
}
