
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { formSchema, FormSchema } from "./types";
import CardFormFields from "./CardFormFields";
import CardFormPreview from "./CardFormPreview";

interface CardFormMainProps {
  initialData?: Partial<FormSchema>;
  onSave: (data: FormSchema) => void;
  onCancel: () => void;
}

export default function CardFormMain({ initialData, onSave, onCancel }: CardFormMainProps) {
  const [selectedIconId, setSelectedIconId] = useState<string>(
    initialData?.iconId || "Activity"
  );

  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: initialData?.title || "",
      subtitle: initialData?.subtitle || "",
      type: initialData?.type || "standard",
      path: initialData?.path || "",
      color: initialData?.color || "blue-light",
      iconId: initialData?.iconId || "Activity",
      width: initialData?.width || "25",
      height: (initialData?.height as "0.5" | "1" | "2" | "3" | "4") || "1",
      dataSourceKey: initialData?.dataSourceKey || "",
      displayMobile: initialData?.displayMobile !== false,
      mobileOrder: initialData?.mobileOrder || 0,
      allowedDepartments: initialData?.allowedDepartments || [],
      allowedRoles: initialData?.allowedRoles || []
    },
  });

  const formValues = form.watch();

  function onSubmit(data: FormSchema) {
    // Ensure we have the selected icon ID
    data.iconId = selectedIconId;
    
    // Filter empty string subtitle to undefined
    const finalData = {
      ...data,
      subtitle: data.subtitle?.trim() ? data.subtitle : undefined
    };
    
    onSave(finalData);
  }

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-6">
              <h3 className="text-lg font-medium">Configuração</h3>
              <CardFormFields
                form={form}
                selectedIconId={selectedIconId}
                setSelectedIconId={setSelectedIconId}
              />
            </div>
            
            <div className="space-y-6">
              <h3 className="text-lg font-medium">Pré-visualização</h3>
              <CardFormPreview
                title={formValues.title}
                subtitle={formValues.subtitle}
                iconId={selectedIconId}
                color={formValues.color}
              />
            </div>
          </div>

          <div className="flex justify-end space-x-4">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancelar
            </Button>
            <Button type="submit">Salvar Card</Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
