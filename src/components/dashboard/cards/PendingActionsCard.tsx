
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface PendingActionsProps {
  id: string;
  notesToApprove: number;
  responsesToDo: number;
}

const PendingActionsCard: React.FC<PendingActionsProps> = ({ 
  id, 
  notesToApprove, 
  responsesToDo 
}) => {
  const navigate = useNavigate();
  
  const totalPending = notesToApprove + responsesToDo;
  
  const handleViewAll = () => {
    if (notesToApprove > 0) {
      navigate('/dashboard/comunicacao/aprovar-nota');
    } else if (responsesToDo > 0) {
      navigate('/dashboard/comunicacao/responder');
    }
  };

  return (
    <Card 
      className="cursor-pointer h-full bg-yellow-50 text-yellow-800 border border-yellow-200 
        rounded-xl shadow-md hover:shadow-xl overflow-hidden transform-gpu hover:scale-[1.03] transition-all duration-300"
    >
      <CardContent className="flex flex-col justify-between h-full p-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium">Você precisa agir</h3>
          <AlertTriangle className="h-5 w-5" />
        </div>
        
        <p className="text-sm mt-2">
          {notesToApprove > 0 && `${notesToApprove} nota${notesToApprove !== 1 ? 's' : ''} para aprovar`}
          {notesToApprove > 0 && responsesToDo > 0 && ' · '}
          {responsesToDo > 0 && `${responsesToDo} resposta${responsesToDo !== 1 ? 's' : ''} pendente${responsesToDo !== 1 ? 's' : ''}`}
        </p>
        
        {totalPending > 0 && (
          <button 
            onClick={handleViewAll}
            className="text-xs self-end mt-2 px-2 py-1 bg-yellow-100 hover:bg-yellow-200 text-yellow-800 rounded transition-colors"
          >
            Ver
          </button>
        )}
      </CardContent>
    </Card>
  );
};

export default PendingActionsCard;
