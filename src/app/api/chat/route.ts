import { createOpenAI } from '@ai-sdk/openai';
import { streamText } from 'ai';

const openrouter = createOpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: process.env.OPENROUTER_API_KEY,
  headers: {
    'HTTP-Referer': process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
    'X-Title': 'AI Founder Dashboard',
  },
});

export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    // Agar await par line hai, toh safely request text parse karke json nikalenge
    const body = await req.json();
    const messages = body.messages || [];

    // Convert UIMessage shape (with `parts`) into simple model messages
    // expected by the model: { role: 'user'|'assistant'|'system', content: string }
    const modelMessages = (messages || []).map((m: any) => {
      // If message already has `content` as string, prefer it
      if (typeof m.content === 'string' && m.content.trim() !== '') {
        return { role: m.role, content: m.content };
      }

      // If message has `parts`, join all text parts into a single string
      if (Array.isArray(m.parts)) {
        const text = m.parts
          .map((p: any) => (p && p.type === 'text' ? String(p.text || '') : ''))
          .filter(Boolean)
          .join('\n');
        return { role: m.role, content: text };
      }

      // Fallback: empty content
      return { role: m.role, content: '' };
    });

    // Log incoming and transformed messages for easier debugging
    console.debug('Incoming messages:', JSON.stringify(messages));
    console.debug('Model messages:', JSON.stringify(modelMessages));

    const modelSlug = process.env.OPENROUTER_MODEL || 'meta-llama/llama-3-8b-instruct';
    const result = await streamText({
      model: openrouter.chat(modelSlug),
      messages: modelMessages,
    });

    return result.toUIMessageStreamResponse();
  } catch (error) {
    console.error('❌ BACKEND LLM ERROR:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Failed to fetch AI response' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}