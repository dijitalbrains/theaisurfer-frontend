import React, { useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import { toast } from 'sonner';
import { Card } from '../components/common/Card';
import { Logo } from '../components/common/Logo';
import { LoginForm } from '../components/auth/LoginForm';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { login, clearError } from '../redux/slices/authSlice';
import type { LoginFormData } from '../utils/validation';

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [searchParams] = useSearchParams();
  const { isLoading, error, token, user, isInitialized } = useAppSelector((state) => state.auth);
  
  const hasRedirected = useRef(false);
  const returnTo = searchParams.get('returnTo');

  // All hooks must be called before any conditional returns
  useEffect(() => {
    if (!isInitialized || hasRedirected.current) return;
    
    // If user has a token, they're authenticated - redirect them
    if (token) {
      hasRedirected.current = true;
      const destination = returnTo || '/projects';
      console.log('[Login] User already authenticated, redirecting to:', destination);
      navigate(destination, { replace: true });
    }
  }, [token, isInitialized, navigate, returnTo]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  // Conditional rendering after all hooks
  if (!isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Initializing...</p>
        </div>
      </div>
    );
  }

  const handleLogin = async (data: LoginFormData) => {
    const result = await dispatch(login(data));
    if (login.fulfilled.match(result)) {
      hasRedirected.current = true; // Mark as redirected to prevent useEffect interference
      toast.success('Welcome back!');
      const destination = returnTo || '/projects';
      console.log('[Login] Login successful, redirecting to:', destination);
      navigate(destination, { replace: true });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900" />
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiM4YjVjZjYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRoLTJWMTZoMnYxOHptLTQgMGgtMlYxNmgydjE4em0tNCAwaC0yVjE2aDJ2MTh6bS00IDBoLTJWMTZoMnYxOHptLTQgMGgtMlYxNmgydjE4em0tNCAwSDh2LTJoOHYyem0wLTRIOHYtMmg4djJ6bTAtNEg4di0yaDh2MnptMC00SDh2LTJoOHYyem0wLTRIOHYtMmg4djJ6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-20" />
      
      {/* Floating orbs */}
      <div className="absolute top-20 left-20 w-72 h-72 bg-primary-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float" />
      <div className="absolute bottom-20 right-20 w-72 h-72 bg-accent-pink rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float" style={{ animationDelay: '2s' }} />

      {/* Content */}
      <div className="relative z-10 w-full max-w-md">
        <div className="flex justify-center mb-8">
          <Logo size="lg" />
        </div>

        <Card className="shadow-2xl backdrop-blur-xl">
          <LoginForm onSubmit={handleLogin} isLoading={isLoading} />
        </Card>
      </div>
    </div>
  );
};
