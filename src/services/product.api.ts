import { apiClient } from "./api";
import type {
  ApiResponse,
  Product,
  ProductColor,
  ProductMaterial,
} from "../types";

const fallbackProductImage = "/models/wooden-table-set.png";

const fallbackProducts: Product[] = [
  {
    arSupported: true,
    basePrice: 4200000,
    category: "ghe",
    collection: "Classic Icons",
    colors: [
      { hex: "#c9a882", id: "c1", name: "Be da" },
      { hex: "#1c1c1c", id: "c2", name: "Đen da" },
      { hex: "#8b4513", id: "c3", name: "Cognac" },
    ],
    dimensions: { d: 84, h: 85, w: 83 },
    id: "ghe-eames-replica",
    images: ["/models/fallback/sheen-chair.jpg"],
    inStock: true,
    materials: [
      { id: "m1", name: "Da thật", surcharge: 0 },
      { id: "m2", name: "Da Italy cao cấp", surcharge: 800000 },
    ],
    modelUrl: "/models/fallback/sheen-chair.glb",
    name: "Ghế Eames Lounge",
    rating: 4.9,
    reviewCount: 89,
    slug: "ghe-eames-replica",
    tags: ["classic", "leather", "lounge", "chair", "ghe"],
  },
];

const fallbackProductAliases = new Map(
  fallbackProducts.flatMap((product) => [
    [product.id, product],
    [product.slug ?? product.id, product],
    ["ghe-eames-lounge", product],
    ["p001", product],
    ["p002", product],
  ]),
);

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

function matchesText(product: Product, query: string) {
  const normalizedQuery = normalize(query);
  if (!normalizedQuery) return true;

  return [
    product.name,
    product.collection,
    product.category,
    product.tags.join(" "),
  ].some((value) => normalize(value).includes(normalizedQuery));
}

function matchesCategory(product: Product, category?: string) {
  if (!category || category === "all") return true;
  const normalizedCategory = categoryAliases[category] ?? category;
  return product.category === normalizedCategory;
}

function fallbackProductList(filters: ProductFilters = {}): ApiResponse<Product[]> {
  const page = Math.max(1, filters.page ?? 1);
  const limit = Math.max(1, filters.limit ?? fallbackProducts.length);
  const sortedProducts = [...fallbackProducts]
    .filter((product) => matchesCategory(product, filters.category))
    .filter((product) => matchesText(product, filters.query ?? ""))
    .filter((product) =>
      filters.minPrice === undefined ? true : product.basePrice >= filters.minPrice,
    )
    .filter((product) =>
      filters.maxPrice === undefined ? true : product.basePrice <= filters.maxPrice,
    )
    .sort((left, right) => {
      if (filters.sort === "price_asc") return left.basePrice - right.basePrice;
      if (filters.sort === "price_desc") return right.basePrice - left.basePrice;
      return 0;
    });
  const total = sortedProducts.length;
  const totalPages = Math.max(1, Math.ceil(total / limit));
  const start = (page - 1) * limit;

  return {
    data: sortedProducts.slice(start, start + limit),
    pagination: {
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
      limit,
      page,
      total,
      totalPages,
    },
  };
}

function getFallbackProduct(id: string) {
  return fallbackProductAliases.get(id);
}

export const productApi = {
  async getAll(filters: ProductFilters = {}): Promise<ApiResponse<Product[]>> {
    try {
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
    } catch {
      return fallbackProductList(filters);
    }
  },

  async getById(id: string): Promise<ApiResponse<Product>> {
    try {
      const response = await apiClient.get<{ data: ApiProduct; success: boolean }>(
        `/products/${id}`,
      );
      return { data: normalizeProduct(response.data.data) };
    } catch (caught) {
      const fallbackProduct = getFallbackProduct(id);
      if (fallbackProduct) {
        return { data: fallbackProduct };
      }

      throw caught;
    }
  },
};
