import { AnimatePresence } from "framer-motion";
import { SlidersHorizontal } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { productsApi, type ProductFilters } from "../api/products.api";
import { ProductCard } from "../components/product/ProductCard";
import type { Product } from "../types";

const categories = [
  { label: "Tất cả", value: "all" },
  { label: "Sofa", value: "sofa" },
  { label: "Ghế", value: "chair" },
  { label: "Bàn", value: "table" },
  { label: "Kệ", value: "shelf" },
  { label: "Đèn", value: "lamp" },
];

const sorts: Array<{ label: string; value: ProductFilters["sort"] }> = [
  { label: "Mới nhất", value: "newest" },
  { label: "Giá tăng dần", value: "price_asc" },
  { label: "Giá giảm dần", value: "price_desc" },
  { label: "Phổ biến", value: "popular" },
];

export function CatalogPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const category = searchParams.get("category") ?? "all";
  const query = searchParams.get("q") ?? "";
  const sort = (searchParams.get("sort") ??
    "newest") as ProductFilters["sort"];
  const minPrice = searchParams.get("minPrice") ?? "";
  const maxPrice = searchParams.get("maxPrice") ?? "";

  const filters = useMemo<ProductFilters>(
    () => ({
      category,
      maxPrice: maxPrice ? Number(maxPrice) : undefined,
      minPrice: minPrice ? Number(minPrice) : undefined,
      query,
      sort,
    }),
    [category, maxPrice, minPrice, query, sort],
  );

  useEffect(() => {
    let isMounted = true;

    productsApi
      .getAll(filters)
      .then((response) => {
        if (isMounted) {
          setProducts(response.data);
        }
      })
      .finally(() => {
        if (isMounted) {
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [filters]);

  function updateParam(key: string, value: string) {
    const next = new URLSearchParams(searchParams);

    if (!value || value === "all" || value === "newest") {
      next.delete(key);
    } else {
      next.set(key, value);
    }

    setSearchParams(next);
  }

  const filterPanel = (
    <aside className="catalog-sidebar" aria-label="Bộ lọc sản phẩm">
      <label>
        <span>Tìm kiếm</span>
        <input
          defaultValue={query}
          onChange={(event) => updateParam("q", event.target.value)}
          placeholder="Sofa, ghế, đèn..."
          type="search"
        />
      </label>
      <div>
        <span className="sidebar-label">Danh mục</span>
        <div className="category-options">
          {categories.map((item) => (
            <button
              aria-pressed={category === item.value}
              key={item.value}
              onClick={() => updateParam("category", item.value)}
              type="button"
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>
      <div className="price-fields">
        <label>
          <span>Giá từ</span>
          <input
            inputMode="numeric"
            onChange={(event) => updateParam("minPrice", event.target.value)}
            placeholder="0"
            value={minPrice}
          />
        </label>
        <label>
          <span>Giá đến</span>
          <input
            inputMode="numeric"
            onChange={(event) => updateParam("maxPrice", event.target.value)}
            placeholder="15000000"
            value={maxPrice}
          />
        </label>
      </div>
      <label>
        <span>Sắp xếp</span>
        <select
          onChange={(event) =>
            updateParam("sort", event.target.value as NonNullable<typeof sort>)
          }
          value={sort}
        >
          {sorts.map((item) => (
            <option key={item.value} value={item.value}>
              {item.label}
            </option>
          ))}
        </select>
      </label>
    </aside>
  );

  return (
    <section className="catalog-page-new">
      <div className="page-heading">
        <span>Explore furniture</span>
        <h1>Catalog nội thất AR</h1>
        <p>
          Lọc sản phẩm, xem biến thể, thêm vào giỏ và mở trải nghiệm AR từ từng
          detail page.
        </p>
      </div>

      <button
        className="mobile-filter-button"
        onClick={() => setMobileFiltersOpen(true)}
        type="button"
      >
        <SlidersHorizontal size={17} /> Bộ lọc
      </button>

      <div className="catalog-layout">
        {filterPanel}

        <section className="catalog-grid-panel" aria-label="Danh sách sản phẩm">
          <div className="catalog-count">
            <strong>{products.length} sản phẩm</strong>
            <span>Mock API · REST-ready</span>
          </div>

          {isLoading ? (
            <div className="product-grid-app">
              {Array.from({ length: 8 }).map((_, index) => (
                <div className="product-skeleton" key={index} />
              ))}
            </div>
          ) : products.length > 0 ? (
            <div className="product-grid-app">
              <AnimatePresence>
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </AnimatePresence>
            </div>
          ) : (
            <div className="empty-panel">Không có sản phẩm phù hợp.</div>
          )}
        </section>
      </div>

      {mobileFiltersOpen ? (
        <div className="filter-sheet" role="dialog" aria-modal="true">
          <button type="button" onClick={() => setMobileFiltersOpen(false)}>
            Đóng
          </button>
          {filterPanel}
        </div>
      ) : null}
    </section>
  );
}
