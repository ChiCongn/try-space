import { ArrowLeft, ScanLine, ShoppingBag } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { ARControls } from "../components/ar/ARControls";
import {
  ModelViewer,
  type ModelViewerArStatus,
  type ModelViewerDimensions,
  type ModelViewerHandle,
  type ModelViewerLoadStatus,
} from "../components/ar/ModelViewer";
import { PlaneDetector } from "../components/ar/PlaneDetector";
import { ThreeViewer } from "../components/ar/ThreeViewer";
import { useARSupport } from "../hooks/useARSupport";
import { productApi } from "../services/product.api";
import { formatVnd } from "../utils/formatPrice";
import { getErrorMessages } from "../utils/errors";
import { useArStore } from "../store/arStore";
import { useCartStore } from "../store/cartStore";
import { useDesignStore } from "../store/designStore";
import type { Product, ProductColor, ProductMaterial } from "../types";

const preloadedModelUrls = new Set<string>();

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function formatScaleValue(value: number) {
  return Number.isFinite(value) ? clamp(value, 0.02, 20).toFixed(4) : "1";
}

function preloadModelAsset(modelUrl: string) {
  if (
    preloadedModelUrls.has(modelUrl) ||
    typeof document === "undefined" ||
    !modelUrl
  ) {
    return;
  }

  const link = document.createElement("link");
  link.rel = "preload";
  link.as = "fetch";
  link.href = modelUrl;
  link.type = "model/gltf-binary";
  if (!modelUrl.startsWith("/")) {
    link.crossOrigin = "anonymous";
  }

  document.head.appendChild(link);
  preloadedModelUrls.add(modelUrl);
}

export function ARPage() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const arSupport = useARSupport();
  const modelViewerRef = useRef<ModelViewerHandle | null>(null);
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [canActivateAR, setCanActivateAR] = useState(false);
  const [selectedColorId, setSelectedColorId] = useState("");
  const [selectedMaterialId, setSelectedMaterialId] = useState("");
  const [modelStatus, setModelStatus] =
    useState<ModelViewerLoadStatus>("loading");
  const [modelMeasurement, setModelMeasurement] = useState<{
    dimensions: ModelViewerDimensions;
    src: string;
  } | null>(null);
  const [arStatus, setArStatus] = useState<ModelViewerArStatus | "idle">(
    "idle",
  );
  const [isLaunchingAR, setIsLaunchingAR] = useState(false);
  const addItem = useCartStore((state) => state.addItem);
  const addDesign = useDesignStore((state) => state.addDesign);
  const rotateLeft = useArStore((state) => state.rotateLeft);
  const rotateRight = useArStore((state) => state.rotateRight);
  const setArSelection = useArStore((state) => state.setSelection);
  const setArStoreStatus = useArStore((state) => state.setStatus);

  useEffect(() => {
    if (!id) {
      return;
    }

    let isMounted = true;
    productApi
      .getById(id)
      .then((response) => {
        if (isMounted) {
          if (response.data.modelUrl) {
            preloadModelAsset(response.data.modelUrl);
          }
          setProduct(response.data);
          setSelectedColorId(
            searchParams.get("color") ?? response.data.colors[0]?.id ?? "",
          );
          setSelectedMaterialId(
            searchParams.get("material") ?? response.data.materials[0]?.id ?? "",
          );
        }
      })
      .catch((caught) => {
        if (!isMounted) return;

        const messages = getErrorMessages(
          caught,
          "Không thể tải sản phẩm AR.",
        );
        setProduct(null);
        toast.error("Không thể tải sản phẩm AR", {
          description: messages.join("\n"),
        });
      })
      .finally(() => {
        if (isMounted) {
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [id, searchParams]);

  const selectedColor = useMemo(() => {
    if (!product) {
      return null;
    }

    return (
      product.colors.find((color) => color.id === selectedColorId) ??
      product.colors[0]
    );
  }, [product, selectedColorId]);

  const selectedMaterial = useMemo(() => {
    if (!product) {
      return null;
    }

    return (
      product.materials.find(
        (material) => material.id === selectedMaterialId,
      ) ?? product.materials[0]
    );
  }, [product, selectedMaterialId]);

  const finalPrice = useMemo(() => {
    if (!product || !selectedMaterial) {
      return 0;
    }

    return product.basePrice + selectedMaterial.surcharge;
  }, [product, selectedMaterial]);

  const modelScale = useMemo(() => {
    if (
      !product?.modelUrl ||
      modelMeasurement?.src !== product.modelUrl ||
      !modelMeasurement.dimensions
    ) {
      return "1 1 1";
    }

    const targetWidth = product.dimensions.w / 100;
    const targetHeight = product.dimensions.h / 100;
    const targetDepth = product.dimensions.d / 100;
    const { x, y, z } = modelMeasurement.dimensions;

    return [
      formatScaleValue(targetWidth / Math.max(x, 0.01)),
      formatScaleValue(targetHeight / Math.max(y, 0.01)),
      formatScaleValue(targetDepth / Math.max(z, 0.01)),
    ].join(" ");
  }, [modelMeasurement, product]);

  useEffect(() => {
    if (selectedColor && selectedMaterial) {
      setArSelection(selectedColor, selectedMaterial);
    }
  }, [selectedColor, selectedMaterial, setArSelection]);

  async function handleStartAR() {
    if (!product?.modelUrl) {
      toast.error("Chưa thể mở AR", {
        description: "Sản phẩm này chưa có model 3D.",
      });
      return;
    }

    if (modelStatus === "loading") {
      toast.info("Model 3D đang tải", {
        description: "Đợi vài giây rồi mở camera AR.",
      });
      return;
    }

    if (modelStatus === "error") {
      toast.error("Không thể mở AR", {
        description: "Model 3D chưa tải được.",
      });
      return;
    }

    setIsLaunchingAR(true);

    try {
      const started = await modelViewerRef.current?.startAR();

      if (!started) {
        setArStatus("failed");
        toast.warning("Thiết bị chưa mở được AR", {
          description: arSupport.isMobile
            ? "Hãy dùng Chrome trên Android hoặc Safari trên iPhone, và mở trang bằng HTTPS hoặc URL có thể truy cập từ điện thoại."
            : "Mở trang này trên điện thoại để dùng camera AR.",
        });
        return;
      }

      toast.success("Đang mở AR", {
        description: "Quét mặt sàn chậm để đặt sản phẩm.",
      });
      setArStoreStatus("active");
    } catch (caught) {
      setArStatus("failed");
      setArStoreStatus("error");
      const messages = getErrorMessages(
        caught,
        "Vui lòng thử lại hoặc dùng viewer 3D.",
      );
      toast.error("Không thể mở AR", {
        description: messages.join("\n"),
      });
    } finally {
      setIsLaunchingAR(false);
    }
  }

  function handleAddToCart() {
    if (!product || !selectedColor || !selectedMaterial) return;

    addItem(product, selectedColor, selectedMaterial);
    toast.success("Đã thêm vào giỏ hàng", {
      description: product.name,
    });
  }

  function handleArStatusChange(status: ModelViewerArStatus) {
    setArStatus(status);

    if (status === "failed") {
      setArStoreStatus("error");
      setIsLaunchingAR(false);
      toast.error("Phiên AR không khởi động được");
      return;
    }

    if (status === "object-placed") {
      setArStoreStatus("placed");
      return;
    }

    if (status === "session-started") {
      setArStoreStatus("active");
      return;
    }

    setArStoreStatus("inactive");
  }

  function handleSaveDesign() {
    if (!product || !selectedColor || !selectedMaterial) return;
    addDesign({ product, selectedColor, selectedMaterial });
    toast.success("Đã lưu thiết kế AR");
  }

  function handleColorChange(color: ProductColor) {
    setSelectedColorId(color.id);
  }

  function handleMaterialChange(material: ProductMaterial) {
    setSelectedMaterialId(material.id);
  }

  function handleModelDimensionsChange(dimensions: ModelViewerDimensions) {
    if (!product?.modelUrl) return;
    setModelMeasurement({ dimensions, src: product.modelUrl });
  }

  const arButtonLabel = isLaunchingAR
    ? "Đang mở camera..."
    : modelStatus === "loading"
      ? "Đang tải model 3D..."
    : modelStatus === "error"
      ? "Model 3D bị lỗi"
      : "Mở camera AR";

  if (isLoading) {
    return <div className="ar-page">Đang mở AR...</div>;
  }

  if (!product || !selectedColor || !selectedMaterial) {
    return <div className="ar-page">Không tìm thấy sản phẩm.</div>;
  }

  return (
    <section className="ar-page">
      <div className="ar-topbar">
        <Link to={`/products/${product.id}`} aria-label="Quay lại">
          <ArrowLeft size={20} />
        </Link>
        <span>
          {canActivateAR ? "AR ready" : "3D preview"}
        </span>
      </div>

      <div className="ar-viewfinder">
        {product.modelUrl ? (
          <ModelViewer
            ref={modelViewerRef}
            alt={`AR model của ${product.name}`}
            onArAvailabilityChange={setCanActivateAR}
            onArStatusChange={handleArStatusChange}
            onLoadStatusChange={setModelStatus}
            onModelDimensionsChange={handleModelDimensionsChange}
            poster={product.images[0]}
            modelScale={modelScale}
            selectedColor={selectedColor.hex}
            src={product.modelUrl}
          />
        ) : (
          <ThreeViewer color={selectedColor.hex} />
        )}
        {arStatus === "session-started" ? <PlaneDetector /> : null}
      </div>

      <div className="ar-floating-actions" aria-label="Tác vụ AR chính">
        <button
          className="ar-floating-actions__primary"
          disabled={
            isLaunchingAR || !product.modelUrl || modelStatus === "error"
          }
          type="button"
          onClick={handleStartAR}
        >
          <ScanLine size={19} />
          {arButtonLabel}
        </button>
      </div>

      <aside className="ar-bottom-sheet" aria-label="Điều khiển AR">
        <div className="ar-bottom-sheet__header">
          <div>
            <span>
              {selectedColor.name} · {selectedMaterial.name}
            </span>
            <strong>{product.name}</strong>
          </div>
          <strong className="ar-bottom-sheet__price">
            {formatVnd(finalPrice)}
          </strong>
        </div>

        <div className="ar-product-meta" aria-label="Thông số sản phẩm">
          <div>
            <span>Rộng</span>
            <strong>{product.dimensions.w} cm</strong>
          </div>
          <div>
            <span>Sâu</span>
            <strong>{product.dimensions.d} cm</strong>
          </div>
          <div>
            <span>Cao</span>
            <strong>{product.dimensions.h} cm</strong>
          </div>
        </div>

        <ARControls
          colors={product.colors}
          materials={product.materials}
          selectedColor={selectedColor}
          selectedMaterial={selectedMaterial}
          onColorChange={handleColorChange}
          onMaterialChange={handleMaterialChange}
          onRotateLeft={rotateLeft}
          onRotateRight={rotateRight}
          onSave={handleSaveDesign}
        />

        <div className="ar-actions">
          <button type="button" onClick={handleAddToCart}>
            <ShoppingBag size={18} />
            Thêm giỏ
          </button>
        </div>
      </aside>
    </section>
  );
}
