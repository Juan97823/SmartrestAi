'use client';

import React, { DependencyList, createContext, useContext, ReactNode, useMemo, useState, useEffect } from 'react';
import { Auth, User, onAuthStateChanged } from '@/firebase/auth';
import { Firestore } from '@/firebase/firestore';

interface LocalProviderProps {
  children: ReactNode;
  app: object;
  firestore: Firestore;
  auth: Auth;
}

interface UserAuthState {
  user: User | null;
  isUserLoading: boolean;
  userError: Error | null;
}

export interface LocalContextState {
  areServicesAvailable: boolean;
  app: object | null;
  firestore: Firestore | null;
  auth: Auth | null;
  user: User | null;
  isUserLoading: boolean;
  userError: Error | null;
}

export interface LocalServicesAndUser {
  app: object;
  firestore: Firestore;
  auth: Auth;
  user: User | null;
  isUserLoading: boolean;
  userError: Error | null;
}

export interface UserHookResult {
  user: User | null;
  isUserLoading: boolean;
  userError: Error | null;
}

export const LocalContext = createContext<LocalContextState | undefined>(undefined);

export const LocalProvider: React.FC<LocalProviderProps> = ({
  children,
  app,
  firestore,
  auth,
}) => {
  const [userAuthState, setUserAuthState] = useState<UserAuthState>({
    user: null,
    isUserLoading: true,
    userError: null,
  });

  useEffect(() => {
    if (!auth) {
      setUserAuthState({ user: null, isUserLoading: false, userError: new Error('Auth service not provided.') });
      return;
    }

    setUserAuthState({ user: null, isUserLoading: true, userError: null });

    const unsubscribe = onAuthStateChanged(
      auth,
      (user) => {
        setUserAuthState({ user, isUserLoading: false, userError: null });
      },
      (error) => {
        console.error('LocalProvider: onAuthStateChanged error:', error);
        setUserAuthState({ user: null, isUserLoading: false, userError: error });
      }
    );

    return () => unsubscribe();
  }, [auth]);

  const contextValue = useMemo((): LocalContextState => {
    const servicesAvailable = !!(app && firestore && auth);
    return {
      areServicesAvailable: servicesAvailable,
      app: servicesAvailable ? app : null,
      firestore: servicesAvailable ? firestore : null,
      auth: servicesAvailable ? auth : null,
      user: userAuthState.user,
      isUserLoading: userAuthState.isUserLoading,
      userError: userAuthState.userError,
    };
  }, [app, firestore, auth, userAuthState]);

  return <LocalContext.Provider value={contextValue}>{children}</LocalContext.Provider>;
};

export const useLocalServices = (): LocalServicesAndUser => {
  const context = useContext(LocalContext);

  if (context === undefined) {
    throw new Error('useLocalServices must be used within a LocalProvider.');
  }

  if (!context.areServicesAvailable || !context.app || !context.firestore || !context.auth) {
    throw new Error('Local core services not available. Check LocalProvider props.');
  }

  return {
    app: context.app,
    firestore: context.firestore,
    auth: context.auth,
    user: context.user,
    isUserLoading: context.isUserLoading,
    userError: context.userError,
  };
};

export const useAuth = (): Auth => {
  const { auth } = useLocalServices();
  return auth;
};

export const useFirestore = (): Firestore => {
  const { firestore } = useLocalServices();
  return firestore;
};

export function useMemoLocal<T>(factory: () => T, deps: DependencyList): T {
  return useMemo(factory, deps);
}

export const useUser = (): UserHookResult => {
  const { user, isUserLoading, userError } = useLocalServices();
  return { user, isUserLoading, userError };
};
