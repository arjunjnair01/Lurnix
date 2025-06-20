import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { AlertCircle, CheckCircle, Clock, Info, X } from "lucide-react"
import { useEffect, useState } from "react"

interface NotificationProps {
  id: string
  type: 'success' | 'error' | 'info' | 'warning'
  title: string
  message: string
  duration?: number
  onClose: (id: string) => void
}

export function Notification({ id, type, title, message, duration = 5000, onClose }: NotificationProps) {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false)
      setTimeout(() => onClose(id), 300)
    }, duration)

    return () => clearTimeout(timer)
  }, [duration, id, onClose])

  const icons = {
    success: CheckCircle,
    error: AlertCircle,
    info: Info,
    warning: Clock
  }

  const colors = {
    success: 'bg-green-50 border-green-200 text-green-800',
    error: 'bg-red-50 border-red-200 text-red-800',
    info: 'bg-blue-50 border-blue-200 text-blue-800',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-800'
  }

  const Icon = icons[type]

  return (
    <div
      className={cn(
        "fixed top-4 right-4 z-50 max-w-sm w-full bg-white/90 backdrop-blur-xl border rounded-xl shadow-xl transition-all duration-300",
        colors[type],
        isVisible ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
      )}
    >
      <div className="p-4">
        <div className="flex items-start gap-3">
          <Icon className="h-5 w-5 mt-0.5 flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <h4 className="font-semibold text-sm">{title}</h4>
            <p className="text-sm mt-1 opacity-90">{message}</p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setIsVisible(false)
              setTimeout(() => onClose(id), 300)
            }}
            className="h-6 w-6 p-0 hover:bg-black/10 rounded-lg"
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      </div>
    </div>
  )
}

interface NotificationContainerProps {
  notifications: Array<{
    id: string
    type: 'success' | 'error' | 'info' | 'warning'
    title: string
    message: string
    duration?: number
  }>
  onClose: (id: string) => void
}

export function NotificationContainer({ notifications, onClose }: NotificationContainerProps) {
  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {notifications.map((notification) => (
        <Notification
          key={notification.id}
          {...notification}
          onClose={onClose}
        />
      ))}
    </div>
  )
} 