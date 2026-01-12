import React from 'react';
import { useRouteError, isRouteErrorResponse, useNavigate } from 'react-router';
import { AlertCircle, Home, RefreshCw } from 'lucide-react';
import { Card } from './common/Card';
import { Button } from './common/Button';
import { Logo } from './common/Logo';

export const ErrorBoundary: React.FC = () => {
  const error = useRouteError();
  const navigate = useNavigate();

  let errorMessage = 'An unexpected error occurred';
  let errorDetails: string | undefined;

  if (isRouteErrorResponse(error)) {
    errorMessage = error.statusText || errorMessage;
    errorDetails = error.data?.message;
  } else if (error instanceof Error) {
    errorMessage = error.message;
    errorDetails = error.stack;
  }

  const handleGoHome = () => {
    navigate('/projects', { replace: true });
  };

  const handleReload = () => {
    window.location.reload();
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiM4YjVjZjYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRoLTJWMTZoMnYxOHptLTQgMGgtMlYxNmgydjE4em0tNCAwaDh2LTJoOHYyem0wLTRIOHYtMmg4djJ6bTAtNEg4di0yaDh2MnptMC00SDh2LTJoOHYyem0wLTRIOHYtMmg4djJ6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-20" />

      {/* Floating orbs */}
      <div className="absolute top-20 left-20 w-72 h-72 bg-red-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float" />
      <div className="absolute bottom-20 right-20 w-72 h-72 bg-accent-pink rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float" style={{ animationDelay: '2s' }} />

      {/* Content */}
      <div className="relative z-10 w-full max-w-2xl">
        <div className="flex justify-center mb-8">
          <Logo size="lg" />
        </div>

        <Card className="shadow-2xl backdrop-blur-xl">
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-red-500/20 mb-6">
              <AlertCircle className="w-10 h-10 text-red-400" />
            </div>
            <h2 className="text-3xl font-bold text-white mb-3">Oops! Something went wrong</h2>
            <p className="text-gray-400 text-lg">{errorMessage}</p>
          </div>

          {errorDetails && process.env.NODE_ENV === 'development' && (
            <div className="mb-6 p-4 rounded-lg bg-slate-800/50 border border-slate-700">
              <p className="text-xs font-mono text-gray-400 mb-2">Error details (dev only):</p>
              <pre className="text-xs text-red-400 overflow-auto max-h-40">
                {errorDetails}
              </pre>
            </div>
          )}

          <div className="flex gap-3 justify-center">
            <Button
              variant="secondary"
              onClick={handleReload}
              className="gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Reload Page
            </Button>
            <Button
              variant="primary"
              onClick={handleGoHome}
              className="gap-2"
            >
              <Home className="w-4 h-4" />
              Go to Projects
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};
