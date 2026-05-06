import { useMemo, useRef, useState } from "react";
import { ArActionBar } from "../../ar/components/ArActionBar";
import { ArPlacementTips } from "../../ar/components/ArPlacementTips";
import { ArSupportNotice } from "../../ar/components/ArSupportNotice";
import {
  ModelViewer,
  type ModelViewerHandle,
} from "../../ar/components/ModelViewer";
import { createDemoId } from "../../../shared/lib/ids";
import { featuredProduct } from "../data/products";
import { ProductHero } from "../components/ProductHero";
import { ProductSpecs } from "../components/ProductSpecs";
import { VariantSelector } from "../components/VariantSelector";

export function ProductTryOnPage() {
  const [selectedVariantId, setSelectedVariantId] = useState(
    featuredProduct.variants[0].id,
  );
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const modelViewerRef = useRef<ModelViewerHandle | null>(null);

  const selectedVariant = useMemo(
    () =>
      featuredProduct.variants.find(
        (variant) => variant.id === selectedVariantId,
      ) ?? featuredProduct.variants[0],
    [selectedVariantId],
  );

  function showPlaceholderToast(message: string) {
    setToastMessage(`${message} · ${createDemoId("demo")}`);
    window.setTimeout(() => setToastMessage(null), 2600);
  }

  async function handleTryInRoom() {
    const started = await modelViewerRef.current?.startAR();

    if (!started) {
      showPlaceholderToast("Thiết bị này đang dùng chế độ xem 3D thay thế");
    }
  }

  return (
    <main className="try-on-page">
      <header className="app-header">
        <a className="brand" href="/" aria-label="TrySpace home">
          TrySpace
        </a>
        <nav aria-label="Primary navigation">
          <a href="#viewer">AR</a>
          <a href="#details">Chi tiết</a>
          <a href="#placement-title">Mẹo đặt</a>
        </nav>
      </header>

      <section className="try-on-layout">
        <div className="viewer-column" id="viewer">
          <ModelViewer
            ref={modelViewerRef}
            src={featuredProduct.modelUrl}
            poster={featuredProduct.posterUrl}
            alt={`3D model của ${featuredProduct.name}`}
            selectedColor={selectedVariant.hexColor}
          />
          <ArSupportNotice />
        </div>

        <div className="details-column" id="details">
          <ProductHero
            product={featuredProduct}
            selectedVariant={selectedVariant}
          />
          <VariantSelector
            variants={featuredProduct.variants}
            selectedVariant={selectedVariant}
            onSelectVariant={(variant) => setSelectedVariantId(variant.id)}
          />
          <ProductSpecs product={featuredProduct} />
          <ArPlacementTips />
          <ArActionBar
            onTryInRoom={handleTryInRoom}
            onAddToCart={() =>
              showPlaceholderToast("Giỏ hàng sẽ được bật ở phase tiếp theo")
            }
            onSaveDesign={() =>
              showPlaceholderToast("Lưu thiết kế demo sẽ được bật sau")
            }
          />
        </div>
      </section>

      {toastMessage ? (
        <div className="toast" role="status">
          {toastMessage}
        </div>
      ) : null}
    </main>
  );
}
