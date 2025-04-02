
/**
 * Este arquivo contém a estrutura dos componentes do formulário de cadastro de demandas
 * e exemplos de como eles são usados. Serve como referência para desenvolvedores.
 * 
 * Nota: Este arquivo é apenas para documentação e não é usado diretamente na aplicação.
 * A estrutura de código abaixo serve apenas como referência e não para execução.
 */

import React from 'react';

// Este componente ilustra a estrutura da página principal de cadastro de demandas
// Apenas para documentação, não é componente funcional
const CadastrarDemandaStructureExample = () => {
  return `
  <div className="max-w-7xl mx-auto">
    {/* Cabeçalho da página */}
    <WelcomeCard
      title="Nova Solicitação"
      description="Cadastre uma nova solicitação de comunicação"
      icon={<PlusCircle />}
      color="bg-gradient-to-r from-blue-600 to-blue-800"
    />
    
    {/* Formulário de cadastro */}
    <CadastrarDemandaForm onClose={() => console.log('Fechando formulário')} />
  </div>
  `;
};

/**
 * Estrutura do formulário principal
 * Apenas para documentação, não é componente funcional
 */
const CadastrarDemandaFormStructureExample = () => {
  return `
  // Hook principal que gerencia todo o estado e comportamento do formulário
  const {
    formData,
    activeStep,
    // ... outros estados e métodos
  } = useDemandForm('user-id', () => console.log('onClose'));

  return (
    <Card>
      <div className="p-6">
        {/* Título da etapa atual */}
        <h3 className="form-step-title">
          {FORM_STEPS[activeStep].title}
        </h3>
        
        {/* Componente de navegação entre etapas */}
        <FormSteps 
          steps={FORM_STEPS} 
          activeStep={activeStep} 
          onStepClick={handleStepClick}
        />
        
        {/* Mensagens de validação */}
        {showValidationAlert && (
          <Alert variant="destructive">
            <AlertTitle>Campos obrigatórios não preenchidos</AlertTitle>
            <AlertDescription>
              {/* Mensagens de erro */}
            </AlertDescription>
          </Alert>
        )}
        
        {/* Conteúdo dinâmico da etapa atual */}
        <FormContent
          activeStep={activeStep}
          formData={formData}
          // ... outras props
        />
        
        {/* Botões de ação */}
        <FormActions 
          onPrevStep={prevStep}
          onNextStep={handleNextStep}
          isLastStep={activeStep === FORM_STEPS.length - 1}
          isFirstStep={activeStep === 0}
          isSubmitting={isLoading}
          onSubmit={() => handleSubmit(formData)}
        />
      </div>
    </Card>
  )
  `;
};

/**
 * Estrutura do componente FormContent que renderiza a etapa atual
 * Apenas para documentação, não é componente funcional
 */
const FormContentStructureExample = () => {
  return `
  switch (activeStep) {
    case 0:
      return <ProtocolStep />;
    case 1:
      return <RequesterInfoStep />;
    case 2:
      return <LocationStep />;
    case 3:
      return <OrganizeStep />;
    case 4:
      return <ReviewStep />;
    default:
      return <div>Step not found</div>;
  }
  `;
};

/**
 * Estrutura do componente FormSteps que exibe os indicadores de etapa
 * Apenas para documentação, não é componente funcional
 */
const FormStepsStructureExample = () => {
  return `
  <div className="relative">
    <div className="flex items-center justify-between">
      {steps.map((step, index) => (
        <React.Fragment key={index}>
          {/* Círculo de etapa (ativo/concluído/futuro) */}
          <div className="circle">
            {index < activeStep ? <Check /> : index + 1}
          </div>
          
          {/* Linha conectora entre etapas */}
          {index < steps.length - 1 && <div className="connector-line" />}
        </React.Fragment>
      ))}
    </div>
  </div>
  `;
};

/**
 * Estrutura do componente FormActions com botões de navegação
 * Apenas para documentação, não é componente funcional
 */
const FormActionsStructureExample = () => {
  return `
  <div className="flex justify-between mt-8">
    {/* Botão Voltar */}
    <Button 
      variant="outline"
      onClick={onPrevStep} 
      disabled={isFirstStep}
    >
      Voltar
    </Button>
    
    {/* Botão Próximo/Finalizar */}
    {isLastStep ? (
      <Button 
        onClick={onSubmit}
        disabled={isSubmitting}
      >
        {isSubmitting ? "Enviando..." : "Finalizar"}
      </Button>
    ) : (
      <Button 
        onClick={onNextStep}
      >
        Próximo
        <ArrowRight />
      </Button>
    )}
  </div>
  `;
};

/**
 * Estrutura do componente de upload de arquivos
 * Apenas para documentação, não é componente funcional
 */
const FileUploadStructureExample = () => {
  return `
  <div className="w-full">
    <Label>Anexar Arquivo</Label>

    {value ? (
      /* Exibição do arquivo já carregado */
      <div className="preview-container">
        {/* Preview do arquivo (imagem ou ícone) */}
        <span className="filename">{fileName}</span>
        <button onClick={handleRemove}><X /></button>
      </div>
    ) : (
      /* Área de upload */
      <div
        className="drop-zone"
        onClick={() => inputRef.current?.click()}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <Upload />
        <p>{isUploading ? 'Enviando arquivo...' : 'Clique aqui ou arraste um arquivo'}</p>
        <p>PNG, JPG, HEIC, PDF, DOC, XLS até 10MB</p>
      </div>
    )}

    {/* Input oculto para seleção de arquivo */}
    <input
      ref={inputRef}
      type="file"
      hidden
      onChange={handleFileChange}
      accept={ACCEPTED_TYPES.join(',')}
    />
  </div>
  `;
};

// Constante para documentação das etapas do formulário
const FORM_STEPS_DOCUMENTATION = [
  { title: "Etapa 1", description: "" },
  { title: "Etapa 2", description: "" },
  { title: "Etapa 3", description: "" },
  { title: "Etapa 4", description: "" },
  { title: "Etapa 5", description: "" },
];

export {
  CadastrarDemandaStructureExample,
  CadastrarDemandaFormStructureExample,
  FormContentStructureExample,
  FormStepsStructureExample,
  FormActionsStructureExample,
  FileUploadStructureExample,
  FORM_STEPS_DOCUMENTATION
};
