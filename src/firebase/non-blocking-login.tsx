'use client';
import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from '@/firebase/auth';

export function initiateAnonymousSignIn(_authInstance: Auth): void {
  // Anonymous sign-in is not supported in the local implementation.
}

export function initiateEmailSignUp(authInstance: Auth, email: string, password: string): void {
  createUserWithEmailAndPassword(authInstance, email, password).catch(() => {
    // Non-blocking sign-up should not throw synchronously.
  });
}

export function initiateEmailSignIn(authInstance: Auth, email: string, password: string): void {
  signInWithEmailAndPassword(authInstance, email, password).catch(() => {
    // Non-blocking sign-in should not throw synchronously.
  });
}
