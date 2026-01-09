import api from './api';

export interface SsoSessionResponse {
  projectSlug: string;
  projectName: string;
  returnUrl: string;
  state?: string;
}

export interface SsoCompleteResponse {
  redirectUrl: string;
  tokens: {
    accessToken: string;
    refreshToken: string;
    user: {
      id: string;
      email: string;
      firstName: string;
      lastName: string;
    };
    state?: string;
  };
}

class SsoService {
  /**
   * Get SSO session data by session ID
   */
  async getSsoSession(sessionId: string): Promise<SsoSessionResponse> {
    const response = await api.get(`/auth/sso/session`, {
      params: { id: sessionId },
    });
    return response.data;
  }

  /**
   * Complete SSO authentication
   */
  async completeSsoAuth(sessionId: string): Promise<SsoCompleteResponse> {
    const response = await api.post('/auth/sso/complete', { sessionId });
    return response.data;
  }

  /**
   * Parse SSO session ID from URL
   */
  parseSessionIdFromUrl(): string | null {
    const params = new URLSearchParams(window.location.search);
    return params.get('session');
  }

  /**
   * Store SSO state for CSRF protection
   */
  storeSsoState(state: string): void {
    sessionStorage.setItem('sso_state', state);
  }

  /**
   * Get and validate SSO state
   */
  validateSsoState(state: string): boolean {
    const savedState = sessionStorage.getItem('sso_state');
    if (savedState && savedState === state) {
      sessionStorage.removeItem('sso_state');
      return true;
    }
    return false;
  }
}

export const ssoService = new SsoService();
