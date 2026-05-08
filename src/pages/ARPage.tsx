import { ArrowLeft, Move, Plus, RotateCw, Trash2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { productsApi } from "../api/products.api";
import { ModelViewer } from "../features/ar/components/ModelViewer";
import { useARSupport } from "../hooks/useARSupport";
import type { Product } from "../types";

export function ARPage() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const arSupport = useARSupport();
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (arSupport.useDesktopViewer && id) {
      navigate(`/products/${id}`, { replace: true });
    }
  }, [arSupport.useDesktopViewer, id, navigate]);

  useEffect(() => {
    if (!id) {
      return;
    }

    let isMounted = true;
    productsApi
      .getById(id)
      .then((response) => {
        if (isMounted) {
          setProduct(response.data);
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

  const selectedColor = useMemo(() => {
    if (!product) {
      return null;
    }

    return (
      product.colors.find((color) => color.id === searchParams.get("color")) ??
      product.colors[0]
    );
  }, [product, searchParams]);

  const selectedMaterial = useMemo(() => {
    if (!product) {
      return null;
    }

    return (
      product.materials.find(
        (material) => material.id === searchParams.get("material"),
      ) ?? product.materials[0]
    );
  }, [product, searchParams]);

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
          {arSupport.arSupported ? "AR ready" : "model-viewer fallback"}
        </span>
      </div>

      <div className="ar-viewfinder">
        {product.modelUrl ? (
          <ModelViewer
            alt={`AR model của ${product.name}`}
            poster={product.images[0]}
            selectedColor={selectedColor.hex}
            src={product.modelUrl}
          />
        ) : (
          <img src={product.images[0]} alt={product.name} />
        )}
        <div className="corner-brackets" aria-hidden="true" />
        <div className="floor-ring" aria-hidden="true" />
        <span className="tap-label">Tap để đặt</span>
      </div>

      <div className="ar-toolbar" aria-label="AR controls">
        <button type="button">
          <RotateCw size={18} /> Xoay
        </button>
        <button type="button">
          <Move size={18} /> Move
        </button>
        <button type="button">
          <span className="capture-dot" />
        </button>
        <button type="button">
          <Plus size={18} />
        </button>
        <button type="button">
          <Trash2 size={18} />
        </button>
      </div>
    </section>
  );
}
