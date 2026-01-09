import React from 'react';
import { Logo } from '../common/Logo';
import { ThemeToggle } from '../common/ThemeToggle';
import { Button } from '../common/Button';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { logout } from '../../redux/slices/authSlice';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';

export const Header: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { user, token } = useAppSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    toast.success('Logged out successfully');
    navigate('/login');
  };

  return (
    <header className="border-b border-white/10 glass-dark">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Logo size="md" />
        
        <div className="flex items-center gap-4">
          <ThemeToggle />
          
          {token && user && (
            <>
              <div className="text-white text-sm hidden md:block">
                <span className="text-gray-400">Welcome, </span>
                <span className="font-medium">{user.firstName}</span>
              </div>
              <Button variant="outline" onClick={handleLogout}>
                Logout
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};
