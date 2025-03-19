
export const formatDestination = (
  destinatariosStr: string,
  users: { id: string; nome_completo: string }[],
  areas: { id: string; descricao: string }[],
  cargos: { id: string; descricao: string }[]
): string => {
  if (destinatariosStr === 'Todos') {
    return 'Todos os usuários';
  }
  
  try {
    const destinatariosObj = JSON.parse(destinatariosStr);
    
    if (destinatariosObj.type === 'usuarios') {
      const count = destinatariosObj.ids.length;
      if (count === 1) {
        const user = users.find(u => u.id === destinatariosObj.ids[0]);
        return user ? `Usuário: ${user.nome_completo}` : 'Um usuário específico';
      }
      return `${count} usuários específicos`;
    } else if (destinatariosObj.type === 'areas') {
      const area = areas.find(a => a.id === destinatariosObj.ids[0]);
      return area ? `Área: ${area.descricao}` : 'Uma área específica';
    } else if (destinatariosObj.type === 'cargos') {
      const cargo = cargos.find(c => c.id === destinatariosObj.ids[0]);
      return cargo ? `Cargo: ${cargo.descricao}` : 'Um cargo específico';
    }
    
    return 'Destinatários específicos';
  } catch (e) {
    return destinatariosStr;
  }
};

export const createCsvData = (
  announcements: any[],
  formatDestination: (dest: string) => string
) => {
  // Create CSV data
  const headers = ['Título', 'Mensagem', 'Destinatários', 'Autor', 'Data de Envio'];
  const csvData = announcements.map(announcement => [
    announcement.titulo,
    announcement.mensagem.replace(/\n/g, ' '),
    formatDestination(announcement.destinatarios),
    announcement.autor?.nome_completo || '',
    new Date(announcement.data_envio).toLocaleString('pt-BR')
  ]);
  
  const csvContent = [
    headers.join(','),
    ...csvData.map(row => row.map(cell => {
      // Handle commas and quotes in CSV
      if (typeof cell === 'string' && (cell.includes(',') || cell.includes('"'))) {
        return `"${cell.replace(/"/g, '""')}"`;
      }
      return cell;
    }).join(','))
  ].join('\n');
  
  return csvContent;
};

export const downloadCsv = (csvContent: string, filename: string) => {
  // Download CSV file
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
  URL.revokeObjectURL(link.href);
};
