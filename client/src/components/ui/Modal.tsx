import React from "react";
import { X } from "lucide-react";
import { cn } from "../../utils/cn";

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  className?: string;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, className }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-md"
        onClick={onClose}
      />
      <div
        className={cn("relative z-10 w-full max-w-2xl min-h-[520px] rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.3)] border glass-heavy overflow-visible", className)}
      >
        <div
          className="flex items-center justify-between px-10 py-6 border-b"
          style={{ borderColor: "var(--border)" }}
        >
          <h2 className="text-base font-bold tracking-tight" style={{ color: "var(--text)" }}>{title}</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-xl transition-all hover:bg-[var(--surface-2)] active:scale-90"
            style={{ color: "var(--text-muted)" }}
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="px-10 py-8">{children}</div>
      </div>
    </div>
  );
};
