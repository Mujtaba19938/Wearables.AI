"use client"

import type React from "react"
import { createContext, useContext, useState, type ReactNode } from "react"

type ToastType = "success" | "error" | "info" | "warning"

interface Toast {
  id: number
  message: string
  type: ToastType
}

interface ToastContextType {
  toasts: Toast[]
  showToast: (message: string, type?: ToastType) => void
  hideToast: (id: number) => void
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

export const useToast = () => {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider")
  }
  return context
}

interface ToastProviderProps {
  children: ReactNode
}

export const ToastProvider: React.FC<ToastProviderProps> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([])
  const [nextId, setNextId] = useState(1)

  const showToast = (message: string, type: ToastType = "info") => {
    const id = nextId
    setNextId(id + 1)

    const newToast: Toast = {
      id,
      message,
      type,
    }

    setToasts((prevToasts) => [...prevToasts, newToast])

    // Auto-hide toast after 3 seconds
    setTimeout(() => {
      hideToast(id)
    }, 3000)
  }

  const hideToast = (id: number) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id))
  }

  return (
    <ToastContext.Provider value={{ toasts, showToast, hideToast }}>
      {children}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`rounded-md px-4 py-2 text-white shadow-md transition-all duration-300 ${
              toast.type === "success"
                ? "bg-green-500"
                : toast.type === "error"
                  ? "bg-red-500"
                  : toast.type === "warning"
                    ? "bg-yellow-500"
                    : "bg-blue-500"
            }`}
          >
            {toast.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}
