// import { useMemo, useState } from "react";
// import { MobileBottomNav } from "../../../components/ui";
// import { formatVnd } from "../../../shared/lib/money";
// import { ProductSpecs } from "../components/ProductSpecs";
// import { VariantSelector } from "../components/VariantSelector";
// import type { Product } from "../types";

// type ProductDetailPageProps = {
//   product: Product;
// };

// const categoryLabels: Record<Product["category"], string> = {
//   chair: "Ghế",
//   lighting: "Đèn",
//   ottoman: "Pouf",
//   shelf: "Kệ sách",
//   sofa: "Sofa",
//   table: "Bàn",
// };

// export function ProductDetailPage({ product }: ProductDetailPageProps) {
//   const [selectedVariantId, setSelectedVariantId] = useState(
//     product.variants[0].id,
//   );

//   const selectedVariant = useMemo(
//     () =>
//       product.variants.find((variant) => variant.id === selectedVariantId) ??
//       product.variants[0],
//     [product.variants, selectedVariantId],
//   );
//   const finalPrice = product.basePrice + selectedVariant.priceAddon;
//   const tryOnPath = `/try/${product.id}?variant=${selectedVariant.id}`;

//   return (
//     <main className="detail-page">
//       <header className="app-header">
//         <a className="brand" href="/products" aria-label="TrySpace catalog">
//           <span className="brand-logo">
//             <span>Try</span>
//             <span>Space</span>
//           </span>
//         </a>
//         <nav aria-label="Product navigation">
//           <a href="/products">Catalog</a>
//           <a href={tryOnPath}>AR/3D</a>
//         </nav>
//         <div className="header-actions">
//           <button className="nav-icon-button" type="button" aria-label="Save">
//             H
//           </button>
//           <button className="nav-icon-button" type="button" aria-label="Cart">
//             B<span>0</span>
//           </button>
//         </div>
//       </header>

//       <section className="detail-shell">
//         <div className="detail-media-panel">
//           <div className="detail-media">
//             <div className="viewer-tabs" aria-label="Viewer modes">
//               <button aria-pressed="true" type="button">
//                 3D view
//               </button>
//               <a href={tryOnPath}>AR room</a>
//               <button type="button">Photos</button>
//             </div>
//             <img src={product.posterUrl} alt="" />
//             <a className="ar-launch-button" href={tryOnPath}>
//               Camera · Try in your room
//             </a>
//           </div>
//           <div className="detail-ar-card">
//             <div>
//               <span>AR/3D preview</span>
//               <strong>Kiểm tra tỷ lệ thật trước khi mua</strong>
//             </div>
//             <a className="ui-button ui-button-primary" href={tryOnPath}>
//               Mở AR/3D
//             </a>
//           </div>
//         </div>

//         <div className="detail-content">
//           <p className="eyebrow">{categoryLabels[product.category]}</p>
//           <h1>{product.name}</h1>
//           <p className="tagline">{product.tagline}</p>
//           <p className="description">{product.description}</p>

//           <div className="detail-price-row">
//             <strong>{formatVnd(finalPrice)}</strong>
//             <span>
//               {selectedVariant.name} · {selectedVariant.materialName}
//             </span>
//           </div>

//           <VariantSelector
//             variants={product.variants}
//             selectedVariant={selectedVariant}
//             onSelectVariant={(variant) => setSelectedVariantId(variant.id)}
//           />
//           <ProductSpecs product={product} />

//           <div className="detail-actions" aria-label="Product actions">
//             <a className="ui-button ui-button-primary" href={tryOnPath}>
//               Thử trong phòng
//             </a>
//             <a className="ui-button ui-button-secondary" href="/products">
//               Xem sản phẩm khác
//             </a>
//           </div>
//         </div>
//       </section>
//       <MobileBottomNav active="explore" />
//     </main>
//   );
// }
