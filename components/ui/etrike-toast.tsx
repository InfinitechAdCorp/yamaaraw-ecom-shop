"use client"

import { useState, useEffect } from "react"
import { X, CheckCircle, AlertCircle, Info, AlertTriangle, Zap } from "lucide-react"
import { cn } from "@/lib/utils"

export interface ToastData {
  id: string
  type: "success" | "error" | "info" | "warning"
  title: string
  message?: string
  duration?: number
  action?: {
    label: string
    onClick: () => void
  }
}

interface ToastProps {
  toast: ToastData
  onRemove: (id: string) => void
}

const Toast = ({ toast, onRemove }: ToastProps) => {
  const [isVisible, setIsVisible] = useState(false)
  const [isLeaving, setIsLeaving] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (toast.duration && toast.duration > 0) {
      const timer = setTimeout(() => {
        handleRemove()
      }, toast.duration)
      return () => clearTimeout(timer)
    }
  }, [toast.duration])

  const handleRemove = () => {
    setIsLeaving(true)
    setTimeout(() => {
      onRemove(toast.id)
    }, 300)
  }

  const getToastStyles = () => {
    switch (toast.type) {
      case "success":
        return "bg-gradient-to-r from-green-500 to-emerald-500 border-green-400"
      case "error":
        return "bg-gradient-to-r from-red-500 to-rose-500 border-red-400"
      case "warning":
        return "bg-gradient-to-r from-yellow-500 to-amber-500 border-yellow-400"
      case "info":
        return "bg-gradient-to-r from-blue-500 to-cyan-500 border-blue-400"
      default:
        return "bg-gradient-to-r from-orange-500 to-red-500 border-orange-400"
    }
  }

  const getIcon = () => {
    switch (toast.type) {
      case "success":
        return <CheckCircle className="w-5 h-5" />
      case "error":
        return <AlertCircle className="w-5 h-5" />
      case "warning":
        return <AlertTriangle className="w-5 h-5" />
      case "info":
        return <Info className="w-5 h-5" />
      default:
        return <Zap className="w-5 h-5" />
    }
  }

  return (
    <div
      className={cn(
        "relative flex items-start space-x-3 p-3 rounded-lg border-2 shadow-md backdrop-blur-sm text-white transition-all duration-300 transform max-w-sm",
        getToastStyles(),
        isVisible && !isLeaving ? "translate-x-0 opacity-100" : "translate-x-full opacity-0",
        isLeaving && "-translate-x-full opacity-0",
      )}
    >
      {/* Background Zap Icon */}
      <div className="absolute inset-0 opacity-10 overflow-hidden rounded-lg">
        <div className="absolute -right-4 -top-4 w-16 h-16">
          <Zap className="w-full h-full rotate-12" />
        </div>
      </div>

      {/* Icon */}
      <div className="flex-shrink-0 relative z-10">
        <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
          {getIcon()}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 relative z-10">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            <h4 className="font-semibold text-sm">{toast.title}</h4>
            {toast.message && <p className="text-white/90 text-xs mt-0.5">{toast.message}</p>}
            {toast.action && (
              <button
                onClick={toast.action.onClick}
                className="mt-2 px-3 py-1 bg-white/20 hover:bg-white/30 rounded-md text-xs font-medium transition-colors backdrop-blur-sm border border-white/30"
              >
                {toast.action.label}
              </button>
            )}
          </div>

          {/* Close Button */}
          <button onClick={handleRemove} className="p-1 hover:bg-white/20 rounded-full transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      {toast.duration && toast.duration > 0 && (
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20 rounded-b-lg overflow-hidden">
          <div
            className="h-full bg-white/60 transition-all ease-linear"
            style={{
              animation: `toast-shrink ${toast.duration}ms linear forwards`,
            }}
          />
        </div>
      )}

      <style jsx>{`
        @keyframes toast-shrink {
          from {
            width: 100%;
          }
          to {
            width: 0%;
          }
        }
      `}</style>
    </div>
  )
}

export default Toast
