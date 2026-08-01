/**
 * Tipo que representa un producto recibido desde la API (Google Apps Script).
 * Mapea únicamente los campos públicos de la hoja PRODUCTOS del Master.
 * Los campos internos (costos, márgenes, proveedores) son excluidos por la API.
 */
export interface Product {
  sku: string;
  status: string;
  brand: string;
  name: string;
  description: string;
  currency: string;
  price: number;
  category: string;
  subcategory: string;
  badge: string;
  image: string | null;
  availability: string;
  resellerPrice?: number | null;
  publishHome?: string;
  PUBLICAR_HOME?: string;
  publishDrop?: string;
  PUBLICAR_DROP?: string;
  descriptionExtended?: string;
  availableColors?: string;
  measurements?: string;
}
