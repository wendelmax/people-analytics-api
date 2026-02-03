# Análise Comparativa de Features - People Analytics API

## 📊 Visão Geral

Este documento apresenta uma análise comparativa entre o sistema atual People Analytics API e três sistemas de referência:
- **Admidio**: Sistema de gerenciamento de usuários para organizações
- **Minthcm**: Sistema de Gestão de Capital Humano habilitado por IA
- **Frappe HRMS**: Software completo de RH e Folha de Pagamento

---

## ✅ Features Já Implementadas

### Módulos Existentes no Sistema Atual:
- ✅ **Employees** - Gestão de funcionários
- ✅ **Departments** - Departamentos
- ✅ **Positions** - Cargos
- ✅ **Skills** - Habilidades e competências
- ✅ **Projects** - Projetos
- ✅ **Trainings** - Treinamentos
- ✅ **Performance Reviews** - Avaliações de desempenho
- ✅ **Goals** - Metas
- ✅ **Feedback** - Sistema de feedback
- ✅ **Mentoring** - Programas de mentoria
- ✅ **Career Paths** - Planos de carreira
- ✅ **Onboarding** - Processo de integração
- ✅ **Offboarding** - Processo de desligamento
- ✅ **Analytics** - Analytics e insights
- ✅ **Notifications** - Notificações
- ✅ **Knowledge Base** - Base de conhecimento
- ✅ **Chatbot** - Chatbot com IA
- ✅ **Competency Assessment** - Avaliação de competências
- ✅ **Employee Journey** - Jornada do funcionário
- ✅ **Development Plans** - Planos de desenvolvimento

---

## 🆕 Features Novas Recomendadas

### 1. **Gestão de Licenças e Férias** (Frappe HRMS)
**Prioridade: ALTA**

**O que adicionar:**
- Modelo de dados para tipos de licença (férias, licença médica, pessoal, etc.)
- Sistema de solicitação e aprovação de licenças
- Cálculo automático de saldo de férias
- Políticas de licença configuráveis por departamento/cargo
- Calendário de licenças da equipe
- Relatórios de absenteísmo

**Benefícios:**
- Controle completo do ciclo de férias
- Redução de erros manuais
- Visibilidade para gestores sobre disponibilidade da equipe

**Estrutura sugerida:**
```prisma
model LeaveType {
  id          String   @id @default(uuid())
  name        String
  code        String   @unique
  maxDays     Int?
  carryForward Boolean @default(false)
  requiresApproval Boolean @default(true)
  leavePolicy LeavePolicy[]
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

model LeaveRequest {
  id          String   @id @default(uuid())
  employeeId String
  leaveTypeId String
  startDate   DateTime
  endDate     DateTime
  days        Float
  reason      String?
  status      LeaveStatus
  approverId  String?
  approvedAt  DateTime?
  rejectedReason String?
  employee   Employee @relation(fields: [employeeId], references: [id])
  leaveType   LeaveType @relation(fields: [leaveTypeId], references: [id])
  approver    Employee? @relation(fields: [approverId], references: [id])
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

enum LeaveStatus {
  PENDING
  APPROVED
  REJECTED
  CANCELLED
}
```

---

### 2. **Controle de Presença/Attendance** (Frappe HRMS)
**Prioridade: ALTA**

**O que adicionar:**
- Registro de entrada/saída
- Integração com geolocalização (opcional)
- Horários de trabalho configuráveis
- Controle de horas extras
- Relatórios de presença
- Alertas de atrasos/ausências

**Benefícios:**
- Rastreamento preciso de horas trabalhadas
- Base para cálculo de folha de pagamento
- Identificação de padrões de absenteísmo

**Estrutura sugerida:**
```prisma
model Attendance {
  id          String   @id @default(uuid())
  employeeId String
  date        DateTime
  checkIn     DateTime?
  checkOut    DateTime?
  workHours   Float?
  status      AttendanceStatus
  location    Json?
  notes       String?
  employee    Employee @relation(fields: [employeeId], references: [id])
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  @@unique([employeeId, date])
}

enum AttendanceStatus {
  PRESENT
  ABSENT
  LATE
  HALF_DAY
  ON_LEAVE
}
```

---

### 3. **Folha de Pagamento** (Frappe HRMS)
**Prioridade: MÉDIA**

**O que adicionar:**
- Estrutura salarial por cargo
- Componentes de pagamento (salário base, bônus, comissões)
- Deduções (impostos, benefícios, descontos)
- Processamento de folha mensal
- Geração de contracheques
- Histórico de pagamentos
- Integração com sistemas contábeis

**Benefícios:**
- Automação completa do processo de folha
- Redução de erros
- Conformidade fiscal

**Estrutura sugerida:**
```prisma
model SalaryStructure {
  id          String   @id @default(uuid())
  positionId String
  baseSalary  Float
  components  Json
  effectiveFrom DateTime
  effectiveTo   DateTime?
  position      Position @relation(fields: [positionId], references: [id])
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
}

model PayrollEntry {
  id          String   @id @default(uuid())
  employeeId String
  payPeriod   DateTime
  grossSalary Float
  deductions  Json
  netSalary   Float
  status      PayrollStatus
  payslipUrl  String?
  employee    Employee @relation(fields: [employeeId], references: [id])
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

enum PayrollStatus {
  DRAFT
  SUBMITTED
  PAID
}
```

---

### 4. **Portal de Autoatendimento do Funcionário** (Frappe HRMS)
**Prioridade: ALTA**

**O que adicionar:**
- Dashboard pessoal do funcionário
- Atualização de dados pessoais
- Visualização de contracheques
- Solicitação de licenças
- Histórico de treinamentos
- Metas pessoais
- Documentos pessoais

**Benefícios:**
- Redução de carga no RH
- Empoderamento dos funcionários
- Melhor experiência do usuário

**Endpoints sugeridos:**
```
GET /employee/me/profile
PATCH /employee/me/profile
GET /employee/me/payslips
GET /employee/me/leaves
POST /employee/me/leave-requests
GET /employee/me/documents
GET /employee/me/trainings
GET /employee/me/goals
```

---

### 5. **Sistema de Recrutamento/ATS** (Minthcm, Frappe HRMS)
**Prioridade: MÉDIA**

**O que adicionar:**
- Gestão de vagas
- Pipeline de recrutamento
- Candidatos e currículos
- Entrevistas agendadas
- Avaliação de candidatos
- Ofertas de emprego
- Integração com job boards

**Benefícios:**
- Processo de recrutamento estruturado
- Rastreamento completo do ciclo de contratação
- Melhor matching candidato-vaga

**Estrutura sugerida:**
```prisma
model JobOpening {
  id          String   @id @default(uuid())
  title       String
  departmentId String
  positionId  String
  description String
  requirements String[]
  status      JobStatus
  openDate    DateTime
  closeDate   DateTime?
  department  Department @relation(fields: [departmentId], references: [id])
  position    Position @relation(fields: [positionId], references: [id])
  applications JobApplication[]
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

model JobApplication {
  id          String   @id @default(uuid())
  jobOpeningId String
  candidateName String
  email       String
  resumeUrl   String?
  status      ApplicationStatus
  stage       ApplicationStage
  jobOpening  JobOpening @relation(fields: [jobOpeningId], references: [id])
  interviews  Interview[]
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

enum JobStatus {
  DRAFT
  OPEN
  CLOSED
  CANCELLED
}

enum ApplicationStatus {
  APPLIED
  SCREENING
  INTERVIEW
  OFFER
  HIRED
  REJECTED
  WITHDRAWN
}
```

---

### 6. **Gestão de Eventos** (Admidio)
**Prioridade: BAIXA**

**O que adicionar:**
- Criação de eventos corporativos
- Inscrições de participantes
- Gestão de participantes
- Lembretes automáticos
- Feedback pós-evento

**Benefícios:**
- Organização de eventos corporativos
- Engajamento dos funcionários

---

### 7. **Galeria de Fotos/Media** (Admidio)
**Prioridade: BAIXA**

**O que adicionar:**
- Upload de fotos de eventos
- Álbuns organizados por departamento/evento
- Compartilhamento de mídia
- E-cards

**Benefícios:**
- Memória visual da organização
- Engajamento e cultura organizacional

---

### 8. **Relacionamentos Familiares** (Admidio)
**Prioridade: BAIXA**

**O que adicionar:**
- Cadastro de dependentes
- Relacionamentos (cônjuge, filhos, etc.)
- Benefícios para dependentes
- Contatos de emergência

**Benefícios:**
- Gestão completa de informações familiares
- Base para benefícios

**Estrutura sugerida:**
```prisma
model FamilyMember {
  id          String   @id @default(uuid())
  employeeId String
  name       String
  relationship RelationshipType
  dateOfBirth DateTime?
  isDependent Boolean @default(false)
  employee   Employee @relation(fields: [employeeId], references: [id])
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

enum RelationshipType {
  SPOUSE
  CHILD
  PARENT
  SIBLING
  OTHER
}
```

---

### 9. **Gestão de Documentos** (Frappe HRMS)
**Prioridade: MÉDIA**

**O que adicionar:**
- Upload e armazenamento de documentos
- Categorização de documentos
- Controle de versão
- Compartilhamento seguro
- Expiração de documentos (certificados, etc.)

**Benefícios:**
- Centralização de documentos
- Conformidade e auditoria
- Acesso fácil aos documentos

**Estrutura sugerida:**
```prisma
model Document {
  id          String   @id @default(uuid())
  employeeId String?
  title       String
  type        DocumentType
  fileUrl     String
  category    String
  expiresAt   DateTime?
  isPublic    Boolean @default(false)
  employee    Employee? @relation(fields: [employeeId], references: [id])
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

enum DocumentType {
  CONTRACT
  CERTIFICATE
  IDENTIFICATION
  MEDICAL
  TRAINING
  OTHER
}
```

---

### 10. **Análise Preditiva com IA** (Minthcm)
**Prioridade: MÉDIA**

**O que adicionar:**
- Previsão de turnover
- Identificação de risco de desligamento
- Recomendações de desenvolvimento baseadas em IA
- Análise de sentimento em feedbacks
- Matching inteligente de candidatos

**Benefícios:**
- Insights proativos
- Prevenção de perda de talentos
- Otimização de processos

**Melhorias no Chatbot existente:**
- Análise mais profunda de performance
- Recomendações personalizadas
- Previsões baseadas em histórico

---

## 🔧 Melhorias nas Features Existentes

### 1. **Sistema de Permissões e Roles** (Admidio)
**Melhoria sugerida:**
- Implementar sistema de permissões mais granular
- Permissões baseadas em recursos específicos
- Herança de permissões por hierarquia
- Auditoria de acesso

**Código atual:** Já existe `UserRole` enum, mas pode ser expandido

---

### 2. **Exportação de Dados** (Admidio, Frappe HRMS)
**Melhoria sugerida:**
- Exportação para CSV, Excel, PDF
- Templates customizáveis
- Agendamento de relatórios
- API para integrações

**Código atual:** Não implementado

---

### 3. **Sistema de Notificações** (Melhoria)
**Melhoria sugerida:**
- Notificações em tempo real (WebSocket)
- Preferências granulares por tipo
- Histórico completo de notificações
- Integração com email/SMS/Slack

**Código atual:** Já existe, mas pode ser expandido

---

### 4. **Dashboard e Relatórios** (Frappe HRMS)
**Melhoria sugerida:**
- Dashboards customizáveis
- Widgets configuráveis
- Relatórios agendados
- Visualizações gráficas avançadas

**Código atual:** Existe analytics básico, pode ser expandido

---

### 5. **Workflow de Aprovação** (Frappe HRMS)
**Melhoria sugerida:**
- Workflows configuráveis
- Múltiplos aprovadores
- Escalonamento automático
- Histórico de aprovações

**Código atual:** Aprovações simples, pode ser mais robusto

---

### 6. **Integração com Sistemas Externos** (Frappe HRMS)
**Melhoria sugerida:**
- API webhooks
- Integração com sistemas de ponto
- Integração com sistemas contábeis
- SSO (Single Sign-On)

**Código atual:** Não implementado

---

### 7. **Mobile App/API Mobile** (Frappe HRMS)
**Melhoria sugerida:**
- Endpoints otimizados para mobile
- Push notifications
- Check-in/check-out mobile
- Acesso offline básico

**Código atual:** API REST existe, mas pode ser otimizada para mobile

---

### 8. **Multi-tenancy** (Frappe HRMS)
**Melhoria sugerida:**
- Suporte a múltiplas organizações
- Isolamento de dados
- Configurações por organização

**Código atual:** Não implementado

---

## 📋 Priorização de Implementação

### Fase 1 - Essencial (3-6 meses)
1. ✅ Gestão de Licenças e Férias
2. ✅ Controle de Presença/Attendance
3. ✅ Portal de Autoatendimento do Funcionário

### Fase 2 - Importante (6-12 meses)
4. ✅ Folha de Pagamento
5. ✅ Sistema de Recrutamento/ATS
6. ✅ Gestão de Documentos
7. ✅ Melhorias no Sistema de Permissões

### Fase 3 - Desejável (12+ meses)
8. ✅ Análise Preditiva com IA
9. ✅ Gestão de Eventos
10. ✅ Relacionamentos Familiares
11. ✅ Galeria de Fotos
12. ✅ Multi-tenancy

---

## 🎯 Recomendações Finais

### Features de Alto Impacto:
1. **Gestão de Licenças** - Necessidade básica de qualquer RH
2. **Controle de Presença** - Base para folha e analytics
3. **Portal de Autoatendimento** - Reduz carga operacional do RH

### Melhorias de Alto Impacto:
1. **Sistema de Permissões Granular** - Segurança e flexibilidade
2. **Exportação de Dados** - Necessidade comum dos usuários
3. **Workflows de Aprovação** - Automação de processos

### Considerações Técnicas:
- Todas as novas features devem seguir a arquitetura atual (NestJS + Prisma)
- Manter compatibilidade com GraphQL e REST
- Implementar testes para novas features
- Documentar APIs no Swagger

---

## 📚 Referências

- [Admidio GitHub](https://github.com/Admidio/admidio)
- [Minthcm GitHub](https://github.com/minthcm/minthcm)
- [Frappe HRMS Documentation](https://docs.frappe.io/hr/introduction)

---

**Última atualização:** 2024-01-XX
**Autor:** Análise comparativa de sistemas HR

