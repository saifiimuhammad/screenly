"use client";
import React, { createContext, useContext, useState, useCallback } from "react";
import {
  Notification,
  NotificationGroup,
} from "@progress/kendo-react-notification";

type ToastType = "success" | "error" | "warning" | "info";

interface Toast {
  id: string;
  type: ToastType;
  message: string;
}

interface ToastContextValue {
  addToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const removeToast = (id: string) =>
    setToasts((prev) => prev.filter((t) => t.id !== id));

  const addToast = useCallback((message: string, type: ToastType = "info") => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => removeToast(id), 4000); // auto-dismiss
  }, []);

  const contextValue = React.useMemo(() => ({ addToast }), [addToast]);

  return (
    <ToastContext.Provider value={contextValue}>
      {children}
      <NotificationGroup style={{ right: 20, bottom: 20, position: "fixed" }}>
        {toasts.map((t) => (
          <Notification
            key={t.id}
            type={{ style: t.type, icon: true }}
            closable={true}
            onClose={() => removeToast(t.id)}
            style={{ padding: ".75rem", fontSize: "0.856rem", gap: "0.5rem" }}
          >
            <span>{t.message}</span>
          </Notification>
        ))}
      </NotificationGroup>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
};
