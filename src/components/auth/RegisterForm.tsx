import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Mail, Lock, User } from 'lucide-react';
import { Link } from 'react-router';
import { Input } from '../common/Input';
import { Button } from '../common/Button';
import { registerSchema, type RegisterFormData } from '../../utils/validation';

interface RegisterFormProps {
  onSubmit: (data: RegisterFormData) => void;
  isLoading: boolean;
}

export const RegisterForm: React.FC<RegisterFormProps> = ({ onSubmit, isLoading }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          {...register('firstName')}
          label="First Name"
          type="text"
          placeholder="John"
          leftIcon={User}
          error={errors.firstName?.message}
        />

        <Input
          {...register('lastName')}
          label="Last Name"
          type="text"
          placeholder="Doe"
          leftIcon={User}
          error={errors.lastName?.message}
        />
      </div>

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

      <Input
        {...register('confirmPassword')}
        label="Confirm Password"
        type="password"
        placeholder="••••••••"
        leftIcon={Lock}
        error={errors.confirmPassword?.message}
      />

      <Button type="submit" variant="primary" size="lg" className="w-full mt-6" isLoading={isLoading}>
        Create Account
      </Button>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-white/10" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-slate-900/50 text-gray-400">Already a member?</span>
        </div>
      </div>

      <Link to="/login" className="block text-center">
        <Button type="button" variant="ghost" size="md" className="w-full">
          Sign in instead
        </Button>
      </Link>
    </form>
  );
};
