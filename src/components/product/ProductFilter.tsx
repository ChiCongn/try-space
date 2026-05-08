interface ProductFilterProps {
  category: string;
  onCategoryChange: (category: string) => void;
}

const categories = ["all", "sofa", "chair", "table", "shelf", "lamp", "other"];

export function ProductFilter({ category, onCategoryChange }: ProductFilterProps) {
  return (
    <div className="product-filter" role="group" aria-label="Danh mục">
      {categories.map((item) => (
        <button
          aria-pressed={category === item}
          className={category === item ? "is-active" : ""}
          key={item}
          type="button"
          onClick={() => onCategoryChange(item)}
        >
          {item}
        </button>
      ))}
    </div>
  );
}
