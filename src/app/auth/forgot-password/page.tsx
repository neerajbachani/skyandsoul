import type { Metadata } from "next";
import { ForgotPasswordForm } from "@/components/auth/ForgotPasswordForm";
import { SiteShell } from "@/components/layout/SiteShell";

export const metadata: Metadata = {
  title: "Forgot password",
  description: "Reset the password for your Sky n Soul account.",
};

export default function ForgotPasswordPage() {
  return (
    <SiteShell>
      <section className="bg-canvas px-5 py-16 sm:px-8 sm:py-24">
        <div className="mx-auto max-w-md">
          <p className="font-sans text-[11px] font-medium uppercase tracking-[0.18em] text-sage">
            Account
          </p>
          <h1 className="mt-3 font-serif text-4xl font-medium text-chocolate">
            Reset your password
          </h1>
          <p className="mt-3 font-serif text-lg text-chocolate/70">
            Enter the email on your account and we will send a one-hour link.
          </p>
          <div className="mt-10">
            <ForgotPasswordForm />
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
