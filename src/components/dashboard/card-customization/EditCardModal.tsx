
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { X, AlertCircle } from "lucide-react";
import { useState, useEffect } from "react";
import { formSchema } from "./types";
import CardFormFields from "./CardFormFields";
import { ActionCardItem, CardHeight, CardWidth } from "@/types/dashboard";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { FormSchema } from "@/types/formSchema";

interface EditCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (card: Partial<ActionCardItem>) => void;
  card: ActionCardItem;
}

function EditCardModal({ isOpen, onClose, onSave, card }: EditCardModalProps) {
  const [selectedIconId, setSelectedIconId] = useState<string>(card.iconId);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: card.title,
      subtitle: card.subtitle || "",
      type: card.type || "standard",
      path: card.path || "",
      color: card.color,
      iconId: card.iconId,
      width: (card.width as CardWidth) || "25",
      height: (card.height as CardHeight) || "1",
      dataSourceKey: card.dataSourceKey || "",
      allowedDepartments: card.allowedDepartments || [],
      allowedRoles: card.allowedRoles || []
    }
  });

  // Atualiza os valores do formulário quando o card muda
  useEffect(() => {
    if (isOpen && card) {
      form.reset({
        title: card.title,
        subtitle: card.subtitle || "",
        type: card.type || "standard",
        path: card.path || "",
        color: card.color,
        iconId: card.iconId,
        width: (card.width as CardWidth) || "25",
        height: (card.height as CardHeight) || "1",
        dataSourceKey: card.dataSourceKey || "",
        allowedDepartments: card.allowedDepartments || [],
        allowedRoles: card.allowedRoles || []
      });
      setSelectedIconId(card.iconId);
    }
  }, [isOpen, card, form]);

  const handleSubmit = (data: FormSchema) => {
    try {
      // Filter empty string subtitle to undefined
      const subtitle = data.subtitle?.trim() ? data.subtitle : undefined;
      
      onSave({
        id: card.id,
        ...data,
        subtitle,
        iconId: selectedIconId
      });
      setError(null);
    } catch (err: any) {
      setError(err.message || "Erro ao salvar o card");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl w-[80vw] max-h-[80vh] overflow-y-auto bg-gradient-to-b from-white to-gray-50 rounded-xl border border-gray-200 shadow-lg">
        <DialogHeader className="border-b border-gray-200 pb-4">
          <DialogTitle className="text-xl font-semibold text-blue-600">Personalizar Card</DialogTitle>
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-4 top-4 rounded-full hover:bg-gray-100"
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

        <div className="py-2">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-700">Configuração do card</h3>
                  <CardFormFields
                    form={form}
                    selectedIconId={selectedIconId}
                    setSelectedIconId={setSelectedIconId}
                    hideExtraFields={true}
                  />
                </div>
              </div>

              <DialogFooter className="pt-4 border-t border-gray-200">
                <Button type="button" variant="outline" onClick={onClose} className="rounded-xl">
                  Cancelar
                </Button>
                <Button type="submit" className="rounded-xl bg-blue-600 hover:bg-blue-700">
                  Salvar Alterações
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default EditCardModal;
