"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/Button";
import { useAuthStatus } from "@/hooks/useAuth";
import { queryKeys } from "@/lib/queryClient";

const inputClass =
  "min-h-12 w-full border border-chocolate/20 bg-white px-4 font-sans text-sm text-chocolate focus:border-earth focus:outline-none";

export function ProfileForm() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { user, isAuthenticated, isLoading } = useAuthStatus();
  const [name, setName] = useState<string | null>(null);
  const [phone, setPhone] = useState<string | null>(null);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace(`/auth/login?redirect=${encodeURIComponent("/account")}`);
    }
  }, [isAuthenticated, isLoading, router]);

  const displayName = name ?? user?.name ?? "";
  const displayPhone = phone ?? user?.phone ?? "";

  async function saveProfile(event: FormEvent) {
    event.preventDefault();
    setPending(true);
    setError("");
    setMessage("");
    try {
      const res = await fetch("/api/account/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          name: displayName || null,
          phone: displayPhone || null,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Could not save profile");
      queryClient.setQueryData(queryKeys.auth, data.user);
      setMessage("Profile saved.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save profile");
    } finally {
      setPending(false);
    }
  }

  async function changePassword(event: FormEvent) {
    event.preventDefault();
    setPending(true);
    setError("");
    setMessage("");
    try {
      const res = await fetch("/api/account/password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Could not change password");
      setCurrentPassword("");
      setNewPassword("");
      setMessage("Password updated.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not change password");
    } finally {
      setPending(false);
    }
  }

  if (isLoading || !isAuthenticated) {
    return <p className="mt-10 font-serif text-lg text-chocolate/70">Loading account…</p>;
  }

  return (
    <div className="mt-10 space-y-12">
      <div>
        <h1 className="font-serif text-4xl font-medium text-chocolate">Your profile</h1>
        <p className="mt-3 font-sans text-sm text-chocolate/60">{user?.email}</p>
      </div>
      {error ? (
        <p className="border border-red-200 bg-red-50 px-4 py-3 font-sans text-sm text-red-800">
          {error}
        </p>
      ) : null}
      {message ? <p className="font-serif text-lg text-earth">{message}</p> : null}

      <form onSubmit={saveProfile} className="space-y-5 border border-chocolate/10 bg-white p-6">
        <h2 className="font-serif text-2xl text-chocolate">Details</h2>
        <label className="block">
          <span className="mb-2 block font-sans text-[11px] uppercase tracking-[0.14em] text-chocolate/60">
            Name
          </span>
          <input className={inputClass} value={displayName} onChange={(e) => setName(e.target.value)} />
        </label>
        <label className="block">
          <span className="mb-2 block font-sans text-[11px] uppercase tracking-[0.14em] text-chocolate/60">
            Phone
          </span>
          <input className={inputClass} value={displayPhone} onChange={(e) => setPhone(e.target.value)} />
        </label>
        <Button type="submit" variant="filled" disabled={pending}>
          Save profile
        </Button>
      </form>

      <form onSubmit={changePassword} className="space-y-5 border border-chocolate/10 bg-white p-6">
        <h2 className="font-serif text-2xl text-chocolate">Password</h2>
        <label className="block">
          <span className="mb-2 block font-sans text-[11px] uppercase tracking-[0.14em] text-chocolate/60">
            Current password
          </span>
          <input
            type="password"
            required
            className={inputClass}
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
          />
        </label>
        <label className="block">
          <span className="mb-2 block font-sans text-[11px] uppercase tracking-[0.14em] text-chocolate/60">
            New password
          </span>
          <input
            type="password"
            required
            minLength={8}
            className={inputClass}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
        </label>
        <Button type="submit" variant="filled" disabled={pending}>
          Change password
        </Button>
      </form>
    </div>
  );
}
