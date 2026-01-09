import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { toast } from 'sonner';
import { Loader } from '../components/common/Loader';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { AlertCircle } from 'lucide-react';
import { useAppSelector } from '../redux/hooks';
import { projectService } from '../services/projectService';

export const RedirectHandler: React.FC = () => {
  const { projectSlug } = useParams<{ projectSlug: string }>();
  const navigate = useNavigate();
  const { token, refreshToken } = useAppSelector((state) => state.auth);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }

    const handleRedirect = async () => {
      if (!projectSlug) {
        setError('Invalid project');
        return;
      }

      try {
        // Fetch project details
        const project = await projectService.getProjectBySlug(projectSlug);

        if (!project.isActive) {
          setError('This project is currently inactive');
          return;
        }

        // Get the first allowed redirect URL
        const redirectUrl = project.allowedRedirectUrls[0];
        
        if (!redirectUrl) {
          setError('No redirect URL configured for this project');
          return;
        }

        // Build redirect URL with tokens
        const url = new URL(redirectUrl);
        url.searchParams.set('accessToken', token);
        if (refreshToken) {
          url.searchParams.set('refreshToken', refreshToken);
        }

        // Show success message
        toast.success(`Redirecting to ${project.name}...`);

        // Redirect after a short delay
        setTimeout(() => {
          window.location.href = url.toString();
        }, 1000);

      } catch (err: any) {
        const errorMessage = err.response?.data?.message || 'Failed to redirect to project';
        setError(errorMessage);
        toast.error(errorMessage);
      }
    };

    handleRedirect();
  }, [projectSlug, token, refreshToken, navigate]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <Card className="max-w-md text-center">
          <div className="mb-4">
            <AlertCircle className="w-16 h-16 text-red-400 mx-auto" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Oops!</h2>
          <p className="text-gray-400 mb-6">{error}</p>
          <Button variant="primary" onClick={() => navigate('/projects')}>
            Back to Projects
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute top-20 left-20 w-72 h-72 bg-primary-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float" />
      <div className="absolute bottom-20 right-20 w-72 h-72 bg-accent-pink rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float" style={{ animationDelay: '2s' }} />

      <div className="relative z-10">
        <Loader size="lg" text="Preparing your project..." />
        <p className="text-center text-gray-400 mt-4">You'll be redirected shortly</p>
      </div>
    </div>
  );
};
