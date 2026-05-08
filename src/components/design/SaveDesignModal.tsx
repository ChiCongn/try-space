import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { Modal } from "../ui";
import { useDesignStore } from "../../store/designStore";
import type { Product, ProductColor, ProductMaterial } from "../../types";

interface SaveDesignModalProps {
  onClose: () => void;
  open: boolean;
  product: Product;
  selectedColor: ProductColor;
  selectedMaterial: ProductMaterial;
  thumbnailUrl?: string;
}

export function SaveDesignModal({
  onClose,
  open,
  product,
  selectedColor,
  selectedMaterial,
  thumbnailUrl,
}: SaveDesignModalProps) {
  const addDesign = useDesignStore((state) => state.addDesign);
  const [name, setName] = useState(`${product.name} custom`);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    addDesign({ name, product, selectedColor, selectedMaterial, thumbnailUrl });
    toast.success("Đã lưu thiết kế");
    onClose();
  }

  return (
    <Modal open={open} title="Lưu thiết kế" onClose={onClose}>
      <form className="save-design-form" onSubmit={handleSubmit}>
        <label>
          Tên thiết kế
          <input value={name} onChange={(event) => setName(event.target.value)} />
        </label>
        <button className="primary-link" type="submit">
          Lưu
        </button>
      </form>
    </Modal>
  );
}
