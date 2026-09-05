"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useSelectionStore } from "@/store/selectionStore";
import { generateMultiProductWhatsAppLink } from "@/utils/whatsapp";

export default function SelectionDrawer() {
  const {
    selectedProducts,
    isDrawerOpen,
    toggleDrawer,
    toggleSelection,
    clearSelection,
  } = useSelectionStore();

  // Handle client-side hydration (though selectionStore isn't persisted, it's good practice)
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <>
      {/* Backdrop */}
      {isDrawerOpen && (
        <div
          className="fixed inset-0 z-[60] bg-brand-primary/50 backdrop-blur-sm transition-opacity"
          onClick={() => toggleDrawer(false)}
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed right-0 top-0 z-[70] h-full w-full max-w-md transform bg-brand-canvas shadow-2xl transition-transform duration-300 ease-in-out flex flex-col ${
          isDrawerOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-brand-primary/10 px-6 py-5 bg-brand-canvas">
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-bold text-brand-primary">Selected Items</h2>
            {selectedProducts.length > 0 && (
              <span className="bg-brand-accent text-white text-[11px] font-bold px-2 py-0.5 rounded-full">
                {selectedProducts.length}
              </span>
            )}
          </div>
          <button
            onClick={() => toggleDrawer(false)}
            className="text-brand-primary/50 hover:text-brand-primary transition-colors"
            aria-label="Close selection drawer"
          >
            <XIcon className="h-6 w-6" />
          </button>
        </div>

        {/* Selected Items */}
        <div className="flex-1 overflow-y-auto p-6">
          {selectedProducts.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <ChecklistIcon className="h-12 w-12 text-brand-primary/20 mb-4" />
              <p className="text-lg font-bold text-brand-primary">No items selected.</p>
              <p className="text-sm text-brand-primary/60 mt-2 mb-6">
                Browse our farm-fresh staples and add them to your order.
              </p>
              <button
                onClick={() => toggleDrawer(false)}
                className="rounded-lg bg-brand-primary px-6 py-3 text-sm font-bold text-brand-canvas hover:opacity-90 transition-opacity"
              >
                Continue Browsing
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex justify-end pb-2">
                <button
                  onClick={clearSelection}
                  className="text-xs font-bold text-brand-primary/40 hover:text-brand-primary transition-colors underline"
                >
                  Clear All
                </button>
              </div>
              {selectedProducts.map((product) => (
                <div key={product.id} className="flex gap-4 border-b border-brand-primary/5 pb-6">
                  {/* Image or Placeholder */}
                  <div className="relative h-20 w-20 flex-shrink-0 rounded-md bg-brand-primary/5 flex items-center justify-center border border-brand-primary/10 overflow-hidden">
                    {product.image_url ? (
                      <Image
                        src={product.image_url}
                        alt={product.name}
                        fill
                        className="object-cover"
                        sizes="80px"
                      />
                    ) : (
                      <span className="text-[10px] font-bold text-brand-primary/30 uppercase tracking-wider text-center px-1">
                        {product.category.replace("_", " ")}
                      </span>
                    )}
                  </div>

                  {/* Details */}
                  <div className="flex flex-1 flex-col justify-between py-1">
                    <div>
                      <h3 className="font-bold text-brand-primary leading-tight pr-6">
                        {product.name}
                      </h3>
                      {/* <p className="text-sm font-medium text-brand-primary/60 mt-1">
                        ₹{product.base_price}
                      </p> */}
                    </div>

                    <button
                      onClick={() => toggleSelection(product)}
                      className="text-xs font-bold text-red-500/70 hover:text-red-500 transition-colors flex items-center gap-1 w-fit mt-3"
                    >
                      <TrashIcon className="h-3.5 w-3.5" /> Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {selectedProducts.length > 0 && (
          <div className="border-t border-brand-primary/10 bg-brand-canvas p-6 shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.05)]">
            <p className="text-xs text-brand-primary/60 mb-4 text-center leading-relaxed">
              Ready to order? We'll create a WhatsApp message with your selected items.
            </p>
            <a
              href={generateMultiProductWhatsAppLink(selectedProducts)}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => toggleDrawer(false)}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#25D366] hover:bg-[#20bd5a] py-3.5 text-sm font-bold text-white transition-colors shadow-sm"
            >
              <WhatsAppIcon className="w-5 h-5" />
              Order via WhatsApp
            </a>
          </div>
        )}
      </div>
    </>
  );
}

// --- Icons ---
const XIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M18 6 6 18" />
    <path d="m6 6 12 12" />
  </svg>
);

const TrashIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M3 6h18" />
    <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
    <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
  </svg>
);

const ChecklistIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="m9 11 3 3L22 4" />
    <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
  </svg>
);

const WhatsAppIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
  </svg>
);
