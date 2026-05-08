import type { ProductFilters } from "../../services/product.api";

interface ProductSortProps {
  onChange: (value: ProductFilters["sort"]) => void;
  value?: ProductFilters["sort"];
}

export function ProductSort({ onChange, value = "popular" }: ProductSortProps) {
  return (
    <select
      aria-label="Sắp xếp"
      className="product-sort"
      value={value}
      onChange={(event) => onChange(event.target.value as ProductFilters["sort"])}
    >
      <option value="popular">Phổ biến</option>
      <option value="price_asc">Giá tăng dần</option>
      <option value="price_desc">Giá giảm dần</option>
      <option value="newest">Mới nhất</option>
    </select>
  );
}
