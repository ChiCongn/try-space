interface ProductSearchProps {
  onChange: (value: string) => void;
  value: string;
}

export function ProductSearch({ onChange, value }: ProductSearchProps) {
  return (
    <input
      aria-label="Tìm sản phẩm"
      className="product-search"
      placeholder="Tìm sofa, bàn, đèn..."
      value={value}
      onChange={(event) => onChange(event.target.value)}
    />
  );
}
