'use client';

import { loadDb, saveDb } from '@/firebase/mock-db';

export interface User {
  uid: string;
  email: string;
  displayName?: string | null;
  emailVerified?: boolean;
  phoneNumber?: string | null;
  providerData?: Array<{ providerId: string; uid: string }>;
  tenantId?: string | null;
}

export interface Auth {
  currentUser: User | null;
  _listeners: Array<(user: User | null) => void>;
}

const AUTH_STORAGE_KEY = 'smartrestai_auth';

function createAuthInstance(): Auth {
  return {
    currentUser: null,
    _listeners: [],
  };
}

const authInstance: Auth = createAuthInstance();

function persistAuthState(user: User | null) {
  if (typeof window === 'undefined') return;
  const payload = user ? JSON.stringify({ uid: user.uid, email: user.email }) : '';
  window.localStorage.setItem(AUTH_STORAGE_KEY, payload);
}

function restoreAuthState() {
  if (typeof window === 'undefined') return null;
  const value = window.localStorage.getItem(AUTH_STORAGE_KEY);
  if (!value) return null;
  try {
    const parsed = JSON.parse(value) as { uid: string; email: string };
    return { uid: parsed.uid, email: parsed.email, displayName: parsed.email, emailVerified: false, providerData: [], tenantId: null } as User;
  } catch {
    return null;
  }
}

function emitAuthStateChanged(user: User | null) {
  authInstance.currentUser = user;
  persistAuthState(user);
  authInstance._listeners.forEach((cb) => cb(user));
}

export function getAuth() {
  if (typeof window !== 'undefined' && !authInstance.currentUser) {
    const restored = restoreAuthState();
    if (restored) {
      authInstance.currentUser = restored;
    }
  }
  return authInstance;
}

export function onAuthStateChanged(auth: Auth, callback: (user: User | null) => void, errorCallback?: (error: Error) => void) {
  auth._listeners.push(callback);
  callback(auth.currentUser);
  return () => {
    auth._listeners = auth._listeners.filter((listener) => listener !== callback);
  };
}

export async function signInWithEmailAndPassword(auth: Auth, email: string, password: string) {
  const db = loadDb();
  const users = db.users || {};
  const found = Object.entries(users).find(([, userData]) => userData.email === email && userData.password === password);

  if (!found) {
    throw new Error('Credenciales inválidas.');
  }

  const [uid, userData] = found;
  const user: User = {
    uid,
    email: userData.email,
    displayName: `${userData.firstName || ''} ${userData.lastName || ''}`.trim() || userData.email,
    emailVerified: true,
    phoneNumber: null,
    providerData: [],
    tenantId: null,
  };

  emitAuthStateChanged(user);
  return { user };
}

export async function createUserWithEmailAndPassword(auth: Auth, email: string, password: string) {
  const db = loadDb();
  const existingUser = Object.values(db.users).find((user) => user.email === email);

  if (existingUser) {
    throw new Error('Ya existe una cuenta con ese correo electrónico.');
  }

  const uid = Math.random().toString(36).slice(2, 10);
  db.users[uid] = { email, password, createdAt: new Date().toISOString() };
  saveDb(db);

  const user: User = {
    uid,
    email,
    displayName: email,
    emailVerified: true,
    phoneNumber: null,
    providerData: [],
    tenantId: null,
  };

  emitAuthStateChanged(user);
  return { user };
}

export async function sendPasswordResetEmail(_auth: Auth, _email: string) {
  return Promise.resolve();
}

export async function signOut(_auth: Auth) {
  emitAuthStateChanged(null);
  return Promise.resolve();
}
