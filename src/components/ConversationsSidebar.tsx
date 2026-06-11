"use client";

import { useEffect, useState } from "react";

export default function ConversationsSidebar({ onLoad }: { onLoad: (messages: any[]) => void }) {
  const [list, setList] = useState<any[]>([]);

  const fetchList = async () => {
    try {
      const res = await fetch('/api/conversations');
      if (!res.ok) return;
      const data = await res.json();
      setList(data);
    } catch (err) { console.error(err); }
  };

  useEffect(() => { fetchList(); }, []);

  const handleLoad = (id: string) => async () => {
    const c = list.find((x) => String(x.id) === String(id));
    if (c) onLoad(c.messages || []);
  };

  const handleDelete = (id: string) => async () => {
    try {
      const res = await fetch('/api/conversations', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) });
      if (res.ok) setList((s) => s.filter((x) => String(x.id) !== String(id)));
    } catch (err) { console.error(err); }
  };

  return (
    <div className="mt-6">
      <h4 className="text-sm font-semibold muted mb-2">Conversations</h4>
      <div className="flex flex-col space-y-2">
        {list.length === 0 ? (<div className="text-xs muted">No saved conversations</div>) : (
          list.map((c) => (
            <div key={c.id} className="flex items-center justify-between p-2 rounded-md hover:bg-[var(--surface-2)]">
              <button className="text-sm text-ui text-left flex-1 truncate" onClick={handleLoad(c.id)}>{c.title || c.id}</button>
              <div className="flex items-center space-x-2">
                <button className="text-xs muted" onClick={handleDelete(c.id)}>Delete</button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
