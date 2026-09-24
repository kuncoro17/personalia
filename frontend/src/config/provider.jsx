import { HeroUIProvider } from "@heroui/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useHref, useNavigate } from "react-router-dom";
import { ClerkProvider } from "@clerk/clerk-react";
import { ToastProvider } from "@heroui/react";
import { useEffect } from "react";

import "@flaticon/flaticon-uicons/css/all/all.css";

import { applyTheme, getPreferredTheme } from "../utils/theme";
import { resolveSatelliteDomain } from "../utils/clerkConfig";
import { getSasPortalUrl } from "../utils/sasSession";

const queryClient = new QueryClient();

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
const RAW_CLERK_DOMAIN = import.meta.env.VITE_CLERK_DOMAIN || undefined;
const RAW_CLERK_SIGN_IN_URL =
  import.meta.env.VITE_CLERK_SIGN_IN_URL || undefined;
const RAW_CLERK_IS_SATELLITE =
  String(import.meta.env.VITE_CLERK_IS_SATELLITE).toLowerCase() === "true";

const CLERK_DOMAIN = resolveSatelliteDomain(
  RAW_CLERK_DOMAIN,
  typeof window !== "undefined" ? window.location.host : undefined,
);
const CLERK_SIGN_IN_URL = RAW_CLERK_SIGN_IN_URL;
const CLERK_IS_SATELLITE = RAW_CLERK_IS_SATELLITE;

if (!PUBLISHABLE_KEY) {
  throw new Error("Add your Clerk Publishable Key to the .env file");
}

export function Provider({ children }) {
  const navigate = useNavigate();

  useEffect(() => {
    applyTheme(getPreferredTheme());
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <HeroUIProvider navigate={navigate} useHref={useHref}>
        <ToastProvider
          placement="top-right"
          toastProps={{
            timeout: 2000,
          }}
        />

        <ClerkProvider
          publishableKey={PUBLISHABLE_KEY}
          afterSignOutUrl={getSasPortalUrl()}
          signInUrl={CLERK_SIGN_IN_URL}
          domain={CLERK_IS_SATELLITE ? CLERK_DOMAIN : undefined}
          isSatellite={CLERK_IS_SATELLITE}
        >
          {children}
        </ClerkProvider>
      </HeroUIProvider>
    </QueryClientProvider>
  );
}
