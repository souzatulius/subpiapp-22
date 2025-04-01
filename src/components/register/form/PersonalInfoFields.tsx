
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
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const PersonalInfoFields: React.FC<PersonalInfoFieldsProps> = ({ 
  name, 
  email, 
  birthday, 
  whatsapp, 
  errors, 
  handleChange 
}) => {
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value);
    const syntheticEvent = {
      ...e,
      target: {
        ...e.target,
        name: 'whatsapp',
        value: formatted
      }
    };
    handleChange(syntheticEvent);
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatDateInput(e.target.value);
    const syntheticEvent = {
      ...e,
      target: {
        ...e.target,
        name: 'birthday',
        value: formatted
      }
    };
    handleChange(syntheticEvent);
  };

  return (
    <div className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-[#111827] mb-1">
          Nome completo
        </label>
        <Input
          type="text"
          id="name"
          name="name"
          value={name}
          onChange={handleChange}
          className={errors.name ? 'border-[#f57b35] focus:ring-[#f57b35]' : ''}
        />
        {errors.name && <p className="mt-1 text-sm text-[#f57b35]">Nome completo é obrigatório</p>}
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-[#111827] mb-1">
          E-mail
        </label>
        <EmailSuffix
          id="email"
          value={email}
          onChange={(value) => handleChange({ target: { name: 'email', value } } as React.ChangeEvent<HTMLInputElement>)}
          error={errors.email}
          placeholder="Apenas o usuário"
        />
        {errors.email && <p className="mt-1 text-sm text-[#f57b35]">E-mail é obrigatório</p>}
      </div>
      
      <div>
        <label htmlFor="birthday" className="block text-sm font-medium text-[#111827] mb-1">
          Data de aniversário
        </label>
        <Input
          type="text"
          id="birthday"
          name="birthday"
          value={birthday}
          onChange={handleDateChange}
          className={errors.birthday ? 'border-[#f57b35] focus:ring-[#f57b35]' : ''}
          placeholder="DD/MM/AAAA"
          maxLength={10}
        />
        {errors.birthday && <p className="mt-1 text-sm text-[#f57b35]">Data de aniversário é obrigatória</p>}
      </div>

      <div>
        <label htmlFor="whatsapp" className="block text-sm font-medium text-[#111827] mb-1">
          WhatsApp (com DDD)
        </label>
        <Input
          type="text"
          id="whatsapp"
          name="whatsapp"
          value={whatsapp}
          onChange={handlePhoneChange}
          className={errors.whatsapp ? 'border-[#f57b35] focus:ring-[#f57b35]' : ''}
          placeholder="(11) 99999-9999"
          maxLength={15}
        />
        {errors.whatsapp && <p className="mt-1 text-sm text-[#f57b35]">WhatsApp é obrigatório</p>}
      </div>
    </div>
  );
};

export default PersonalInfoFields;
