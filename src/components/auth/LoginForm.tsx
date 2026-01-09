import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Mail, Lock } from 'lucide-react';
import { Link } from 'react-router';
import { Input } from '../common/Input';
import { Button } from '../common/Button';
import { loginSchema, type LoginFormData } from '../../utils/validation';

interface LoginFormProps {
  onSubmit: (data: LoginFormData) => void;
  isLoading: boolean;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onSubmit, isLoading }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <Input
        {...register('email')}
        label="Email"
        type="email"
        placeholder="your@email.com"
        leftIcon={Mail}
        error={errors.email?.message}
      />

      <Input
        {...register('password')}
        label="Password"
        type="password"
        placeholder="••••••••"
        leftIcon={Lock}
        error={errors.password?.message}
      />

      <Button type="submit" variant="primary" size="lg" className="w-full mt-6" isLoading={isLoading}>
        Sign In
      </Button>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-white/10" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-slate-900/50 text-gray-400">New here?</span>
        </div>
      </div>

      <Link to="/register" className="block text-center">
        <Button type="button" variant="ghost" size="md" className="w-full">
          Create an account
        </Button>
      </Link>
    </form>
  );
};
