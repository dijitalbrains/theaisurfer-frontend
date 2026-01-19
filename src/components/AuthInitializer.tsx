import { useEffect, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { fetchCurrentUser, initializeAuth } from '../redux/slices/authSlice';
import React from "react";

export const AuthInitializer: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const dispatch = useAppDispatch();
  const { token, isInitialized } = useAppSelector((state) => state.auth);
  const lastProcessedState = useRef<{ token: string | null; isInitialized: boolean } | null>(null);

  useEffect(() => {
    const currentState = { token, isInitialized };
    const lastState = lastProcessedState.current;

    if (lastState && lastState.token === token && lastState.isInitialized === isInitialized) {
      return;
    }

    if (!isInitialized) {
      lastProcessedState.current = currentState;

      if (token) {
        dispatch(fetchCurrentUser());
      } else {
        dispatch(initializeAuth());
      }
    }
  }, [token, isInitialized, dispatch]);

  return <>{children}</>;
};
