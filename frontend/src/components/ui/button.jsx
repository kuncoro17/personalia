import { forwardRef } from "react";

import { cn } from "../../lib/utils";

const variants = {
  default:
    "border-blue-600 bg-blue-600 text-white hover:border-blue-700 hover:bg-blue-700",
  destructive:
    "border-red-600 bg-red-600 text-white hover:border-red-700 hover:bg-red-700",
  outline:
    "border-slate-300 bg-white text-slate-700 hover:border-slate-400 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200 dark:hover:bg-slate-900",
  secondary:
    "border-slate-200 bg-slate-100 text-slate-700 hover:bg-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200",
  success:
    "border-emerald-600 bg-emerald-600 text-white hover:border-emerald-700 hover:bg-emerald-700",
  warning:
    "border-amber-400 bg-amber-400 text-slate-950 hover:border-amber-500 hover:bg-amber-500",
  ghost:
    "border-transparent bg-transparent text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-900",
};

const sizes = {
  sm: "h-8 px-2.5 text-xs",
  default: "h-10 px-3.5 text-sm",
  lg: "h-11 px-5 text-base",
  icon: "h-10 w-10 p-0",
  iconSm: "h-8 w-8 p-0",
};

export const Button = forwardRef(function Button(
  {
    asChild = false,
    as: ComponentFromProp,
    className,
    disabled,
    isDisabled,
    isIconOnly,
    onPress,
    onClick,
    size = "default",
    type = "button",
    variant = "default",
    ...props
  },
  ref,
) {
  const Component = ComponentFromProp || (asChild ? "span" : "button");
  const resolvedSize = isIconOnly ? "icon" : size;

  return (
    <Component
      ref={ref}
      type={Component === "button" ? type : undefined}
      disabled={Component === "button" ? disabled || isDisabled : undefined}
      aria-disabled={disabled || isDisabled || undefined}
      onClick={onPress || onClick}
      className={cn(
        "inline-flex shrink-0 items-center justify-center gap-2 rounded-md border font-bold leading-none shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
        variants[variant] || variants.default,
        sizes[resolvedSize] || sizes.default,
        className,
      )}
      {...props}
    />
  );
});
