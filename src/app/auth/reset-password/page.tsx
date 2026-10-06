import type { Metadata } from "next";
import { Suspense } from "react";
import { ResetPasswordForm } from "@/components/auth/ResetPasswordForm";
import { SiteShell } from "@/components/layout/SiteShell";

export const metadata: Metadata = {
  title: "Choose a new password",
  description: "Set a new password for your Sky n Soul account.",
};

type PageProps = {
  searchParams: Promise<{ token?: string }>;
};

export default async function ResetPasswordPage({ searchParams }: PageProps) {
  const { token = "" } = await searchParams;

  return (
    <SiteShell>
      <section className="bg-canvas px-5 py-16 sm:px-8 sm:py-24">
        <div className="mx-auto max-w-md">
          <p className="font-sans text-[11px] font-medium uppercase tracking-[0.18em] text-sage">
            Account
          </p>
          <h1 className="mt-3 font-serif text-4xl font-medium text-chocolate">
            Choose a new password
          </h1>
          <div className="mt-10">
            <Suspense fallback={<p className="font-serif text-chocolate/70">Loading…</p>}>
              <ResetPasswordForm token={token} />
            </Suspense>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
