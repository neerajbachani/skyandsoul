"use client";

import { useEffect, useState, type FormEvent } from "react";
import { formatInr } from "@/lib/money";
import { ORDER_STATUS_LABELS, allowedTransitions } from "@/lib/order-status";

type OrderStatus = keyof typeof ORDER_STATUS_LABELS;

type AdminOrder = {
  id: string;
  orderNumber: string;
  status: OrderStatus;
  paymentStatus: string;
  subtotal: number;
  shippingFee: number;
  discount: number;
  total: number;
  shippingName: string;
  shippingPhone: string;
  shippingAddress: string;
  shippingCity: string;
  shippingState: string;
  shippingPincode: string;
  carrier: string | null;
  trackingNumber: string | null;
  trackingUrl: string | null;
  internalNote: string | null;
  razorpayOrderId: string | null;
  razorpayPaymentId: string | null;
  user: { email: string; name: string | null; phone: string | null };
  items: Array<{
    id: string;
    productName: string;
    quantity: number;
    total: number;
    selectedPatternLabel: string | null;
    productImage: string;
  }>;
  events: Array<{
    id: string;
    type: string;
    fromStatus: OrderStatus | null;
    toStatus: OrderStatus | null;
    note: string | null;
    createdAt: string;
    actor: { email: string; name: string | null } | null;
  }>;
};

const inputClass =
  "min-h-11 w-full border border-chocolate/20 bg-white px-3 font-sans text-sm";

export function OrderEditor({ orderId }: { orderId: string }) {
  const [order, setOrder] = useState<AdminOrder | null>(null);
  const [status, setStatus] = useState<OrderStatus>("CONFIRMED");
  const [carrier, setCarrier] = useState("");
  const [trackingNumber, setTrackingNumber] = useState("");
  const [trackingUrl, setTrackingUrl] = useState("");
  const [internalNote, setInternalNote] = useState("");
  const [recordRefund, setRecordRefund] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [pending, setPending] = useState(false);

  function apply(next: AdminOrder) {
    setOrder(next);
    setStatus(next.status);
    setCarrier(next.carrier ?? "");
    setTrackingNumber(next.trackingNumber ?? "");
    setTrackingUrl(next.trackingUrl ?? "");
    setInternalNote(next.internalNote ?? "");
    setRecordRefund(next.paymentStatus === "REFUNDED");
  }

  useEffect(() => {
    fetch(`/api/admin/orders/${orderId}`, { credentials: "include" })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Order not found");
        apply(data.order);
      })
      .catch((err: Error) => setError(err.message));
  }, [orderId]);

  async function save(event: FormEvent) {
    event.preventDefault();
    setPending(true);
    setError("");
    setMessage("");
    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          status,
          carrier,
          trackingNumber,
          trackingUrl,
          internalNote,
          recordRefund: status === "REFUNDED" ? recordRefund : false,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Could not update order");
      apply(data.order);
      setMessage("Order saved. The customer is emailed when the status changes.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not update order");
    } finally {
      setPending(false);
    }
  }

  if (error && !order) return <p className="font-serif text-lg">{error}</p>;
  if (!order) return <p className="font-serif text-lg text-chocolate/70">Loading order…</p>;

  const choices = [order.status, ...allowedTransitions(order.status)];

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_22rem]">
      <div>
        <h1 className="font-serif text-4xl font-medium">{order.orderNumber}</h1>
        <p className="mt-2 font-sans text-sm text-chocolate/60">
          {order.user.name || order.shippingName} · {order.user.email}
        </p>
        {error ? <p className="mt-4 font-sans text-sm text-red-800">{error}</p> : null}
        {message ? <p className="mt-4 font-serif text-lg text-earth">{message}</p> : null}

        <ul className="mt-8 space-y-4 border border-chocolate/10 bg-white p-5">
          {order.items.map((item) => (
            <li key={item.id} className="flex justify-between gap-4">
              <span className="font-serif">
                {item.productName} × {item.quantity}
                {item.selectedPatternLabel ? (
                  <span className="mt-1 block font-sans text-xs text-chocolate/60">
                    {item.selectedPatternLabel}
                  </span>
                ) : null}
              </span>
              <span>{formatInr(item.total)}</span>
            </li>
          ))}
        </ul>
        <p className="mt-4 font-sans text-sm">
          Subtotal {formatInr(order.subtotal)} · Shipping {formatInr(order.shippingFee)} · Discount{" "}
          {formatInr(order.discount)} · Total {formatInr(order.total)}
        </p>
        <p className="mt-4 font-serif leading-relaxed">
          {order.shippingName}
          <br />
          {order.shippingAddress}
          <br />
          {order.shippingCity}, {order.shippingState} {order.shippingPincode}
          <br />
          {order.shippingPhone}
        </p>
        <p className="mt-4 font-sans text-xs text-chocolate/55">
          Razorpay {order.razorpayPaymentId || "—"} · Order {order.razorpayOrderId || "—"}
        </p>

        <h2 className="mt-10 font-serif text-2xl">History</h2>
        <ul className="mt-4 space-y-3">
          {order.events.length === 0 ? (
            <li className="font-sans text-sm text-chocolate/60">No changes yet.</li>
          ) : (
            order.events.map((event) => (
              <li key={event.id} className="border-b border-chocolate/10 pb-3 font-sans text-sm">
                <span className="uppercase tracking-[0.12em] text-chocolate/50">{event.type}</span>
                {event.fromStatus && event.toStatus ? (
                  <span>
                    {" "}
                    {ORDER_STATUS_LABELS[event.fromStatus]} → {ORDER_STATUS_LABELS[event.toStatus]}
                  </span>
                ) : null}
                {event.note ? <span> · {event.note}</span> : null}
                <span className="mt-1 block text-xs text-chocolate/45">
                  {event.actor?.email || "System"} · {new Date(event.createdAt).toLocaleString("en-IN")}
                </span>
              </li>
            ))
          )}
        </ul>
      </div>

      <form onSubmit={save} className="space-y-4 border border-chocolate/10 bg-white p-5">
        <h2 className="font-serif text-2xl">Fulfillment</h2>
        <label className="block font-sans text-[11px] uppercase tracking-[0.14em] text-chocolate/60">
          Status
          <select
            className={`${inputClass} mt-2`}
            value={status}
            onChange={(event) => setStatus(event.target.value as OrderStatus)}
          >
            {choices.map((value) => (
              <option key={value} value={value}>
                {ORDER_STATUS_LABELS[value]}
              </option>
            ))}
          </select>
        </label>
        <label className="block font-sans text-[11px] uppercase tracking-[0.14em] text-chocolate/60">
          Carrier
          <input className={`${inputClass} mt-2`} value={carrier} onChange={(e) => setCarrier(e.target.value)} />
        </label>
        <label className="block font-sans text-[11px] uppercase tracking-[0.14em] text-chocolate/60">
          Tracking number
          <input
            className={`${inputClass} mt-2`}
            value={trackingNumber}
            onChange={(e) => setTrackingNumber(e.target.value)}
          />
        </label>
        <label className="block font-sans text-[11px] uppercase tracking-[0.14em] text-chocolate/60">
          Tracking link
          <input className={`${inputClass} mt-2`} value={trackingUrl} onChange={(e) => setTrackingUrl(e.target.value)} />
        </label>
        <label className="block font-sans text-[11px] uppercase tracking-[0.14em] text-chocolate/60">
          Internal note
          <textarea
            className={`${inputClass} mt-2 min-h-24 py-2`}
            value={internalNote}
            onChange={(e) => setInternalNote(e.target.value)}
          />
        </label>
        {status === "REFUNDED" ? (
          <label className="flex items-start gap-2 font-sans text-sm">
            <input
              type="checkbox"
              checked={recordRefund}
              onChange={(event) => setRecordRefund(event.target.checked)}
            />
            Record the Razorpay refund. Issue the refund in Razorpay first.
          </label>
        ) : null}
        <button
          type="submit"
          disabled={pending}
          className="min-h-11 w-full bg-chocolate font-sans text-xs uppercase tracking-[0.14em] text-white hover:bg-earth"
        >
          {pending ? "Saving…" : "Save order"}
        </button>
      </form>
    </div>
  );
}
