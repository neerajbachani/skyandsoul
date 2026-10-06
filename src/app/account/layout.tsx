import { SiteShell } from "@/components/layout/SiteShell";
import { AccountNav } from "@/components/account/AccountNav";

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  return (
    <SiteShell>
      <div className="mx-auto max-w-3xl px-5 py-14 sm:px-8 sm:py-20">
        <p className="font-sans text-[11px] uppercase tracking-[0.18em] text-sage">
          Account
        </p>
        <AccountNav />
        {children}
      </div>
    </SiteShell>
  );
}
