
// Format an email to include the domain if it's not already present
export const completeEmailWithDomain = (email: string): string => {
  const emailDomain = '@smsub.prefeitura.sp.gov.br';
  
  if (!email.includes('@')) {
    return `${email}${emailDomain}`;
  }
  
  return email;
};
