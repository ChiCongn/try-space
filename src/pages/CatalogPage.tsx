import { AnimatePresence, motion } from "framer-motion";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { productApi, type ProductFilters } from "../services/product.api";
import { ProductCard } from "../components/product/ProductCard";
import { getErrorMessages } from "../utils/errors";
import type { Product } from "../types";

const categories = [
  { label: "Tất cả", value: "all", emoji: "✦" },
  { label: "Sofa", value: "sofa", emoji: "🛋" },
  { label: "Ghế", value: "chair", emoji: "🪑" },
  { label: "Bàn", value: "table", emoji: "🪵" },
  { label: "Kệ", value: "shelf", emoji: "📦" },
  { label: "Đèn", value: "lamp", emoji: "💡" },
];

const sorts: Array<{ label: string; value: ProductFilters["sort"] }> = [
  { label: "Mới nhất", value: "newest" },
  { label: "Giá tăng dần", value: "price_asc" },
  { label: "Giá giảm dần", value: "price_desc" },
  { label: "Phổ biến nhất", value: "popular" },
];

export function CatalogPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);

  const category = searchParams.get("category") ?? "all";
  const query = searchParams.get("q") ?? "";
  const sort = (searchParams.get("sort") ?? "newest") as ProductFilters["sort"];
  const minPrice = searchParams.get("minPrice") ?? "";
  const maxPrice = searchParams.get("maxPrice") ?? "";

  const hasActiveFilters =
    (category && category !== "all") || minPrice || maxPrice;

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

    async function loadProducts() {
      await Promise.resolve();
      if (!isMounted) return;

      setIsLoading(true);
      try {
        const response = await productApi.getAll(filters);
        if (isMounted) {
          setError("");
          setProducts(response.data);
        }
      } catch (caught) {
        if (isMounted) {
          const messages = getErrorMessages(
            caught,
            "Không thể tải sản phẩm. Vui lòng kiểm tra backend hoặc thử lại sau.",
          );
          setProducts([]);
          setError(messages.join("\n"));
          toast.error("Không thể tải sản phẩm", {
            description: messages.join("\n"),
          });
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    void loadProducts();

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

  function clearFilters() {
    setSearchParams(new URLSearchParams());
  }

  return (
    <div className="catalog-v2">
      {/* ─── Page Header ─── */}
      <div className="cv2-header">
        <div className="cv2-header__text">
          <span className="cv2-eyebrow">Khám phá</span>
          <h1 className="cv2-title">Nội Thất AR</h1>
        </div>

        {/* Search bar */}
        <div
          className={`cv2-search ${searchFocused ? "cv2-search--focused" : ""}`}
        >
          <Search size={16} className="cv2-search__icon" aria-hidden />
          <input
            ref={searchRef}
            className="cv2-search__input"
            defaultValue={query}
            placeholder="Tìm sofa, ghế, đèn..."
            type="search"
            onBlur={() => setSearchFocused(false)}
            onChange={(e) => updateParam("q", e.target.value)}
            onFocus={() => setSearchFocused(true)}
          />
        </div>
      </div>

      {/* ─── Category strip + controls ─── */}
      <div className="cv2-controls">
        {/* Horizontal scroll category pills */}
        <div className="cv2-cats" role="group" aria-label="Danh mục">
          {categories.map((cat) => (
            <button
              aria-pressed={category === cat.value}
              className={`cv2-cat-pill ${category === cat.value ? "cv2-cat-pill--active" : ""}`}
              key={cat.value}
              type="button"
              onClick={() => updateParam("category", cat.value)}
            >
              <span className="cv2-cat-pill__emoji" aria-hidden>
                {cat.emoji}
              </span>
              {cat.label}
            </button>
          ))}
        </div>

        {/* Right side: sort + filter button */}
        <div className="cv2-toolbar">
          <select
            aria-label="Sắp xếp"
            className="cv2-sort-select"
            value={sort}
            onChange={(e) =>
              updateParam("sort", e.target.value as NonNullable<typeof sort>)
            }
          >
            {sorts.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>

          <button
            aria-label="Bộ lọc"
            className={`cv2-filter-btn ${hasActiveFilters ? "cv2-filter-btn--active" : ""}`}
            type="button"
            onClick={() => setMobileFiltersOpen(true)}
          >
            <SlidersHorizontal size={15} />
            {hasActiveFilters && <span className="cv2-filter-dot" />}
          </button>
        </div>
      </div>

      {/* ─── Active filter chips ─── */}
      <AnimatePresence>
        {hasActiveFilters && (
          <motion.div
            animate={{ opacity: 1, height: "auto" }}
            className="cv2-active-filters"
            exit={{ opacity: 0, height: 0 }}
            initial={{ opacity: 0, height: 0 }}
          >
            {category && category !== "all" && (
              <span className="cv2-chip">
                {categories.find((c) => c.value === category)?.label}
                <button
                  aria-label="Xoá bộ lọc danh mục"
                  type="button"
                  onClick={() => updateParam("category", "all")}
                >
                  <X size={11} />
                </button>
              </span>
            )}
            {minPrice && (
              <span className="cv2-chip">
                Từ {Number(minPrice).toLocaleString("vi-VN")}đ
                <button
                  aria-label="Xoá giá tối thiểu"
                  type="button"
                  onClick={() => updateParam("minPrice", "")}
                >
                  <X size={11} />
                </button>
              </span>
            )}
            {maxPrice && (
              <span className="cv2-chip">
                Đến {Number(maxPrice).toLocaleString("vi-VN")}đ
                <button
                  aria-label="Xoá giá tối đa"
                  type="button"
                  onClick={() => updateParam("maxPrice", "")}
                >
                  <X size={11} />
                </button>
              </span>
            )}
            <button
              className="cv2-clear-btn"
              type="button"
              onClick={clearFilters}
            >
              Xoá tất cả
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── Desktop sidebar + grid layout ─── */}
      <div className="cv2-layout">
        {/* Desktop sidebar (hidden on mobile) */}
        <aside className="cv2-sidebar" aria-label="Bộ lọc">
          <p className="cv2-sidebar__heading">Bộ lọc</p>

          <div className="cv2-sidebar__section">
            <span className="cv2-sidebar__label">Giá (VND)</span>
            <div className="cv2-price-row">
              <input
                className="cv2-price-input"
                inputMode="numeric"
                placeholder="Tối thiểu"
                value={minPrice}
                onChange={(e) => updateParam("minPrice", e.target.value)}
              />
              <span className="cv2-price-sep">–</span>
              <input
                className="cv2-price-input"
                inputMode="numeric"
                placeholder="Tối đa"
                value={maxPrice}
                onChange={(e) => updateParam("maxPrice", e.target.value)}
              />
            </div>
          </div>

          {hasActiveFilters && (
            <button
              className="cv2-sidebar__clear"
              type="button"
              onClick={clearFilters}
            >
              Xoá bộ lọc
            </button>
          )}
        </aside>

        {/* Product grid */}
        <section aria-label="Danh sách sản phẩm">
          <div className="cv2-grid-meta">
            <span className="cv2-count">
              {isLoading ? "Đang tải..." : `${products.length} sản phẩm`}
            </span>
          </div>

          {isLoading ? (
            <div className="cv2-grid">
              {Array.from({ length: 8 }).map((_, i) => (
                <div className="cv2-skeleton" key={i} aria-hidden />
              ))}
            </div>
          ) : error ? (
            <div className="cv2-empty">
              <span className="cv2-empty__icon">!</span>
              <p>{error}</p>
              <button type="button" onClick={clearFilters}>
                Xoá bộ lọc
              </button>
            </div>
          ) : products.length > 0 ? (
            <div className="cv2-grid">
              <AnimatePresence>
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </AnimatePresence>
            </div>
          ) : (
            <div className="cv2-empty">
              <span className="cv2-empty__icon">◎</span>
              <p>Không tìm thấy sản phẩm phù hợp</p>
              <button type="button" onClick={clearFilters}>
                Xoá bộ lọc
              </button>
            </div>
          )}
        </section>
      </div>

      {/* ─── Mobile filter bottom sheet ─── */}
      <AnimatePresence>
        {mobileFiltersOpen && (
          <>
            <motion.div
              animate={{ opacity: 1 }}
              aria-hidden
              className="cv2-sheet-backdrop"
              exit={{ opacity: 0 }}
              initial={{ opacity: 0 }}
              onClick={() => setMobileFiltersOpen(false)}
            />
            <motion.div
              animate={{ y: 0 }}
              aria-label="Bộ lọc"
              aria-modal="true"
              className="cv2-sheet"
              exit={{ y: "100%" }}
              initial={{ y: "100%" }}
              role="dialog"
              transition={{ type: "spring", damping: 28, stiffness: 300 }}
            >
              {/* Handle */}
              <div className="cv2-sheet__handle" aria-hidden />

              <div className="cv2-sheet__header">
                <h2 className="cv2-sheet__title">Bộ lọc</h2>
                <button
                  aria-label="Đóng"
                  className="cv2-sheet__close"
                  type="button"
                  onClick={() => setMobileFiltersOpen(false)}
                >
                  <X size={18} />
                </button>
              </div>

              {/* Sort */}
              <div className="cv2-sheet__section">
                <span className="cv2-sheet__label">Sắp xếp theo</span>
                <div className="cv2-sheet__options">
                  {sorts.map((s) => (
                    <button
                      aria-pressed={sort === s.value}
                      className={`cv2-sheet__opt ${sort === s.value ? "cv2-sheet__opt--active" : ""}`}
                      key={s.value}
                      type="button"
                      onClick={() => updateParam("sort", s.value!)}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price */}
              <div className="cv2-sheet__section">
                <span className="cv2-sheet__label">Khoảng giá</span>
                <div className="cv2-price-row">
                  <input
                    className="cv2-price-input"
                    inputMode="numeric"
                    placeholder="Tối thiểu"
                    value={minPrice}
                    onChange={(e) => updateParam("minPrice", e.target.value)}
                  />
                  <span className="cv2-price-sep">–</span>
                  <input
                    className="cv2-price-input"
                    inputMode="numeric"
                    placeholder="Tối đa"
                    value={maxPrice}
                    onChange={(e) => updateParam("maxPrice", e.target.value)}
                  />
                </div>
              </div>

              <div className="cv2-sheet__footer">
                <button
                  className="cv2-sheet__reset"
                  type="button"
                  onClick={clearFilters}
                >
                  Đặt lại
                </button>
                <button
                  className="cv2-sheet__apply"
                  type="button"
                  onClick={() => setMobileFiltersOpen(false)}
                >
                  Xem {isLoading ? "..." : `${products.length} kết quả`}
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
