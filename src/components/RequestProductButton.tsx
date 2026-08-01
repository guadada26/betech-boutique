'use client';

import { openWhatsAppRequest } from '@/lib/whatsapp';

type RequestProductButtonProps = {
  sku: string;
  descriptionCommercial: string;
  currency: string;
  price: number;
  productUrl?: string;
  className: string;
};

export default function RequestProductButton({
  sku,
  descriptionCommercial,
  currency,
  price,
  productUrl,
  className,
}: RequestProductButtonProps) {
  return (
    <button
      type="button"
      className={className}
      data-sku={sku}
      data-action="request-product"
      onClick={() => {
        openWhatsAppRequest({
          sku,
          descriptionCommercial,
          currency,
          price,
          productUrl,
        });
      }}
    >
      Solicitar
    </button>
  );
}
