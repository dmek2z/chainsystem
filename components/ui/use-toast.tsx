"use client"

// Simplified version of the toast hook
import { useState } from "react"

type ToastProps = {
  title?: string
  description?: string
}

export function useToast() {
  const [toasts, setToasts] = useState<ToastProps[]>([])

  const toast = ({ title, description }: ToastProps) => {
    const id = Date.now()
    setToasts((prev) => [...prev, { title, description }])

    // Auto-remove toast after 3 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((_, i) => i !== 0))
    }, 3000)

    // Log toast for debugging
    console.log("Toast:", { title, description })

    return id
  }

  return {
    toast,
    toasts,
  }
}

export { toast }
