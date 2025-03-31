
import React, { useEffect } from 'react';
import { useFormContext } from 'react-hook-form';
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
  isNewCard?: boolean;
}

const CardFormFields: React.FC<CardFormFieldsProps> = ({ isNewCard = false }) => {
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
    if (watchType === 'quickDemand') {
      form.setValue('title', 'Nova Demanda Rápida');
      form.setValue('customProperties', {
        ...form.getValues('customProperties'),
        isQuickDemand: true
      });
    } else if (watchType === 'search') {
      form.setValue('title', 'Pesquisar');
      form.setValue('customProperties', {
        ...form.getValues('customProperties'),
        isSearch: true
      });
    } else if (watchType === 'overdueDemands') {
      form.setValue('title', 'Demandas Atrasadas');
      form.setValue('customProperties', {
        ...form.getValues('customProperties'),
        isOverdueDemands: true
      });
    } else if (watchType === 'pendingActions') {
      form.setValue('title', 'Ações Pendentes');
      form.setValue('customProperties', {
        ...form.getValues('customProperties'),
        isPendingActions: true
      });
    }
  }, [watchType, form]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4">
        <div>
          <Label htmlFor="type">Tipo de Card</Label>
          <Select
            onValueChange={(value) => form.setValue('type', value as FormSchema['type'])}
            defaultValue={form.watch('type')}
            value={form.watch('type')}
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
        </div>

        <div>
          <Label htmlFor="title">Título</Label>
          <Input
            id="title"
            placeholder="Título do card"
            {...form.register('title')}
          />
        </div>

        {isWelcomeCard && (
          <>
            <div>
              <Label htmlFor="description">Descrição</Label>
              <Textarea
                id="description"
                placeholder="Descrição do card de boas-vindas"
                rows={3}
                {...form.register('customProperties.description')}
              />
            </div>
            <div>
              <Label htmlFor="gradient">Cor do Gradiente</Label>
              <Select
                onValueChange={(value) => form.setValue('customProperties.gradient', value)}
                value={form.watch('customProperties.gradient') || "bg-gradient-to-r from-blue-600 to-blue-800"}
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
            </div>
          </>
        )}

        {!isWelcomeCard && !isSpecialCard && !isDataCard && (
          <div>
            <Label htmlFor="path">Redirecionamento</Label>
            <Select
              onValueChange={(value) => form.setValue('path', value)}
              value={form.watch('path')}
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
          </div>
        )}

        {isDataCard && (
          <div>
            <Label htmlFor="dataSourceKey">Fonte de Dados</Label>
            <Select
              onValueChange={(value) => form.setValue('dataSourceKey', value)}
              value={form.watch('dataSourceKey') || ""}
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
          </div>
        )}

        <div>
          <Label htmlFor="iconId">Ícone</Label>
          <IconSelector 
            value={form.watch('iconId')} 
            onChange={(id) => form.setValue('iconId', id)} 
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
              <ColorOptions 
                value={form.watch('color')} 
                onChange={(color) => form.setValue('color', color)} 
              />
            </div>
          </TabsContent>
          <TabsContent value="dimensions">
            <div className="py-4">
              <Label>Tamanho do Card</Label>
              <DimensionOptions 
                width={form.watch('width')} 
                height={form.watch('height')}
                onWidthChange={(width) => form.setValue('width', width)}
                onHeightChange={(height) => form.setValue('height', height)}
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
