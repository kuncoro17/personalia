import { HeroUIProvider } from "@heroui/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useHref, useNavigate } from "react-router-dom";
import { ClerkProvider } from "@clerk/clerk-react";
import { ToastProvider } from "@heroui/react";
import { useEffect } from "react";

import "@flaticon/flaticon-uicons/css/all/all.css";

import { applyTheme, getPreferredTheme } from "../utils/theme";

const queryClient = new QueryClient();

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
const RAW_CLERK_DOMAIN = import.meta.env.VITE_CLERK_DOMAIN || undefined;
const RAW_CLERK_SIGN_IN_URL =
  import.meta.env.VITE_CLERK_SIGN_IN_URL || undefined;
const RAW_CLERK_IS_SATELLITE =
  String(import.meta.env.VITE_CLERK_IS_SATELLITE).toLowerCase() === "true";

const normalizeClerkDomain = (value) => {
  if (!value) return value;
  const raw = String(value).trim();
  if (!raw) return undefined;

  // Clerk expects a "domain" (host[:port]) for satellite apps. Accept URLs too.
  if (/^https?:\/\//i.test(raw)) {
    try {
      return new URL(raw).host;
    } catch {
      return raw;
    }
  }

  return raw.split("/")[0];
};

const getClerkDomain = () => {
  const configuredDomain = normalizeClerkDomain(RAW_CLERK_DOMAIN);
  if (typeof window === "undefined") return configuredDomain;

  const configuredHost = configuredDomain?.split(":")[0];
  const currentHost = window.location.hostname;
  const isConfiguredLocal = ["localhost", "127.0.0.1"].includes(configuredHost);
  const isCurrentLocal = ["localhost", "127.0.0.1"].includes(currentHost);

  // A local satellite must include the port it is actually served from.
  if (isConfiguredLocal && isCurrentLocal) return window.location.host;

  return configuredDomain;
};

const CLERK_DOMAIN = getClerkDomain();
const CLERK_SIGN_IN_URL = RAW_CLERK_SIGN_IN_URL;
const CLERK_IS_SATELLITE = RAW_CLERK_IS_SATELLITE;

if (!PUBLISHABLE_KEY) {
  throw new Error("Add your Clerk Publishable Key to the .env file");
}

export function Provider({ children }) {
  const navigate = useNavigate();
  const allowedRedirectOrigins =
    typeof window !== "undefined"
      ? [
          window.location.origin,
          "http://localhost:5173",
          "http://127.0.0.1:5173",
          "https://staging-new-sas.bpkpenaburjakarta.or.id",
        ]
      : undefined;

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
          afterSignOutUrl="https://dt24ftxpcr79w.cloudfront.net/"
          signInUrl={CLERK_SIGN_IN_URL}
          domain={CLERK_IS_SATELLITE ? CLERK_DOMAIN : undefined}
          isSatellite={CLERK_IS_SATELLITE}
          allowedRedirectOrigins={
            CLERK_IS_SATELLITE ? allowedRedirectOrigins : undefined
          }
        >
          {children}
        </ClerkProvider>
      </HeroUIProvider>
    </QueryClientProvider>
  );
}
