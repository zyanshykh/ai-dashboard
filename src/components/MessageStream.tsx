"use client";

import React from "react";
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import CodeBlock from "./CodeBlock";

type Message = {
  id?: string | number;
  role?: "user" | "bot" | string;
  content?: string;
  parts?: Array<{ type?: string; text?: string }>;
};

export default function MessageStream({ messages }: { messages?: Message[] }) {
  const hasMessages = Array.isArray(messages) && messages.length > 0;

  const renderContent = (m: Message) => {
    if (typeof m.content === "string" && m.content.trim()) return m.content;
    if (Array.isArray(m.parts)) {
      return m.parts
        .filter((p) => p?.type === "text" && p.text)
        .map((p) => String(p.text))
        .join("");
    }
    return "";
  };

  return (
    <section aria-label="Conversation" role="log" className="flex-1 space-y-4 overflow-y-auto mb-6 pr-2 custom-scrollbar">
      {!hasMessages ? (
        <div className="h-full flex flex-col items-center justify-center text-center space-y-3 opacity-60 my-auto py-20">
          <p className="text-lg font-medium muted">Welcome to your Open-Source AI Agent Workspace</p>
          <p className="text-sm mono muted">Run your prompts. Code base integration ready.</p>
        </div>
      ) : (
        <AnimatePresence initial={false} mode="popLayout">
        {messages!.map((m, index) => {
          const content = renderContent(m);
          const key = m.id ?? index;
          const isUser = m.role === "user";

          return (
            <motion.article
              layout
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.22 }}
              key={key}
              aria-live={isUser ? "polite" : "assertive"}
              className={`flex flex-col p-4 rounded-xl ${isUser ? "msg-user ml-12 self-end max-w-[75%]" : "msg-bot mr-12 self-start max-w-[75%]"}`}
            >
              <span className={`text-xs mono mb-1 tracking-wider uppercase ${isUser ? "accent" : "primary"}`}>
                {isUser ? "❯ You" : "❯ Assistant"}
              </span>
              <div className="text-sm leading-relaxed text-ui">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  rehypePlugins={[rehypeHighlight]}
                  components={{
                    code({ inline, className, children, ...props }) {
                      if (inline) {
                        return (
                          <code className="px-1 py-0.5 rounded bg-[rgba(255,255,255,0.02)]">
                            {children}
                          </code>
                        );
                      }
                      return (
                        <CodeBlock className={className ?? ""}>
                          {String(children).replace(/\n$/, "")}
                        </CodeBlock>
                      );
                    }
                  }}
                >
                  {String(content)}
                </ReactMarkdown>
              </div>
            </motion.article>
          );
        })}
        </AnimatePresence>
      )}
    </section>
  );
}
