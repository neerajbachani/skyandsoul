"use client";

import { useEffect, useState } from "react";

type Customer = {
  id: string;
  name: string | null;
  email: string;
  phone: string | null;
  role: string;
  createdAt: string;
  orderCount: number;
};

export function CustomersAdmin() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/admin/customers", { credentials: "include" })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Could not load customers");
        setCustomers(data.customers);
      })
      .catch((err: Error) => setError(err.message));
  }, []);

  return (
    <div>
      <h1 className="font-serif text-4xl font-medium">Customers</h1>
      {error ? <p className="mt-4 font-sans text-sm text-red-800">{error}</p> : null}
      <div className="mt-6 overflow-x-auto border border-chocolate/10 bg-white">
        <table className="w-full min-w-[40rem] text-left font-sans text-sm">
          <thead className="border-b border-chocolate/10 text-[11px] uppercase tracking-[0.12em] text-chocolate/50">
            <tr>
              <th className="px-4 py-3 font-medium">Name</th>
              <th className="px-4 py-3 font-medium">Email</th>
              <th className="px-4 py-3 font-medium">Phone</th>
              <th className="px-4 py-3 font-medium">Orders</th>
              <th className="px-4 py-3 font-medium">Joined</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((customer) => (
              <tr key={customer.id} className="border-b border-chocolate/5">
                <td className="px-4 py-3">
                  {customer.name || "—"}
                  {customer.role === "ADMIN" ? (
                    <span className="ml-2 text-[10px] uppercase tracking-[0.12em] text-sage">Admin</span>
                  ) : null}
                </td>
                <td className="px-4 py-3">{customer.email}</td>
                <td className="px-4 py-3">{customer.phone || "—"}</td>
                <td className="px-4 py-3">{customer.orderCount}</td>
                <td className="px-4 py-3">{new Date(customer.createdAt).toLocaleDateString("en-IN")}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
