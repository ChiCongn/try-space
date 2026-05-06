import type { Product } from "../types";

type ProductSpecsProps = {
  product: Product;
};

export function ProductSpecs({ product }: ProductSpecsProps) {
  const { dimensions } = product;

  return (
    <section className="product-specs" aria-labelledby="specs-title">
      <div className="section-heading">
        <h2 id="specs-title">Kích thước thật</h2>
        <span>1:1 trong AR</span>
      </div>
      <dl>
        <div>
          <dt>Rộng</dt>
          <dd>
            {dimensions.width}
            {dimensions.unit}
          </dd>
        </div>
        <div>
          <dt>Cao</dt>
          <dd>
            {dimensions.height}
            {dimensions.unit}
          </dd>
        </div>
        <div>
          <dt>Sâu</dt>
          <dd>
            {dimensions.depth}
            {dimensions.unit}
          </dd>
        </div>
      </dl>
    </section>
  );
}
