
# Documentação do Formulário de Cadastro de Demandas

## Visão Geral
Este documento descreve a estrutura, componentes, hooks e fluxo de dados do formulário de cadastro de demandas implementado na aplicação. Esta documentação serve como referência para manutenção futura e preservação da estrutura atual.

## Arquitetura

### Estrutura de Arquivos

```
├── pages/dashboard/comunicacao/
│   └── CadastrarDemanda.tsx       # Página principal
├── components/dashboard/forms/
│   ├── CadastrarDemandaForm.tsx   # Container do formulário
│   ├── FileUpload.tsx             # Componente de upload
│   ├── components/
│   │   ├── FormActions.tsx        # Botões de navegação
│   │   ├── FormContent.tsx        # Conteúdo dinâmico do formulário
│   │   ├── FormHeader.tsx         # Cabeçalho do formulário
│   │   ├── FormSteps.tsx          # Indicadores de etapas
│   │   └── FormStepConfig.ts      # Configuração das etapas
│   └── steps/
│       ├── IdentificationStep.tsx   # Etapa de identificação
│       ├── LocationStep.tsx         # Etapa de localização
│       ├── OrganizeStep.tsx         # Etapa de organização
│       ├── ProtocolStep.tsx         # Etapa de protocolo
│       ├── RequesterInfoStep.tsx    # Etapa de dados do solicitante
│       ├── ReviewStep.tsx           # Etapa de revisão
│       └── ...                      # Outros componentes de etapas
└── hooks/demandForm/
    ├── index.ts                   # Exportações
    ├── types.ts                   # Definições de tipos
    ├── useDemandForm.ts           # Hook principal
    ├── useDemandFormData.ts       # Hook de dados auxiliares
    ├── useDemandFormState.ts      # Hook de gerenciamento de estado
    └── useDemandFormSubmit.ts     # Hook de submissão do formulário
```

## Fluxo de Dados

1. O componente `CadastrarDemanda.tsx` renderiza o formulário
2. `CadastrarDemandaForm.tsx` utiliza o hook `useDemandForm` para gerenciar o estado e comportamentos
3. `useDemandForm` coordena os outros hooks:
   - `useDemandFormData`: carrega dados de referência (origens, problemas, etc.)
   - `useDemandFormState`: gerencia o estado do formulário e navegação entre etapas
   - `useDemandFormSubmit`: processa o envio do formulário para o backend

## Componentes Principais

### CadastrarDemandaForm.tsx

Principal componente do formulário, gerencia:
- Navegação entre etapas
- Validação de campos
- Renderização condicional de componentes
- Submissão do formulário

### FormContent.tsx

Renderiza o conteúdo adequado para cada etapa do formulário.

### FormSteps.tsx

Exibe indicadores de navegação entre as etapas do formulário.

### Etapas do Formulário

1. **ProtocolStep**: Origem da demanda e prazo
2. **RequesterInfoStep**: Dados do solicitante e mídia
3. **LocationStep**: Tema, serviço e localização
4. **OrganizeStep**: Título, perguntas e anexos
5. **ReviewStep**: Revisão geral para envio

## Hooks

### useDemandForm.ts

Hook principal que integra os demais hooks:

```typescript
export const useDemandForm = (userId: string | undefined, onClose: () => void) => {
  // Carrega dados de referência (origens, tipos de mídia, problemas, etc.)
  const {
    areasCoord,
    origens,
    tiposMidia,
    distritos,
    bairros,
    problemas,
    isLoading,
    setIsLoading
  } = useDemandFormData();

  // Gerencia o estado do formulário
  const {
    formData,
    serviceSearch,
    filteredBairros,
    selectedDistrito,
    activeStep,
    handleChange,
    handleSelectChange,
    handlePerguntaChange,
    handleAnexosChange,
    nextStep,
    prevStep,
    setSelectedDistrito,
    resetForm,
    setActiveStep,
    servicos,
    filteredServicos,
    handleServiceSearch
  } = useDemandFormState(bairros, problemas);

  // Gerencia a submissão do formulário
  const { isLoading: submitting, submitForm, handleSubmit } = useDemandFormSubmit(
    resetForm,
    onClose
  );

  return {
    // Retorna todas as propriedades e métodos necessários
    // ...
  };
};
```

### useDemandFormState.ts

Gerencia o estado do formulário:
- Campos do formulário
- Navegação entre etapas
- Filtragem de dados (bairros, serviços)
- Persistência no localStorage

### useDemandFormSubmit.ts

Gerencia a submissão do formulário:
- Validação de campos obrigatórios
- Formatação de dados para envio
- Comunicação com API Supabase
- Tratamento de erros

### useDemandFormData.ts

Carrega dados de referência:
- Origens de demandas
- Tipos de mídia
- Áreas de coordenação
- Distritos e bairros
- Problemas

## Componente de Upload de Arquivos

O componente `FileUpload.tsx` gerencia:
- Upload de arquivos para Supabase Storage
- Validação de tipos e tamanhos de arquivo
- Exibição de pré-visualização
- Funcionalidade de drag-and-drop

## Validação de Formulário

A validação de formulário é implementada em `formValidationUtils.ts`:
- Validação por etapa
- Validação de campos obrigatórios
- Exibição de mensagens de erro

## Armazenamento de Dados

Os dados do formulário são salvos em diversas tabelas do Supabase:
- `demandas`: armazena os dados principais
- `storage.demandas`: armazena os arquivos anexados

## Comportamentos Específicos

### Auto-sugestão de Título

O título é automaticamente sugerido com base em:
- Problema selecionado
- Serviço selecionado (se houver)
- Bairro selecionado
- Endereço informado

### Armazenamento Temporário

O formulário armazena o estado atual no localStorage para:
- Recuperação em caso de fechamento acidental
- Preenchimento parcial e continuação posterior

### Filtragem Dinâmica

- Bairros são filtrados por distrito selecionado
- Serviços são filtrados por problema selecionado

## Interfaces e Tipos

### DemandFormData

```typescript
export interface DemandFormData {
  titulo: string;
  problema_id: string;
  origem_id: string;
  tipo_midia_id: string;
  prioridade: string;
  prazo_resposta: string;
  nome_solicitante: string;
  telefone_solicitante: string;
  email_solicitante: string;
  veiculo_imprensa: string;
  endereco: string;
  bairro_id: string;
  perguntas: string[];
  detalhes_solicitacao: string;
  arquivo_url: string;
  anexos: string[];
  servico_id: string;
  nao_sabe_servico: boolean;
  tem_protocolo_156?: boolean;
  numero_protocolo_156?: string;
  coordenacao_id?: string;
}
```

## Considerações para Manutenção

1. **Preservar a Estrutura Modular**: Manter a separação de responsabilidades entre componentes e hooks
2. **Validação de Campos**: Preservar e ampliar o sistema de validação em `formValidationUtils.ts` 
3. **Fluxo de Navegação**: Manter o sistema de etapas e a navegação entre elas
4. **Upload de Arquivos**: Preservar o funcionamento do componente `FileUpload.tsx`
5. **Persistência Local**: Manter o armazenamento no localStorage

## Conclusão

Esta documentação serve como referência para a estrutura atual do formulário de cadastro de demandas. Qualquer alteração futura deve preservar esta arquitetura e fluxo de dados, podendo apenas estendê-la sem comprometer o funcionamento básico.
