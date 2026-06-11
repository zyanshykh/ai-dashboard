"use client";

import { useState } from "react";

export default function ResearchInterface() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Array<{ id: string; title: string; snippet: string }>>([]);
  const categories = ["Overview", "Market", "Technology", "Papers", "People"];
  const [activeCat, setActiveCat] = useState("Overview");

  const mockSearch = async (q: string) => {
    if (!q) return;
    try {
      const payload = { messages: [{ role: 'user', content: q }] };
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      // Attempt to read the response as text (works for non-streaming or finished streams)
      const text = await res.text();
      const items = [
        { id: String(Date.now()), title: `${q} — Insight`, snippet: text || 'No content returned' },
      ];
      setResults(items);
    } catch (err) {
      console.error('Research fetch failed', err);
      setResults([{ id: String(Date.now()), title: `${q} — Insight`, snippet: 'Failed to fetch AI result' }]);
    }
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mockSearch(query.trim() || activeCat);
  };

  return (
    <div className="w-full mb-6">
      <div className="card p-3 mb-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="text-sm font-semibold text-ui">Research</div>
          <div className="flex items-center gap-2 bg-[rgba(255,255,255,0.02)] rounded-full p-1">
            {categories.map((c) => (
              <button key={c} onClick={() => { setActiveCat(c); setQuery(''); setResults([]); }} className={`px-3 py-1 rounded-full text-sm ${activeCat === c ? 'bg-primary text-black' : 'text-muted hover:bg-[var(--surface-2)]'}`}>
                {c}
              </button>
            ))}
          </div>
        </div>

        <form onSubmit={onSubmit} className="flex gap-3 items-center">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={`Ask about ${activeCat}...`}
            className="flex-1 bg-transparent border border-gray-800 rounded-lg px-4 py-3 text-ui outline-none"
          />
          <button className="px-4 py-2 rounded-md bg-primary text-black">Search</button>
        </form>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {results.length === 0 ? (
          <div className="col-span-1 card p-8 text-center muted">No results — try a search or pick a category.</div>
        ) : (
          results.map((r) => (
            <article key={r.id} className="card p-4">
              <h4 className="text-lg font-semibold text-ui">{r.title}</h4>
              <p className="text-sm muted mt-2">{r.snippet}</p>
              <div className="mt-3 flex items-center justify-between">
                <div className="text-xs muted">Source: internal</div>
                <div className="text-xs">
                  <button className="text-primary mr-2">Open</button>
                  <button className="text-accent">Save</button>
                </div>
              </div>
            </article>
          ))
        )}
      </div>
    </div>
  );
}
