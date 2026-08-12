import type { Metadata } from "next";
import { Suspense } from "react";
import { LoginForm } from "@/components/auth/LoginForm";
import { SiteShell } from "@/components/layout/SiteShell";

export const metadata: Metadata = {
  title: "Sign In",
  description: "Sign in to your Sky n Soul account to checkout and view orders.",
};

export default function LoginPage() {
  return (
    <SiteShell>
      <section className="bg-canvas px-5 py-16 sm:px-8 sm:py-24">
        <div className="mx-auto max-w-md">
          <p className="font-sans text-[11px] font-medium uppercase tracking-[0.18em] text-sage">
            Account
          </p>
          <h1 className="mt-3 font-serif text-4xl font-medium text-chocolate">
            Welcome back
          </h1>
          <p className="mt-3 font-serif text-lg text-chocolate/70">
            Sign in to continue checkout and view your orders.
          </p>
          <div className="mt-10">
            <Suspense fallback={<p className="font-serif text-chocolate/70">Loading…</p>}>
              <LoginForm />
            </Suspense>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
