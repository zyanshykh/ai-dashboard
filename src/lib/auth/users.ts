import { promises as fs } from 'fs';
import { join } from 'path';
import { createHash, randomUUID } from 'crypto';

const usersFile = join(process.cwd(), 'users.json');
const PASSWORD_SALT = 'ai-dashboard-local-salt';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  createdAt: string;
}

async function readUsers(): Promise<AuthUser[]> {
  try {
    const raw = await fs.readFile(usersFile, 'utf8');
    return JSON.parse(raw) as AuthUser[];
  } catch (error) {
    return [];
  }
}

async function writeUsers(users: AuthUser[]): Promise<void> {
  await fs.writeFile(usersFile, JSON.stringify(users, null, 2), 'utf8');
}

function hashPassword(password: string): string {
  return createHash('sha256')
    .update(`${PASSWORD_SALT}:${password}`)
    .digest('hex');
}

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

export async function findUserByEmail(email: string): Promise<AuthUser | undefined> {
  const normalized = normalizeEmail(email);
  const users = await readUsers();
  return users.find((user) => user.email === normalized);
}

export async function findUserById(id: string): Promise<AuthUser | undefined> {
  const users = await readUsers();
  return users.find((user) => user.id === id);
}

export async function createUser({ name, email, password }: { name: string; email: string; password: string; }): Promise<AuthUser> {
  const normalized = normalizeEmail(email);
  const users = await readUsers();
  const existing = users.find((user) => user.email === normalized);
  if (existing) {
    throw new Error('A user with that email already exists.');
  }

  const passwordHash = hashPassword(password);
  const newUser: AuthUser = {
    id: randomUUID(),
    name: name.trim(),
    email: email.toLowerCase().trim(),
    passwordHash,
    createdAt: new Date().toISOString(),
  };

  users.push(newUser);
  await writeUsers(users);
  return newUser;
}

export async function verifyUser(email: string, password: string): Promise<AuthUser | null> {
  const user = await findUserByEmail(email);
  if (!user) return null;
  const isValid = hashPassword(password) === user.passwordHash;
  return isValid ? user : null;
}
