import React from "react";
import { Button } from "./Button";

interface ConfirmModalProps {
  isOpen: boolean;
  title?: string;
  message?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({ isOpen, title = "Confirm", message = "Are you sure?", confirmLabel = "Confirm", cancelLabel = "Cancel", onConfirm, onCancel }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-md" onClick={onCancel} />
      <div className="relative glass-heavy rounded-3xl p-6 z-10 w-full max-w-md shadow-[0_8px_32px_rgba(0,0,0,0.2)] border border-[var(--border)]">
        <h3 className="text-xl font-bold tracking-tight mb-2" style={{ color: "var(--text)" }}>{title}</h3>
        <p className="text-sm mb-6 leading-relaxed" style={{ color: "var(--text-muted)" }}>{message}</p>
        <div className="flex justify-end gap-3">
          <Button variant="ghost" onClick={onCancel}>{cancelLabel}</Button>
          <Button variant="danger" onClick={onConfirm}>{confirmLabel}</Button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
