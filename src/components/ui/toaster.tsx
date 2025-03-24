
import { useToast } from "@/hooks/use-toast"
import { X, CheckCircle, AlertTriangle, XCircle, Info } from "lucide-react"
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast"

export function Toaster() {
  const { toasts } = useToast()

  const getToastIcon = (variant: string | undefined) => {
    switch (variant) {
      case "success":
        return <CheckCircle className="h-5 w-5 text-green-600" />
      case "destructive":
        return <XCircle className="h-5 w-5 text-red-600" />
      case "warning":
        return <AlertTriangle className="h-5 w-5 text-yellow-600" />
      default:
        return <Info className="h-5 w-5 text-blue-600" />
    }
  }

  const getToastStyles = (variant: string | undefined) => {
    switch (variant) {
      case "success":
        return "bg-green-50 text-green-800 border border-green-200"
      case "destructive":
        return "bg-red-50 text-red-800 border border-red-200"
      case "warning":
        return "bg-yellow-50 text-yellow-800 border border-yellow-200"
      default:
        return "bg-blue-50 text-blue-800 border border-blue-200"
    }
  }

  return (
    <ToastProvider duration={5000}>
      {toasts.map(function ({ id, title, description, action, variant, ...props }) {
        return (
          <Toast 
            key={id} 
            {...props} 
            className={`animate-fade-in rounded-xl shadow-md flex flex-row items-start gap-3 p-4 ${getToastStyles(variant)}`}
          >
            <div className="flex-shrink-0">
              {getToastIcon(variant)}
            </div>
            <div className="flex-1 grid gap-1">
              {title && <ToastTitle className="font-semibold">{title}</ToastTitle>}
              {description && (
                <ToastDescription className="whitespace-normal break-words">{description}</ToastDescription>
              )}
            </div>
            {action}
            <ToastClose className="flex-shrink-0 opacity-100 hover:opacity-80 transition-opacity">
              <X className="h-5 w-5" />
            </ToastClose>
          </Toast>
        )
      })}
      <ToastViewport className="fixed top-20 inset-x-0 mx-auto flex flex-col items-center gap-2 max-w-md z-[100]" />
    </ToastProvider>
  )
}
