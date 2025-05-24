# People Analytics API

API GraphQL para gerenciamento de pessoas e competências.

## Tecnologias

- NestJS
- GraphQL
- Prisma
- PostgreSQL
- TypeScript

## Requisitos

- Node.js 18+
- PostgreSQL 14+

## Instalação

1. Clone o repositório
2. Instale as dependências:
```bash
npm install
```

3. Configure as variáveis de ambiente:
```bash
cp .env.example .env
```

4. Execute as migrações do banco de dados:
```bash
npx prisma migrate dev
```

5. Inicie o servidor de desenvolvimento:
```bash
npm run start:dev
```

## Estrutura do Projeto

```
src/
├── application/          # Camada de aplicação
│   └── graphql/         # Configuração do GraphQL
│       ├── inputs/      # Inputs do GraphQL
│       ├── modules/     # Módulos do GraphQL
│       ├── resolvers/   # Resolvers do GraphQL
│       └── types/       # Tipos do GraphQL
├── core/                # Camada de domínio
│   └── domain/         # Entidades e regras de negócio
│       └── services/   # Serviços de domínio
└── infrastructure/      # Camada de infraestrutura
    └── database/       # Configuração do banco de dados
```

## Funcionalidades

- Gerenciamento de funcionários
- Gerenciamento de posições
- Gerenciamento de departamentos
- Gerenciamento de habilidades
- Avaliação de competências
- Recomendações de desenvolvimento
- Histórico de jornada do funcionário

## API GraphQL

A API GraphQL está disponível em `http://localhost:3000/graphql`.

### Exemplos de Queries

```graphql
# Buscar todos os funcionários
query {
  employees {
    id
    name
    email
    position {
      name
    }
    department {
      name
    }
  }
}

# Buscar funcionário por ID
query {
  employee(id: "1") {
    id
    name
    email
    position {
      name
    }
    department {
      name
    }
    skills {
      name
      level
    }
  }
}
```

### Exemplos de Mutations

```graphql
# Criar funcionário
mutation {
  createEmployee(createEmployeeInput: {
    name: "John Doe"
    email: "john@example.com"
    positionId: "1"
    departmentId: "1"
  }) {
    id
    name
    email
  }
}

# Atualizar funcionário
mutation {
  updateEmployee(
    id: "1"
    updateEmployeeInput: {
      name: "John Doe Updated"
    }
  ) {
    id
    name
    email
  }
}
```

## Licença

Este projeto está licenciado sob a licença MIT.
