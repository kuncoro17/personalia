import { forwardRef } from "react";

import { cn } from "../../lib/utils";

export const Input = forwardRef(function Input(
  { className, onValueChange, onChange, ...props },
  ref,
) {
  return (
    <input
      ref={ref}
      className={cn(
        "flex h-10 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100",
        className,
      )}
      onChange={(event) => {
        onValueChange?.(event.target.value);
        onChange?.(event);
      }}
      {...props}
    />
  );
});
