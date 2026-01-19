import React, { useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import { toast } from 'sonner';
import { Card } from '../components/common/Card';
import { Logo } from '../components/common/Logo';
import { RegisterForm } from '../components/auth/RegisterForm';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { register as registerAction, clearError } from '../redux/slices/authSlice';
import type { RegisterFormData } from '../utils/validation';

export const Register: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [searchParams] = useSearchParams();
  const { isLoading, error, token } = useAppSelector((state) => state.auth);
  
  const hasRedirected = useRef(false);
  const returnTo = searchParams.get('returnTo');

  useEffect(() => {
    if (hasRedirected.current) return;
    
    if (token) {
      hasRedirected.current = true;
      const destination = returnTo || '/projects';
      navigate(destination, { replace: true });
    }
  }, [token, navigate, returnTo]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  const handleRegister = async (data: RegisterFormData) => {
    const { confirmPassword, ...registerData } = data;
    const result = await dispatch(registerAction(registerData));
    if (registerAction.fulfilled.match(result)) {
      hasRedirected.current = true;
      toast.success('Account created successfully!');
      const destination = returnTo || '/projects';
      navigate(destination, { replace: true });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900" />
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiM4YjVjZjYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRoLTJWMTZoMnYxOHptLTQgMGgtMlYxNmgydjE4em0tNCAwSDh2LTJoOHYyem0wLTRIOHYtMmg4djJ6bTAtNEg4di0yaDh2MnptMC00SDh2LTJoOHYyem0wLTRIOHYtMmg4djJ6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-20" />

      <div className="absolute top-20 right-20 w-72 h-72 bg-accent-orange rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float" />
      <div className="absolute bottom-20 left-20 w-72 h-72 bg-accent-pink rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float" style={{ animationDelay: '2s' }} />

      <div className="relative z-10 w-full max-w-md">
        <div className="flex justify-center mb-8">
          <Logo size="lg" />
        </div>

        <Card className="shadow-2xl backdrop-blur-xl">
          <RegisterForm onSubmit={handleRegister} isLoading={isLoading} />
        </Card>
      </div>
    </div>
  );
};
