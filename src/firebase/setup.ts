'use client';

import { getAuth, Auth } from '@/firebase/auth';
import { initializeFirestore, Firestore } from '@/firebase/firestore';

export interface FirebaseServices {
  firebaseApp: object;
  auth: Auth;
  firestore: Firestore;
}

export function initializeFirebase(): FirebaseServices {
  return {
    firebaseApp: {},
    auth: getAuth(),
    firestore: initializeFirestore(),
  };
}
