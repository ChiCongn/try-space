import { AnimatePresence, motion } from "framer-motion";
import { Heart, Share2, ShoppingBag, View, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { productsApi } from "../api/products.api";
import { ModelViewer } from "../features/ar/components/ModelViewer";
import { formatVnd } from "../shared/lib/money";
import { useCartStore } from "../stores/cartStore";
import { useWishlistStore } from "../stores/wishlistStore";
import type { Product, ProductColor, ProductMaterial } from "../types";

export function ProductDetailPage() {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedColor, setSelectedColor] = useState<ProductColor | null>(null);
  const [selectedMaterial, setSelectedMaterial] =
    useState<ProductMaterial | null>(null);
  const [viewerOpen, setViewerOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const addItem = useCartStore((state) => state.addItem);
  const toggleWishlist = useWishlistStore((state) => state.toggle);
  const isWished = useWishlistStore((state) =>
    product ? state.isWished(product.id) : false,
  );

  useEffect(() => {
    if (!id) {
      return;
    }

    let isMounted = true;

    productsApi
      .getById(id)
      .then((response) => {
        if (!isMounted) {
          return;
        }

        setProduct(response.data);
        setSelectedColor(response.data.colors[0]);
        setSelectedMaterial(response.data.materials[0]);
      })
      .catch(() => {
        if (isMounted) {
          setProduct(null);
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
  }, [id]);

  const finalPrice = useMemo(() => {
    if (!product || !selectedMaterial) {
      return 0;
    }

    return product.basePrice + selectedMaterial.surcharge;
  }, [product, selectedMaterial]);

  function saveDesign() {
    if (!product || !selectedColor || !selectedMaterial) {
      return;
    }

    const hash = `design_${Date.now().toString(36)}`;
    const saved = {
      hash,
      productId: product.id,
      selectedColor,
      selectedMaterial,
    };
    localStorage.setItem(`tryspace-design-${hash}`, JSON.stringify(saved));
    setToast(`/design/${hash}`);
    window.setTimeout(() => setToast(null), 3200);
  }

  if (isLoading) {
    return <div className="page-loading">Đang tải sản phẩm...</div>;
  }

  if (!product || !selectedColor || !selectedMaterial) {
    return (
      <div className="empty-panel page-empty">
        Không tìm thấy sản phẩm. <Link to="/catalog">Về catalog</Link>
      </div>
    );
  }

  return (
    <section className="detail-page-new">
      <nav className="breadcrumb" aria-label="Breadcrumb">
        <Link to="/">Home</Link>
        <span>/</span>
        <Link to={`/catalog?category=${product.category}`}>{product.category}</Link>
        <span>/</span>
        <span>{product.name}</span>
      </nav>

      <div className="detail-layout-new">
        <div className="detail-gallery">
          <motion.div className="detail-main-image" layoutId={product.id}>
            <img src={product.images[0]} alt={product.name} />
            {product.modelUrl ? (
              <button
                className="viewer-float-button"
                onClick={() => setViewerOpen(true)}
                type="button"
              >
                <View size={17} /> Xem 3D
              </button>
            ) : null}
          </motion.div>
          <div className="thumb-row">
            {product.images.map((image) => (
              <img key={image} src={image} alt="" />
            ))}
          </div>
        </div>

        <aside className="detail-info-panel">
          <span className="collection-label">{product.collection}</span>
          <h1>{product.name}</h1>
          <div className="detail-rating">
            <strong>{product.rating}</strong>
            <span>{product.reviewCount} đánh giá</span>
            <span>{product.inStock ? "Còn hàng" : "Tạm hết hàng"}</span>
          </div>

          <div className="detail-price">
            <strong>{formatVnd(finalPrice)}</strong>
            {selectedMaterial.surcharge !== 0 ? (
              <span>{formatVnd(product.basePrice)}</span>
            ) : null}
          </div>

          <section className="option-section">
            <div className="option-heading">
              <span>Màu sắc</span>
              <strong>{selectedColor.name}</strong>
            </div>
            <div className="color-options">
              {product.colors.map((color) => (
                <button
                  aria-label={color.name}
                  aria-pressed={selectedColor.id === color.id}
                  key={color.id}
                  onClick={() => setSelectedColor(color)}
                  style={{ backgroundColor: color.hex }}
                  type="button"
                />
              ))}
            </div>
          </section>

          <section className="option-section">
            <div className="option-heading">
              <span>Vật liệu</span>
              <strong>{selectedMaterial.name}</strong>
            </div>
            <div className="material-options">
              {product.materials.map((material) => (
                <button
                  aria-pressed={selectedMaterial.id === material.id}
                  key={material.id}
                  onClick={() => setSelectedMaterial(material)}
                  type="button"
                >
                  {material.name}
                  {material.surcharge !== 0 ? (
                    <span>{formatVnd(material.surcharge)}</span>
                  ) : null}
                </button>
              ))}
            </div>
          </section>

          <section className="dimensions-grid" aria-label="Kích thước">
            <div>
              <strong>{product.dimensions.w}</strong>
              <span>Rộng</span>
            </div>
            <div>
              <strong>{product.dimensions.d}</strong>
              <span>Sâu</span>
            </div>
            <div>
              <strong>{product.dimensions.h}</strong>
              <span>Cao</span>
            </div>
          </section>

          <p className="detail-copy">
            Mẫu thuộc {product.collection}, hỗ trợ preview 3D/AR với kích thước
            mô phỏng theo đơn vị centimet để bạn kiểm tra tỷ lệ trong phòng.
          </p>

          <div className="detail-cta-row">
            <button
              className="primary-link"
              disabled={!product.inStock}
              onClick={() => addItem(product, selectedColor, selectedMaterial)}
              type="button"
            >
              <ShoppingBag size={17} /> Thêm vào giỏ
            </button>
            <button
              aria-pressed={isWished}
              className="square-action"
              onClick={() => toggleWishlist(product)}
              type="button"
              aria-label="Yêu thích"
            >
              <Heart size={18} fill={isWished ? "currentColor" : "none"} />
            </button>
            <button
              className="square-action"
              onClick={saveDesign}
              type="button"
              aria-label="Lưu thiết kế"
            >
              <Share2 size={18} />
            </button>
          </div>

          <Link
            className="ar-link"
            to={`/ar/${product.id}?color=${selectedColor.id}&material=${selectedMaterial.id}`}
          >
            <View size={17} /> Thử trong phòng
          </Link>
        </aside>
      </div>

      <AnimatePresence>
        {viewerOpen && product.modelUrl ? (
          <div className="viewer-modal" role="dialog" aria-modal="true">
            <motion.div
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.97 }}
              initial={{ opacity: 0, scale: 0.97 }}
              className="viewer-modal-card"
            >
              <button
                onClick={() => setViewerOpen(false)}
                type="button"
                aria-label="Đóng viewer"
              >
                <X size={18} />
              </button>
              <ModelViewer
                alt={`3D model của ${product.name}`}
                poster={product.images[0]}
                selectedColor={selectedColor.hex}
                src={product.modelUrl}
              />
            </motion.div>
          </div>
        ) : null}
      </AnimatePresence>

      {toast ? <div className="toast">Đã lưu thiết kế: {toast}</div> : null}
    </section>
  );
}
