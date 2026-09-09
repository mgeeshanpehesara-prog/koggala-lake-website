"use client";

import { Product } from "@/lib/types";
import { useCurrency } from "@/lib/currency/CurrencyContext";
import CTAButton from "@/components/ui/CTAButton";

export default function MobileStickyBar({ product }: { product: Product }) {
  const { displayPrice } = useCurrency();

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-navy-950/95 backdrop-blur-xl px-5 py-3 lg:hidden">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-[10px] uppercase tracking-wide text-sand-200/50">
            From
          </p>
          <p className="font-display text-lg font-semibold text-teal-400">
            {displayPrice(product.priceBase.amount, product.priceBase.currency)}
            <span className="ml-1 text-xs font-sans font-normal text-sand-200/60">
              {product.priceBase.unit}
            </span>
          </p>
        </div>
        <CTAButton href="#booking" size="md">
          Book Now
        </CTAButton>
      </div>
    </div>
  );
}
