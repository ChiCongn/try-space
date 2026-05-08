import { X } from "lucide-react";
import type { ReactNode } from "react";

interface ModalProps {
  children: ReactNode;
  onClose: () => void;
  open: boolean;
  title: string;
}

export function Modal({ children, onClose, open, title }: ModalProps) {
  if (!open) return null;

  return (
    <div className="modal-overlay" role="presentation" onClick={onClose}>
      <section
        aria-modal="true"
        className="modal-card"
        role="dialog"
        onClick={(event) => event.stopPropagation()}
      >
        <header className="modal-card__header">
          <h2>{title}</h2>
          <button aria-label="Đóng" type="button" onClick={onClose}>
            <X size={18} />
          </button>
        </header>
        {children}
      </section>
    </div>
  );
}
