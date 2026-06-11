 'use client';

import { useChat } from '@ai-sdk/react';
import Header from '@/components/Header';
import AuthPanel from '@/components/AuthPanel';
import MessageStream from '@/components/MessageStream';
import Composer from '@/components/Composer';
import Sidebar from '@/components/Sidebar';
import ResearchInterface from '@/components/ResearchInterface';
import useStreamingChat from '@/lib/useStreamingChat';
import { useState } from 'react';
import { useCallback } from 'react';

export default function AIDashboard() {
  const { messages, sendMessage, status, error, setAllMessages } = useStreamingChat();

  const [input, setInput] = useState('');
  const [user, setUser] = useState<{ id: string; name: string; email: string } | null>(null);
  const isLoading = status !== 'ready';

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInput(event.target.value);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault?.();
    const value = input.trim();
    if (!value) return;

    await sendMessage(value);
    setInput('');
  };

  const saveConversation = useCallback(async () => {
    try {
      const res = await fetch('/api/conversations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: 'Saved Conversation', messages }),
      });
      if (!res.ok) throw new Error('Save failed');
      const data = await res.json();
      alert('Conversation saved: ' + data.id);
    } catch (err) {
      console.error(err);
      alert('Failed to save conversation');
    }
  }, [messages]);

  return (
    <div className="min-h-screen flex flex-col antialiased bg-[var(--background)] text-ui">
      {/* Premium Header */}
      <Header />

      {/* Main Workspace */}
      <main className="flex-1 w-full mx-auto p-4 md:p-6 min-h-[calc(100vh-73px)]">
        <div className="max-w-6xl mx-auto grid grid-cols-12 gap-6">
          <div className="col-span-12 md:col-span-3">
            <Sidebar />
          </div>
          <div className="col-span-12 md:col-span-9 max-w-4xl mx-auto flex flex-col">
        {/* Move auth into Sidebar; render only small banner here if needed */}

        {error && (
          <div className="mb-4 rounded-md bg-red-800/60 border border-red-700 p-3 text-sm text-red-100">
            API Error: {String(error.message || error)}
          </div>
        )}

        {/* Research-style interface (Kimi-like) */}
        <ResearchInterface />

        <MessageStream messages={messages || []} />

            <div className="mt-4 flex items-center justify-end">
              <button
                type="button"
                onClick={saveConversation}
                className="px-4 py-2 rounded-md bg-primary text-black hover:opacity-90"
              >
                Save Conversation
              </button>
            </div>

          </div>
        </div>

        <Composer value={input} onChange={(e: any) => setInput(e.target.value)} onSubmit={handleSubmit} isLoading={isLoading} />
      </main>
    </div>
  );
}