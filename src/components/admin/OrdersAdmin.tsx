"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { formatInr } from "@/lib/money";
import { ORDER_STATUS_LABELS } from "@/lib/order-status";

type OrderRow = {
  id: string;
  orderNumber: string;
  status: keyof typeof ORDER_STATUS_LABELS;
  paymentStatus: string;
  total: number;
  createdAt: string;
  shippingName: string;
  user: { email: string; name: string | null };
};

export function OrdersAdmin() {
  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("");
  const [paymentStatus, setPaymentStatus] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (status) params.set("status", status);
    if (paymentStatus) params.set("paymentStatus", paymentStatus);
    const handle = setTimeout(() => {
      fetch(`/api/admin/orders?${params.toString()}`, { credentials: "include" })
        .then(async (res) => {
          const data = await res.json();
          if (!res.ok) throw new Error(data.error || "Could not load orders");
          setOrders(data.orders);
          setError("");
        })
        .catch((err: Error) => setError(err.message));
    }, 200);
    return () => clearTimeout(handle);
  }, [q, status, paymentStatus]);

  return (
    <div>
      <h1 className="font-serif text-4xl font-medium">Orders</h1>
      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        <input
          value={q}
          onChange={(event) => setQ(event.target.value)}
          placeholder="Order, email, or phone"
          className="min-h-11 border border-chocolate/20 bg-white px-3 font-sans text-sm"
        />
        <select
          value={status}
          onChange={(event) => setStatus(event.target.value)}
          className="min-h-11 border border-chocolate/20 bg-white px-3 font-sans text-sm"
        >
          <option value="">All statuses</option>
          {Object.entries(ORDER_STATUS_LABELS).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
        <select
          value={paymentStatus}
          onChange={(event) => setPaymentStatus(event.target.value)}
          className="min-h-11 border border-chocolate/20 bg-white px-3 font-sans text-sm"
        >
          <option value="">All payments</option>
          <option value="PAID">Paid</option>
          <option value="PENDING">Pending</option>
          <option value="FAILED">Failed</option>
          <option value="REFUNDED">Refunded</option>
        </select>
      </div>
      {error ? <p className="mt-4 font-sans text-sm text-red-800">{error}</p> : null}
      <ul className="mt-6 divide-y divide-chocolate/10 border border-chocolate/10 bg-white">
        {orders.map((order) => (
          <li key={order.id}>
            <Link
              href={`/admin/orders/${order.id}`}
              className="grid gap-2 px-4 py-4 hover:bg-canvas sm:grid-cols-[1fr_auto_auto]"
            >
              <span>
                <span className="font-serif text-lg">{order.orderNumber}</span>
                <span className="mt-1 block font-sans text-xs text-chocolate/60">
                  {order.shippingName} · {order.user.email}
                </span>
              </span>
              <span className="font-sans text-xs uppercase tracking-[0.12em] text-chocolate/60">
                {ORDER_STATUS_LABELS[order.status]} · {order.paymentStatus}
              </span>
              <span className="font-sans text-sm">{formatInr(order.total)}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
