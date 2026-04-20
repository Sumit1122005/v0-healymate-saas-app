'use client';

import { userDB, User } from './db';
import { hashPassword, verifyPasswordHash } from './encryption';

export interface AuthUser {
  id: string;
  email: string;
}

export interface AuthSession {
  user: AuthUser;
  isAuthenticated: boolean;
}

// Session storage using sessionStorage
const SESSION_KEY = 'healymate_session';
const CURRENT_USER_KEY = 'healymate_user';

export async function signup(email: string, password: string): Promise<{ success: boolean; error?: string }> {
  try {
    // Check if user already exists
    const existingUser = await userDB.getByEmail(email);
    if (existingUser) {
      return { success: false, error: 'Email already registered' };
    }

    // Create new user
    const userId = crypto.randomUUID();
    const passwordHash = await hashPassword(password);

    const newUser: User = {
      id: userId,
      email,
      passwordHash,
      createdAt: Date.now(),
    };

    await userDB.create(newUser);

    // Set session
    const session: AuthSession = {
      user: { id: userId, email },
      isAuthenticated: true,
    };

    sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
    sessionStorage.setItem(CURRENT_USER_KEY, JSON.stringify({ id: userId, email }));

    return { success: true };
  } catch (error) {
    console.error('Signup error:', error);
    return { success: false, error: 'Failed to create account' };
  }
}

export async function login(email: string, password: string): Promise<{ success: boolean; error?: string }> {
  try {
    const user = await userDB.getByEmail(email);

    if (!user) {
      return { success: false, error: 'User not found' };
    }

    const isValidPassword = await verifyPasswordHash(password, user.passwordHash);
    if (!isValidPassword) {
      return { success: false, error: 'Invalid password' };
    }

    // Set session
    const session: AuthSession = {
      user: { id: user.id, email: user.email },
      isAuthenticated: true,
    };

    sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
    sessionStorage.setItem(CURRENT_USER_KEY, JSON.stringify({ id: user.id, email: user.email }));

    return { success: true };
  } catch (error) {
    console.error('Login error:', error);
    return { success: false, error: 'Failed to login' };
  }
}

export function logout(): void {
  sessionStorage.removeItem(SESSION_KEY);
  sessionStorage.removeItem(CURRENT_USER_KEY);
}

export function getSession(): AuthSession | null {
  if (typeof window === 'undefined') return null;

  try {
    const sessionData = sessionStorage.getItem(SESSION_KEY);
    return sessionData ? JSON.parse(sessionData) : null;
  } catch {
    return null;
  }
}

export function getCurrentUser(): AuthUser | null {
  if (typeof window === 'undefined') return null;

  try {
    const userData = sessionStorage.getItem(CURRENT_USER_KEY);
    return userData ? JSON.parse(userData) : null;
  } catch {
    return null;
  }
}

export function isAuthenticated(): boolean {
  const session = getSession();
  return session?.isAuthenticated ?? false;
}
