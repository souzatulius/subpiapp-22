
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { X, AlertCircle } from "lucide-react";
import { useState } from "react";
import { formSchema } from "./types";
import CardFormFields from "./CardFormFields";
import { ActionCardItem } from "@/types/dashboard";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface EditCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (card: Partial<ActionCardItem>) => void;
  card: ActionCardItem;
}

function EditCardModal({ isOpen, onClose, onSave, card }: EditCardModalProps) {
  const [selectedIconId, setSelectedIconId] = useState<string>(card.iconId);
  const [error, setError] = useState<string | null>(null);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: card.title,
      subtitle: card.subtitle || "",
      type: card.type || "standard",
      path: card.path || "",
      color: card.color,
      iconId: card.iconId,
      width: card.width || "25",
      height: (card.height as "0.5" | "1" | "2" | "3" | "4") || "1",
      dataSourceKey: card.dataSourceKey || "",
      displayMobile: card.displayMobile !== false,
      mobileOrder: card.mobileOrder || 0,
      allowedDepartments: card.allowedDepartments || [],
      allowedRoles: card.allowedRoles || []
    }
  });

  const handleSubmit = (data: any) => {
    try {
      // Filter empty string subtitle to undefined
      const subtitle = data.subtitle?.trim() ? data.subtitle : undefined;
      
      onSave({
        id: card.id,
        ...data,
        subtitle,
        iconId: selectedIconId
      });
    } catch (err: any) {
      setError(err.message || "Erro ao salvar o card");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-lg font-medium">Editar Card</DialogTitle>
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-4 top-4"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>

        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <div className="space-y-4">
              <CardFormFields
                form={form}
                selectedIconId={selectedIconId}
                setSelectedIconId={setSelectedIconId}
              />
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>
                Cancelar
              </Button>
              <Button type="submit">Salvar Alterações</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export default EditCardModal;
