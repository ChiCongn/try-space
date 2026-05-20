import { apiClient } from "./api";
import type {
  ApiResponse,
  Product,
  ProductColor,
  ProductMaterial,
} from "../types";

const fallbackProductImage = "/models/wooden-table-set.png";

export interface ProductFilters {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  colors?: string[];
  materials?: string[];
  query?: string;
  sort?: "newest" | "price_asc" | "price_desc" | "popular";
  page?: number;
  limit?: number;
}

function normalize(value: string) {
  return value.trim().toLowerCase();
}

const categoryAliases: Record<string, string> = {
  chair: "ghe",
  lamp: "den",
  shelf: "ke",
  table: "ban",
};

export type ApiProduct = Omit<
  Partial<Product>,
  "category" | "colors" | "dimensions" | "images" | "materials"
> & {
  category?: string | { id?: string; name?: string; slug?: string };
  colors?: ProductColor[];
  dimensions?: {
    d?: number;
    depth?: number;
    h?: number;
    height?: number;
    unit?: string;
    w?: number;
    width?: number;
  };
  hasArSupport?: boolean;
  images?: Array<string | { url?: string }>;
  materials?: ProductMaterial[] | string[];
  posterUrl?: string;
  variants?: Array<{
    hexColor?: string;
    id?: string;
    name?: string;
    priceAddon?: number;
    type?: string;
  }>;
};

function isProductMaterial(value: unknown): value is ProductMaterial {
  return (
    typeof value === "object" &&
    value !== null &&
    "id" in value &&
    "name" in value &&
    "surcharge" in value
  );
}

function normalizeCategory(category: ApiProduct["category"]) {
  if (!category) return "other";
  if (typeof category === "string") return category;
  return category.slug ?? category.id ?? category.name ?? "other";
}

function normalizeColors(product: ApiProduct): ProductColor[] {
  if (product.colors?.length) return product.colors;

  const colors = new Map<string, ProductColor>();
  product.variants?.forEach((variant) => {
    if (!variant.hexColor) return;
    const id = variant.id ?? variant.name ?? variant.hexColor;
    colors.set(id, {
      hex: variant.hexColor,
      id,
      name: variant.name ?? "Màu mặc định",
    });
  });

  const normalizedColors = [...colors.values()];
  return normalizedColors.length
    ? normalizedColors
    : [{ hex: "#d6d0c4", id: "default", name: "Mặc định" }];
}

function normalizeMaterials(product: ApiProduct): ProductMaterial[] {
  if (!product.materials?.length) {
    return [{ id: "default", name: "Tiêu chuẩn", surcharge: 0 }];
  }

  return product.materials.map((material) => {
    if (isProductMaterial(material)) return material;
    return {
      id: normalize(material),
      name: material,
      surcharge: 0,
    };
  });
}

function normalizeImages(product: ApiProduct) {
  const images =
    product.images
      ?.map((image) => (typeof image === "string" ? image : image.url))
      .filter((image): image is string => Boolean(image)) ?? [];

  return images.length
    ? images
    : [product.thumbnailUrl, product.posterUrl].filter(
        (image): image is string => Boolean(image),
      );
}

export function normalizeProduct(product: ApiProduct): Product {
  const category =
    typeof product.category === "object" ? product.category : undefined;
  const images = normalizeImages(product);
  const dimensions = product.dimensions ?? {};
  const colors = normalizeColors(product);
  const materials = normalizeMaterials(product);

  return {
    ...product,
    arSupported:
      product.arSupported ?? product.hasArSupport ?? Boolean(product.modelUrl),
    basePrice: product.basePrice ?? product.finalPrice ?? 0,
    category: normalizeCategory(product.category),
    collection: product.collection ?? category?.name ?? "TrySpace",
    colors,
    dimensions: {
      d: dimensions.d ?? dimensions.depth ?? 0,
      h: dimensions.h ?? dimensions.height ?? 0,
      unit: dimensions.unit,
      w: dimensions.w ?? dimensions.width ?? 0,
    },
    id: product.id ?? "",
    images: images.length ? images : [fallbackProductImage],
    inStock: product.inStock ?? true,
    materials,
    name: product.name ?? "Sản phẩm",
    rating: product.rating ?? product.averageRating ?? 0,
    reviewCount: product.reviewCount ?? product.totalReviews ?? 0,
    tags: product.tags ?? [],
  };
}

function toBackendParams(filters: ProductFilters) {
  const category =
    filters.category && filters.category !== "all" ? filters.category : undefined;
  const categorySlug = category
    ? (categoryAliases[category] ?? category)
    : undefined;
  const sortMap = {
    newest: { sortBy: "createdAt", sortOrder: "desc" },
    popular: { sortBy: "popular", sortOrder: "desc" },
    price_asc: { sortBy: "price", sortOrder: "asc" },
    price_desc: { sortBy: "price", sortOrder: "desc" },
  } as const;
  const sort = sortMap[filters.sort ?? "newest"];

  return {
    categorySlug,
    color: filters.colors?.[0],
    limit: filters.limit,
    material: filters.materials?.[0],
    maxPrice: filters.maxPrice,
    minPrice: filters.minPrice,
    page: filters.page,
    search: filters.query || undefined,
    sortBy: sort.sortBy,
    sortOrder: sort.sortOrder,
  };
}

export const productApi = {
  async getAll(filters: ProductFilters = {}): Promise<ApiResponse<Product[]>> {
    const response = await apiClient.get<{
      data: ApiProduct[];
      meta: { limit: number; page: number; total: number; totalPages: number };
      success: boolean;
    }>("/products", {
      params: toBackendParams(filters),
    });
    const totalPages = response.data.meta.totalPages;
    const page = response.data.meta.page;

    return {
      data: response.data.data.map((product) => normalizeProduct(product)),
      pagination: {
        limit: response.data.meta.limit,
        page,
        total: response.data.meta.total,
        totalPages,
        hasNextPage: totalPages > page,
        hasPreviousPage: page > 1,
      },
    };
  },

  async getById(id: string): Promise<ApiResponse<Product>> {
    const response = await apiClient.get<{ data: ApiProduct; success: boolean }>(
      `/products/${id}`,
    );
    return { data: normalizeProduct(response.data.data) };
  },
};
