import { cn } from "../../lib/utils";

export function Table({ className, ...props }) {
  return (
    <div className="w-full overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-800">
      <table className={cn("w-full border-collapse text-sm", className)} {...props} />
    </div>
  );
}

export function TableHeader({ className, ...props }) {
  return <thead className={cn("bg-slate-50 dark:bg-slate-900", className)} {...props} />;
}

export function TableBody({ className, ...props }) {
  return <tbody className={cn("divide-y divide-slate-200 dark:divide-slate-800", className)} {...props} />;
}

export function TableRow({ className, ...props }) {
  return <tr className={cn("transition-colors hover:bg-slate-50 dark:hover:bg-slate-900", className)} {...props} />;
}

export function TableHead({ className, ...props }) {
  return (
    <th
      className={cn(
        "border border-slate-200 px-4 py-3 text-left text-xs font-bold uppercase leading-4 tracking-[0.08em] text-slate-500 dark:border-slate-800 dark:text-slate-400",
        className,
      )}
      {...props}
    />
  );
}

export function TableCell({ className, ...props }) {
  return (
    <td
      className={cn(
        "border border-slate-200 px-4 py-3 align-top text-sm text-slate-700 dark:border-slate-800 dark:text-slate-300",
        className,
      )}
      {...props}
    />
  );
}
