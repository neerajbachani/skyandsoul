"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/Button";
import { useAuthStatus } from "@/hooks/useAuth";

type Address = {
  id: string;
  label: string | null;
  recipientName: string;
  phone: string;
  line1: string;
  city: string;
  state: string;
  pincode: string;
  isDefault: boolean;
};

const empty = {
  label: "",
  recipientName: "",
  phone: "",
  line1: "",
  city: "",
  state: "",
  pincode: "",
  isDefault: false,
};

const inputClass =
  "min-h-11 w-full border border-chocolate/20 bg-white px-3 font-sans text-sm text-chocolate focus:border-earth focus:outline-none";

export function AddressesManager() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuthStatus();
  const [error, setError] = useState("");
  const queryClient = useQueryClient();
  const addressesQuery = useQuery({
    queryKey: ["account-addresses"],
    enabled: isAuthenticated,
    queryFn: async () => {
      const res = await fetch("/api/account/addresses", { credentials: "include" });
      if (res.status === 401) {
        router.replace(`/auth/login?redirect=${encodeURIComponent("/account/addresses")}`);
        return [] as Address[];
      }
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Could not load addresses");
      return (data.addresses ?? []) as Address[];
    },
  });
  const addresses = addressesQuery.data ?? [];
  const [form, setForm] = useState(empty);
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace(`/auth/login?redirect=${encodeURIComponent("/account/addresses")}`);
    }
  }, [isAuthenticated, isLoading, router]);

  function setField(key: keyof typeof empty, value: string | boolean) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError("");
    const payload = {
      ...form,
      label: form.label || null,
    };
    const res = await fetch(
      editingId ? `/api/account/addresses/${editingId}` : "/api/account/addresses",
      {
        method: editingId ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      },
    );
    const data = await res.json();
    if (!res.ok) {
      setError(data.error || "Could not save address");
      return;
    }
    setForm(empty);
    setEditingId(null);
    await queryClient.invalidateQueries({ queryKey: ["account-addresses"] });
  }

  async function remove(id: string) {
    const res = await fetch(`/api/account/addresses/${id}`, {
      method: "DELETE",
      credentials: "include",
    });
    if (!res.ok) {
      const data = await res.json();
      setError(data.error || "Could not delete address");
      return;
    }
    await queryClient.invalidateQueries({ queryKey: ["account-addresses"] });
  }

  async function makeDefault(address: Address) {
    await fetch(`/api/account/addresses/${address.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ isDefault: true }),
    });
    await queryClient.invalidateQueries({ queryKey: ["account-addresses"] });
  }

  if (isLoading || !isAuthenticated) {
    return <p className="mt-10 font-serif text-lg text-chocolate/70">Loading addresses…</p>;
  }

  return (
    <div className="mt-10 space-y-10">
      <h1 className="font-serif text-4xl font-medium text-chocolate">Addresses</h1>
      {error ? (
        <p className="border border-red-200 bg-red-50 px-4 py-3 font-sans text-sm text-red-800">
          {error}
        </p>
      ) : null}
      <ul className="space-y-4">
        {addresses.map((address) => (
          <li key={address.id} className="border border-chocolate/10 bg-white p-5">
            <p className="font-serif text-xl text-chocolate">
              {address.recipientName}
              {address.isDefault ? (
                <span className="ml-3 font-sans text-[10px] uppercase tracking-[0.14em] text-sage">
                  Default
                </span>
              ) : null}
            </p>
            {address.label ? (
              <p className="mt-1 font-sans text-xs uppercase tracking-[0.12em] text-chocolate/50">
                {address.label}
              </p>
            ) : null}
            <p className="mt-2 font-serif text-base text-chocolate/75">
              {address.line1}
              <br />
              {address.city}, {address.state} {address.pincode}
              <br />
              {address.phone}
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              <button
                type="button"
                className="font-sans text-[11px] uppercase tracking-[0.12em] text-earth underline"
                onClick={() => {
                  setEditingId(address.id);
                  setForm({
                    label: address.label ?? "",
                    recipientName: address.recipientName,
                    phone: address.phone,
                    line1: address.line1,
                    city: address.city,
                    state: address.state,
                    pincode: address.pincode,
                    isDefault: address.isDefault,
                  });
                }}
              >
                Edit
              </button>
              {!address.isDefault ? (
                <button
                  type="button"
                  className="font-sans text-[11px] uppercase tracking-[0.12em] text-earth underline"
                  onClick={() => makeDefault(address)}
                >
                  Make default
                </button>
              ) : null}
              <button
                type="button"
                className="font-sans text-[11px] uppercase tracking-[0.12em] text-chocolate/60 underline"
                onClick={() => remove(address.id)}
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>

      <form onSubmit={handleSubmit} className="space-y-4 border border-chocolate/10 bg-white p-6">
        <h2 className="font-serif text-2xl text-chocolate">
          {editingId ? "Edit address" : "Add an address"}
        </h2>
        {(
          [
            ["label", "Label"],
            ["recipientName", "Recipient"],
            ["phone", "Phone"],
            ["line1", "Address"],
            ["city", "City"],
            ["state", "State"],
            ["pincode", "Pincode"],
          ] as const
        ).map(([key, label]) => (
          <label key={key} className="block">
            <span className="mb-2 block font-sans text-[11px] uppercase tracking-[0.14em] text-chocolate/60">
              {label}
            </span>
            <input
              required={key !== "label"}
              className={inputClass}
              value={form[key]}
              onChange={(event) => setField(key, event.target.value)}
            />
          </label>
        ))}
        <label className="flex items-center gap-2 font-sans text-sm text-chocolate">
          <input
            type="checkbox"
            checked={form.isDefault}
            onChange={(event) => setField("isDefault", event.target.checked)}
          />
          Use as default
        </label>
        <div className="flex gap-3">
          <Button type="submit" variant="filled">
            {editingId ? "Save address" : "Add address"}
          </Button>
          {editingId ? (
            <Button
              type="button"
              variant="ghost"
              onClick={() => {
                setEditingId(null);
                setForm(empty);
              }}
            >
              Cancel
            </Button>
          ) : null}
        </div>
      </form>
    </div>
  );
}
