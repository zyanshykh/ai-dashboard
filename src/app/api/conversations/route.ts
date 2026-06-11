import { promises as fs } from 'fs';
import path from 'path';

const DATA_PATH = path.join(process.cwd(), 'data');
const FILE = path.join(DATA_PATH, 'conversations.json');

async function ensureFile() {
  try {
    await fs.mkdir(DATA_PATH, { recursive: true });
    await fs.access(FILE);
  } catch (e) {
    await fs.writeFile(FILE, JSON.stringify([]), 'utf-8');
  }
}

export async function GET() {
  try {
    await ensureFile();
    const raw = await fs.readFile(FILE, 'utf-8');
    const list = JSON.parse(raw || '[]');
    return new Response(JSON.stringify(list), { status: 200, headers: { 'Content-Type': 'application/json' } });
  } catch (err) {
    console.error('Error reading conversations file', err);
    return new Response(JSON.stringify({ error: 'Failed to read conversations' }), { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { title = 'Conversation', messages = [] } = body;
    await ensureFile();
    const raw = await fs.readFile(FILE, 'utf-8');
    const list = JSON.parse(raw || '[]');
    const id = Date.now().toString();
    const item = { id, title, messages, createdAt: new Date().toISOString() };
    list.unshift(item);
    await fs.writeFile(FILE, JSON.stringify(list, null, 2), 'utf-8');
    return new Response(JSON.stringify(item), { status: 201, headers: { 'Content-Type': 'application/json' } });
  } catch (err) {
    console.error('Error saving conversation', err);
    return new Response(JSON.stringify({ error: 'Failed to save conversation' }), { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const body = await req.json();
    const { id } = body;
    if (!id) return new Response(JSON.stringify({ error: 'Missing id' }), { status: 400 });
    await ensureFile();
    const raw = await fs.readFile(FILE, 'utf-8');
    const list = JSON.parse(raw || '[]');
    const filtered = list.filter((item: any) => String(item.id) !== String(id));
    await fs.writeFile(FILE, JSON.stringify(filtered, null, 2), 'utf-8');
    return new Response(JSON.stringify({ ok: true }), { status: 200 });
  } catch (err) {
    console.error('Error deleting conversation', err);
    return new Response(JSON.stringify({ error: 'Failed to delete conversation' }), { status: 500 });
  }
}
