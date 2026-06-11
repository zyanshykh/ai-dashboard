"use client";

import { useState } from "react";
import { Copy } from "lucide-react";

export default function CodeBlock({ className, children }: any) {
  const [copied, setCopied] = useState(false);
  const language = (className || "").replace("language-", "");

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(String(children));
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {}
  };

  return (
    <div className="relative rounded-lg overflow-hidden bg-[#0b1020] border border-[#1f2937]">
      <div className="px-3 py-2 flex items-center justify-between border-b border-[#111827]">
        <span className="text-xs muted">{language || "code"}</span>
        <button onClick={copy} className="text-sm px-2 py-1 rounded-md bg-[rgba(255,255,255,0.03)] hover:opacity-90">
          <Copy className="inline-block" /> {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <pre className="p-4 overflow-auto text-sm">{children}</pre>
    </div>
  );
}
