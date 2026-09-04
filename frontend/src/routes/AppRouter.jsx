import { RedirectToSignIn, useAuth, useUser } from "@clerk/clerk-react";
import { lazy, Suspense, useEffect } from "react";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { Spinner } from "@heroui/react";

import { ROUTE } from "../constants/routes";
import {
  getSasSessionUser,
  hasSasEntry,
  hasSasSession,
  markSasEntry,
} from "../utils/sasSession";

const rawSignInUrl = import.meta.env.VITE_CLERK_SIGN_IN_URL;
const signInUrl = rawSignInUrl;
const SasVerifyPage = lazy(() => import("../pages/sasVerify"));

function AppRouter() {
  const { isSignedIn, isLoaded } = useAuth();
  const { user } = useUser();
  const location = useLocation();
  const navigate = useNavigate();
  const hasInternalSasSession = hasSasSession();
  const isSasVerifyRoute = location.pathname === "/sas/verify";

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const isSasEntry =
      params.get("source") === "sas" && params.get("auto_login") === "true";

    if (isSasEntry) markSasEntry();
  }, [location.search]);

  useEffect(() => {
    if (!isLoaded || (!isSignedIn && !hasInternalSasSession)) return;
    if (!hasSasEntry() || location.pathname !== "/") return;

    const params = new URLSearchParams(location.search);
    const hasLegacySasParams =
      params.has("email") || params.has("source") || params.has("auto_login");
    if (!hasLegacySasParams) return;

    const userId = getSasSessionUser()?.id || user?.id;
    if (!userId) return;

    navigate(`/?id=${encodeURIComponent(userId)}`, { replace: true });
  }, [
    hasInternalSasSession,
    isLoaded,
    isSignedIn,
    location.pathname,
    location.search,
    navigate,
    user?.id,
  ]);

  if (!isLoaded) return <LoadingFallback />;

  if (isSasVerifyRoute) {
    return (
      <Suspense fallback={<LoadingFallback />}>
        <Routes>
          <Route path="/sas/verify" element={<SasVerifyPage />} />
        </Routes>
      </Suspense>
    );
  }

  if (!isSignedIn && !hasInternalSasSession) {
    // Prefer Clerk's redirect helper so it can attach the correct return URL.
    if (signInUrl) {
      return (
        <>
          <RedirectToSignIn redirectUrl={window.location.href} />
          <SignedOutFallback signInUrl={signInUrl} />
        </>
      );
    }

    return <SignedOutFallback signInUrl={signInUrl} />;
  }

  return (
    <Suspense fallback={<LoadingFallback />}>
      <Routes>
        <Route>
          {ROUTE.map((r) => (
            <Route key={r.path} path={r.path} element={r.element} />
          ))}
        </Route>
      </Routes>
    </Suspense>
  );
}

function LoadingFallback() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <Spinner size="lg" color="primary" />
    </div>
  );
}

export { AppRouter };

function SignedOutFallback({ signInUrl }) {
  const canRedirect = Boolean(signInUrl);

  return (
    <div className="flex items-center justify-center min-h-screen p-6">
      <div className="max-w-md w-full text-center space-y-4">
        <div className="text-2xl font-semibold">Session habis</div>
        <div className="text-default-500">
          Silakan login lagi untuk melanjutkan.
        </div>

        {canRedirect ? (
          <div className="text-sm text-default-400">
            Mengalihkan ke halaman login…
          </div>
        ) : (
          <div className="text-sm text-default-400">
            `VITE_CLERK_SIGN_IN_URL` belum diset.
          </div>
        )}
      </div>
    </div>
  );
}
