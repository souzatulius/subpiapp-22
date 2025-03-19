
import { Announcement } from './types';

export const formatDestination = (destinatarios: string): string => {
  try {
    if (destinatarios === 'Todos') return 'Todos';
    
    const parsed = JSON.parse(destinatarios);
    
    if (parsed.type === 'usuarios') {
      return `${parsed.ids.length} usuário(s) específico(s)`;
    } else if (parsed.type === 'areas') {
      return 'Área(s) específica(s)';
    } else if (parsed.type === 'cargos') {
      return 'Cargo(s) específico(s)';
    }
    
    return destinatarios;
  } catch (e) {
    return destinatarios;
  }
};

export const handleExportCsv = (announcements: Announcement[]) => {
  if (announcements.length === 0) return;
  
  // Preparar dados para CSV
  const headers = ['ID', 'Título', 'Mensagem', 'Destinatários', 'Data de Envio', 'Autor'];
  const rows = announcements.map(a => [
    a.id,
    a.titulo,
    a.mensagem,
    formatDestination(a.destinatarios),
    new Date(a.data_envio).toLocaleDateString('pt-BR'),
    a.autor.nome_completo
  ]);
  
  // Converter para CSV
  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
  ].join('\n');
  
  // Criar blob e link para download
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  
  link.setAttribute('href', url);
  link.setAttribute('download', `comunicados_${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const handlePrint = (announcements: Announcement[]) => {
  if (announcements.length === 0) return;
  
  // Criar conteúdo para impressão
  const printContent = `
    <html>
      <head>
        <title>Comunicados</title>
        <style>
          body { font-family: Arial, sans-serif; }
          .header { text-align: center; margin-bottom: 20px; }
          table { width: 100%; border-collapse: collapse; }
          th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
          th { background-color: #f2f2f2; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Relatório de Comunicados</h1>
          <p>Data: ${new Date().toLocaleDateString('pt-BR')}</p>
        </div>
        <table>
          <thead>
            <tr>
              <th>Título</th>
              <th>Mensagem</th>
              <th>Destinatários</th>
              <th>Data de Envio</th>
              <th>Autor</th>
            </tr>
          </thead>
          <tbody>
            ${announcements.map(a => `
              <tr>
                <td>${a.titulo}</td>
                <td>${a.mensagem}</td>
                <td>${formatDestination(a.destinatarios)}</td>
                <td>${new Date(a.data_envio).toLocaleDateString('pt-BR')}</td>
                <td>${a.autor.nome_completo}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </body>
    </html>
  `;
  
  // Abrir janela de impressão
  const printWindow = window.open('', '_blank');
  if (printWindow) {
    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.close();
  }
};
