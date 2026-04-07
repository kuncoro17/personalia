import { useAuth, useUser } from "@clerk/clerk-react";
import { Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import { Spinner } from "@heroui/react";

import { apiClient } from "../service/api";
import { ROUTE } from "../constants/routes";

const rawSignInUrl = import.meta.env.VITE_CLERK_SIGN_IN_URL;
const isLocalHost =
  typeof window !== "undefined" &&
  ["localhost", "127.0.0.1"].includes(window.location.hostname);
const signInUrl = isLocalHost ? undefined : rawSignInUrl;

function AppRouter() {
  const { isSignedIn, isLoaded, getToken } = useAuth();
  const { user } = useUser();
  const api = apiClient(getToken);

  if (!isLoaded) return <LoadingFallback />;

  if (!isSignedIn) {
    if (signInUrl && window.location.href !== signInUrl) {
      window.location.href = signInUrl;
    }
    return;
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
