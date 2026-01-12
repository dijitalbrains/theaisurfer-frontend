import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { toast } from 'sonner';
import { Loader } from '../components/common/Loader';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { AlertCircle, ExternalLink, ArrowRight } from 'lucide-react';
import { useAppSelector } from '../redux/hooks';
import { projectService } from '../services/projectService';

export const RedirectHandler: React.FC = () => {
  const { projectSlug } = useParams<{ projectSlug: string }>();
  const navigate = useNavigate();
  const { token, refreshToken, user } = useAppSelector((state) => state.auth);
  const [error, setError] = useState<string | null>(null);
  const [project, setProject] = useState<any>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);

  useEffect(() => {
    if (!token) {
      // Save where user wanted to go
      navigate(`/login?returnTo=/redirect/${projectSlug}`);
      return;
    }

    const loadProject = async () => {
      if (!projectSlug) {
        setError('Invalid project');
        return;
      }

      try {
        // Fetch project details
        const projectData = await projectService.getProjectBySlug(projectSlug);

        if (!projectData.isActive) {
          setError('This project is currently inactive');
          return;
        }

        setProject(projectData);
        setShowConfirmation(true); // Show confirmation instead of auto-redirect
      } catch (err: any) {
        const errorMessage = err.response?.data?.message || 'Failed to load project';
        setError(errorMessage);
        toast.error(errorMessage);
      }
    };

    loadProject();
  }, [projectSlug, token, navigate]);

  const handleContinue = () => {
    if (!project || !token) return;

    // Get the first allowed redirect URL
    const redirectUrl = project.allowedRedirectUrls[0];

    if (!redirectUrl) {
      setError('No redirect URL configured for this project');
      return;
    }

    // Encode tokens in URL hash fragment (same secure method as SSO flow)
    const tokenData = btoa(JSON.stringify({
      accessToken: token,
      refreshToken: refreshToken || '',
      state: undefined,
    }));

    const redirectWithTokens = `${redirectUrl}#tokens=${encodeURIComponent(tokenData)}`;

    console.log('[RedirectHandler] Redirecting to:', redirectUrl);

    // Show success message
    toast.success(`Redirecting to ${project.name}...`);

    // Redirect after a short delay
    setTimeout(() => {
      window.location.href = redirectWithTokens;
    }, 500);
  };

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

  if (showConfirmation && project) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiM4YjVjZjYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRoLTJWMTZoMnYxOHptLTQgMGgtMlYxNmgydjE4em0tNCAwaDh2LTJoOHYyem0wLTRIOHYtMmg4djJ6bTAtNEg4di0yaDh2MnptMC00SDh2LTJoOHYyem0wLTRIOHYtMmg4djJ6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-20" />

        {/* Floating orbs */}
        <div className="absolute top-20 left-20 w-72 h-72 bg-primary-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float" />
        <div
          className="absolute bottom-20 right-20 w-72 h-72 bg-accent-pink rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float"
          style={{ animationDelay: "2s" }}
        />

        {/* Content */}
        <div className="relative z-10 w-full max-w-md">
          <Card className="shadow-2xl backdrop-blur-xl">
            <div className="text-center space-y-6">
              {/* Project Icon */}
              <div className="flex justify-center">
                <div className="p-4 rounded-2xl bg-gradient-primary shadow-lg shadow-primary-500/30">
                  <ExternalLink className="w-12 h-12 text-white" />
                </div>
              </div>

              {/* Title */}
              <div>
                <h2 className="text-2xl font-bold text-white mb-2">
                  Continue to {project.name}?
                </h2>
                <p className="text-gray-400">
                  You're about to sign in to{" "}
                  <span className="text-primary-400 font-semibold">
                    {project.name}
                  </span>
                </p>
              </div>

              {/* User info */}
              {user && (
                <div className="glass-dark rounded-xl p-4">
                  <p className="text-sm text-gray-400 mb-1">Signing in as</p>
                  <p className="text-white font-semibold">
                    {user.firstName} {user.lastName}
                  </p>
                  <p className="text-sm text-gray-400">{user.email}</p>
                </div>
              )}

              {/* Actions */}
              <div className="space-y-3 pt-2">
                <Button
                  variant="primary"
                  size="lg"
                  className="w-full"
                  onClick={handleContinue}
                >
                  <span className="flex items-center justify-center gap-2">
                    Continue
                    <ArrowRight className="w-5 h-5" />
                  </span>
                </Button>

                <Button
                  variant="ghost"
                  size="md"
                  className="w-full"
                  onClick={() => navigate('/projects')}
                >
                  <span className="flex items-center justify-center gap-2">
                    <AlertCircle className="w-4 h-4" />
                    Cancel
                  </span>
                </Button>
              </div>

              {/* Security note */}
              <p className="text-xs text-gray-500 pt-4">
                Your authentication will be securely shared with{" "}
                {project.name}
              </p>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute top-20 left-20 w-72 h-72 bg-primary-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float" />
      <div className="absolute bottom-20 right-20 w-72 h-72 bg-accent-pink rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float" style={{ animationDelay: '2s' }} />

      <div className="relative z-10">
        <Loader size="lg" text="Loading project..." />
      </div>
    </div>
  );
};
