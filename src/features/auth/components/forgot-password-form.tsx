"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Mail,
  KeyRound,
  Lock,
  Eye,
  EyeOff,
  ArrowLeft,
  CheckCircle2,
  RotateCcw,
} from "lucide-react";
import { toast } from "sonner";

import { useAuth } from "../hooks/use-auth";
import {
  forgotPasswordSchema,
  verifyResetCodeSchema,
  resetPasswordSchema,
  ForgotPasswordFormValues,
  VerifyResetCodeFormValues,
  ResetPasswordFormValues,
} from "../utils/auth-validation";
import { AuthCard } from "./auth-card";
import { AuthErrorBanner } from "./auth-error-banner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type Step = "EMAIL" | "VERIFY_CODE" | "NEW_PASSWORD" | "SUCCESS";

export function ForgotPasswordForm() {
  const router = useRouter();
  const { forgotPassword, verifyResetCode, resetPassword, isAuthenticated, isLoading } = useAuth();

  const [step, setStep] = useState<Step>("EMAIL");
  const [email, setEmail] = useState("");
  const [resetToken, setResetToken] = useState("");
  const [serverError, setServerError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  React.useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.replace("/dashboard");
    }
  }, [isAuthenticated, isLoading, router]);

  // Forms for each step
  const emailForm = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });

  const verifyForm = useForm<VerifyResetCodeFormValues>({
    resolver: zodResolver(verifyResetCodeSchema),
    defaultValues: { code: "" },
  });

  const resetForm = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { new_password: "", confirm_password: "" },
  });

  // Step 1: Request reset code
  const handleRequestCode = async (values: ForgotPasswordFormValues) => {
    setServerError(null);
    try {
      await forgotPassword(values.email);
      setEmail(values.email);
      setStep("VERIFY_CODE");
      toast.success("Verification code sent! Please check your email.");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to send reset code. Please try again.";
      setServerError(msg);
    }
  };

  // Step 2: Verify 6-digit code
  const handleVerifyCode = async (values: VerifyResetCodeFormValues) => {
    setServerError(null);
    try {
      const token = await verifyResetCode(email, values.code);
      setResetToken(token);
      setStep("NEW_PASSWORD");
      toast.success("Code verified successfully!");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Invalid or expired verification code.";
      setServerError(msg);
    }
  };

  // Step 3: Set new password
  const handleResetPassword = async (values: ResetPasswordFormValues) => {
    setServerError(null);
    try {
      await resetPassword(resetToken, values.new_password);
      setStep("SUCCESS");
      toast.success("Password reset successfully!");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to reset password. Please try again.";
      setServerError(msg);
    }
  };

  // Resend code action
  const handleResendCode = async () => {
    if (!email) return;
    setServerError(null);
    try {
      await forgotPassword(email);
      toast.success("A new code has been sent to your email.");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to resend code.";
      setServerError(msg);
    }
  };

  return (
    <AuthCard
      title={
        step === "EMAIL"
          ? "Reset your password"
          : step === "VERIFY_CODE"
          ? "Enter verification code"
          : step === "NEW_PASSWORD"
          ? "Create new password"
          : "Password updated"
      }
      subtitle={
        step === "EMAIL"
          ? "Enter your email address to receive a 6-digit recovery code"
          : step === "VERIFY_CODE"
          ? `We sent a 6-digit verification code to ${email}`
          : step === "NEW_PASSWORD"
          ? "Choose a strong password with at least 6 characters"
          : "Your password has been changed. You can now sign in."
      }
      footer={
        <p>
          <Link
            href="/login"
            className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 hover:underline inline-flex items-center gap-1"
          >
            <ArrowLeft className="h-3 w-3" /> Back to sign in
          </Link>
        </p>
      }
    >
      <div className="space-y-4">
        <AuthErrorBanner
          error={serverError}
          onDismiss={() => setServerError(null)}
        />

        {/* STEP 1: EMAIL */}
        {step === "EMAIL" && (
          <form
            onSubmit={emailForm.handleSubmit(handleRequestCode)}
            className="space-y-4"
          >
            <Input
              label="Email Address"
              type="email"
              placeholder="name@company.com"
              leftIcon={<Mail className="h-4 w-4" />}
              error={emailForm.formState.errors.email?.message}
              {...emailForm.register("email")}
            />
            <Button
              type="submit"
              className="w-full"
              size="lg"
              isLoading={emailForm.formState.isSubmitting}
            >
              Send Reset Code
            </Button>
          </form>
        )}

        {/* STEP 2: VERIFICATION CODE */}
        {step === "VERIFY_CODE" && (
          <form
            onSubmit={verifyForm.handleSubmit(handleVerifyCode)}
            className="space-y-4"
          >
            <Input
              label="6-Digit Code"
              type="text"
              placeholder="123456"
              maxLength={6}
              className="text-center tracking-widest text-lg font-mono font-semibold"
              leftIcon={<KeyRound className="h-4 w-4" />}
              error={verifyForm.formState.errors.code?.message}
              {...verifyForm.register("code")}
            />

            <Button
              type="submit"
              className="w-full"
              size="lg"
              isLoading={verifyForm.formState.isSubmitting}
            >
              Verify Code
            </Button>

            <div className="flex items-center justify-between text-xs pt-1">
              <button
                type="button"
                onClick={() => setStep("EMAIL")}
                className="text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 cursor-pointer"
              >
                Change email
              </button>
              <button
                type="button"
                onClick={handleResendCode}
                className="text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 font-medium inline-flex items-center gap-1 cursor-pointer"
              >
                <RotateCcw className="h-3 w-3" /> Resend code
              </button>
            </div>
          </form>
        )}

        {/* STEP 3: NEW PASSWORD */}
        {step === "NEW_PASSWORD" && (
          <form
            onSubmit={resetForm.handleSubmit(handleResetPassword)}
            className="space-y-4"
          >
            <Input
              label="New Password"
              type={showPassword ? "text" : "password"}
              placeholder="At least 6 characters"
              leftIcon={<Lock className="h-4 w-4" />}
              rightIcon={
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer focus:outline-none"
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              }
              error={resetForm.formState.errors.new_password?.message}
              {...resetForm.register("new_password")}
            />

            <Input
              label="Confirm New Password"
              type={showPassword ? "text" : "password"}
              placeholder="Re-enter new password"
              leftIcon={<Lock className="h-4 w-4" />}
              error={resetForm.formState.errors.confirm_password?.message}
              {...resetForm.register("confirm_password")}
            />

            <Button
              type="submit"
              className="w-full"
              size="lg"
              isLoading={resetForm.formState.isSubmitting}
            >
              Reset Password
            </Button>
          </form>
        )}

        {/* STEP 4: SUCCESS */}
        {step === "SUCCESS" && (
          <div className="space-y-4 text-center py-2">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="h-6 w-6" />
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Your password has been securely updated. You can now log into your account with your new credentials.
            </p>
            <Button
              type="button"
              className="w-full"
              size="lg"
              onClick={() => router.push("/login")}
            >
              Sign In Now
            </Button>
          </div>
        )}
      </div>
    </AuthCard>
  );
}
