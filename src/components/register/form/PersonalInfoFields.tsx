
import React from 'react';
import EmailSuffix from '@/components/EmailSuffix';
import { formatPhone, formatDate } from '@/lib/formValidation';

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
  return (
    <>
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-[#111827] mb-1">
          Nome Completo
        </label>
        <input 
          id="name" 
          name="name" 
          type="text" 
          value={name} 
          onChange={handleChange} 
          className={`w-full px-4 py-2 border ${errors.name ? 'border-[#f57b35]' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003570] focus:border-transparent transition-all duration-200`} 
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
          <input 
            id="birthday" 
            name="birthday" 
            type="text" 
            value={birthday} 
            onChange={handleChange} 
            className={`w-full px-4 py-2 border ${errors.birthday ? 'border-[#f57b35]' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003570] focus:border-transparent transition-all duration-200`} 
            placeholder="DD/MM/AAAA" 
            maxLength={10} 
          />
          {errors.birthday && <p className="mt-1 text-sm text-[#f57b35]">Data válida é obrigatória</p>}
        </div>
        
        <div>
          <label htmlFor="whatsapp" className="block text-sm font-medium text-[#111827] mb-1">
            WhatsApp
          </label>
          <input 
            id="whatsapp" 
            name="whatsapp" 
            type="text" 
            value={whatsapp} 
            onChange={handleChange} 
            className={`w-full px-4 py-2 border ${errors.whatsapp ? 'border-[#f57b35]' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003570] focus:border-transparent transition-all duration-200`} 
            placeholder="(XX) XXXXX-XXXX" 
            maxLength={15} 
          />
          {errors.whatsapp && <p className="mt-1 text-sm text-[#f57b35]">WhatsApp é obrigatório</p>}
        </div>
      </div>
    </>
  );
};

export default PersonalInfoFields;
