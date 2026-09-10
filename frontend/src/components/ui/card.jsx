import { cn } from "../../lib/utils";

export function Card({ as: Component = "div", className, ...props }) {
  return (
    <Component
      className={cn(
        "rounded-lg border border-slate-200 border-t-4 border-t-blue-600 bg-white shadow-sm dark:border-slate-800 dark:border-t-blue-500 dark:bg-slate-950",
        className,
      )}
      {...props}
    />
  );
}

export function CardHeader({ className, ...props }) {
  return (
    <div
      className={cn("border-b border-slate-200 px-4 py-3 dark:border-slate-800", className)}
      {...props}
    />
  );
}

export function CardTitle({ className, ...props }) {
  return (
    <h2
      className={cn("text-base font-semibold leading-6 text-slate-950 dark:text-slate-100", className)}
      {...props}
    />
  );
}

export function CardDescription({ className, ...props }) {
  return (
    <p
      className={cn("mt-1 text-sm leading-6 text-slate-500 dark:text-slate-400", className)}
      {...props}
    />
  );
}

export function CardContent({ className, ...props }) {
  return <div className={cn("p-4", className)} {...props} />;
}

export function CardFooter({ className, ...props }) {
  return (
    <div
      className={cn("border-t border-slate-200 px-4 py-3 dark:border-slate-800", className)}
      {...props}
    />
  );
}
