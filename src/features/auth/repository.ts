import * as Crypto from 'expo-crypto';
import { readJson, writeJson } from '../../services/fileStorage';
import { Session, User } from '../../models/User';

function hashPassword(email: string, password: string): Promise<string> {
  return Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, `${email}:${password}`);
}

export async function signUp(name: string, email: string, password: string): Promise<User> {
  const users = await readJson<User[]>('users');
  const cleanEmail = email.trim().toLowerCase();
  if (users.some((u) => u.email === cleanEmail)) {
    throw new Error('An account with this email already exists');
  }
  const user: User = {
    id: `user-${Date.now()}`,
    name: name.trim(),
    email: cleanEmail,
    passwordHash: await hashPassword(cleanEmail, password),
    createdAt: new Date().toISOString(),
  };
  await writeJson('users', [...users, user]);
  await writeJson<Session>('session', { userId: user.id });
  return user;
}

export async function logIn(email: string, password: string): Promise<User> {
  const users = await readJson<User[]>('users');
  const cleanEmail = email.trim().toLowerCase();
  const hash = await hashPassword(cleanEmail, password);
  const user = users.find((u) => u.email === cleanEmail && u.passwordHash === hash);
  if (!user) throw new Error('Wrong email or password');
  await writeJson<Session>('session', { userId: user.id });
  return user;
}

export async function getCurrentUser(): Promise<User | null> {
  const session = await readJson<Session>('session');
  if (!session.userId) return null;
  const users = await readJson<User[]>('users');
  return users.find((u) => u.id === session.userId) ?? null;
}

export async function logOut(): Promise<void> {
  await writeJson<Session>('session', { userId: null });
}