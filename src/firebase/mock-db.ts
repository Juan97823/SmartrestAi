'use client';

export interface LocalDocRef {
  path: string;
  id: string;
  type: 'doc';
}

export interface LocalCollectionRef {
  path: string;
  type: 'collection';
}

export interface LocalQuery {
  collectionPath: string;
  filters: Array<{ field: string; op: '==' | 'in'; value: any }>;
  orderBys: Array<{ field: string; direction: 'asc' | 'desc' }>;
}

export interface LocalBatchOp {
  type: 'set' | 'update';
  ref: LocalDocRef;
  data: any;
}

const DB_KEY = 'smartrestai_local_db';

interface StoredCollections {
  users: Record<string, any>;
  orders: Record<string, any>;
  ingredients: Record<string, any>;
  roles_waiter: Record<string, any>;
}

const defaultDb: StoredCollections = {
  users: {},
  orders: {},
  ingredients: {},
  roles_waiter: {},
};

export function loadDb(): StoredCollections {
  if (typeof window === 'undefined') {
    return { ...defaultDb };
  }

  const value = window.localStorage.getItem(DB_KEY);
  if (!value) {
    window.localStorage.setItem(DB_KEY, JSON.stringify(defaultDb));
    return { ...defaultDb };
  }

  try {
    return JSON.parse(value) as StoredCollections;
  } catch {
    window.localStorage.setItem(DB_KEY, JSON.stringify(defaultDb));
    return { ...defaultDb };
  }
}

export function saveDb(data: StoredCollections) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(DB_KEY, JSON.stringify(data));
}

function createId() {
  return Math.random().toString(36).slice(2, 10);
}

export function collection(_db: unknown, path: string): LocalCollectionRef {
  return { path, type: 'collection' };
}

export function doc(arg1: LocalCollectionRef | unknown, arg2?: string, arg3?: string): LocalDocRef {
  if (typeof arg1 === 'object' && arg1 && (arg1 as LocalCollectionRef).type === 'collection') {
    const collectionRef = arg1 as LocalCollectionRef;
    const id = arg2 || createId();
    return { path: `${collectionRef.path}/${id}`, id, type: 'doc' };
  }

  if (typeof arg2 === 'string' && typeof arg3 === 'string') {
    return { path: `${arg2}/${arg3}`, id: arg3, type: 'doc' };
  }

  throw new Error('Invalid doc() arguments.');
}

export function serverTimestamp() {
  return new Date().toISOString();
}

export function addDoc(collectionRef: LocalCollectionRef, data: any) {
  const db = loadDb();
  const id = createId();
  const path = `${collectionRef.path}/${id}`;
  const collection = db[collectionRef.path as keyof StoredCollections] as Record<string, any>;

  if (!collection) {
    throw new Error(`Collection ${collectionRef.path} does not exist.`);
  }

  collection[id] = { ...data };
  saveDb(db);

  return Promise.resolve({ id, ...data });
}

export function setDoc(docRef: LocalDocRef, data: any) {
  const db = loadDb();
  const [collectionPath, id] = docRef.path.split('/');
  const collection = db[collectionPath as keyof StoredCollections] as Record<string, any>;

  if (!collection) {
    throw new Error(`Collection ${collectionPath} does not exist.`);
  }

  collection[id] = { ...data };
  saveDb(db);

  return Promise.resolve();
}

export function updateDoc(docRef: LocalDocRef, data: any) {
  const db = loadDb();
  const [collectionPath, id] = docRef.path.split('/');
  const collection = db[collectionPath as keyof StoredCollections] as Record<string, any>;

  if (!collection || !collection[id]) {
    throw new Error(`Document ${docRef.path} does not exist.`);
  }

  collection[id] = { ...collection[id], ...data };
  saveDb(db);

  return Promise.resolve();
}

export function deleteDoc(docRef: LocalDocRef) {
  const db = loadDb();
  const [collectionPath, id] = docRef.path.split('/');
  const collection = db[collectionPath as keyof StoredCollections] as Record<string, any>;

  if (!collection || !(id in collection)) {
    throw new Error(`Document ${docRef.path} does not exist.`);
  }

  delete collection[id];
  saveDb(db);

  return Promise.resolve();
}

export function getDocs(queryObj: LocalQuery | LocalCollectionRef) {
  const db = loadDb();
  const collectionPath = 'collectionPath' in queryObj ? queryObj.collectionPath : queryObj.path;
  const raw = db[collectionPath as keyof StoredCollections] as Record<string, any>;
  const results = Object.entries(raw || {}).map(([id, data]) => ({ id, ...data }));

  if ('filters' in queryObj) {
    return applyFilters(results, queryObj.filters, queryObj.orderBys);
  }

  return results;
}

function applyFilters(items: any[], filters: LocalQuery['filters'], orderBys: LocalQuery['orderBys']) {
  let filtered = items;

  for (const filter of filters) {
    if (filter.op === '==') {
      filtered = filtered.filter((item) => item[filter.field] === filter.value);
    }
    if (filter.op === 'in' && Array.isArray(filter.value)) {
      filtered = filtered.filter((item) => filter.value.includes(item[filter.field]));
    }
  }

  for (const order of orderBys) {
    filtered = filtered.slice().sort((a, b) => {
      const aValue = a[order.field];
      const bValue = b[order.field];

      if (aValue === bValue) return 0;
      if (aValue == null) return 1;
      if (bValue == null) return -1;

      if (order.direction === 'asc') {
        return aValue > bValue ? 1 : -1;
      }
      return aValue < bValue ? 1 : -1;
    });
  }

  return filtered;
}

export function query(collectionRef: LocalCollectionRef, ...clauses: Array<ReturnType<typeof where> | ReturnType<typeof orderBy>>) {
  const filters: LocalQuery['filters'] = [];
  const orderBys: LocalQuery['orderBys'] = [];

  for (const clause of clauses) {
    if ('op' in clause) {
      filters.push(clause as LocalQuery['filters'][0]);
    }
    if ('direction' in clause) {
      orderBys.push(clause as LocalQuery['orderBys'][0]);
    }
  }

  return {
    collectionPath: collectionRef.path,
    filters,
    orderBys,
  };
}

export function where(field: string, op: '==' | 'in', value: any) {
  return { field, op, value } as const;
}

export function orderBy(field: string, direction: 'asc' | 'desc' = 'asc') {
  return { field, direction } as const;
}

export function writeBatch(_db: unknown) {
  const operations: LocalBatchOp[] = [];

  return {
    set(docRef: LocalDocRef, data: any) {
      operations.push({ type: 'set', ref: docRef, data });
    },
    update(docRef: LocalDocRef, data: any) {
      operations.push({ type: 'update', ref: docRef, data });
    },
    async commit() {
      for (const operation of operations) {
        if (operation.type === 'set') {
          await setDoc(operation.ref, operation.data);
        } else {
          await updateDoc(operation.ref, operation.data);
        }
      }
      return Promise.resolve();
    },
  };
}

export function getDoc(docRef: LocalDocRef) {
  const db = loadDb();
  const [collectionPath, id] = docRef.path.split('/');
  const collection = db[collectionPath as keyof StoredCollections] as Record<string, any>;

  if (!collection || !collection[id]) {
    return null;
  }

  return { id, ...collection[id] };
}

export function buildDocRef(path: string, id: string): LocalDocRef {
  return { path, id, type: 'doc' };
}
