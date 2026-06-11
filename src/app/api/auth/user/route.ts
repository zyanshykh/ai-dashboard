import { NextResponse } from 'next/server';
import { findUserById } from '@/lib/auth/users';

export async function GET(req: Request) {
  const id = req.headers.get('x-user-id');
  if (!id) {
    return NextResponse.json({ user: null });
  }

  const user = await findUserById(id);
  if (!user) {
    return NextResponse.json({ user: null });
  }

  return NextResponse.json({ user: { id: user.id, name: user.name, email: user.email } });
}
