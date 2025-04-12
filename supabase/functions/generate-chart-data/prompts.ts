
/**
 * Generates a prompt for Zeladoria chart data generation
 */
export function generateZeladoriaChartsPrompt(data: { csv: string }) {
  return `
Você receberá abaixo o conteúdo de uma planilha de ordens de serviço públicas, convertida para CSV. As colunas incluem:

- número da OS  
- tipo de serviço  
- status  
- data de abertura  
- data de conclusão (se houver)  
- distrito  
- prazo de atendimento (dentro ou fora do prazo)  
- tempo de atendimento estimado ou percentual  
- responsável (ex: subprefeitura, ENEL, SABESP etc.)

Com base nesse conteúdo, retorne apenas um **objeto JSON** contendo os seguintes blocos de dados:

{
  "kpis": {
    "total_os": number,
    "os_fechadas": number,
    "os_pendentes": number,
    "os_canceladas": number,
    "os_fora_do_prazo": number,
    "media_dias_atendimento": number
  },
  "por_distrito": {
    "Distrito A": number,
    "Distrito B": number
  },
  "por_status": {
    "NOVO": number,
    "PLANEJAR": number,
    "EM ANDAMENTO": number,
    "CONCLUÍDO": number,
    "CANCELADO": number
  },
  "por_responsavel": {
    "subprefeitura": number,
    "enel": number,
    "sabesp": number,
    "dzu": number,
    "selimp": number,
    "outros": number
  },
  "por_tipo_servico_agrupado": {
    "Poda Remoção Árvores": number,
    "Tapa Buraco": number,
    "Limpeza de Córregos e Bocas de Lobo": number,
    "Conservação de Logradouros": number,
    "Limpeza Urbana": number,
    "Equipamentos Urbanos": number
  },
  "tempo_medio_por_status": {
    "NOVO": number,
    "PLANEJAR": number,
    "CONCLUÍDO": number,
    "CANCELADO": number
  },
  "tempo_abertura_distribuicao": {
    "0–10 dias": number,
    "11–30 dias": number,
    "31–60 dias": number,
    "+60 dias": number
  },
  "prazo_fechamento_distribuicao": {
    "Dentro do Prazo": number,
    "Fora do Prazo": number
  },
  "mais_frequentes": [
    {"servico": "Serviço X", "quantidade": number},
    {"servico": "Serviço Y", "quantidade": number},
    {"servico": "Serviço Z", "quantidade": number}
  ],
  "evolucao_diaria": {
    "2025-04-01": number,
    "2025-04-02": number,
    "2025-04-03": number
  },
  "fluxo_status": [
    {"from": "NOVO", "to": "PLANEJAR", "count": number},
    {"from": "PLANEJAR", "to": "EM ANDAMENTO", "count": number}
  ]
}

**Regras obrigatórias:**
- Padronize os nomes (sem acentos, letras minúsculas).
- Considere que os tipos de serviço devem ser agrupados conforme uma lógica institucional (ex: poda e remoção de árvores são do mesmo grupo).
- Calcule a média de dias usando as datas de abertura e conclusão (quando houver).
- Retorne **somente o JSON**, sem explicações adicionais, sem prefixos, sem markdown.

**Conteúdo CSV:**  
${data.csv}
`.trim();
}
