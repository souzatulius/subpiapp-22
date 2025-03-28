
import React from 'react';
import EmailSuffix from '@/components/EmailSuffix';
import { Input } from '@/components/ui/input';
import { formatPhoneNumber, formatDateInput } from '@/lib/inputFormatting';

interface PersonalInfoFieldsProps {
  name: string;
  email: string;
  birthday: string;
  whatsapp: string;
  errors: Record<string, boolean>;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
}

const PersonalInfoFields: React.FC<PersonalInfoFieldsProps> = ({
  name,
  email,
  birthday,
  whatsapp,
  errors,
  handleChange
}) => {
  // Função para formatar o WhatsApp enquanto o usuário digita
  const handleWhatsAppChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const formattedValue = formatPhoneNumber(value);
    
    handleChange({
      target: {
        name: e.target.name,
        value: formattedValue
      }
    } as React.ChangeEvent<HTMLInputElement>);
  };
  
  // Função para formatar a data enquanto o usuário digita
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const formattedValue = formatDateInput(value);
    
    handleChange({
      target: {
        name: e.target.name,
        value: formattedValue
      }
    } as React.ChangeEvent<HTMLInputElement>);
  };

  return (
    <>
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-[#111827] mb-1">
          Nome Completo
        </label>
        <Input 
          id="name" 
          name="name" 
          type="text" 
          value={name} 
          onChange={handleChange} 
          className={errors.name ? 'border-[#f57b35] ring-[#f57b35]' : ''} 
        />
        {errors.name && <p className="mt-1 text-sm text-[#f57b35]">Nome é obrigatório</p>}
      </div>
      
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-[#111827] mb-1">
          E-mail
        </label>
        <EmailSuffix 
          id="email" 
          value={email} 
          onChange={value => {
            handleChange({
              target: {
                name: 'email',
                value
              }
            } as React.ChangeEvent<HTMLInputElement>);
          }} 
          suffix="@smsub.prefeitura.sp.gov.br" 
          error={errors.email} 
          placeholder="" 
        />
        {errors.email && <p className="mt-1 text-sm text-[#f57b35]">E-mail é obrigatório</p>}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="birthday" className="block text-sm font-medium text-[#111827] mb-1">
            Data de Aniversário
          </label>
          <Input 
            id="birthday" 
            name="birthday" 
            type="text" 
            value={birthday} 
            onChange={handleDateChange} 
            placeholder="DD/MM/AAAA" 
            maxLength={10} 
            className={errors.birthday ? 'border-[#f57b35] ring-[#f57b35]' : ''}
          />
          {errors.birthday && <p className="mt-1 text-sm text-[#f57b35]">Data válida é obrigatória</p>}
        </div>
        
        <div>
          <label htmlFor="whatsapp" className="block text-sm font-medium text-[#111827] mb-1">
            WhatsApp
          </label>
          <Input 
            id="whatsapp" 
            name="whatsapp" 
            type="text" 
            value={whatsapp} 
            onChange={handleWhatsAppChange} 
            placeholder="(XX) XXXXX-XXXX" 
            maxLength={15} 
            className={errors.whatsapp ? 'border-[#f57b35] ring-[#f57b35]' : ''}
          />
          {errors.whatsapp && <p className="mt-1 text-sm text-[#f57b35]">WhatsApp é obrigatório</p>}
        </div>
      </div>
    </>
  );
};

export default PersonalInfoFields;
