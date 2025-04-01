
import React from 'react';
import EmailSuffix from '@/components/EmailSuffix';

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
  return (
    <div className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-[#111827] mb-1">
          Nome completo
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={name}
          onChange={handleChange}
          className={`w-full px-4 py-2 border ${errors.name ? 'border-[#f57b35]' : 'border-gray-300'} rounded-xl focus:ring-2 focus:ring-[#003570]`}
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
          suffix="@smsub.prefeitura.sp.gov.br"
          error={errors.email}
          placeholder="Apenas o usuário"
        />
        {errors.email && <p className="mt-1 text-sm text-[#f57b35]">E-mail é obrigatório</p>}
      </div>
      
      <div>
        <label htmlFor="birthday" className="block text-sm font-medium text-[#111827] mb-1">
          Data de aniversário
        </label>
        <input
          type="text"
          id="birthday"
          name="birthday"
          value={birthday}
          onChange={handleChange}
          className={`w-full px-4 py-2 border ${errors.birthday ? 'border-[#f57b35]' : 'border-gray-300'} rounded-xl focus:ring-2 focus:ring-[#003570]`}
          placeholder="DD/MM/AAAA"
        />
        {errors.birthday && <p className="mt-1 text-sm text-[#f57b35]">Data de aniversário é obrigatória</p>}
      </div>

      <div>
        <label htmlFor="whatsapp" className="block text-sm font-medium text-[#111827] mb-1">
          WhatsApp (com DDD)
        </label>
        <input
          type="text"
          id="whatsapp"
          name="whatsapp"
          value={whatsapp}
          onChange={handleChange}
          className={`w-full px-4 py-2 border ${errors.whatsapp ? 'border-[#f57b35]' : 'border-gray-300'} rounded-xl focus:ring-2 focus:ring-[#003570]`}
          placeholder="(11) 99999-9999"
        />
        {errors.whatsapp && <p className="mt-1 text-sm text-[#f57b35]">WhatsApp é obrigatório</p>}
      </div>
    </div>
  );
};

export default PersonalInfoFields;
