"use client";

import { useState } from "react";
import { Menu } from "lucide-react";
import { motion } from "framer-motion";
import ConversationsSidebar from "./ConversationsSidebar";
import AuthPanel from "./AuthPanel";

export default function Sidebar() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState('Research');
  const items = [
    { name: 'New Chat', icon: 'PlusSquare' },
    { name: 'Research', icon: 'BookOpen' },
    { name: 'Files', icon: 'FileText' },
    { name: 'Settings', icon: 'Settings' },
  ];

  return (
    <aside className="hidden md:block w-72 p-4">
      <div className="flex items-center justify-between mb-6">
        <div className="text-lg font-semibold text-ui">AI Dashboard</div>
        <button className="md:hidden" onClick={() => setOpen(!open)} aria-label="Toggle menu">
          <Menu />
        </button>
      </div>

      <nav className="flex flex-col space-y-3">
        {items.map((it, i) => {
          const isActive = active === it.name;
          return (
            <motion.button
              key={it.name}
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.03 }}
              onClick={() => setActive(it.name)}
              type="button"
              className={`text-sm text-ui flex items-center gap-3 px-3 py-2 rounded-md justify-start ${isActive ? 'bg-[var(--surface-2)] border-l-2 border-primary pl-3' : 'hover:bg-[var(--surface-2)]'}`}
            >
              {/* icon placeholder - lucide will be resolved via name */}
              <span className="w-4 h-4 bg-[rgba(255,255,255,0.03)] rounded-sm" aria-hidden />
              <span className="flex-1 text-left">{it.name}</span>
            </motion.button>
          );
        })}
      </nav>

      <div className="mt-6">
        <AuthPanel onAuth={() => {}} />
      </div>

      <ConversationsSidebar onLoad={() => {}} />
    </aside>
  );
}