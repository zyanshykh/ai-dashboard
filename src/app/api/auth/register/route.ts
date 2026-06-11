import { NextResponse } from 'next/server';
import { createUser } from '@/lib/auth/users';

export async function POST(req: Request) {
  const body = await req.json();
  const { name, email, password } = body;

  if (!name || !email || !password) {
    return NextResponse.json({ error: 'Name, email, and password are required.' }, { status: 400 });
  }

  try {
    const normalizedEmail = String(email).trim().toLowerCase();
    const user = await createUser({ name, email: normalizedEmail, password });
    return NextResponse.json({ user: { id: user.id, name: user.name, email: user.email } });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Unable to create user.' }, { status: 400 });
  }
}
