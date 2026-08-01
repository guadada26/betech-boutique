/**
 * Tipo que representa una categoría recibida desde la API (Google Apps Script).
 * Mapea 1:1 con la hoja CATEGORIAS del Master.
 */
export interface Category {
  id: string;
  status: string;
  name: string;
  slug: string;
  title: string;
  subtitle: string;
  featuredBrands: string[];
}
