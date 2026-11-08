"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Mail, Lock, Eye, EyeOff, ArrowRight } from "lucide-react";
import { toast } from "sonner";

import { useAuth } from "../hooks/use-auth";
import { loginSchema, LoginFormValues } from "../utils/auth-validation";
import { AuthCard } from "./auth-card";
import { AuthErrorBanner } from "./auth-error-banner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface LoginFormProps {
  redirectTo?: string;
}

export function LoginForm({ redirectTo }: LoginFormProps) {
  const router = useRouter();

  const { login, isAuthenticated, isLoading: isAuthLoading } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const getTargetUrl = useCallback(() => {
    if (redirectTo) return redirectTo;
    if (typeof window !== "undefined") {
      const searchParams = new URLSearchParams(window.location.search);
      const redirectParam = searchParams.get("redirect");
      if (redirectParam && redirectParam.startsWith("/")) {
        return redirectParam;
      }
    }
    return "/dashboard";
  }, [redirectTo]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  // Redirect if already authenticated
  useEffect(() => {
    if (!isAuthLoading && isAuthenticated) {
      router.replace(getTargetUrl());
    }
  }, [isAuthenticated, isAuthLoading, router, getTargetUrl]);

  const onSubmit = async (values: LoginFormValues) => {
    setServerError(null);
    try {
      await login({
        email: values.email,
        password: values.password,
      });
      toast.success("Welcome back!");
      router.push(getTargetUrl());
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to sign in. Please check your credentials.";
      setServerError(msg);
    }
  };

  return (
    <AuthCard
      title="Sign in to your account"
      subtitle="Access your intelligent document assistant & knowledge base"
      footer={
        <p>
          Don&apos;t have an account?{" "}
          <Link
            href="/register"
            className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 hover:underline inline-flex items-center gap-1"
          >
            Create an account <ArrowRight className="h-3 w-3" />
          </Link>
        </p>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <AuthErrorBanner
          error={serverError}
          onDismiss={() => setServerError(null)}
        />

        <Input
          label="Email Address"
          type="email"
          placeholder="name@company.com"
          autoComplete="email"
          leftIcon={<Mail className="h-4 w-4" />}
          error={errors.email?.message}
          {...register("email")}
        />

        <div className="space-y-1">
          <Input
            label="Password"
            type={showPassword ? "text" : "password"}
            placeholder="••••••••"
            autoComplete="current-password"
            leftIcon={<Lock className="h-4 w-4" />}
            rightIcon={
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer focus:outline-none"
                tabIndex={-1}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            }
            error={errors.password?.message}
            {...register("password")}
          />
        </div>

        <div className="flex items-center justify-between text-xs sm:text-sm pt-1">
          <label className="flex items-center gap-2 cursor-pointer select-none text-slate-600 dark:text-slate-400">
            <input
              type="checkbox"
              className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
              {...register("rememberMe")}
            />
            <span>Remember me</span>
          </label>

          <Link
            href="/forgot-password"
            className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 hover:underline"
          >
            Forgot password?
          </Link>
        </div>

        <Button
          type="submit"
          className="w-full mt-2"
          size="lg"
          isLoading={isSubmitting}
        >
          Sign In
        </Button>
      </form>
    </AuthCard>
  );
}
