import React, { useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router';
import { toast } from 'sonner';
import { Rocket, ArrowLeft } from 'lucide-react';
import { Card } from '../components/common/Card';
import { Logo } from '../components/common/Logo';
import { LoginForm } from '../components/auth/LoginForm';
import { Loader } from '../components/common/Loader';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { login, clearError } from '../redux/slices/authSlice';
import { fetchSsoSession } from '../redux/slices/ssoSlice';
import type { LoginFormData } from '../utils/validation';

export const SSOLogin: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [searchParams] = useSearchParams();
  const { isLoading: authLoading, error: authError, token } = useAppSelector((state) => state.auth);
  const { sessionData, isLoading: ssoLoading } = useAppSelector((state) => state.sso);

  useEffect(() => {
    // Fetch SSO session data
    const sessionId = searchParams.get('session');
    if (sessionId && !sessionData) {
      dispatch(fetchSsoSession(sessionId));
    }
  }, [searchParams, sessionData, dispatch]);

  useEffect(() => {
    // If user is already authenticated, redirect to confirmation
    if (token) {
      const sessionId = searchParams.get('session');
      navigate(`/sso/confirm?session=${sessionId}`);
    }
  }, [token, searchParams, navigate]);

  useEffect(() => {
    if (authError) {
      toast.error(authError);
      dispatch(clearError());
    }
  }, [authError, dispatch]);

  const handleLogin = async (data: LoginFormData) => {
    const result = await dispatch(login(data));
    
    if (login.fulfilled.match(result)) {
      toast.success('Welcome back!');
      const sessionId = searchParams.get('session');
      navigate(`/sso/confirm?session=${sessionId}`);
    }
  };

  if (ssoLoading || !sessionData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <Loader size="lg" text="Loading..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900" />
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiM4YjVjZjYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRoLTJWMTZoMnYxOHptLTQgMGgtMlYxNmgydjE4em0tNCAwaDh2LTJoOHYyem0wLTRIOHYtMmg4djJ6bTAtNEg4di0yaDh2MnptMC00SDh2LTJoOHYyem0wLTRIOHYtMmg4djJ6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-20" />
      
      {/* Floating orbs */}
      <div className="absolute top-20 left-20 w-72 h-72 bg-primary-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float" />
      <div className="absolute bottom-20 right-20 w-72 h-72 bg-accent-pink rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float" style={{ animationDelay: '2s' }} />

      {/* Content */}
      <div className="relative z-10 w-full max-w-md">
        <div className="flex justify-center mb-8">
          <Logo size="lg" />
        </div>

        {/* Project context banner */}
        <div className="mb-6 glass-dark rounded-xl p-4 border border-primary-500/30">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gradient-primary">
              <Rocket className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-xs text-gray-400">Sign in to access</p>
              <p className="text-white font-semibold">{sessionData.projectName}</p>
            </div>
          </div>
        </div>

        <Card className="shadow-2xl backdrop-blur-xl">
          <LoginForm onSubmit={handleLogin} isLoading={authLoading} />
        </Card>

        {/* Back link */}
        <div className="mt-6 text-center">
          <Link
            to="/login"
            className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to regular login
          </Link>
        </div>
      </div>
    </div>
  );
};
