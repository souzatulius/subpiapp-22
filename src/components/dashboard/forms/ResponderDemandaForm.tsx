
import React from 'react';
import ResponderDemandaContent from './responder-demanda/ResponderDemandaContent';
import { ResponderDemandaFormProps } from './responder-demanda/types';

const ResponderDemandaForm: React.FC<ResponderDemandaFormProps> = ({ onClose }) => {
  return <ResponderDemandaContent />;
};

export default ResponderDemandaForm;
