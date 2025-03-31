
import React, { useEffect } from 'react';
import { useFormContext, Controller } from 'react-hook-form';
import { FormSchema } from './types';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import IconSelector from './IconSelector';
import ColorOptions from './ColorOptions';
import DimensionOptions from './DimensionOptions';
import { cardTypes, dashboardPages, dataSources, gradientOptions } from './utils';

interface CardFormFieldsProps {
  isNewCard: boolean;
}

const CardFormFields: React.FC<CardFormFieldsProps> = ({ isNewCard }) => {
  const form = useFormContext<FormSchema>();
  const watchType = form.watch('type');
  const isWelcomeCard = watchType === 'welcome_card';
  const isDataCard = watchType === 'data_dynamic';
  const isSpecialCard = ['quickDemand', 'search', 'overdueDemands', 'pendingActions'].includes(watchType);

  // Quando o tipo de card muda, ajustar outros campos
  useEffect(() => {
    // Se for um card de boas-vindas, definir largura como 100%
    if (isWelcomeCard) {
      form.setValue('width', '100');
    }
    
    // Se for um card dinâmico, ajustar campos específicos
    if (isDataCard && !form.getValues('dataSourceKey')) {
      form.setValue('dataSourceKey', 'pendencias_por_coordenacao');
    }
    
    // Se for um card especial, configurar propriedades
    if (isSpecialCard) {
      switch (watchType) {
        case 'quickDemand':
          form.setValue('isQuickDemand', true);
          form.setValue('title', 'Nova Demanda Rápida');
          break;
        case 'search':
          form.setValue('isSearch', true);
          form.setValue('title', 'Pesquisar');
          break;
        case 'overdueDemands':
          form.setValue('isOverdueDemands', true);
          form.setValue('title', 'Demandas Atrasadas');
          break;
        case 'pendingActions':
          form.setValue('isPendingActions', true);
          form.setValue('title', 'Ações Pendentes');
          break;
      }
    }
  }, [watchType, form]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4">
        <div>
          <Label htmlFor="type">Tipo de Card</Label>
          <Controller
            name="type"
            control={form.control}
            render={({ field }) => (
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
                value={field.value}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um tipo de card" />
                </SelectTrigger>
                <SelectContent>
                  {cardTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </div>

        <div>
          <Label htmlFor="title">Título</Label>
          <Controller
            name="title"
            control={form.control}
            render={({ field }) => (
              <Input
                id="title"
                placeholder="Título do card"
                {...field}
              />
            )}
          />
        </div>

        {isWelcomeCard && (
          <>
            <div>
              <Label htmlFor="customProperties.description">Descrição</Label>
              <Controller
                name="customProperties.description"
                control={form.control}
                render={({ field }) => (
                  <Textarea
                    id="customProperties.description"
                    placeholder="Descrição do card de boas-vindas"
                    rows={3}
                    {...field}
                  />
                )}
              />
            </div>
            <div>
              <Label htmlFor="customProperties.gradient">Cor do Gradiente</Label>
              <Controller
                name="customProperties.gradient"
                control={form.control}
                render={({ field }) => (
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    value={field.value || "bg-gradient-to-r from-blue-600 to-blue-800"}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione uma cor de gradiente" />
                    </SelectTrigger>
                    <SelectContent>
                      {gradientOptions.map((gradient) => (
                        <SelectItem key={gradient.value} value={gradient.value}>
                          <div className="flex items-center">
                            <div className={`w-5 h-5 mr-2 rounded ${gradient.value}`} />
                            <span>{gradient.label}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
          </>
        )}

        {!isWelcomeCard && !isSpecialCard && !isDataCard && (
          <div>
            <Label htmlFor="path">Redirecionamento</Label>
            <Controller
              name="path"
              control={form.control}
              render={({ field }) => (
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  value={field.value}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione uma página" />
                  </SelectTrigger>
                  <SelectContent>
                    {dashboardPages.map((page) => (
                      <SelectItem key={page.value} value={page.value}>
                        {page.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </div>
        )}

        {isDataCard && (
          <div>
            <Label htmlFor="dataSourceKey">Fonte de Dados</Label>
            <Controller
              name="dataSourceKey"
              control={form.control}
              render={({ field }) => (
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  value={field.value || ""}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione uma fonte de dados" />
                  </SelectTrigger>
                  <SelectContent>
                    {dataSources.map((source) => (
                      <SelectItem key={source.value} value={source.value}>
                        {source.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </div>
        )}

        <div>
          <Label htmlFor="iconId">Ícone</Label>
          <Controller
            name="iconId"
            control={form.control}
            render={({ field }) => (
              <IconSelector 
                value={field.value} 
                onChange={field.onChange} 
              />
            )}
          />
        </div>

        <Tabs defaultValue="appearance" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="appearance">Aparência</TabsTrigger>
            <TabsTrigger value="dimensions" disabled={isWelcomeCard}>Dimensões</TabsTrigger>
          </TabsList>
          <TabsContent value="appearance">
            <div className="py-4">
              <Label>Cor do Card</Label>
              <Controller
                name="color"
                control={form.control}
                render={({ field }) => (
                  <ColorOptions 
                    value={field.value} 
                    onChange={field.onChange} 
                  />
                )}
              />
            </div>
          </TabsContent>
          <TabsContent value="dimensions">
            <div className="py-4">
              <Label>Tamanho do Card</Label>
              <Controller
                name="width"
                control={form.control}
                render={({ field: widthField }) => (
                  <Controller
                    name="height"
                    control={form.control}
                    render={({ field: heightField }) => (
                      <DimensionOptions 
                        width={widthField.value} 
                        height={heightField.value}
                        onWidthChange={widthField.onChange}
                        onHeightChange={heightField.onChange}
                      />
                    )}
                  />
                )}
              />
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {isNewCard && (
        <div className="text-sm text-gray-500 mt-4">
          {isWelcomeCard ? 
            "Este card será exibido no topo do dashboard com largura total." :
            isDataCard ? 
              "Este card exibirá dados dinâmicos conforme a fonte selecionada." :
              isSpecialCard ? 
                "Este é um card com funcionalidade especial." :
                "Este card redirecionará para a página selecionada quando clicado."
          }
        </div>
      )}
    </div>
  );
};

export default CardFormFields;
