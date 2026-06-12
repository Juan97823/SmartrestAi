'use client';

import { getAuth, Auth } from '@/firebase/auth';
import { initializeFirestore, Firestore } from '@/firebase/firestore';

export interface LocalServices {
  app: object;
  auth: Auth;
  firestore: Firestore;
}

export function initializeLocalServices(): LocalServices {
  return {
    app: {},
    auth: getAuth(),
    firestore: initializeFirestore(),
  };
}
