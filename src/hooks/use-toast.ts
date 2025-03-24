
import { Toast } from "@/components/ui/toast";
import { useToast as useShadcnToast } from "@/components/ui/use-toast";

type CustomToastProps = Omit<Toast, "id"> & {
  action?: React.ReactElement;
};

export function useToast() {
  const { toast: shadcnToast, ...rest } = useShadcnToast();

  // Customized toast function that preserves all shadcn/ui toast functionality
  function customToast(props: CustomToastProps) {
    return shadcnToast(props);
  }

  // Add predefined toast types
  customToast.success = (title: string, description?: string) => {
    return shadcnToast({
      title,
      description,
      variant: "success",
    });
  };

  customToast.error = (title: string, description?: string) => {
    return shadcnToast({
      title,
      description,
      variant: "destructive",
    });
  };

  customToast.info = (title: string, description?: string) => {
    return shadcnToast({
      title,
      description,
    });
  };

  customToast.warning = (title: string, description?: string) => {
    return shadcnToast({
      title,
      description,
      variant: "warning",
    });
  };

  return {
    ...rest,
    toast: customToast
  };
}

export { toast as originalToast } from "@/components/ui/use-toast";
