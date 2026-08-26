"use client";

import React, { useState } from "react";
import { updateOrderStatus } from "./actions";

type Order = {
  id: string;
  created_at: string | null;
  status: "pending" | "processing" | "out_for_delivery" | "delivered" | "failed" | null;
  total_amount: number;
  user_id: string | null;
  profiles?: { first_name: string | null } | null;
};

export default function OrdersTable({ orders }: { orders: Order[] }) {
  const [isUpdating, setIsUpdating] = useState(false);

  const handleStatusChange = async (id: string, newStatus: "pending" | "processing" | "out_for_delivery" | "delivered" | "failed") => {
    setIsUpdating(true);
    await updateOrderStatus(id, newStatus);
    setIsUpdating(false);
  };

  return (
    <div className="overflow-x-auto rounded-xl border border-brand-primary/10 bg-white shadow-sm">
      <table className="w-full text-left text-sm">
        <thead className="bg-brand-primary/5">
          <tr className="border-b border-brand-primary/10 text-brand-primary/60">
            <th className="p-4 font-bold">Order ID</th>
            <th className="p-4 font-bold">Date</th>
            <th className="p-4 font-bold">Customer</th>
            <th className="p-4 font-bold">Amount</th>
            <th className="p-4 font-bold">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-brand-primary/5">
          {orders.map((order) => (
            <tr key={order.id} className="text-brand-primary transition-colors hover:bg-brand-primary/5">
              <td className="p-4 font-mono text-xs">#{order.id.slice(0, 8)}</td>
              <td className="p-4">{order.created_at ? new Date(order.created_at).toLocaleDateString() : "N/A"}</td>
              <td className="p-4">{order.profiles?.first_name || "Unknown"}</td>
              <td className="p-4 font-bold">₹{order.total_amount}</td>
              <td className="p-4">
                <select
                  value={order.status || "pending"}
                  onChange={(e) => handleStatusChange(order.id, e.target.value as "pending" | "processing" | "out_for_delivery" | "delivered" | "failed")}
                  disabled={isUpdating}
                  className={`rounded-md border-transparent px-2 py-1 text-xs font-bold uppercase tracking-wider focus:border-brand-secondary focus:ring-brand-secondary disabled:opacity-50 ${
                    order.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                    order.status === 'processing' ? 'bg-blue-100 text-blue-700' :
                    order.status === 'out_for_delivery' ? 'bg-purple-100 text-purple-700' :
                    order.status === 'delivered' ? 'bg-success/10 text-success' :
                    'bg-red-100 text-red-700'
                  }`}
                >
                  <option value="pending">Pending</option>
                  <option value="processing">Processing</option>
                  <option value="out_for_delivery">Out for Delivery</option>
                  <option value="delivered">Delivered</option>
                  <option value="failed">Failed</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {orders.length === 0 && (
        <div className="p-8 text-center text-brand-primary/50">No orders found.</div>
      )}
    </div>
  );
}
