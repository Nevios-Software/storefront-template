import type { ComponentType } from "react";
import type { Collection, Product, ProductSort } from "@nevios/storefront-js";

import { DefaultCollectionTemplate } from "./default";

/** Products per page on a collection listing. The loader + templates share it. */
export const COLLECTION_PAGE_SIZE = 12;

/** Sort options offered on a collection listing (loader validates against these). */
export const COLLECTION_SORTS: { value: ProductSort; label: string }[] = [
  { value: "newest", label: "Nejnovější" },
  { value: "price-asc", label: "Od nejlevnějších" },
  { value: "price-desc", label: "Od nejdražších" },
  { value: "title-asc", label: "Název A–Z" },
];

/** Props every collection template receives (the collection loader's data). */
export interface CollectionTemplateProps {
  collection: Collection;
  products: Product[];
  total: number;
  page: number;
  sort: ProductSort;
}

/**
 * Collection page templates, keyed by `template_handle`. The `default` entry is
 * required — the fallback for any collection with no (or unknown)
 * `template_handle`. Add an alternate the same way as product templates:
 * component under `app/collection-templates/` + entry here + `nevios.templates.json`.
 */
export const COLLECTION_TEMPLATES: Record<string, ComponentType<CollectionTemplateProps>> = {
  default: DefaultCollectionTemplate,
};

/** Pick the template for a collection's `template_handle` (null/unknown -> default). */
export function resolveCollectionTemplate(templateHandle: string | null | undefined) {
  return (templateHandle && COLLECTION_TEMPLATES[templateHandle]) || COLLECTION_TEMPLATES.default;
}
