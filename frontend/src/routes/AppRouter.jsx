import { useAuth, useUser } from "@clerk/clerk-react";
import { lazy, Suspense, useEffect, useState } from "react";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { Spinner } from "@heroui/react";

import { ROUTE } from "../constants/routes";
import {
  getSasSessionUser,
  hasSasEntry,
  hasSasSession,
  markSasEntry,
  getSasPortalUrl,
} from "../utils/sasSession";
import { apiClient } from "../service/api";

const SasVerifyPage = lazy(() => import("../pages/sasVerify"));

function AppRouter() {
  const { getToken, isSignedIn, isLoaded } = useAuth();
  const { user } = useUser();
  const location = useLocation();
  const navigate = useNavigate();
  const hasInternalSasSession = hasSasSession();
  const isSasVerifyRoute = location.pathname === "/sas/verify";
  const [userAccess, setUserAccess] = useState("checking");
  const api = apiClient(getToken);

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

  useEffect(() => {
    if (!isLoaded || (!isSignedIn && !hasInternalSasSession)) return;
    if (isSasVerifyRoute) return;

    const email = String(
      user?.primaryEmailAddress?.emailAddress ||
        getSasSessionUser()?.email ||
        "",
    )
      .trim()
      .toLowerCase();

    if (!email) {
      setUserAccess("denied");
      return;
    }

    let active = true;
    setUserAccess("checking");

    api
      .get(`personalia/users?q=${encodeURIComponent(email)}&limit=10`)
      .then((response) => {
        if (!active) return;
        const users = response?.data?.data?.items ?? [];
        const allowed = users.some(
          (item) =>
            String(item?.email ?? "")
              .trim()
              .toLowerCase() === email,
        );
        setUserAccess(allowed ? "allowed" : "denied");
      })
      .catch(() => {
        if (active) setUserAccess("denied");
      });

    return () => {
      active = false;
    };
  }, [
    getToken,
    hasInternalSasSession,
    isLoaded,
    isSasVerifyRoute,
    isSignedIn,
    user,
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
    return <SignedOutRedirect redirectUrl={getSasPortalUrl()} />;
  }

  if (userAccess === "checking") return <LoadingFallback />;

  if (userAccess === "denied") {
    return <SignedOutRedirect redirectUrl={getSasPortalUrl()} />;
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

function SignedOutRedirect({ redirectUrl }) {
  useEffect(() => {
    window.location.replace(redirectUrl);
  }, [redirectUrl]);

  return (
    <div className="flex items-center justify-center min-h-screen p-6">
      <div className="max-w-md w-full text-center space-y-4">
        <div className="text-2xl font-semibold">Session habis</div>
        <div className="text-default-500">
          Silakan login lagi untuk melanjutkan.
        </div>

        <div className="text-sm text-default-400">
          Mengalihkan ke halaman login…
        </div>
      </div>
    </div>
  );
}
