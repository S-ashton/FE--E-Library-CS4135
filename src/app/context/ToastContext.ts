import { createContext } from "react";

export type ToastType = "success" | "error";

export type ToastItem = {
  id: string;
  message: string;
  type: ToastType;
};

export type ToastContextValue = {
  showSuccess: (message: string) => void;
  showError: (message: string) => void;
};

export const ToastContext = createContext<ToastContextValue | null>(null);