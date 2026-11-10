import React from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "accent" | "danger";
  size?: "sm" | "md" | "lg" | "icon";
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      isLoading = false,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      "inline-flex items-center justify-center font-medium rounded-xl select-none cursor-pointer disabled:pointer-events-none disabled:opacity-50 transition-all duration-150 ease-out active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-400 dark:focus-visible:ring-stone-600 focus-visible:ring-offset-2 focus-visible:ring-offset-[#FAF8F5] dark:focus-visible:ring-offset-[#0C0A09]";

    const sizeStyles = {
      sm: "h-8.5 px-3 text-xs gap-1.5",
      md: "h-10 px-4 text-sm gap-2",
      lg: "h-11.5 px-5.5 text-base gap-2.5",
      icon: "h-9 w-9 p-0",
    };

    const variantStyles = {
      primary:
        "bg-stone-900 text-stone-50 hover:bg-stone-800 active:bg-black dark:bg-stone-100 dark:text-stone-900 dark:hover:bg-white dark:active:bg-stone-200 shadow-xs shadow-stone-900/10",
      secondary:
        "bg-stone-200/80 hover:bg-stone-300/80 text-stone-800 dark:bg-stone-800 dark:hover:bg-stone-700 dark:text-stone-200",
      outline:
        "border border-stone-300 dark:border-stone-800 bg-white/70 dark:bg-stone-900/70 hover:bg-stone-100/80 dark:hover:bg-stone-800/80 text-stone-800 dark:text-stone-200 shadow-2xs backdrop-blur-xs",
      ghost:
        "bg-transparent hover:bg-stone-200/50 dark:hover:bg-stone-800/60 text-stone-700 dark:text-stone-300",
      accent:
        "bg-amber-600 text-white hover:bg-amber-500 active:bg-amber-700 shadow-xs shadow-amber-600/20",
      danger:
        "bg-rose-600 text-white hover:bg-rose-500 active:bg-rose-700 shadow-xs shadow-rose-600/20",
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(baseStyles, sizeStyles[size], variantStyles[variant], className)}
        {...props}
      >
        {isLoading && <Loader2 className="h-4 w-4 animate-spin text-current" />}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
