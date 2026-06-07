"use client";

import React, { useState } from "react";
import type { Tables } from "@/types/database.types";
import { updateProductStatus, updateProductStock } from "./actions";

type Product = Tables<"products">;

export default function InventoryTable({ products }: { products: Product[] }) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [stockInput, setStockInput] = useState<number>(0);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleToggleStatus = async (id: string, currentStatus: boolean) => {
    setIsUpdating(true);
    await updateProductStatus(id, !currentStatus);
    setIsUpdating(false);
  };

  const handleSaveStock = async (id: string) => {
    setIsUpdating(true);
    await updateProductStock(id, stockInput);
    setEditingId(null);
    setIsUpdating(false);
  };

  return (
    <div className="overflow-x-auto rounded-xl border border-brand-primary/10 bg-white shadow-sm">
      <table className="w-full text-left text-sm">
        <thead className="bg-brand-primary/5">
          <tr className="border-b border-brand-primary/10 text-brand-primary/60">
            <th className="p-4 font-bold">Product</th>
            <th className="p-4 font-bold">Category</th>
            <th className="p-4 font-bold">Base Price</th>
            <th className="p-4 font-bold">Stock Quantity</th>
            <th className="p-4 font-bold">Status</th>
            <th className="p-4 font-bold">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-brand-primary/5">
          {products.map((product) => (
            <tr key={product.id} className="text-brand-primary transition-colors hover:bg-brand-primary/5">
              <td className="p-4 font-bold">{product.name}</td>
              <td className="p-4 capitalize">{product.category.replace("_", " ")}</td>
              <td className="p-4">₹{product.base_price}</td>
              
              <td className="p-4">
                {editingId === product.id ? (
                  <input
                    type="number"
                    value={stockInput}
                    onChange={(e) => setStockInput(parseInt(e.target.value) || 0)}
                    className="w-20 rounded border border-brand-primary/20 px-2 py-1 focus:border-brand-secondary focus:outline-none focus:ring-1 focus:ring-brand-secondary"
                    min="0"
                  />
                ) : (
                  <span className={`font-bold ${product.stock_quantity < 20 ? "text-red-500" : ""}`}>
                    {product.stock_quantity}
                  </span>
                )}
              </td>
              
              <td className="p-4">
                <button
                  onClick={() => handleToggleStatus(product.id, product.is_active || false)}
                  disabled={isUpdating}
                  className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider transition-colors disabled:opacity-50 ${
                    product.is_active
                      ? "bg-success/10 text-success hover:bg-error/10 hover:text-error"
                      : "bg-error/10 text-error hover:bg-success/10 hover:text-success"
                  }`}
                >
                  {product.is_active ? "Active" : "Inactive"}
                </button>
              </td>
              
              <td className="p-4">
                {editingId === product.id ? (
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleSaveStock(product.id)}
                      disabled={isUpdating}
                      className="text-xs font-bold text-success hover:underline disabled:opacity-50"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      disabled={isUpdating}
                      className="text-xs text-brand-primary/50 hover:underline disabled:opacity-50"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      setEditingId(product.id);
                      setStockInput(product.stock_quantity);
                    }}
                    className="text-xs font-bold text-brand-secondary hover:underline"
                  >
                    Edit Stock
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
