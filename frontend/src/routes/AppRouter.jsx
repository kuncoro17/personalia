import { RedirectToSignIn, useAuth, useUser } from "@clerk/clerk-react";
import { Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import { Spinner } from "@heroui/react";

import { apiClient } from "../service/api";
import { ROUTE } from "../constants/routes";

const rawSignInUrl = import.meta.env.VITE_CLERK_SIGN_IN_URL;
const signInUrl = rawSignInUrl;

function AppRouter() {
  const { isSignedIn, isLoaded, getToken } = useAuth();
  const { user } = useUser();
  const api = apiClient(getToken);

  if (!isLoaded) return <LoadingFallback />;

  if (!isSignedIn) {
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
