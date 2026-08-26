"use server";
import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function updateProductStatus(productId: string, isActive: boolean) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("products")
    .update({ is_active: isActive })
    .eq("id", productId);

  if (error) return { error: "Failed to update product status." };
  
  revalidatePath("/admin/inventory");
  revalidatePath("/shop");
  return { success: true };
}

export async function updateProductStock(productId: string, newStock: number) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("products")
    .update({ stock_quantity: newStock })
    .eq("id", productId);

  if (error) return { error: "Failed to update stock quantity." };
  
  revalidatePath("/admin/inventory");
  return { success: true };
}
