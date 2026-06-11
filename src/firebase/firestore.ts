'use client';

import {
  collection as createCollection,
  doc as createDoc,
  addDoc as addDocument,
  setDoc as setDocument,
  updateDoc as updateDocument,
  deleteDoc as deleteDocument,
  getDoc as getDocument,
  writeBatch as createBatch,
  query as createQuery,
  where as createWhere,
  orderBy as createOrderBy,
  getDocs as getDocuments,
  serverTimestamp as createServerTimestamp,
  LocalCollectionRef,
  LocalDocRef,
  LocalQuery,
} from '@/firebase/mock-db';

export type Firestore = object;

export type { LocalCollectionRef as CollectionReference, LocalDocRef as DocumentReference, LocalQuery as Query };
export { createCollection as collection };
export { createDoc as doc };
export { addDocument as addDoc };
export { setDocument as setDoc };
export { updateDocument as updateDoc };
export { deleteDocument as deleteDoc };
export { createBatch as writeBatch };
export { createQuery as query };
export { createWhere as where };
export { createOrderBy as orderBy };
export { getDocuments as getDocs };
export { getDocument as getDoc };
export { createServerTimestamp as serverTimestamp };

export function initializeFirestore(): Firestore {
  return {};
}
