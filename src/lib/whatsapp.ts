const BETECH_WHATSAPP_NUMBER = '5491136327076';

type WhatsAppProductRequestInput = {
  descriptionCommercial: string;
  sku: string;
  currency: string;
  price: number;
  productUrl?: string;
};

function normalizeText(value: string): string {
  return (value || '').trim();
}

function formatWhatsAppPrice(currency: string, price: number): string {
  const safeCurrency = normalizeText(currency || 'ARS').toUpperCase();

  if (typeof price !== 'number' || Number.isNaN(price)) {
    return `${safeCurrency} Consultar`;
  }

  const amount = new Intl.NumberFormat('es-AR', {
    maximumFractionDigits: 0,
  }).format(price);

  return `${safeCurrency} ${amount}`;
}

function normalizeProductUrl(productUrl?: string): string {
  const url = normalizeText(productUrl || '');
  if (!url) return '';

  if (/^https?:\/\//i.test(url)) {
    return url;
  }

  if (typeof window === 'undefined') {
    return '';
  }

  return new URL(url, window.location.origin).toString();
}

export function buildWhatsAppRequestMessage(input: WhatsAppProductRequestInput): string {
  const productUrl = normalizeProductUrl(input.productUrl);

  const lines = [
    'Hola \u{1F44B}',
    '',
    'Quiero solicitar el siguiente producto:',
    '',
    `• Producto: ${normalizeText(input.descriptionCommercial) || 'Sin descripción'}`,
    `• SKU: ${normalizeText(input.sku) || 'Sin SKU'}`,
    `• Precio: ${formatWhatsAppPrice(input.currency, input.price)}`,
    '',
    '¿Podrían ayudarme a avanzar con este pedido?',
    '',
    'Muchas gracias.',
  ];

  if (productUrl) {
    lines.push('', productUrl);
  }

  return lines.join('\n');
}

export function buildWhatsAppRequestUrl(input: WhatsAppProductRequestInput): string {
  const message = buildWhatsAppRequestMessage(input);
  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${BETECH_WHATSAPP_NUMBER}?text=${encodedMessage}`;
}

export function openWhatsAppRequest(input: WhatsAppProductRequestInput): void {
  const url = buildWhatsAppRequestUrl(input);

  // Evita sacar al usuario de la web: intenta abrir un popup y si el navegador lo bloquea, abre nueva pestaña.
  const popup = window.open(
    url,
    'betech-whatsapp-request',
    'popup=yes,width=520,height=760,noopener,noreferrer'
  );

  if (popup) {
    popup.focus();
    return;
  }

  window.open(url, '_blank', 'noopener,noreferrer');
}
