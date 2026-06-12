'use client';

import { useState, useEffect } from 'react';
import { getDoc, DocumentReference } from '@/firebase/firestore';

/** Utility type to add an 'id' field to a given type T. */
type WithId<T> = T & { id: string };

/**
 * Interface for the return value of the useDoc hook.
 * @template T Type of the document data.
 */
export interface UseDocResult<T> {
  data: WithId<T> | null;
  isLoading: boolean;
  error: Error | null;
}

export function useDoc<T = any>(
  memoizedDocRef: (DocumentReference & { __memo?: boolean }) | null | undefined,
): UseDocResult<T> {
  type StateDataType = WithId<T> | null;

  const [data, setData] = useState<StateDataType>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!memoizedDocRef) {
      setData(null);
      setIsLoading(false);
      setError(null);
      return;
    }

    if (!memoizedDocRef.__memo) {
      setError(new Error('The document reference must be memoized using useMemoLocal.'));
      setData(null);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    const refresh = () => {
      try {
        const result = getDoc(memoizedDocRef) as WithId<T> | null;
        setData(result);
        setError(null);
      } catch (err: any) {
        setError(err instanceof Error ? err : new Error('Error reading document.'));
        setData(null);
      } finally {
        setIsLoading(false);
      }
    };

    refresh();
    const intervalId = window.setInterval(refresh, 1000);
    return () => window.clearInterval(intervalId);
  }, [memoizedDocRef]);

  return { data, isLoading, error };
}
