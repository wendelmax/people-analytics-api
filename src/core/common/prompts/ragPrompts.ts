export const RAGPrompts = {
  performance: {
    analysis: `Analise os seguintes dados de performance do colaborador {employeeName}:
    - KPIs: {kpis}
    - Feedback: {feedback}
    - Metas: {goals}
    - Histórico: {history}
    
    Considere:
    1. Tendências de performance
    2. Pontos fortes e áreas de melhoria
    3. Alinhamento com metas
    4. Comparação com pares
    5. Recomendações de desenvolvimento
    
    Formate a resposta em português, usando linguagem profissional mas acessível.`,

    prediction: `Com base nos dados históricos de performance:
    - Histórico: {history}
    - KPIs: {kpis}
    - Feedback: {feedback}
    
    Faça uma previsão para os próximos {timeframe} meses considerando:
    1. Tendências atuais
    2. Fatores de influência
    3. Probabilidade de sucesso
    4. Riscos potenciais
    5. Ações recomendadas
    
    Formate a resposta em português, destacando pontos críticos.`,
  },

  career: {
    guidance: `Analise o perfil de carreira do colaborador {employeeName}:
    - Posição atual: {currentPosition}
    - Histórico: {history}
    - Aspirações: {aspirations}
    - Habilidades: {skills}
    
    Forneça orientação considerando:
    1. Caminhos de carreira possíveis
    2. Habilidades necessárias
    3. Timeline recomendada
    4. Oportunidades internas
    5. Desafios potenciais
    
    Formate a resposta em português, com foco em desenvolvimento.`,

    transition: `Avalie a transição de carreira proposta:
    - Posição atual: {currentPosition}
    - Posição alvo: {targetPosition}
    - Habilidades atuais: {currentSkills}
    - Habilidades necessárias: {requiredSkills}
    
    Forneça análise considerando:
    1. Viabilidade da transição
    2. Gaps de habilidades
    3. Timeline recomendada
    4. Riscos e oportunidades
    5. Plano de ação
    
    Formate a resposta em português, com foco em planejamento.`,
  },

  skills: {
    assessment: `Avalie as habilidades do colaborador {employeeName}:
    - Habilidades técnicas: {technicalSkills}
    - Habilidades comportamentais: {softSkills}
    - Certificações: {certifications}
    - Projetos: {projects}
    
    Forneça análise considerando:
    1. Nível de proficiência
    2. Relevância para o cargo
    3. Gaps identificados
    4. Oportunidades de desenvolvimento
    5. Recomendações de treinamento
    
    Formate a resposta em português, com foco em desenvolvimento.`,

    recommendation: `Com base no perfil de habilidades:
    - Habilidades atuais: {currentSkills}
    - Objetivos: {objectives}
    - Mercado: {marketTrends}
    
    Recomende desenvolvimento considerando:
    1. Prioridades de aprendizado
    2. Recursos disponíveis
    3. Timeline sugerida
    4. Métricas de sucesso
    5. Aplicação prática
    
    Formate a resposta em português, com foco em ação.`,
  },

  engagement: {
    analysis: `Analise o engajamento da equipe {teamName}:
    - Pesquisas: {surveys}
    - Feedback: {feedback}
    - Atividades: {activities}
    - Métricas: {metrics}
    
    Forneça insights considerando:
    1. Nível geral de engajamento
    2. Fatores de influência
    3. Tendências
    4. Áreas de preocupação
    5. Recomendações de ação
    
    Formate a resposta em português, com foco em melhorias.`,

    prediction: `Preveja o engajamento futuro baseado em:
    - Histórico: {history}
    - Fatores atuais: {currentFactors}
    - Mudanças planejadas: {plannedChanges}
    
    Considere:
    1. Probabilidade de mudanças
    2. Fatores de risco
    3. Oportunidades
    4. Ações preventivas
    5. Métricas de monitoramento
    
    Formate a resposta em português, com foco em prevenção.`,
  },

  chatbot: {
    general: `Contexto da conversa:
    - Usuário: {userInfo}
    - Histórico: {conversationHistory}
    - Intenção: {intent}
    
    Forneça resposta considerando:
    1. Perfil do usuário
    2. Contexto da conversa
    3. Tom apropriado
    4. Informações relevantes
    5. Próximos passos sugeridos
    
    Formate a resposta em português, de forma conversacional.`,

    specific: `Contexto específico:
    - Domínio: {domain}
    - Dados: {domainData}
    - Pergunta: {question}
    
    Forneça resposta considerando:
    1. Especificidade do domínio
    2. Dados disponíveis
    3. Precisão técnica
    4. Clareza na explicação
    5. Ações recomendadas
    
    Formate a resposta em português, adaptada ao domínio.`,
  },
};
