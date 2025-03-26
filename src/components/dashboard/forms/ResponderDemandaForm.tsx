
import React from 'react';
import ResponderDemandaContent from './responder-demanda/ResponderDemandaContent';

interface ResponderDemandaFormProps {
  onClose?: () => void;
}

const ResponderDemandaForm: React.FC<ResponderDemandaFormProps> = ({ onClose }) => {
  return <ResponderDemandaContent />;
};

export default ResponderDemandaForm;
