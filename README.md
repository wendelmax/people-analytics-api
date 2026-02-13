# People Analytics API (.NET 10)

Backend da API People Analytics em ASP.NET Core 10. Usa o mesmo banco PostgreSQL do backend Node (Prisma); as tabelas e colunas seguem o schema existente.

## Cobertura para o frontend

Implementado e compativel com o frontend (mesmos paths e formato de resposta):

| Recurso | Endpoints | Observacao |
|---------|-----------|------------|
| Health | GET /api/health | |
| Auth | POST /api/auth/login | Retorna accessToken, token, user (id, email, name, role) |
| Departments | GET, GET/:id, POST, PATCH, DELETE /api/departments | |
| Projects | GET, GET/:id, POST, PATCH, DELETE /api/projects | |
| Notifications | GET, GET/:id, POST, PATCH, DELETE, PATCH/:id/read, GET user/:userId/unread | |
| Employee | GET, GET/:id, POST, PATCH, DELETE /api/employee | |

O frontend usa ainda outros modulos que nesta API .NET nao existem (retornarao 404 se chamados sem mock): positions, skills, skill-proficiency, analytics, insights, chatbot, settings/ai-provider, leaves, attendance, benefits, payroll, recruitment, etc. Para usar essas telas com a API .NET, mantenha `VITE_USE_MOCK=true` para os mocks ou implemente os endpoints faltantes.

## Endpoints (resumo)

- `GET /api/health` - Health check
- `POST /api/auth/login` - Login (email, password) retorna accessToken e user
- `GET|POST|PATCH|DELETE /api/departments` e `GET /api/departments/:id`
- `GET|POST|PATCH|DELETE /api/projects` e `GET /api/projects/:id`
- `GET|POST|PATCH|DELETE /api/notifications`, `GET /api/notifications/user/:userId/unread`, `PATCH /api/notifications/:id/read`
- `GET|POST|PATCH|DELETE /api/employee` e `GET /api/employee/:id`

## Executar local

Requer .NET 10 SDK e PostgreSQL (ou use o compose apenas do postgres).

```bash
dotnet run
```

Variaveis de ambiente opcionais: `ConnectionStrings__DefaultConnection`, `JWT_SECRET`, `PORT` (default 3000).

## Executar com Docker

Na raiz do monorepo (pasta people-analytics):

```bash
podman compose up -d
```

O servico `api` sobe na porta 3000. O frontend (`web`) aponta para `http://localhost:3000/api`.
