import { useMemo, useState } from "react";
import {
  Button,
  MobileBottomNav,
  Select,
  TextInput,
} from "../../../components/ui";
import { products } from "../data/products";
import type {
  Product,
  ProductCategory,
  ProductColor,
  ProductMaterial,
} from "../types";
import { ProductCard } from "../components/ProductCard";
import { getProductPriceRange } from "../lib/pricing";

type CategoryFilter = ProductCategory | "all";
type ColorFilter = ProductColor | "all";
type MaterialFilter = ProductMaterial | "all";
type PriceFilter = "all" | "under-2500000" | "2500000-3500000" | "over-3500000";
type SortMode = "featured" | "name" | "price-asc" | "price-desc";

const categoryOptions: Array<{ label: string; value: CategoryFilter }> = [
  { label: "Tất cả", value: "all" },
  { label: "Ghế", value: "chair" },
  { label: "Bàn", value: "table" },
  { label: "Kệ sách", value: "shelf" },
  { label: "Sofa", value: "sofa" },
  { label: "Pouf", value: "ottoman" },
  { label: "Đèn", value: "lighting" },
];

const colorOptions: Array<{ label: string; value: ColorFilter }> = [
  { label: "Tất cả", value: "all" },
  { label: "Beige", value: "beige" },
  { label: "Đen", value: "black" },
  { label: "Nâu", value: "brown" },
  { label: "Xanh", value: "green" },
  { label: "Xám", value: "grey" },
  { label: "Gỗ tự nhiên", value: "natural" },
  { label: "Trắng", value: "white" },
];

const materialOptions: Array<{ label: string; value: MaterialFilter }> = [
  { label: "Tất cả", value: "all" },
  { label: "Ash", value: "ash" },
  { label: "Boucle", value: "boucle" },
  { label: "Leather", value: "leather" },
  { label: "Linen", value: "linen" },
  { label: "Oak", value: "oak" },
  { label: "Silk", value: "silk" },
  { label: "Steel", value: "steel" },
  { label: "Walnut", value: "walnut" },
];

function matchesPrice(product: Product, filter: PriceFilter) {
  if (filter === "all") {
    return true;
  }

  const { min } = getProductPriceRange(product);

  if (filter === "under-2500000") {
    return min < 2500000;
  }

  if (filter === "2500000-3500000") {
    return min >= 2500000 && min <= 3500000;
  }

  return min > 3500000;
}

function productSearchText(product: Product) {
  return [
    product.name,
    product.tagline,
    product.description,
    product.roomFit,
    product.category,
    ...product.variants.flatMap((variant) => [
      variant.colorName,
      variant.materialName,
      variant.name,
    ]),
  ]
    .join(" ")
    .toLowerCase();
}

export function ProductCatalogPage() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<CategoryFilter>("all");
  const [price, setPrice] = useState<PriceFilter>("all");
  const [color, setColor] = useState<ColorFilter>("all");
  const [material, setMaterial] = useState<MaterialFilter>("all");
  const [sort, setSort] = useState<SortMode>("featured");

  const filteredProducts = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return products
      .filter((product) => {
        const matchesQuery =
          normalizedQuery.length === 0 ||
          productSearchText(product).includes(normalizedQuery);
        const matchesCategory =
          category === "all" || product.category === category;
        const matchesColor =
          color === "all" ||
          product.variants.some((variant) => variant.color === color);
        const matchesMaterial =
          material === "all" ||
          product.variants.some((variant) => variant.material === material);

        return (
          matchesQuery &&
          matchesCategory &&
          matchesPrice(product, price) &&
          matchesColor &&
          matchesMaterial
        );
      })
      .sort((leftProduct, rightProduct) => {
        if (sort === "name") {
          return leftProduct.name.localeCompare(rightProduct.name);
        }

        if (sort === "price-asc") {
          return (
            getProductPriceRange(leftProduct).min -
            getProductPriceRange(rightProduct).min
          );
        }

        if (sort === "price-desc") {
          return (
            getProductPriceRange(rightProduct).min -
            getProductPriceRange(leftProduct).min
          );
        }

        return (
          products.findIndex((product) => product.id === leftProduct.id) -
          products.findIndex((product) => product.id === rightProduct.id)
        );
      });
  }, [category, color, material, price, query, sort]);

  function resetFilters() {
    setQuery("");
    setCategory("all");
    setPrice("all");
    setColor("all");
    setMaterial("all");
    setSort("featured");
  }

  return (
    <main className="catalog-page">
      <header className="app-header">
        <a className="brand" href="/products" aria-label="TrySpace catalog">
          <span className="brand-logo">
            <span>Try</span>
            <span>Space</span>
          </span>
        </a>
        <nav aria-label="Catalog navigation">
          <a href="/products">Explore</a>
          <a href="/try">AR/3D</a>
          <a href="#catalog-grid">Pieces</a>
        </nav>
        <div className="header-actions">
          <button className="nav-icon-button" type="button" aria-label="Search">
            S
          </button>
          <button className="nav-icon-button" type="button" aria-label="Cart">
            B<span>0</span>
          </button>
        </div>
      </header>

      <section className="catalog-shell" aria-labelledby="catalog-title">
        <div className="catalog-heading">
          <div>
            <p className="eyebrow">Nội thất mẫu</p>
            <h1 id="catalog-title">Chọn sản phẩm để thử trong phòng</h1>
          </div>
          <p>
            Ghế, bàn, kệ, sofa, pouf và đèn có kích thước rõ ràng để so nhanh
            với phòng.
          </p>
        </div>

        <div className="catalog-workspace">
          <aside className="catalog-filters" aria-label="Bộ lọc sản phẩm">
            <TextInput
              label="Search"
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Tìm ghế, bàn, kệ..."
              type="search"
              value={query}
            />
            <Select
              label="Category"
              onChange={(event) =>
                setCategory(event.target.value as CategoryFilter)
              }
              value={category}
            >
              {categoryOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Select>
            <Select
              label="Price"
              onChange={(event) => setPrice(event.target.value as PriceFilter)}
              value={price}
            >
              <option value="all">Tất cả</option>
              <option value="under-2500000">Dưới 2.500.000 VND</option>
              <option value="2500000-3500000">2.500.000-3.500.000 VND</option>
              <option value="over-3500000">Trên 3.500.000 VND</option>
            </Select>
            <Select
              label="Color"
              onChange={(event) => setColor(event.target.value as ColorFilter)}
              value={color}
            >
              {colorOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Select>
            <Select
              label="Material"
              onChange={(event) =>
                setMaterial(event.target.value as MaterialFilter)
              }
              value={material}
            >
              {materialOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Select>
            <Button onClick={resetFilters} variant="ghost">
              Reset
            </Button>
          </aside>

          <section className="catalog-results" aria-labelledby="results-title">
            <div className="filter-chip-row" aria-label="Category shortcuts">
              {categoryOptions.map((option) => (
                <button
                  aria-pressed={category === option.value}
                  key={option.value}
                  onClick={() => setCategory(option.value)}
                  type="button"
                >
                  {option.label}
                </button>
              ))}
            </div>
            <div className="results-toolbar">
              <div>
                <h2 id="results-title">{filteredProducts.length} sản phẩm</h2>
                <span>Nhiều model 3D demo</span>
              </div>
              <Select
                label="Sort"
                onChange={(event) => setSort(event.target.value as SortMode)}
                value={sort}
              >
                <option value="featured">Đề xuất</option>
                <option value="price-asc">Giá tăng dần</option>
                <option value="price-desc">Giá giảm dần</option>
                <option value="name">Tên A-Z</option>
              </Select>
            </div>

            {filteredProducts.length > 0 ? (
              <div className="product-grid" id="catalog-grid">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="empty-state" role="status">
                Không có sản phẩm phù hợp. Hãy đổi bộ lọc hoặc reset.
              </div>
            )}
          </section>
        </div>
      </section>
      <MobileBottomNav active="explore" />
    </main>
  );
}
