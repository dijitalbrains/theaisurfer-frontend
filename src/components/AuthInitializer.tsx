import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { fetchCurrentUser, initializeAuth } from '../redux/slices/authSlice';

export const AuthInitializer: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const dispatch = useAppDispatch();
  const { token, isInitialized } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (!isInitialized) {
      if (token) {
        console.log('[AuthInitializer] Token found, fetching user');
        dispatch(fetchCurrentUser());
      } else {
        console.log('[AuthInitializer] No token, marking as initialized');
        dispatch(initializeAuth());
      }
    }
  }, [token, isInitialized, dispatch]);

  return <>{children}</>;
};
