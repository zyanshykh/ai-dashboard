"use client";

import { useCallback, useState } from "react";

type Msg = { id?: string | number; role?: string; content?: string };

export default function useStreamingChat() {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [status, setStatus] = useState<'ready'|'streaming'|'error'|'idle'>('ready');
  const [error, setError] = useState<any>(null);

  const sendMessage = useCallback(async (text: string) => {
    if (!text) return;
    // Append user message
    const userMsg: Msg = { id: Date.now() + '-u', role: 'user', content: text };
    setMessages((s) => [...s, userMsg]);

    // Append empty assistant message for streaming
    const assistantId = Date.now() + '-a';
    const assistantMsg: Msg = { id: assistantId, role: 'assistant', content: '' };
    setMessages((s) => [...s, assistantMsg]);

    setStatus('streaming');
    setError(null);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [{ role: 'user', content: text }] }),
      });

      if (!res.body) {
        const txt = await res.text();
        setMessages((s) => s.map((m) => m.id === assistantId ? { ...m, content: txt } : m));
        setStatus('ready');
        return;
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let done = false;
      while (!done) {
        const { value, done: d } = await reader.read();
        done = d;
        if (value) {
          const chunk = decoder.decode(value);
          setMessages((s) => s.map((m) => m.id === assistantId ? { ...m, content: (m.content || '') + chunk } : m));
        }
      }

      setStatus('ready');
    } catch (err) {
      setError(err);
      setStatus('error');
      setMessages((s) => s.map((m) => m.id === assistantId ? { ...m, content: (m.content || '') + '\n\n[Stream failed]' } : m));
    }
  }, []);

  const setAllMessages = useCallback((list: Msg[]) => setMessages(list), []);

  return { messages, sendMessage, status, error, setAllMessages };
}
