
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Loader2, CheckCircle2 } from 'lucide-react';
import { migrateUserDashboards, migrateDepartmentDashboards } from '@/utils/dashboard/migrateUserDashboards';
import { toast } from '@/components/ui/use-toast';

interface DashboardMigrationHelperProps {
  onComplete?: () => void;
}

const DashboardMigrationHelper: React.FC<DashboardMigrationHelperProps> = ({ onComplete }) => {
  const [isMigrating, setIsMigrating] = useState(false);
  const [migrationComplete, setMigrationComplete] = useState(false);

  const handleMigration = async () => {
    setIsMigrating(true);
    
    try {
      // Migrate user dashboards
      await migrateUserDashboards();
      
      // Migrate department dashboards
      await migrateDepartmentDashboards();
      
      toast({
        title: 'Migração concluída',
        description: 'A migração dos dashboards foi concluída com sucesso.',
        variant: 'default',
      });
      
      setMigrationComplete(true);
      if (onComplete) onComplete();
    } catch (error) {
      console.error('Migration error:', error);
      toast({
        title: 'Erro na migração',
        description: 'Ocorreu um erro durante a migração dos dashboards.',
        variant: 'destructive',
      });
    } finally {
      setIsMigrating(false);
    }
  };

  return (
    <div className="space-y-4 p-4 border rounded-md">
      <Alert variant={migrationComplete ? "success" : "default"}>
        <AlertTitle className="font-bold">
          {migrationComplete ? 'Migração concluída!' : 'Migração de Dashboards'}
        </AlertTitle>
        <AlertDescription>
          {migrationComplete 
            ? 'Seus dashboards foram separados com sucesso. Agora você pode gerenciar o dashboard principal e o dashboard de comunicação independentemente.'
            : 'Este assistente irá ajudá-lo a migrar seus dashboards para o novo formato, separando as configurações do dashboard principal e do dashboard de comunicação.'}
        </AlertDescription>
      </Alert>

      {!migrationComplete && (
        <Button 
          onClick={handleMigration} 
          disabled={isMigrating}
          className="w-full"
        >
          {isMigrating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 
              Migrando dashboards...
            </>
          ) : (
            'Iniciar migração'
          )}
        </Button>
      )}

      {migrationComplete && (
        <div className="flex items-center justify-center text-green-600">
          <CheckCircle2 className="mr-2 h-5 w-5" />
          <p>Migração concluída com sucesso!</p>
        </div>
      )}
    </div>
  );
};

export default DashboardMigrationHelper;
