import React from "react";
import { cn } from "@/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      type = "text",
      label,
      error,
      helperText,
      leftIcon,
      rightIcon,
      id,
      disabled,
      ...props
    },
    ref
  ) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

    return (
      <div className="w-full space-y-1.5 text-left">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-xs font-medium tracking-wide text-stone-700 dark:text-stone-300"
          >
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {leftIcon && (
            <div className="pointer-events-none absolute left-3.5 z-10 flex items-center justify-center text-stone-500 dark:text-stone-400">
              {leftIcon}
            </div>
          )}
          <input
            id={inputId}
            ref={ref}
            type={type}
            disabled={disabled}
            className={cn(
              "flex h-10 w-full rounded-xl border bg-white/90 dark:bg-stone-900/90 px-3.5 py-2 text-sm text-stone-900 dark:text-stone-100 placeholder:text-stone-400 dark:placeholder:text-stone-500 transition-all duration-150 ease-out shadow-2xs backdrop-blur-xs",
              "border-stone-300 dark:border-stone-800",
              "focus-visible:outline-none focus-visible:border-stone-600 dark:focus-visible:border-stone-400 focus-visible:ring-3 focus-visible:ring-stone-400/15 dark:focus-visible:ring-stone-500/15",
              "disabled:cursor-not-allowed disabled:opacity-50",
              Boolean(leftIcon) && "pl-10",
              Boolean(rightIcon) && "pr-10",
              error &&
                "border-rose-500 text-rose-900 dark:text-rose-200 focus-visible:border-rose-500 focus-visible:ring-rose-500/20",
              className
            )}
            {...props}
          />
          {rightIcon && (
            <div className="absolute right-3.5 z-10 flex items-center justify-center text-stone-500 dark:text-stone-400">
              {rightIcon}
            </div>
          )}
        </div>
        {error ? (
          <p className="text-xs text-rose-600 dark:text-rose-400 font-medium animate-in fade-in-50 duration-150">
            {error}
          </p>
        ) : helperText ? (
          <p className="text-xs text-stone-500 dark:text-stone-400">{helperText}</p>
        ) : null}
      </div>
    );
  }
);

Input.displayName = "Input";
