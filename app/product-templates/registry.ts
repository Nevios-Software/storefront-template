import type { ComponentType } from "react";
import type { Product } from "@nevios/storefront-js";

import { DefaultProductTemplate } from "./default";

/** Props every product template receives (the PDP loader's data). */
export interface ProductTemplateProps {
  product: Product;
  origin: string;
  url: string;
}

/**
 * Product page templates, keyed by `template_handle`. The `default` entry is
 * required — it's the fallback for any product with no (or an unknown)
 * `template_handle`. To add an alternate PDP:
 *   1. Build a component under `app/product-templates/` taking ProductTemplateProps.
 *   2. Register it here (key = its handle).
 *   3. Declare it in `nevios.templates.json` so the dashboard "Template ▾" lists it.
 * The merchant then assigns it per product in the dashboard.
 */
export const PRODUCT_TEMPLATES: Record<string, ComponentType<ProductTemplateProps>> = {
  default: DefaultProductTemplate,
};

/** Pick the template for a product's `template_handle` (null/unknown -> default). */
export function resolveProductTemplate(templateHandle: string | null | undefined) {
  return (templateHandle && PRODUCT_TEMPLATES[templateHandle]) || PRODUCT_TEMPLATES.default;
}
