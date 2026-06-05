"use server";
import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function updateOrderStatus(orderId: string, newStatus: "pending" | "processing" | "shipped" | "delivered" | "cancelled") {
  const supabase = await createClient();

  const { error } = await supabase
    .from("orders")
    .update({ status: newStatus })
    .eq("id", orderId);

  if (error) return { error: "Failed to update order status." };
  
  revalidatePath("/admin/orders");
  revalidatePath("/admin");
  return { success: true };
}
