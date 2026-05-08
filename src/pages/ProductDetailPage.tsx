import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  Check,
  Heart,
  Maximize2,
  Ruler,
  ScanLine,
  Share2,
  ShoppingBag,
  Star,
  X,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { productsApi } from "../api/products.api";
import { ModelViewer } from "../features/ar/components/ModelViewer";
import { formatVnd } from "../shared/lib/money";
import { useCartStore } from "../stores/cartStore";
import { useWishlistStore } from "../stores/wishlistStore";
import type { Product, ProductColor, ProductMaterial } from "../types";

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 18 },

  show: {
    opacity: 1,
    y: 0,

    transition: {
      duration: 0.38,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  },
};

export function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeImg, setActiveImg] = useState(0);
  const [selectedColor, setSelectedColor] = useState<ProductColor | null>(null);
  const [selectedMaterial, setSelectedMaterial] =
    useState<ProductMaterial | null>(null);
  const [viewerOpen, setViewerOpen] = useState(false);
  const [added, setAdded] = useState(false);

  const addItem = useCartStore((s) => s.addItem);
  const toggleWishlist = useWishlistStore((s) => s.toggle);
  const isWished = useWishlistStore((s) =>
    product ? s.isWished(product.id) : false,
  );

  useEffect(() => {
    if (!id) return;
    let live = true;
    setIsLoading(true);
    productsApi
      .getById(id)
      .then((res) => {
        if (!live) return;
        setProduct(res.data);
        setSelectedColor(res.data.colors[0]);
        setSelectedMaterial(res.data.materials[0]);
        setActiveImg(0);
      })
      .catch(() => {
        if (live) setProduct(null);
      })
      .finally(() => {
        if (live) setIsLoading(false);
      });
    return () => {
      live = false;
    };
  }, [id]);

  const finalPrice = useMemo(() => {
    if (!product || !selectedMaterial) return 0;
    return product.basePrice + selectedMaterial.surcharge;
  }, [product, selectedMaterial]);

  function handleAddToCart() {
    if (!product || !selectedColor || !selectedMaterial) {
      toast.error("Chưa thể thêm vào giỏ", {
        description: "Vui lòng chọn đầy đủ màu sắc và vật liệu.",
      });
      return;
    }

    if (!product.inStock) {
      toast.warning("Sản phẩm đang hết hàng");
      return;
    }

    addItem(product, selectedColor, selectedMaterial);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
    toast.success("Đã thêm vào giỏ hàng", {
      description: product.name,
    });
  }

  function saveDesign() {
    if (!product || !selectedColor || !selectedMaterial) {
      toast.error("Chưa thể lưu thiết kế", {
        description: "Vui lòng chọn đầy đủ màu sắc và vật liệu.",
      });
      return;
    }

    const hash = `design_${Date.now().toString(36)}`;
    try {
      localStorage.setItem(
        `tryspace-design-${hash}`,
        JSON.stringify({
          hash,
          productId: product.id,
          selectedColor,
          selectedMaterial,
        }),
      );
      toast.success("Đã lưu thiết kế");
    } catch {
      toast.error("Không thể lưu thiết kế", {
        description: "Trình duyệt không cho phép lưu dữ liệu lúc này.",
      });
    }
  }

  function handleToggleWishlist() {
    if (!product) return;

    toggleWishlist(product);
    toast.success(isWished ? "Đã bỏ khỏi yêu thích" : "Đã thêm vào yêu thích", {
      description: product.name,
    });
  }

  /* ── Loading ── */
  if (isLoading) {
    return (
      <div className="pdp-skeleton-wrap">
        <div className="pdp-skeleton-img" />
        <div className="pdp-skeleton-body">
          <div className="pdp-skeleton-line pdp-skeleton-line--short" />
          <div className="pdp-skeleton-line pdp-skeleton-line--title" />
          <div className="pdp-skeleton-line" />
          <div className="pdp-skeleton-line pdp-skeleton-line--short" />
        </div>
      </div>
    );
  }

  /* ── Not found ── */
  if (!product || !selectedColor || !selectedMaterial) {
    return (
      <div className="pdp-not-found">
        <span>◎</span>
        <p>Không tìm thấy sản phẩm</p>
        <Link to="/catalog">← Về catalog</Link>
      </div>
    );
  }

  return (
    <div className="pdp">
      {/* ── Floating back button ── */}
      <button
        aria-label="Quay lại"
        className="pdp__back"
        type="button"
        onClick={() => navigate(-1)}
      >
        <ArrowLeft size={18} strokeWidth={2} />
      </button>

      <div className="pdp__inner">
        {/* ════════════════════════════════
            LEFT — Gallery
            ════════════════════════════════ */}
        <div className="pdp__gallery">
          {/* Main image */}
          <motion.div
            className="pdp__main-img"
            layoutId={`product-img-${product.id}`}
          >
            <AnimatePresence mode="wait">
              <motion.img
                key={activeImg}
                alt={product.name}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.02 }}
                initial={{ opacity: 0, scale: 0.98 }}
                src={product.images[activeImg]}
                transition={{ duration: 0.25 }}
              />
            </AnimatePresence>

            {/* Stock badge */}
            <span
              className={`pdp__stock-badge ${product.inStock ? "pdp__stock-badge--in" : "pdp__stock-badge--out"}`}
            >
              {product.inStock ? "Còn hàng" : "Hết hàng"}
            </span>

            {/* 3D viewer trigger */}
            {product.modelUrl && (
              <button
                className="pdp__3d-btn"
                type="button"
                onClick={() => setViewerOpen(true)}
              >
                <Maximize2 size={14} strokeWidth={2} />
                Xem 3D
              </button>
            )}
          </motion.div>

          {/* Thumbnail strip */}
          {product.images.length > 1 && (
            <div className="pdp__thumbs" role="group" aria-label="Ảnh sản phẩm">
              {product.images.map((img, i) => (
                <button
                  aria-label={`Ảnh ${i + 1}`}
                  aria-pressed={activeImg === i}
                  className={`pdp__thumb ${activeImg === i ? "pdp__thumb--active" : ""}`}
                  key={img}
                  type="button"
                  onClick={() => setActiveImg(i)}
                >
                  <img alt="" src={img} />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* ════════════════════════════════
            RIGHT — Info panel
            ════════════════════════════════ */}
        <motion.aside
          animate="show"
          className="pdp__panel"
          initial="hidden"
          variants={stagger}
        >
          {/* Breadcrumb */}
          <motion.nav
            aria-label="Breadcrumb"
            className="pdp__crumb"
            variants={fadeUp}
          >
            <Link to="/">Trang chủ</Link>
            <span aria-hidden>·</span>
            <Link to={`/catalog?category=${product.category}`}>
              {product.category}
            </Link>
            <span aria-hidden>·</span>
            <span>{product.name}</span>
          </motion.nav>

          {/* Collection tag */}
          <motion.span className="pdp__collection" variants={fadeUp}>
            {product.collection}
          </motion.span>

          {/* Product name */}
          <motion.h1 className="pdp__name" variants={fadeUp}>
            {product.name}
          </motion.h1>

          {/* Rating row */}
          <motion.div className="pdp__rating" variants={fadeUp}>
            <span className="pdp__stars" aria-label={`${product.rating} sao`}>
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  size={13}
                  fill={
                    i < Math.round(product.rating) ? "currentColor" : "none"
                  }
                  strokeWidth={1.5}
                />
              ))}
            </span>
            <strong>{product.rating}</strong>
            <span className="pdp__rating-sep" aria-hidden />
            <span>{product.reviewCount} đánh giá</span>
          </motion.div>

          {/* Price */}
          <motion.div className="pdp__price-row" variants={fadeUp}>
            <strong className="pdp__price">{formatVnd(finalPrice)}</strong>
            {selectedMaterial.surcharge !== 0 && (
              <span className="pdp__price-base">
                {formatVnd(product.basePrice)}
              </span>
            )}
            {selectedMaterial.surcharge > 0 && (
              <span className="pdp__surcharge">
                +{formatVnd(selectedMaterial.surcharge)} vật liệu
              </span>
            )}
          </motion.div>

          <div className="pdp__divider" />

          {/* Color picker */}
          <motion.section className="pdp__option" variants={fadeUp}>
            <div className="pdp__option-head">
              <span className="pdp__option-label">Màu sắc</span>
              <strong className="pdp__option-value">
                {selectedColor.name}
              </strong>
            </div>
            <div className="pdp__colors" role="group" aria-label="Chọn màu sắc">
              {product.colors.map((color) => {
                const active = selectedColor.id === color.id;
                return (
                  <button
                    aria-label={color.name}
                    aria-pressed={active}
                    className={`pdp__color-btn ${active ? "pdp__color-btn--active" : ""}`}
                    key={color.id}
                    style={{ "--swatch": color.hex } as React.CSSProperties}
                    type="button"
                    onClick={() => setSelectedColor(color)}
                  >
                    {active && (
                      <motion.span
                        animate={{ scale: 1, opacity: 1 }}
                        className="pdp__color-check"
                        initial={{ scale: 0, opacity: 0 }}
                      >
                        <Check size={10} strokeWidth={3} />
                      </motion.span>
                    )}
                  </button>
                );
              })}
            </div>
          </motion.section>

          {/* Material picker */}
          <motion.section className="pdp__option" variants={fadeUp}>
            <div className="pdp__option-head">
              <span className="pdp__option-label">Vật liệu</span>
              <strong className="pdp__option-value">
                {selectedMaterial.name}
              </strong>
            </div>
            <div
              className="pdp__materials"
              role="group"
              aria-label="Chọn vật liệu"
            >
              {product.materials.map((mat) => {
                const active = selectedMaterial.id === mat.id;
                return (
                  <button
                    aria-pressed={active}
                    className={`pdp__mat-btn ${active ? "pdp__mat-btn--active" : ""}`}
                    key={mat.id}
                    type="button"
                    onClick={() => setSelectedMaterial(mat)}
                  >
                    <span className="pdp__mat-name">{mat.name}</span>
                    {mat.surcharge !== 0 && (
                      <span className="pdp__mat-price">
                        +{formatVnd(mat.surcharge)}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </motion.section>

          {/* Dimensions */}
          <motion.section
            aria-label="Kích thước (cm)"
            className="pdp__dims"
            variants={fadeUp}
          >
            <div className="pdp__dim-head">
              <Ruler size={13} strokeWidth={2} aria-hidden />
              <span>Kích thước (cm)</span>
            </div>
            <div className="pdp__dim-grid">
              {(
                [
                  ["W", product.dimensions.w, "Rộng"],
                  ["D", product.dimensions.d, "Sâu"],
                  ["H", product.dimensions.h, "Cao"],
                ] as const
              ).map(([axis, val, label]) => (
                <div className="pdp__dim-cell" key={axis}>
                  <strong className="pdp__dim-val">{val}</strong>
                  <span className="pdp__dim-label">{label}</span>
                  <span className="pdp__dim-axis">{axis}</span>
                </div>
              ))}
            </div>
          </motion.section>

          {/* Description */}
          <motion.p className="pdp__desc" variants={fadeUp}>
            Mẫu thuộc {product.collection}, hỗ trợ preview 3D/AR với kích thước
            mô phỏng theo đơn vị centimet để bạn kiểm tra tỷ lệ trong phòng.
          </motion.p>

          <div className="pdp__divider" />

          {/* CTA row */}
          <motion.div className="pdp__cta" variants={fadeUp}>
            <motion.button
              animate={added ? { scale: [1, 0.95, 1] } : {}}
              className={`pdp__add-btn ${added ? "pdp__add-btn--added" : ""}`}
              disabled={!product.inStock}
              type="button"
              onClick={handleAddToCart}
            >
              <AnimatePresence mode="wait">
                {added ? (
                  <motion.span
                    animate={{ opacity: 1, y: 0 }}
                    className="pdp__add-btn-inner"
                    exit={{ opacity: 0, y: -8 }}
                    initial={{ opacity: 0, y: 8 }}
                    key="added"
                  >
                    <Check size={17} strokeWidth={2.5} />
                    Đã thêm
                  </motion.span>
                ) : (
                  <motion.span
                    animate={{ opacity: 1, y: 0 }}
                    className="pdp__add-btn-inner"
                    exit={{ opacity: 0, y: 8 }}
                    initial={{ opacity: 0, y: -8 }}
                    key="add"
                  >
                    <ShoppingBag size={17} strokeWidth={1.8} />
                    Thêm vào giỏ
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>

            <button
              aria-label={isWished ? "Bỏ yêu thích" : "Yêu thích"}
              aria-pressed={isWished}
              className={`pdp__icon-btn ${isWished ? "pdp__icon-btn--wished" : ""}`}
              type="button"
              onClick={handleToggleWishlist}
            >
              <Heart size={18} fill={isWished ? "currentColor" : "none"} />
            </button>

            <button
              aria-label="Lưu thiết kế"
              className="pdp__icon-btn"
              type="button"
              onClick={saveDesign}
            >
              <Share2 size={18} />
            </button>
          </motion.div>

          {/* AR link */}
          {product.arSupported && (
            <motion.div variants={fadeUp}>
              <Link
                className="pdp__ar-btn"
                to={`/ar/${product.id}?color=${selectedColor.id}&material=${selectedMaterial.id}`}
              >
                <span className="pdp__ar-glow" aria-hidden />
                <ScanLine size={18} strokeWidth={1.8} aria-hidden />
                Thử trong phòng của bạn
              </Link>
            </motion.div>
          )}
        </motion.aside>
      </div>

      {/* ── 3D Viewer modal ── */}
      <AnimatePresence>
        {viewerOpen && product.modelUrl && (
          <motion.div
            animate={{ opacity: 1 }}
            aria-modal="true"
            className="pdp__viewer-overlay"
            exit={{ opacity: 0 }}
            initial={{ opacity: 0 }}
            role="dialog"
          >
            <motion.div
              animate={{ opacity: 1, scale: 1, y: 0 }}
              className="pdp__viewer-card"
              exit={{ opacity: 0, scale: 0.96, y: 16 }}
              initial={{ opacity: 0, scale: 0.96, y: 16 }}
              transition={{ duration: 0.22 }}
            >
              <div className="pdp__viewer-header">
                <span>{product.name} — 3D</span>
                <button
                  aria-label="Đóng"
                  className="pdp__viewer-close"
                  type="button"
                  onClick={() => setViewerOpen(false)}
                >
                  <X size={17} />
                </button>
              </div>
              <div className="pdp__viewer-frame">
                <ModelViewer
                  alt={`3D model của ${product.name}`}
                  poster={product.images[0]}
                  selectedColor={selectedColor.hex}
                  src={product.modelUrl}
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
