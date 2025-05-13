"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { X } from "lucide-react"
import { useTheme } from "next-themes"

export type ToastType = "success" | "error" | "info" | "warning"

interface ToastProps {
  message: string
  type?: ToastType
  duration?: number
  onClose: () => void
}

export function Toast({ message, type = "info", duration = 3000, onClose }: ToastProps) {
  const [isVisible, setIsVisible] = useState(true)
  const { theme } = useTheme()
  const isLightMode = theme === "light"

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false)
      setTimeout(onClose, 300) // Allow time for exit animation
    }, duration)

    return () => clearTimeout(timer)
  }, [duration, onClose])

  const getTypeStyles = () => {
    switch (type) {
      case "success":
        return isLightMode
          ? "bg-green-100 border-green-500 text-green-800"
          : "bg-green-900/20 border-green-600 text-green-400"
      case "error":
        return isLightMode ? "bg-red-100 border-red-500 text-red-800" : "bg-red-900/20 border-red-600 text-red-400"
      case "warning":
        return isLightMode
          ? "bg-yellow-100 border-yellow-500 text-yellow-800"
          : "bg-yellow-900/20 border-yellow-600 text-yellow-400"
      default:
        return isLightMode
          ? "bg-blue-100 border-blue-500 text-blue-800"
          : "bg-blue-900/20 border-blue-600 text-blue-400"
    }
  }

  return (
    <div
      className={`fixed bottom-4 left-1/2 transform -translate-x-1/2 px-4 py-3 rounded-lg shadow-lg border-l-4 flex items-center gap-2 transition-all duration-300 z-50 ${getTypeStyles()} ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
      }`}
    >
      <span>{message}</span>
      <button
        onClick={() => {
          setIsVisible(false)
          setTimeout(onClose, 300)
        }}
        className="p-1 rounded-full hover:bg-black/10"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  )
}

interface ToastContainerProps {
  children: React.ReactNode
}

export function ToastContainer({ children }: ToastContainerProps) {
  return <div className="fixed bottom-4 left-0 right-0 flex flex-col items-center gap-2 z-50">{children}</div>
}
