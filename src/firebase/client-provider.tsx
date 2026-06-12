'use client';

import React, { useMemo, type ReactNode } from 'react';
import { LocalProvider } from '@/firebase/provider';
import { initializeLocalServices } from '@/firebase/setup';

interface LocalClientProviderProps {
  children: ReactNode;
}

export function LocalClientProvider({ children }: LocalClientProviderProps) {
  const localServices = useMemo(() => {
    // Initialize local services on the client side, once per component mount.
    return initializeLocalServices();
  }, []); // Empty dependency array ensures this runs only once on mount

  return (
    <LocalProvider
      app={localServices.app}
      auth={localServices.auth}
      firestore={localServices.firestore}
    >
      {children}
    </LocalProvider>
  );
}