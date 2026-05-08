import { ArrowLeft, ScanLine, ShoppingBag } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { ARControls } from "../components/ar/ARControls";
import {
  ModelViewer,
  type ModelViewerArStatus,
  type ModelViewerHandle,
  type ModelViewerLoadStatus,
} from "../components/ar/ModelViewer";
import { PlaneDetector } from "../components/ar/PlaneDetector";
import { ThreeViewer } from "../components/ar/ThreeViewer";
import { useARSupport } from "../hooks/useARSupport";
import { productApi } from "../services/product.api";
import { formatVnd } from "../utils/formatPrice";
import { useArStore } from "../store/arStore";
import { useCartStore } from "../store/cartStore";
import { useDesignStore } from "../store/designStore";
import type { Product, ProductColor, ProductMaterial } from "../types";

export function ARPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [searchParams] = useSearchParams();
  const arSupport = useARSupport();
  const modelViewerRef = useRef<ModelViewerHandle | null>(null);
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [, setCanActivateAR] = useState(false);
  const [selectedColorId, setSelectedColorId] = useState("");
  const [selectedMaterialId, setSelectedMaterialId] = useState("");
  const [modelStatus, setModelStatus] =
    useState<ModelViewerLoadStatus>("loading");
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
          setProduct(response.data);
          setSelectedColorId(
            searchParams.get("color") ?? response.data.colors[0]?.id ?? "",
          );
          setSelectedMaterialId(
            searchParams.get("material") ??
              response.data.materials[0]?.id ??
              "",
          );
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
    } catch {
      setArStatus("failed");
      setArStoreStatus("error");
      toast.error("Không thể mở AR", {
        description: "Vui lòng thử lại hoặc dùng viewer 3D.",
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

  if (isLoading) {
    return (
      <div className="ar-page-state">
        <span>TrySpace AR</span>
        <strong>Đang tải không gian thử sản phẩm...</strong>
      </div>
    );
  }

  if (!product || !selectedColor || !selectedMaterial) {
    return (
      <div className="ar-page-state">
        <span>TrySpace AR</span>
        <strong>Không tìm thấy sản phẩm.</strong>
        <Link className="primary-link" to="/catalog">
          Về catalog
        </Link>
      </div>
    );
  }

  return (
    <section className="ar-page">
      <div className="ar-topbar">
        <button
          aria-label="Quay lại"
          className="pdp__back"
          type="button"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft size={18} strokeWidth={2} />
        </button>
      </div>

      <section className="ar-stage" aria-label="Xem sản phẩm trong 3D">
        <div className="ar-viewfinder">
          {product.modelUrl ? (
            <ModelViewer
              ref={modelViewerRef}
              alt={`AR model của ${product.name}`}
              onArAvailabilityChange={setCanActivateAR}
              onArStatusChange={handleArStatusChange}
              onLoadStatusChange={setModelStatus}
              poster={product.images[0]}
              selectedColor={selectedColor.hex}
              src={product.modelUrl}
            />
          ) : (
            <ThreeViewer color={selectedColor.hex} />
          )}
          {arStatus === "session-started" ? <PlaneDetector /> : null}
        </div>
      </section>

      <aside className="ar-bottom-sheet" aria-label="Điều khiển AR">
        <div className="ar-panel-title">
          <span>Cấu hình sản phẩm</span>
        </div>

        <div className="ar-bottom-sheet__header">
          <div>
            <span>{product.collection}</span>
            <strong>{product.name}</strong>
            <small>
              {selectedColor.name} · {selectedMaterial.name}
            </small>
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
          <button
            className="ar-actions__primary"
            disabled={
              isLaunchingAR || !product.modelUrl || modelStatus === "error"
            }
            type="button"
            onClick={handleStartAR}
          >
            <ScanLine size={18} />
            {isLaunchingAR ? "Đang mở..." : "Mở AR"}
          </button>
          <button type="button" onClick={handleAddToCart}>
            <ShoppingBag size={18} />
            Thêm giỏ
          </button>
        </div>
      </aside>
    </section>
  );
}
