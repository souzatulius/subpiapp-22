
import { Toast, ToastActionElement, ToastProps } from "@/components/ui/toast";
import { useToast as useShadcnToast } from "@/components/ui/use-toast";

type ToastProps = Omit<Toast, "id"> & {
  action?: ToastActionElement;
};

export function useToast() {
  const { toast: shadcnToast, ...rest } = useShadcnToast();

  // Customized toast function that preserves all shadcn/ui toast functionality
  function toast(props: ToastProps) {
    return shadcnToast(props);
  }

  // Add predefined toast types
  toast.success = (title: string, description?: string) => {
    return shadcnToast({
      title,
      description,
      variant: "success",
    });
  };

  toast.error = (title: string, description?: string) => {
    return shadcnToast({
      title,
      description,
      variant: "destructive",
    });
  };

  toast.info = (title: string, description?: string) => {
    return shadcnToast({
      title,
      description,
    });
  };

  toast.warning = (title: string, description?: string) => {
    return shadcnToast({
      title,
      description,
      variant: "warning",
    });
  };

  return {
    ...rest,
    toast
  };
}

export { toast } from "@/components/ui/use-toast";
