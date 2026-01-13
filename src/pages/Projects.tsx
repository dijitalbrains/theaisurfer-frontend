import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';
import { Rocket, ArrowRight, Package } from 'lucide-react';
import { Card } from '../components/common/Card';
import { Loader } from '../components/common/Loader';
import { Logo } from '../components/common/Logo';
import { Button } from '../components/common/Button';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { logout, fetchCurrentUser } from '../redux/slices/authSlice';
import { projectService } from '../services/projectService';
import type { Project } from '../types/project.types';

export const Projects: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { token, user } = useAppSelector((state) => state.auth);
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Redirect to login if token is removed (e.g., by interceptor or logout)
  useEffect(() => {
    if (!token) {
      navigate('/login');
    }
  }, [token, navigate]);

  useEffect(() => {
    if (!token) {
      return;
    }

    const loadData = async () => {
      try {
        // Fetch user if not loaded
        if (!user) {
          const result = await dispatch(fetchCurrentUser());
          
          // If fetchCurrentUser failed, logout and redirect
          if (fetchCurrentUser.rejected.match(result)) {
            dispatch(logout());
            toast.error('Session expired. Please login again.');
            navigate('/login');
            return;
          }
        }

        // Fetch projects
        const projectsData = await projectService.getUserProjects();
        setProjects(projectsData);
        setIsLoading(false);
      } catch (error: any) {
        // Handle any other errors (like project fetch failures)
        const errorMessage = error.response?.data?.message || 'Failed to load projects';
        
        // If it's an auth error, logout and redirect
        if (error.response?.status === 401) {
          dispatch(logout());
          toast.error('Session expired. Please login again.');
          navigate('/login');
          return;
        }
        
        toast.error(errorMessage);
        setIsLoading(false);
      }
    };

    loadData();
  }, [token, user, navigate, dispatch]);

  const handleLogout = () => {
    dispatch(logout());
    toast.success('Logged out successfully');
    navigate('/login');
  };

  const handleProjectClick = async (projectSlug: string) => {
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
      const response = await fetch(`${API_URL}/auth/sso/quick-login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ projectSlug }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate login link');
      }

      const { loginUrl } = await response.json();
      window.location.href = loginUrl;
    } catch (error) {
      toast.error('Failed to access project');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <Loader size="lg" text="Loading your projects..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Animated background pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiM4YjVjZjYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRoLTJWMTZoMnYxOHptLTQgMGgtMlYxNmgydjE4em0tNCAwaDh2LTJoOHYyem0wLTRIOHYtMmg4djJ6bTAtNEg4di0yaDh2MnptMC00SDh2LTJoOHYyem0wLTRIOHYtMmg4djJ6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-20" />

      {/* Floating orbs */}
      <div className="absolute top-20 left-20 w-96 h-96 bg-primary-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float" />
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-accent-pink rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float" style={{ animationDelay: '2s' }} />

      {/* Header */}
      <header className="relative z-10 border-b border-white/10 backdrop-blur-xl bg-slate-900/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Logo size="md" />
            <div className="flex items-center gap-3 sm:gap-4">
              {user && (
                <div className="text-sm hidden sm:block">
                  <span className="text-gray-400">Welcome, </span>
                  <span className="font-semibold text-primary-400">
                    {user.firstName}
                  </span>
                </div>
              )}
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {projects.length === 0 ? (
          <Card className="max-w-md mx-auto text-center py-16">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-primary-500/20 to-accent-pink/20 mb-6">
              <Package className="w-10 h-10 text-primary-400" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-3">No Projects Yet</h3>
            <p className="text-gray-400 leading-relaxed">
              You don't have access to any projects. Contact your administrator to get started.
            </p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 max-w-7xl mx-auto">
            {projects.map((project) => (
              <Card
                key={project.id}
                hover
                onClick={() => handleProjectClick(project.slug)}
                className="group relative overflow-hidden"
              >
                {/* Gradient accent on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary-500/0 to-accent-pink/0 group-hover:from-primary-500/5 group-hover:to-accent-pink/5 transition-all duration-300" />
                
                <div className="relative">
                  <div className="flex items-start justify-between mb-5">
                    <div className="p-3 rounded-xl bg-gradient-primary shadow-lg shadow-primary-500/20">
                      <Rocket className="w-6 h-6 text-white" />
                    </div>
                    {project.isActive && (
                      <span className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                        Active
                      </span>
                    )}
                  </div>
                  
                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-primary-400 transition-colors">
                    {project.name}
                  </h3>
                  
                  <p className="text-gray-400 text-sm mb-5 leading-relaxed">
                    Click to access this project
                  </p>

                  <div className="flex items-center text-primary-400 text-sm font-semibold group-hover:translate-x-2 transition-all duration-300">
                    Launch Project
                    <ArrowRight className="w-4 h-4 ml-2 text-primary-400 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};
