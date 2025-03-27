
import React from 'react';
import ResponderDemandaContent from './responder-demanda/ResponderDemandaContent';

interface ResponderDemandaFormProps {
  onClose?: () => void;
}

const ResponderDemandaForm: React.FC<ResponderDemandaFormProps> = ({ onClose }) => {
  return (
    <div className="w-full">
      <ResponderDemandaContent />
    </div>
  );
};

export default ResponderDemandaForm;
