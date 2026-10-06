"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { formatInr } from "@/lib/money";
import { ORDER_STATUS_LABELS } from "@/lib/order-status";

type Stats = {
  paidOrdersToday: number;
  revenueToday: number;
  awaitingFulfillment: number;
  lowStock: number;
  recentOrders: Array<{
    id: string;
    orderNumber: string;
    status: keyof typeof ORDER_STATUS_LABELS;
    paymentStatus: string;
    total: number;
    createdAt: string;
    shippingName: string;
  }>;
};

export function DashboardClient() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/admin/stats", { credentials: "include" })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Could not load dashboard");
        setStats(data);
      })
      .catch((err: Error) => setError(err.message));
  }, []);

  if (error) return <p className="font-serif text-lg text-chocolate">{error}</p>;
  if (!stats) return <p className="font-serif text-lg text-chocolate/70">Loading studio…</p>;

  const cards = [
    ["Paid today", String(stats.paidOrdersToday)],
    ["Revenue today", formatInr(stats.revenueToday)],
    ["Awaiting fulfillment", String(stats.awaitingFulfillment)],
    ["Low stock", String(stats.lowStock)],
  ];

  return (
    <div>
      <h1 className="font-serif text-4xl font-medium">Overview</h1>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map(([label, value]) => (
          <div key={label} className="border border-chocolate/10 bg-white p-5">
            <p className="font-sans text-[11px] uppercase tracking-[0.14em] text-chocolate/50">
              {label}
            </p>
            <p className="mt-2 font-serif text-3xl">{value}</p>
          </div>
        ))}
      </div>
      <h2 className="mt-12 font-serif text-2xl">Recent orders</h2>
      <ul className="mt-4 divide-y divide-chocolate/10 border border-chocolate/10 bg-white">
        {stats.recentOrders.map((order) => (
          <li key={order.id}>
            <Link href={`/admin/orders/${order.id}`} className="flex flex-wrap items-center justify-between gap-3 px-4 py-4 hover:bg-canvas">
              <span>
                <span className="font-serif text-lg">{order.orderNumber}</span>
                <span className="mt-1 block font-sans text-xs uppercase tracking-[0.12em] text-chocolate/50">
                  {order.shippingName} · {ORDER_STATUS_LABELS[order.status]} · {order.paymentStatus}
                </span>
              </span>
              <span className="font-sans text-sm">{formatInr(order.total)}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
