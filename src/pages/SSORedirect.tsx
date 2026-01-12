import React, { useEffect, useRef } from 'react';
import { useLocation } from 'react-router';
import { Loader } from '../components/common/Loader';

interface SsoUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
}

interface SsoRedirectState {
  redirectUrl: string;
  tokens: {
    accessToken: string;
    refreshToken: string;
    user: SsoUser;
    state?: string;
  };
}

export const SSORedirect: React.FC = () => {
  const location = useLocation();
  const hasRedirected = useRef(false);

  useEffect(() => {
    if (hasRedirected.current) return;
    hasRedirected.current = true;

    const state = location.state as SsoRedirectState | null;

    if (!state || !state.redirectUrl || !state.tokens) {
      window.location.href = '/projects';
      return;
    }

    // Encode tokens in URL hash fragment (not sent to server, more secure than query params)
    const tokenData = btoa(JSON.stringify({
      accessToken: state.tokens.accessToken,
      refreshToken: state.tokens.refreshToken,
      state: state.tokens.state,
    }));

    const redirectWithTokens = `${state.redirectUrl}#tokens=${encodeURIComponent(tokenData)}`;

    console.log('[SSORedirect] Redirecting to:', state.redirectUrl);

    // Redirect to child app with tokens in hash fragment
    window.location.href = redirectWithTokens;
  }, [location.state]);

  const state = location.state as SsoRedirectState | null;

  if (!state || !state.redirectUrl || !state.tokens) {
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="text-center">
        <Loader size="lg" text="Redirecting securely..." />
      </div>
    </div>
  );
};
