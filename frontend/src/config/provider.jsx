import { HeroUIProvider } from "@heroui/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useHref, useNavigate } from "react-router-dom";
import { ClerkProvider } from "@clerk/clerk-react";
import { ToastProvider } from "@heroui/react";

import "@flaticon/flaticon-uicons/css/all/all.css";

const queryClient = new QueryClient();

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
const CLERK_DOMAIN = import.meta.env.VITE_CLERK_DOMAIN || undefined;
const CLERK_SIGN_IN_URL = import.meta.env.VITE_CLERK_SIGN_IN_URL || undefined;
const CLERK_IS_SATELLITE =
  String(import.meta.env.VITE_CLERK_IS_SATELLITE).toLowerCase() === "true";

if (!PUBLISHABLE_KEY) {
  throw new Error("Add your Clerk Publishable Key to the .env file");
}

export function Provider({ children }) {
  const navigate = useNavigate();

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
          domain={CLERK_DOMAIN}
          isSatellite={CLERK_IS_SATELLITE}
        >
          {children}
        </ClerkProvider>
      </HeroUIProvider>
    </QueryClientProvider>
  );
}
