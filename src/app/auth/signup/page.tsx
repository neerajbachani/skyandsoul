import type { Metadata } from "next";
import { Suspense } from "react";
import { SignupForm } from "@/components/auth/SignupForm";
import { SiteShell } from "@/components/layout/SiteShell";

export const metadata: Metadata = {
  title: "Create Account",
  description: "Create a Sky n Soul account to save your cart and place orders.",
};

export default function SignupPage() {
  return (
    <SiteShell>
      <section className="bg-canvas px-5 py-16 sm:px-8 sm:py-24">
        <div className="mx-auto max-w-md">
          <p className="font-sans text-[11px] font-medium uppercase tracking-[0.18em] text-sage">
            Account
          </p>
          <h1 className="mt-3 font-serif text-4xl font-medium text-chocolate">
            Join the nest
          </h1>
          <p className="mt-3 font-serif text-lg text-chocolate/70">
            Create an account to checkout and keep your orders close.
          </p>
          <div className="mt-10">
            <Suspense fallback={<p className="font-serif text-chocolate/70">Loading…</p>}>
              <SignupForm />
            </Suspense>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
