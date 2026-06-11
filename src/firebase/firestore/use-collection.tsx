'use client';

import { useState, useEffect } from 'react';
import { getDocs, CollectionReference, Query } from '@/firebase/firestore';

export type WithId<T> = T & { id: string };

export interface UseCollectionResult<T> {
  data: WithId<T>[] | null;
  isLoading: boolean;
  error: Error | null;
}

export function useCollection<T = any>(
  memoizedTargetRefOrQuery: ((CollectionReference | Query) & { __memo?: boolean }) | null | undefined,
): UseCollectionResult<T> {
  type ResultItemType = WithId<T>;
  type StateDataType = ResultItemType[] | null;

  const [data, setData] = useState<StateDataType>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!memoizedTargetRefOrQuery) {
      setData(null);
      setIsLoading(false);
      setError(null);
      return;
    }

    if (!memoizedTargetRefOrQuery.__memo) {
      setError(new Error('The query must be memoized using useMemoFirebase.'));
      setData(null);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    const refresh = () => {
      try {
        const results = getDocs(memoizedTargetRefOrQuery) as ResultItemType[];
        setData(results);
        setError(null);
      } catch (err: any) {
        setError(err instanceof Error ? err : new Error('Error obteniendo la colección.'));
        setData(null);
      } finally {
        setIsLoading(false);
      }
    };

    refresh();
    const intervalId = window.setInterval(refresh, 1000);
    return () => window.clearInterval(intervalId);
  }, [memoizedTargetRefOrQuery]);

  return { data, isLoading, error };
}
