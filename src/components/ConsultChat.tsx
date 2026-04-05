'use client';

import { useState, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { MessageCircle, X, Send, Bot } from 'lucide-react';

type Msg = { role: 'user' | 'assistant'; text: string };

const GREETING =
  "Hi, I'm Nimbus — Deeptech's AI consultant. I can help you figure out if robotics or AI software is right for your operation, walk you through pricing, or answer any questions. What are you working on?";

const EXCLUDED_PREFIXES = ['/orders/', '/admin/', '/portal/', '/checkout/', '/quote/'];

function getSessionId(): string {
  try {
    let id = sessionStorage.getItem('nimbus-session');
    if (!id) {
      id = crypto.randomUUID();
      sessionStorage.setItem('nimbus-session', id);
    }
    return id;
  } catch {
    return crypto.randomUUID();
  }
}

export default function ConsultChat() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState<Msg[]>([{ role: 'assistant', text: GREETING }]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [hasUnread, setHasUnread] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const sessionId = useRef<string>('');

  useEffect(() => { sessionId.current = getSessionId(); }, []);
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [msgs]);

  const hidden = EXCLUDED_PREFIXES.some(p => pathname.startsWith(p));
  if (hidden) return null;

  async function send() {
    const text = input.trim();
    if (!text || loading) return;
    setInput('');
    setMsgs(prev => [...prev, { role: 'user', text }]);
    setLoading(true);
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text, sessionId: sessionId.current }),
      });
      const data = await res.json();
      if (!res.ok) {
        console.error('[Nimbus] API error', res.status, data);
      }
      const reply = data.reply || (res.status === 429
        ? 'You\'ve sent a few messages quickly — please wait a moment and try again.'
        : 'Sorry, I ran into an issue. Try again in a moment.');
      setMsgs(prev => [...prev, { role: 'assistant', text: reply }]);
      if (!open) setHasUnread(true);
    } catch (err) {
      console.error('[Nimbus] fetch error', err);
      setMsgs(prev => [...prev, { role: 'assistant', text: 'Connection issue. Please try again.' }]);
    } finally {
      setLoading(false);
    }
  }

  function toggle() {
    setOpen(o => !o);
    setHasUnread(false);
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      {/* Chat panel */}
      {open && (
        <div className="w-[360px] h-[500px] bg-white rounded-2xl shadow-2xl border border-[#e8e8e8] flex flex-col overflow-hidden animate-in slide-in-from-bottom-4 fade-in duration-200">
          {/* Header */}
          <div className="bg-[#111] px-4 py-3 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-white text-sm font-semibold">Nimbus</span>
              <span className="text-white/40 text-xs font-manrope">AI Consultant</span>
            </div>
            <button onClick={toggle} className="text-white/50 hover:text-white transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3 bg-white">
            {msgs.map((m, i) => (
              <div key={i} className={`flex gap-2 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                {m.role === 'assistant' && <Bot className="w-4 h-4 text-[#111] mt-1 shrink-0" />}
                <div className={`max-w-[82%] rounded-xl px-3 py-2 text-sm leading-relaxed ${
                  m.role === 'user'
                    ? 'bg-[#111] text-white'
                    : 'bg-[#f5f5f5] text-[#222]'
                }`}>
                  {m.text}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex gap-2">
                <Bot className="w-4 h-4 text-[#111] mt-1 shrink-0" />
                <div className="bg-[#f5f5f5] rounded-xl px-3 py-2 text-sm text-[#999]">Thinking…</div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="border-t border-[#eee] p-3 flex gap-2 shrink-0 bg-white">
            <input
              className="flex-1 text-sm text-[#111] border border-[#e0e0e0] rounded-lg px-3 py-2 outline-none focus:border-[#111] transition-colors font-manrope"
              placeholder="Ask about robotics, software, pricing…"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); } }}
            />
            <button
              onClick={send}
              disabled={!input.trim() || loading}
              className="bg-[#111] text-white rounded-lg px-3 py-2 hover:bg-[#333] transition-colors disabled:opacity-30 shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Toggle button */}
      <button
        onClick={toggle}
        className="bg-[#111] text-white rounded-full px-4 py-3 flex items-center gap-2 shadow-lg hover:bg-[#333] transition-colors relative"
      >
        {open ? <X className="w-4 h-4" /> : <MessageCircle className="w-4 h-4" />}
        {!open && <span className="text-sm font-medium">Chat with Nimbus</span>}
        {!open && hasUnread && (
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full" />
        )}
      </button>
    </div>
  );
}
