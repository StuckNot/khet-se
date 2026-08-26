import type { Tables } from "@/types/database.types";

type Product = Tables<"products">;

/**
 * generateMultiProductWhatsAppLink
 * Builds a wa.me URL for ordering multiple products based on the selection state.
 * e.g. "Hi, I'd like to order:
 * - Product A
 * - Product B"
 */
export function generateMultiProductWhatsAppLink(products: Product[]): string {
  const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER;
  if (!WHATSAPP_NUMBER) {
    console.error("NEXT_PUBLIC_WHATSAPP_NUMBER is not defined");
  }

  const baseNumber = WHATSAPP_NUMBER || "918851819808";

  if (!products || products.length === 0) {
    return `https://wa.me/${baseNumber}`;
  }

  const intro = "Hi, I'd like to order:";
  const productList = products.map((p) => `- ${p.name}`).join("\n");
  const message = `${intro}\n${productList}`;
  
  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${baseNumber}?text=${encodedMessage}`;
}

/**
 * generateSingleProductWhatsAppLink
 * Builds a wa.me URL for ordering a single product directly from a product card/page.
 * e.g. "Hi, I'd like to order: Product A"
 */
export function generateSingleProductWhatsAppLink(product: Product): string {
  const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER;
  if (!WHATSAPP_NUMBER) {
    console.error("NEXT_PUBLIC_WHATSAPP_NUMBER is not defined");
  }

  const baseNumber = WHATSAPP_NUMBER || "918851819808";

  if (!product) {
    return `https://wa.me/${baseNumber}`;
  }

  const message = `Hi, I'd like to order:\n- ${product.name}`;
  const encodedMessage = encodeURIComponent(message);
  
  return `https://wa.me/${baseNumber}?text=${encodedMessage}`;
}

/**
 * generateGeneralWhatsAppLink
 * Builds a wa.me URL for general inquiries without specific products.
 * e.g. "Hi, I have a question about the Trial Kits"
 */
export function generateGeneralWhatsAppLink(message: string): string {
  const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER;
  const baseNumber = WHATSAPP_NUMBER || "918851819808";

  if (!message) {
    return `https://wa.me/${baseNumber}`;
  }

  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${baseNumber}?text=${encodedMessage}`;
}

