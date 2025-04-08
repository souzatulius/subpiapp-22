import {
  useToast as useToastHook,
  UseToastOptions,
  ToastViewport as ToastViewportComponent,
  Toast as ToastComponent,
  ToastTitle as ToastTitleComponent,
  ToastDescription as ToastDescriptionComponent,
  ToastClose as ToastCloseComponent,
  ToastAction as ToastActionComponent,
} from "@/components/ui/toast"

type ToastProps = UseToastOptions;

export function useToast() {
  return useToastHook();
}

// This is an updated version to avoid unnecessary success toasts
export function useToastNoSuccess() {
  const { toast: originalToast } = useToastHook();
  
  const toast = (props: ToastProps) => {
    // Skip showing success toasts for dashboard edits
    if (
      props.title?.includes("Dashboard atualizado") || 
      props.description?.includes("Dashboard") ||
      props.title?.includes("Card") ||
      props.description?.includes("Card")
    ) {
      // Return a dummy ID that can be used by the caller
      return {
        id: "suppressed-" + Math.random().toString(36).substring(2, 9),
        dismiss: () => {},
        update: () => {}
      };
    }
    
    // For all other toasts, use the original behavior
    return originalToast(props);
  };
  
  return { toast };
}

export const ToastViewport = ToastViewportComponent;
export const Toast = ToastComponent;
export const ToastTitle = ToastTitleComponent;
export const ToastDescription = ToastDescriptionComponent;
export const ToastClose = ToastCloseComponent;
export const ToastAction = ToastActionComponent;
