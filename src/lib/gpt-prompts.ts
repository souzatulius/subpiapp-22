
/**
 * Collection of prompt generation functions for different use cases
 * Used by the GPT integration to create contextual prompts
 */

/**
 * Generates a prompt for press requests
 */
export function generatePressRequestPrompt(data: {
  origem: string;
  detalhesSolicitacao: string;
  tipoVeiculo?: string;
  nomeVeiculo?: string;
  nomeSolicitante: string;
  prioridade: string;
  prazo: string;
  problema: string;
  servicos: string;
}) {
  return `
Você é assessor de imprensa da Subprefeitura de Pinheiros. Com base nas informações abaixo, gere:

1. Um **título objetivo e consultável**, com até 80 caracteres, seguindo o padrão:
   **[Problema ou serviço] – [Bairro ou região mencionada]**
   (Exemplo: "Buraco em via pública – Vila Madalena")

2. Um **resumo da solicitação**, com até 3 parágrafos, que esclareça:
   - Quem fez a solicitação (cidadão, jornalista, vereador etc.)
   - Qual é o problema ou questionamento
   - Onde ocorre
   - Qual é a urgência (prazo e prioridade)
   - Qual é o possível impacto

3. Três **perguntas claras para a área técnica**, com foco em esclarecer a situação e permitir uma resposta institucional completa. Use como base as seguintes perguntas comuns (escolha as mais apropriadas):
   - Temos conhecimento da situação?
   - Já foi realizada vistoria no local?
   - A obra ou intervenção está regular?
   - É responsabilidade da Subprefeitura?
   - Existe previsão ou prazo para solução?
   - Por que o serviço ainda não foi realizado?
   - Quais regras se aplicam a essa situação?
   - Temos estatísticas sobre esse tipo de serviço no último ano?

**Informações recebidas:**
- Origem da demanda: ${data.origem}
- Texto do e-mail recebido: ${data.detalhesSolicitacao}
- Tipo e nome do veículo (se houver): ${data.tipoVeiculo || 'Não informado'}, ${data.nomeVeiculo || 'Não informado'}
- Nome do solicitante: ${data.nomeSolicitante}
- Prioridade: ${data.prioridade}
- Prazo de resposta: ${data.prazo}
- Tipo de problema: ${data.problema}
- Serviços relacionados: ${data.servicos}

**Instruções de linguagem:**
- Seja direto, objetivo e institucional.
- Evite jargões técnicos e termos vagos.
- O conteúdo será enviado para a área técnica responsável.
`.trim();
}

/**
 * Generates a prompt for press release notes
 */
export function generateNotaImprensaPrompt(data: {
  resumo: string;
  perguntas: string[];
  respostas: string[];
  comentariosAdicionais?: string;
  dataAtual: string;
}) {
  const perguntasERespostas = data.perguntas.map((pergunta, i) => {
    return `**Pergunta:** ${pergunta}\n**Resposta:** ${data.respostas[i] || 'Sem resposta'}`;
  }).join('\n\n');

  return `
Você é assessor de imprensa da Subprefeitura de Pinheiros.

Com base nas informações da demanda exibida nesta página (incluindo o contexto do pedido da imprensa, as perguntas feitas pela coordenação de comunicação e as respostas fornecidas pelas áreas técnicas da Subprefeitura), redija uma **nota oficial clara, objetiva e institucional**, seguindo rigorosamente os critérios abaixo:

1. Crie um **título curto, informativo e direto ao ponto**, que resuma o tema principal da nota (por exemplo: "Limpeza de galhos na Rua X", "Responsabilidade por poda de árvore", "Demolição de imóvel na região Y").
2. Inicie o texto com uma **frase institucional**, usando verbos como **"informa", "esclarece", "reforça" ou "confirma"**.
3. Desenvolva **de um a três parágrafos objetivos**, com:
   - Contexto da demanda recebida (ex: denúncia, dúvida, reclamação)
   - Ação realizada ou posicionamento da Subprefeitura
   - **Local exato**, **data da ocorrência**, **tipo de serviço envolvido**
   - Indicação do **órgão responsável**, quando não for a Subprefeitura
   - **Prazos**, **números**, ou **exemplos concretos**, se aplicáveis
4. Finalize com uma **mensagem institucional de reforço**, como orientações à população (ex: uso do canal 156) ou reafirmação do compromisso da gestão local.
5. Sempre conclua com a assinatura oficial:

Subprefeitura de Pinheiros  
Prefeitura de São Paulo  
Data: ${data.dataAtual}

---

**Contexto da solicitação:**  
${data.resumo}

**Perguntas e respostas:**  
${perguntasERespostas}

**Comentários adicionais:**  
${data.comentariosAdicionais || 'Nenhum'}
`.trim();
}

/**
 * Generates a prompt for transforming release text to news
 */
export function generateReleaseToNewsPrompt(data: {
  releaseTexto: string;
}) {
  return `
Você é jornalista da equipe de comunicação da Subprefeitura de Pinheiros. Transforme o texto abaixo em uma notícia jornalística completa com:

1. **Título jornalístico** direto e atrativo.
2. **Subtítulo** complementar que contextualize a ação ou evento.
3. **Corpo da notícia** em 2 a 4 parágrafos, com linguagem acessível e institucional.

**Texto recebido:**  
${data.releaseTexto}
`.trim();
}

/**
 * Generates a prompt for ESIC justifications
 */
export function generateEsicJustificativaPrompt(data: {
  rascunho: string;
}) {
  return `
Você é servidor público responsável por responder a uma solicitação via Lei de Acesso à Informação (e-SIC) no município de São Paulo.

Com base no rascunho abaixo, elabore uma **justificativa oficial clara, objetiva, legalmente adequada e com tom institucional**, explicando a informação solicitada ou o motivo de eventual negativa.

**Rascunho da justificativa:**  
${data.rascunho}
`.trim();
}
