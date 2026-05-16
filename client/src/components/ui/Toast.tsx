import React from "react";
import { useToastStore, Toast as ToastType } from "../../store/toastStore";
import { X, CheckCircle, AlertCircle, Info } from "lucide-react";

const icons = {
  success: <CheckCircle className="w-5 h-5 shrink-0" style={{ color: "#10b981" }} />,
  error: <AlertCircle className="w-5 h-5 shrink-0" style={{ color: "#ef4444" }} />,
  info: <Info className="w-5 h-5 shrink-0" style={{ color: "#3b82f6" }} />,
};

const accentLeft = {
  success: "#10b981",
  error: "#ef4444",
  info: "#3b82f6",
};

const Toast: React.FC<{ toast: ToastType }> = ({ toast }) => {
  const { removeToast } = useToastStore();

  return (
    <div
      className="flex items-start gap-3 w-80 max-w-[calc(100vw-2rem)] rounded-xl border shadow-xl px-4 py-3"
      style={{
        background: "var(--surface)",
        borderColor: "var(--border)",
        borderLeft: `3px solid ${accentLeft[toast.type]}`,
      }}
      role="alert"
    >
      {icons[toast.type]}
      <p className="flex-1 text-sm font-medium leading-snug" style={{ color: "var(--text)" }}>
        {toast.message}
      </p>
      <button
        onClick={() => removeToast(toast.id)}
        className="shrink-0 p-0.5 rounded-md transition-colors hover:bg-black/5 dark:hover:bg-white/10"
        style={{ color: "var(--text-muted)" }}
        aria-label="Dismiss"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

export const ToastContainer = () => {
  const { toasts } = useToastStore();

  return (
    <div className="fixed top-5 right-5 z-[100] flex flex-col gap-3">
      {toasts.map((toast) => (
        <Toast key={toast.id} toast={toast} />
      ))}
    </div>
  );
};
