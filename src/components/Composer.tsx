"use client";

import { useRef, useState, useEffect, type ChangeEvent, type FormEvent } from "react";
import { Paperclip, Globe, ArrowRight } from "lucide-react";

interface ComposerProps {
  value?: string;
  onChange?: (event: ChangeEvent<HTMLTextAreaElement>) => void;
  onSubmit?: (event: FormEvent<HTMLFormElement>) => void;
  isLoading?: boolean;
}

export default function Composer({
  value = '',
  onChange,
  onSubmit,
  isLoading = false,
}: ComposerProps) {
  const [query, setQuery] = useState(value);
  const [webEnabled, setWebEnabled] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.style.height = 'auto';
    ta.style.height = Math.min(200, ta.scrollHeight) + 'px';
  }, [query]);

  const handleInput = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setQuery(e.target.value);
    onChange?.(e);
  };

  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!query.trim()) return;
    onSubmit?.(e);
  };

  return (
    <form
      onSubmit={submit}
      className="w-full fixed bottom-4 left-0 flex justify-center px-4 pointer-events-auto"
    >
      <div className="max-w-3xl w-full flex items-end gap-3">
        <div className="flex-1 surface rounded-3xl p-3 relative flex items-center gap-3">
          <button
            type="button"
            className="p-2 rounded-2xl hover:bg-[var(--surface-2)] transition"
          >
            <Paperclip />
          </button>

          <textarea
            ref={textareaRef}
            value={query}
            onChange={handleInput}
            placeholder="Ask anything or generate startup mechanics..."
            className="flex-1 resize-none bg-transparent px-3 py-3 text-ui outline-none placeholder:text-zinc-500 max-h-[200px]"
          />

          <button
            type="button"
            onClick={() => setWebEnabled((current) => !current)}
            className={`rounded-full px-3 py-1 text-sm transition ${
              webEnabled
                ? 'bg-primary text-black shadow-[0_10px_30px_rgba(6,182,212,0.16)]'
                : 'bg-transparent border border-[rgba(255,255,255,0.08)] text-muted'
            }`}
          >
            <Globe className="inline-block mr-1" /> Web
          </button>

          <button
            type="submit"
            disabled={isLoading || !query.trim()}
            className={`absolute right-3 bottom-3 rounded-full p-2 transition ${
              query.trim() ? 'bg-ui text-black' : 'bg-[rgba(255,255,255,0.03)] text-muted'
            }`}
          >
            <ArrowRight />
          </button>
        </div>
      </div>
    </form>
  );
}
