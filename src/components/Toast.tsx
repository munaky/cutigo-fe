import React, { useEffect, useState } from "react";
import { X } from "lucide-react";

type ToastProps = {
  type?: "success" | "error" | "info" | "warning";
  title: string;
  message: string;
  duration?: number; // milliseconds
  onClose?: () => void;
};

const Toast: React.FC<ToastProps> = ({
  type = "info",
  title,
  message,
  duration = 3000,
  onClose,
}) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      onClose?.();
    }, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  if (!visible) return null;

  const typeStyles: Record<typeof type, string> = {
    success: "bg-green-100 border-green-500 text-green-700",
    error: "bg-red-100 border-red-500 text-red-700",
    info: "bg-blue-100 border-blue-500 text-blue-700",
    warning: "bg-yellow-100 border-yellow-500 text-yellow-700",
  };

  return (
    <div
      className={`fixed right-4 top-4 z-50 max-w-sm border-l-4 p-4 rounded shadow-lg transition-opacity duration-300 ${typeStyles[type]}`}
    >
      <div className="flex justify-between items-start">
        <div>
          <p className="font-bold">{title}</p>
          <p className="text-sm">{message}</p>
        </div>
        <button
          onClick={() => {
            setVisible(false);
            onClose?.();
          }}
          className="ml-4 text-gray-500 hover:text-gray-700"
        >
          <X size={18} />
        </button>
      </div>
    </div>
  );
};

export default Toast;
