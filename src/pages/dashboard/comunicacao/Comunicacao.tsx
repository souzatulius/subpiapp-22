// (sem alterações até aqui)

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto p-6 flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        <span className="ml-2 text-blue-600 font-medium">Carregando dashboard...</span>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6 px-4 pt-6 pb-20 md:px-6 md:pb-6">
      {/* Welcome Card */}
      <WelcomeCard
        title="Comunicação"
        description="Gerencie demandas e notas oficiais"
        icon={<MessageSquareReply className="h-6 w-6 mr-2" />}
        color="bg-gradient-to-r from-blue-500 to-blue-700"
      />
      
      {/* Action Cards - Moved to top without title */}
      <div>
        <ActionCards 
          coordenacaoId={userDepartment || ''} 
          isComunicacao={isComunicacao}
          baseUrl="dashboard/comunicacao" 
        />
      </div>
      
      {/* Dynamic Content Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1: Nova Solicitação - only for Comunicação */}
        {isComunicacao && (
          <div className="col-span-1 md:col-span-1">
            <NewRequestOriginCard baseUrl="dashboard/comunicacao" />
          </div>
        )}
        
        {/* Card 2: Responder Demandas - for all */}
        <div className="col-span-1 md:col-span-1">
          <PendingDemandsCard 
            coordenacaoId={userDepartment || ''} 
            isComunicacao={isComunicacao}
            baseUrl="dashboard/comunicacao"
          />
        </div>
        
        {/* Card 3: Gerenciamento de Notas - for all */}
        <div className="col-span-1 md:col-span-1">
          <NotasManagementCard 
            coordenacaoId={userDepartment || ''} 
            isComunicacao={isComunicacao}
            baseUrl="dashboard/comunicacao/notas"
          />
        </div>
        
        {/* Card 4: Demandas em Andamento - for all */}
        <div className={`col-span-1 md:col-span-${isComunicacao ? 3 : 1}`}>
          <DemandasEmAndamentoCard 
            coordenacaoId={userDepartment || ''} 
            isComunicacao={isComunicacao}
            baseUrl="dashboard/comunicacao" 
          />
        </div>
      </div>
      
      {/* Only add MobileBottomNav if this page is not in preview mode */}
      {!isPreview && isMobile && <MobileBottomNav />}
    </div>
  );
};

export default ComunicacaoDashboard;
