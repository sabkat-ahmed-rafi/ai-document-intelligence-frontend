"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Mail, Lock, User as UserIcon, Eye, EyeOff, ArrowLeft } from "lucide-react";
import { toast } from "sonner";

import { useAuth } from "../hooks/use-auth";
import { registerSchema, RegisterFormValues } from "../utils/auth-validation";
import { AuthCard } from "./auth-card";
import { AuthErrorBanner } from "./auth-error-banner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function RegisterForm() {
  const router = useRouter();
  const { register: registerUser, login, isAuthenticated, isLoading: isAuthLoading } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      email: "",
      password: "",
      confirm_password: "",
    },
  });

  // Redirect if already authenticated
  useEffect(() => {
    if (!isAuthLoading && isAuthenticated) {
      router.replace("/dashboard");
    }
  }, [isAuthenticated, isAuthLoading, router]);

  const onSubmit = async (values: RegisterFormValues) => {
    setServerError(null);
    try {
      await registerUser({
        first_name: values.first_name,
        last_name: values.last_name,
        email: values.email,
        password: values.password,
      });

      toast.success("Account created successfully!");

      // Automatically sign in the user
      try {
        await login({
          email: values.email,
          password: values.password,
        });
        router.push("/dashboard");
      } catch {
        router.push("/login?registered=true");
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to create account. Please try again.";
      setServerError(msg);
    }
  };

  return (
    <AuthCard
      title="Create your account"
      subtitle="Start exploring document intelligence and semantic search"
      footer={
        <p>
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 hover:underline inline-flex items-center gap-1"
          >
            <ArrowLeft className="h-3 w-3" /> Back to sign in
          </Link>
        </p>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <AuthErrorBanner
          error={serverError}
          onDismiss={() => setServerError(null)}
        />

        {/* First & Last Name grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Input
            label="First Name"
            placeholder="John"
            autoComplete="given-name"
            leftIcon={<UserIcon className="h-4 w-4" />}
            error={errors.first_name?.message}
            {...register("first_name")}
          />
          <Input
            label="Last Name"
            placeholder="Doe"
            autoComplete="family-name"
            leftIcon={<UserIcon className="h-4 w-4" />}
            error={errors.last_name?.message}
            {...register("last_name")}
          />
        </div>

        <Input
          label="Email Address"
          type="email"
          placeholder="name@company.com"
          autoComplete="email"
          leftIcon={<Mail className="h-4 w-4" />}
          error={errors.email?.message}
          {...register("email")}
        />

        <Input
          label="Password"
          type={showPassword ? "text" : "password"}
          placeholder="At least 6 characters"
          autoComplete="new-password"
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

        <Input
          label="Confirm Password"
          type={showPassword ? "text" : "password"}
          placeholder="Re-enter password"
          autoComplete="new-password"
          leftIcon={<Lock className="h-4 w-4" />}
          error={errors.confirm_password?.message}
          {...register("confirm_password")}
        />

        <Button
          type="submit"
          className="w-full mt-2"
          size="lg"
          isLoading={isSubmitting}
        >
          Create Account
        </Button>
      </form>
    </AuthCard>
  );
}
