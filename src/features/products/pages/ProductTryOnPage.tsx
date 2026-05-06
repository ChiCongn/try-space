import { useMemo, useRef, useState } from "react";
import { ArActionBar } from "../../ar/components/ArActionBar";
import { ArPlacementTips } from "../../ar/components/ArPlacementTips";
import { ArSupportNotice } from "../../ar/components/ArSupportNotice";
import {
  ModelViewer,
  type ModelViewerArStatus,
  type ModelViewerHandle,
} from "../../ar/components/ModelViewer";
import { TryInRoomGuide } from "../../ar/components/TryInRoomGuide";
import { TryInRoomSheet } from "../../ar/components/TryInRoomSheet";
import { createDemoId } from "../../../shared/lib/ids";
import { featuredProduct } from "../data/products";
import { ProductHero } from "../components/ProductHero";
import { ProductSpecs } from "../components/ProductSpecs";
import { VariantSelector } from "../components/VariantSelector";

export function ProductTryOnPage() {
  const [selectedVariantId, setSelectedVariantId] = useState(
    featuredProduct.variants[0].id,
  );
  const [arStatus, setArStatus] = useState<ModelViewerArStatus | "idle">(
    "idle",
  );
  const [canActivateAR, setCanActivateAR] = useState(false);
  const [isLaunchingAR, setIsLaunchingAR] = useState(false);
  const [isTryRoomSheetOpen, setIsTryRoomSheetOpen] = useState(false);
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

  const arStatusMessage = useMemo(() => {
    if (!canActivateAR) {
      return "Thiết bị hiện tại đang dùng chế độ 3D thay thế.";
    }

    switch (arStatus) {
      case "failed":
        return "Không mở được AR. Hãy thử lại hoặc dùng viewer 3D.";
      case "not-presenting":
        return "AR đã đóng. Bạn có thể mở lại bất cứ lúc nào.";
      case "object-placed":
        return "Sản phẩm đã được đặt trong không gian AR.";
      case "session-started":
        return "Phiên AR đang mở. Quét sàn chậm để đặt sản phẩm.";
      case "idle":
      default:
        return "Thiết bị sẵn sàng mở AR để thử sản phẩm trong phòng.";
    }
  }, [arStatus, canActivateAR]);

  async function startTryInRoom() {
    setIsLaunchingAR(true);

    try {
      const started = await modelViewerRef.current?.startAR();

      if (!started) {
        setArStatus("failed");
        showPlaceholderToast("Thiết bị này đang dùng chế độ xem 3D thay thế");
        return;
      }

      showPlaceholderToast("Đang mở trải nghiệm AR");
    } catch {
      setArStatus("failed");
      showPlaceholderToast("Không mở được AR trên thiết bị này");
    } finally {
      setIsLaunchingAR(false);
    }
  }

  function handleTryInRoom() {
    setIsTryRoomSheetOpen(true);
  }

  function handleArStatusChange(status: ModelViewerArStatus) {
    setArStatus(status);

    if (status === "session-started" || status === "object-placed") {
      setIsTryRoomSheetOpen(false);
      setIsLaunchingAR(false);
    }

    if (status === "failed") {
      setIsLaunchingAR(false);
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
            onArAvailabilityChange={setCanActivateAR}
            onArStatusChange={handleArStatusChange}
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
          <TryInRoomGuide
            canActivateAR={canActivateAR}
            lastStatus={arStatusMessage}
          />
          <ArPlacementTips />
          <ArActionBar
            isLaunchingAR={isLaunchingAR}
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

      {isTryRoomSheetOpen ? (
        <TryInRoomSheet
          canActivateAR={canActivateAR}
          isLaunching={isLaunchingAR}
          onClose={() => setIsTryRoomSheetOpen(false)}
          onStartAR={startTryInRoom}
        />
      ) : null}

      {toastMessage ? (
        <div className="toast" role="status">
          {toastMessage}
        </div>
      ) : null}
    </main>
  );
}
