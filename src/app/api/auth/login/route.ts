import { NextResponse } from 'next/server';
import { verifyUser } from '@/lib/auth/users';

export async function POST(req: Request) {
  const body = await req.json();
  const { email, password } = body;
  if (!email || !password) {
    return NextResponse.json({ error: 'Email and password are required.' }, { status: 400 });
  }

  const normalizedEmail = String(email).trim().toLowerCase();
  const user = await verifyUser(normalizedEmail, password);
  if (!user) {
    return NextResponse.json({ error: 'Invalid email or password.' }, { status: 401 });
  }

  return NextResponse.json({ user: { id: user.id, name: user.name, email: user.email } });
}
