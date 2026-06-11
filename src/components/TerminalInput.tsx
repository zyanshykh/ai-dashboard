'use client';

import React from 'react';

interface TerminalInputProps {
  input: string;
  isLoading: boolean;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}

export default function TerminalInput({
  input,
  isLoading,
  handleInputChange,
  handleSubmit,
}: TerminalInputProps) {
  return (
    <form onSubmit={handleSubmit} className="relative mt-auto">
      <div className="relative rounded-xl surface focus-within:border-cyan-500/50 transition-all shadow-2xl">
        <input
          type="text"
          className="w-full bg-transparent text-sm text-ui placeholder-muted pl-4 pr-24 py-4 focus:outline-none rounded-xl"
          placeholder="Ask anything or generate startup mechanics..."
          disabled={isLoading}
          value={input || ''}
          onChange={handleInputChange}
        />
        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center space-x-2">
          <button
            type="submit"
            disabled={isLoading || !input?.trim()}
            className="bg-gradient-to-r from-[#06b6d4] to-[#8b5cf6] hover:from-[#06b6d4] hover:to-[#8b5cf6] disabled:opacity-40 text-black font-semibold text-xs px-4 py-2 rounded-lg transition-all tracking-wide shadow-lg cursor-pointer"
          >
            {isLoading ? 'Processing...' : 'EXECUTE'}
          </button>
        </div>
      </div>
    </form>
  );
}