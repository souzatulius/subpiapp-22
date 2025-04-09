
import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import ResponderDemandaContent from './responder-demanda/ResponderDemandaContent';
import { useDemandasData } from './responder-demanda/hooks/useDemandasData';

interface ResponderDemandaFormProps {
  onClose?: () => void;
}

const ResponderDemandaForm: React.FC<ResponderDemandaFormProps> = ({ onClose }) => {
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const demandaId = query.get('id');
  
  const { demandas, setSelectedDemanda } = useDemandasData();
  
  // Set the selected demand based on the URL parameter if present
  useEffect(() => {
    if (demandaId && demandas.length > 0) {
      const foundDemanda = demandas.find(d => d.id === demandaId);
      if (foundDemanda) {
        setSelectedDemanda(foundDemanda);
      }
    }
  }, [demandaId, demandas, setSelectedDemanda]);
  
  return (
    <div className="w-full rounded-xl overflow-hidden">
      <ResponderDemandaContent />
    </div>
  );
};

export default ResponderDemandaForm;
