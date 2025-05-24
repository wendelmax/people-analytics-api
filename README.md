# People Analytics API

API para análise de dados de pessoas e recursos humanos, fornecendo insights sobre performance, desenvolvimento e engajamento dos colaboradores.

## Tecnologias Utilizadas

- NestJS
- Prisma
- PostgreSQL
- GraphQL
- Swagger/OpenAPI
- TypeScript

## Pré-requisitos

- Node.js (v18 ou superior)
- PostgreSQL
- npm ou yarn

## Instalação

1. Clone o repositório:
```bash
git clone [URL_DO_REPOSITÓRIO]
```

2. Instale as dependências:
```bash
npm install
```

3. Configure as variáveis de ambiente:
```bash
cp .env.example .env
```
Edite o arquivo `.env` com suas configurações.

4. Execute as migrações do banco de dados:
```bash
npx prisma migrate dev
```

## Executando a Aplicação

### Desenvolvimento
```bash
npm run start:dev
```

### Produção
```bash
npm run build
npm run start:prod
```

## Documentação da API

### Swagger UI
A documentação interativa da API REST está disponível em:
```
http://localhost:3000/api
```

### GraphQL Playground
O playground do GraphQL está disponível em:
```
http://localhost:3000/graphql
```

## Estrutura do Projeto

```
src/
├── application/          # Camada de aplicação (controllers, resolvers, DTOs)
├── core/                 # Camada de domínio (entities, services)
├── infrastructure/       # Camada de infraestrutura (database, external services)
└── main.ts              # Ponto de entrada da aplicação
```

## Testes

```bash
# Testes unitários
npm run test

# Testes e2e
npm run test:e2e

# Cobertura de testes
npm run test:cov
```

## Linting e Formatação

```bash
# Linting
npm run lint

# Formatação
npm run format
```

## Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`)
3. Faça commit das suas alterações (`git commit -m 'Adiciona nova feature'`)
4. Faça push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

## Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.
