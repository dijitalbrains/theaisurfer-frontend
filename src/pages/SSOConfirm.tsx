import React, { useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { toast } from "sonner";
import { Rocket, ArrowRight, X } from "lucide-react";
import { Card } from "../components/common/Card";
import { Button } from "../components/common/Button";
import { Logo } from "../components/common/Logo";
import { Loader } from "../components/common/Loader";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import {
  fetchSsoSession,
  authorizeSso,
  clearSsoState,
} from "../redux/slices/ssoSlice";
import { fetchCurrentUser } from "../redux/slices/authSlice";

export const SSOConfirm: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [searchParams] = useSearchParams();
  const { sessionData, isLoading, error } = useAppSelector((state) => state.sso);
  const { token, user, isInitialized } = useAppSelector((state) => state.auth);
  const hasCompletedAuth = useRef(false);
  const hasFetchedSession = useRef(false);
  const hasFetchedUser = useRef(false);

  useEffect(() => {
    if (!isInitialized) {
      return;
    }

    if (hasCompletedAuth.current) {
      return;
    }

    const sessionId = searchParams.get("session");

    if (!sessionId) {
      navigate("/login", { replace: true });
      return;
    }

    if (!token) {
      navigate(`/login?returnTo=${encodeURIComponent(`/sso/confirm?session=${sessionId}`)}`, { replace: true });
      return;
    }

    if (token && !user && !hasFetchedUser.current) {
      hasFetchedUser.current = true;
      dispatch(fetchCurrentUser());
    }

    if (!sessionData && !hasFetchedSession.current) {
      hasFetchedSession.current = true;
      dispatch(fetchSsoSession(sessionId));
    }
  }, [token, user, isInitialized, searchParams, sessionData, dispatch, navigate]);

  useEffect(() => {
    if (error) {
      toast.error('Failed to load SSO session');
    }
  }, [error]);

  const handleConfirm = async () => {
    const sessionId = searchParams.get("session");
    if (!sessionId || !token) {
      toast.error("Invalid session");
      return;
    }

    if (hasCompletedAuth.current) {
      return;
    }

    hasCompletedAuth.current = true;

    try {
      const result = await dispatch(authorizeSso({ sessionId, token }));

      if (authorizeSso.fulfilled.match(result)) {
        const { code, state, redirectUri } = result.payload;

        dispatch(clearSsoState());

        const redirectUrl = new URL(redirectUri);
        redirectUrl.searchParams.set('code', code);
        redirectUrl.searchParams.set('state', state);

        window.location.href = redirectUrl.toString();
      }
    } catch (error) {
      hasCompletedAuth.current = false;
      toast.error("Failed to complete authentication");
    }
  };

  const handleCancel = () => {
    dispatch(clearSsoState());
    navigate("/projects");
  };

  if (!isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Initializing...</p>
        </div>
      </div>
    );
  }

  if (isLoading && !sessionData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <Loader size="lg" text="Loading..." />
      </div>
    );
  }

  const projectName = sessionData?.projectName || "the application";

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900" />
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiM4YjVjZjYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRoLTJWMTZoMnYxOHptLTQgMGgtMlYxNmgydjE4em0tNCAwaDh2LTJoOHYyem0wLTRIOHYtMmg4djJ6bTAtNEg4di0yaDh2MnptMC00SDh2LTJoOHYyem0wLTRIOHYtMmg4djJ6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-20" />

      <div className="absolute top-20 left-20 w-72 h-72 bg-primary-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float" />
      <div
        className="absolute bottom-20 right-20 w-72 h-72 bg-accent-pink rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float"
        style={{ animationDelay: "2s" }}
      />

      <div className="relative z-10 w-full max-w-md">
        <div className="flex justify-center mb-8">
          <Logo size="lg" />
        </div>

        <Card className="shadow-2xl backdrop-blur-xl">
          <div className="text-center space-y-6">
            <div className="flex justify-center">
              <div className="p-4 rounded-2xl bg-gradient-primary shadow-lg shadow-primary-500/30">
                <Rocket className="w-12 h-12 text-white" />
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-white mb-2">
                Continue to {projectName}?
              </h2>
              <p className="text-gray-400">
                You're about to sign in to{" "}
                <span className="text-primary-400 font-semibold">
                  {projectName}
                </span>
              </p>
            </div>

            {user && (
              <div className="glass-dark rounded-xl p-4">
                <p className="text-sm text-gray-400 mb-1">Signing in as</p>
                <p className="text-white font-semibold">
                  {user.firstName} {user.lastName}
                </p>
                <p className="text-sm text-gray-400">{user.email}</p>
              </div>
            )}

            <div className="space-y-3 pt-2">
              <Button
                variant="primary"
                size="lg"
                className="w-full"
                onClick={handleConfirm}
                isLoading={isLoading}
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
                onClick={handleCancel}
                disabled={isLoading}
              >
                <span className="flex items-center justify-center gap-2">
                  <X className="w-4 h-4" />
                  Cancel
                </span>
              </Button>
            </div>

            <p className="text-xs text-gray-500 pt-4">
              Your authentication will be securely shared with{" "}
              {projectName}
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};
