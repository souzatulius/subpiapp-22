
# Gerenciamento de Estado do Formulário de Cadastro de Demandas

Este documento descreve em detalhes o gerenciamento de estado implementado no formulário de cadastro de demandas.

## Arquitetura de Estado

O formulário utiliza uma combinação de hooks personalizados para gerenciar diferentes aspectos do estado:

```
useDemandForm
  ├── useDemandFormData     # Dados de referência
  ├── useDemandFormState    # Estado do formulário
  └── useDemandFormSubmit   # Submissão do formulário
```

## Hook Principal: useDemandForm

Este hook orquestra todos os outros, servindo como ponto central de acesso ao estado e comportamentos do formulário.

```typescript
// src/hooks/demandForm/useDemandForm.ts
export const useDemandForm = (userId: string | undefined, onClose: () => void) => {
  // Carrega dados de referência
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

  // Gerencia estado do formulário
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

  // Gerencia submissão
  const { 
    isLoading: submitting, 
    submitForm, 
    handleSubmit 
  } = useDemandFormSubmit(resetForm, onClose);

  // Retorna uma API unificada para o componente de formulário
  return {
    formData,
    areasCoord,
    origens,
    tiposMidia,
    distritos,
    bairros,
    problemas,
    isLoading: isLoading || submitting,
    serviceSearch,
    filteredBairros,
    selectedDistrito,
    activeStep,
    handleChange,
    handleSelectChange,
    handlePerguntaChange,
    handleAnexosChange,
    handleSubmit,
    nextStep,
    prevStep,
    setSelectedDistrito,
    resetForm,
    setActiveStep,
    servicos,
    filteredServicos,
    handleServiceSearch
  };
};
```

## Estado do Formulário: useDemandFormState

Este hook gerencia todos os campos do formulário, navegação entre etapas e comportamentos relacionados.

### Principais Responsabilidades

1. **Gerenciamento de Campos**
   - Estado inicial do formulário
   - Handlers para alterações em campos
   - Formatação de campos específicos (telefone)

2. **Navegação Entre Etapas**
   - Controle do passo atual
   - Métodos para avançar/retroceder

3. **Persistência Local**
   - Salvar estado no localStorage
   - Carregar estado salvo anteriormente

4. **Filtragem Dinâmica**
   - Filtrar bairros por distrito
   - Filtrar serviços por problema e texto de busca

5. **Geração Automática de Título**
   - Sugestão baseada em problema, serviço, bairro e endereço

### Exemplo de Implementação

```typescript
// Trecho simplificado de useDemandFormState.ts
export const useDemandFormState = (bairros: any[], problemas: any[]) => {
  const [formData, setFormData] = useState<DemandFormData>(initialFormState);
  const [activeStep, setActiveStep] = useState(0);
  const [selectedDistrito, setSelectedDistrito] = useState('');
  
  // Persistência no localStorage
  useEffect(() => {
    localStorage.setItem('demandForm_state', JSON.stringify({
      formData, activeStep, selectedDistrito
    }));
  }, [formData, activeStep, selectedDistrito]);
  
  // Filtragem de bairros por distrito
  useEffect(() => {
    if (selectedDistrito) {
      const filtered = bairros.filter(
        bairro => bairro.distrito_id === selectedDistrito
      );
      setFilteredBairros(filtered);
    } else {
      setFilteredBairros([]);
    }
  }, [selectedDistrito, bairros]);
  
  // Navegação entre etapas
  const nextStep = () => setActiveStep(prev => prev + 1);
  const prevStep = () => setActiveStep(prev => prev - 1);
  
  // ... outros métodos e efeitos
  
  return {
    formData,
    activeStep,
    selectedDistrito,
    filteredBairros,
    // ... outros estados e métodos
    nextStep,
    prevStep,
    setSelectedDistrito,
    resetForm
  };
};
```

## Carregamento de Dados: useDemandFormData

Este hook é responsável por carregar todos os dados de referência necessários para o formulário.

### Dados Carregados

- Áreas de coordenação
- Origens de demanda
- Tipos de mídia
- Distritos
- Bairros
- Problemas/temas

### Implementação

```typescript
// Trecho simplificado de useDemandFormData.ts
export const useDemandFormData = () => {
  const [areasCoord, setAreasCoord] = useState<any[]>([]);
  const [origens, setOrigens] = useState<any[]>([]);
  // ... outros estados
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Buscar áreas de coordenação
        const { data: areasData, error: areasError } = await supabase
          .from('areas_coordenacao')
          .select('*');
        if (areasError) throw areasError;
        setAreasCoord(areasData || []);
        
        // ... buscar outros dados
        
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
        toast({
          title: "Erro ao carregar dados",
          description: "Não foi possível carregar as informações necessárias.",
          variant: "destructive"
        });
      }
    };
    
    fetchData();
  }, []);
  
  return {
    areasCoord,
    origens,
    tiposMidia,
    distritos,
    bairros,
    problemas,
    isLoading,
    setIsLoading
  };
};
```

## Submissão do Formulário: useDemandFormSubmit

Este hook gerencia o processo de submissão do formulário para a API.

### Principais Responsabilidades

1. **Validação Final**
   - Verificar campos obrigatórios
   - Exibir mensagens de erro específicas

2. **Formatação de Dados**
   - Converter perguntas para o formato correto
   - Validar URLs de anexos
   - Preparar payload para a API

3. **Submissão à API**
   - Enviar dados para o Supabase
   - Tratar respostas de sucesso e erro

4. **Comportamento Pós-submissão**
   - Exibir notificação de sucesso
   - Resetar formulário
   - Fechar modal/redirecionar

### Implementação

```typescript
// Trecho simplificado de useDemandFormSubmit.ts
export const useDemandFormSubmit = (resetForm: () => void, onClose: () => void) => {
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();

  const submitForm = async (formData: DemandFormData) => {
    if (!user) {
      toast({
        title: "Erro de autenticação",
        description: "Você precisa estar logado para submeter o formulário.",
        variant: "destructive"
      });
      return;
    }
    
    // Validar formulário
    const validationErrors = validateDemandForm(formData, 4);
    if (validationErrors.length > 0) {
      const errorSummary = getErrorSummary(validationErrors);
      throw new Error(`Campos obrigatórios não preenchidos: ${errorSummary}`);
    }
    
    setIsLoading(true);
    
    try {
      // Formatar dados
      const formattedPerguntas = formatQuestionsToObject(formData.perguntas);
      const validAnexos = formData.anexos.filter(url => isValidPublicUrl(url));
      
      // Preparar payload
      const payload = {
        titulo: formData.titulo,
        // ... outros campos
        autor_id: user.id,
        status: 'pendente'
      };
      
      // Submeter à API
      const { error } = await supabase
        .from('demandas')
        .insert(payload);
        
      if (error) throw error;
      
      // Sucesso
      toast({
        title: "Demanda cadastrada com sucesso!",
        description: "A demanda foi cadastrada e será analisada pela equipe.",
      });
      
      resetForm();
      onClose();
    } catch (error: any) {
      // Tratar erro
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return { isLoading, submitForm, handleSubmit: submitForm };
};
```

## Fluxo de Dados

O fluxo de dados no formulário segue um padrão unidirecional:

1. **Entrada do Usuário** → Componentes de UI chamam handlers
2. **Handlers** → Atualizam o estado via `setFormData`
3. **Estado Atualizado** → Aciona efeitos colaterais (ex: filtragem)
4. **Efeitos** → Atualizam estados derivados (ex: filtered lists)
5. **Renderização** → Componentes são atualizados com novos dados

## Interdependências Entre Campos

O formulário gerencia várias relações entre campos:

- Seleção de **Distrito** filtra **Bairros** disponíveis
- Seleção de **Problema** carrega **Serviços** relacionados
- Seleção de **Origem** determina se **Tipo de Mídia** é obrigatório
- Seleção de **Tipo de Mídia** torna **Veículo de Imprensa** obrigatório
- Campos **Problema**, **Serviço**, **Bairro** e **Endereço** influenciam a sugestão de **Título**

## Validação de Campos

A validação de campos é implementada em `formValidationUtils.ts` e segue regras específicas:

- Validação por etapa do formulário
- Validação completa na etapa de revisão
- Validações condicionais baseadas em outros campos

### Exemplo de Regras de Validação

```typescript
// Trecho de formValidationUtils.ts
export const validateDemandForm = (formData: DemandFormData, step: number): ValidationError[] => {
  const errors: ValidationError[] = [];
  
  // Na etapa de revisão (4), validar todos os campos
  const fieldsToValidate = step === 4 ? 
    stepValidations[4] : 
    stepValidations[step] || [];
  
  // Validar origem_id
  if (fieldsToValidate.includes("origem_id") && !formData.origem_id) {
    errors.push({
      field: "origem_id",
      message: "Selecione a origem da demanda"
    });
  }
  
  // ... outras validações
  
  // Validação condicional: tipo_midia_id obrigatório para certas origens
  const requiresMediaType = ["Imprensa", "SMSUB", "SECOM"].includes(
    formData.origem_id ? (formData as any).origem?.descricao || "" : ""
  );
  
  if (requiresMediaType && fieldsToValidate.includes("tipo_midia_id") && !formData.tipo_midia_id) {
    errors.push({
      field: "tipo_midia_id",
      message: "Selecione o tipo de mídia"
    });
  }
  
  return errors;
};
```

## Conclusão

O gerenciamento de estado do formulário de cadastro de demandas é cuidadosamente projetado para:

- Separar responsabilidades entre diferentes hooks
- Manter um fluxo de dados claro e previsível
- Gerenciar interdependências complexas entre campos
- Implementar validações contextuais
- Persistir estado localmente para melhor experiência do usuário
- Lidar com os casos de erro de forma elegante

Esta arquitetura facilita a manutenção e extensão do formulário, permitindo adicionar novos campos e lógicas sem comprometer o funcionamento existente.
