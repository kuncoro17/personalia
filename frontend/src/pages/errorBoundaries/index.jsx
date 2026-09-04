import React, { useMemo } from "react";

import useToast from "../../hooks/useToast";
import { DefaultFallback } from "./components/fallback";

export default function ErrorBoundary({
  children,
  Fallback = DefaultFallback,
}) {
  const Boundary = useMemo(
    () =>
      class extends React.Component {
        state = { hasError: false };

        static getDerivedStateFromError() {
          return { hasError: true };
        }

        componentDidCatch(error) {
          useToast(error.message, {
            title: "Error",
            description: error.message,
            color: "danger",
          });
        }

        render() {
          return this.state.hasError ? <Fallback /> : this.props.children;
        }
      },
    [Fallback],
  );

  return <Boundary>{children}</Boundary>;
}
