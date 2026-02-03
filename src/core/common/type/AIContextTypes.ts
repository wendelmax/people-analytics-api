export interface AIContextUser {
  id: string;
  role?: string;
  department?: string;
  position?: string;
  experience?: string;
}

export interface AIContextConversation {
  history: unknown[];
  currentTopic?: string;
  intent: string;
}

export interface AIContextDomainBase {
  type: string;
  data: Record<string, unknown>;
  lastUpdate?: Date;
}

export interface AIContextSystem {
  language?: string;
  timezone?: string;
  preferences: { detailLevel?: string };
}

export interface AIContext {
  user: AIContextUser;
  conversation: AIContextConversation;
  domain: AIContextDomainBase;
  system: AIContextSystem;
}

export interface PerformanceContext extends AIContext {
  domain: AIContextDomainBase & {
    type: 'performance';
    data: {
      metrics: { kpis: unknown; trends: unknown };
      feedback: unknown;
      goals: unknown;
    };
  };
}

export interface CareerContext extends AIContext {
  domain: AIContextDomainBase & {
    type: 'career';
    data: {
      currentPosition: unknown;
      history: unknown;
      aspirations: unknown;
      skills: unknown;
    };
  };
}

export interface SkillsContext extends AIContext {
  domain: AIContextDomainBase & {
    type: 'skills';
    data: {
      technical: unknown;
      soft: unknown;
      certifications: unknown;
      gaps: unknown;
    };
  };
}

export interface EngagementContext extends AIContext {
  domain: AIContextDomainBase & {
    type: 'engagement';
    data: {
      surveys: unknown;
      feedback: unknown;
      activities: unknown;
    };
  };
}
