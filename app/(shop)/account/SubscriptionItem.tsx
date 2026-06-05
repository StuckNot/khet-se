"use client";

import React, { useState } from "react";
import { updateSubscriptionStatus } from "./actions";

interface Subscription {
  id: string;
  status: string;
  next_delivery_date: string | null;
  delivery_frequency_days: number;
}

export default function SubscriptionItem({ subscription }: { subscription: Subscription }) {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleUpdate = async (newStatus: "active" | "paused" | "cancelled") => {
    setIsLoading(true);
    setErrorMsg("");

    const result = await updateSubscriptionStatus(subscription.id, newStatus);
    
    if (result.error) {
      setErrorMsg(result.error);
    }
    
    setIsLoading(false);
  };

  const isActive = subscription.status === "active";
  const isPaused = subscription.status === "paused";

  return (
    <div className="flex flex-col gap-3 rounded-lg border border-brand-primary/5 bg-brand-canvas p-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="font-bold text-brand-primary">Organic Box (Every {subscription.delivery_frequency_days} Days)</p>
          <p className="text-xs text-brand-primary/50">
            Next Delivery: {subscription.next_delivery_date ? new Date(subscription.next_delivery_date).toLocaleDateString() : 'TBD'}
          </p>
        </div>
        <span
          className={`rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider ${
            isActive ? "bg-green-100 text-green-700" :
            isPaused ? "bg-yellow-100 text-yellow-700" :
            "bg-red-100 text-red-700"
          }`}
        >
          {subscription.status}
        </span>
      </div>

      {errorMsg && <p className="text-xs text-red-600">{errorMsg}</p>}

      {subscription.status !== "cancelled" && (
        <div className="mt-2 flex items-center gap-3 border-t border-brand-primary/5 pt-3">
          {isActive ? (
            <button
              onClick={() => handleUpdate("paused")}
              disabled={isLoading}
              className="text-xs font-bold text-brand-primary/70 hover:text-brand-primary transition-colors disabled:opacity-50"
            >
              Pause Delivery
            </button>
          ) : (
            <button
              onClick={() => handleUpdate("active")}
              disabled={isLoading}
              className="text-xs font-bold text-green-600 hover:text-green-700 transition-colors disabled:opacity-50"
            >
              Resume Delivery
            </button>
          )}

          <button
            onClick={() => {
              if (confirm("Are you sure you want to cancel this subscription?")) {
                handleUpdate("cancelled");
              }
            }}
            disabled={isLoading}
            className="text-xs font-bold text-red-500 hover:text-red-700 transition-colors ml-auto disabled:opacity-50"
          >
            Cancel Subscription
          </button>
        </div>
      )}
    </div>
  );
}
