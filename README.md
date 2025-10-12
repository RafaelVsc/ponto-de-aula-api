# Tech Challenge Fase 2 – API de Posts

API em Node.js + TypeScript (Express 5) organizada em Clean Architecture, com persistência via Prisma (PostgreSQL), validação com Zod e autenticação JWT. Inclui CRUD de posts com filtros, paginação e ordenação, além de endpoints de usuários.

## Stack

- Node 22+, TypeScript, Express 5
- Prisma ORM (PostgreSQL)
- Zod para validação
- JWT (jsonwebtoken) + bcrypt
- tsx (dev), tsup (build), ESLint + Prettier

## Requisitos

- Node 22+
- Docker + Docker Compose (recomendado para subir o Postgres)
- NPM

## Início Rápido (desenvolvimento)

1. Instalar dependências

- `npm install`

2. Criar arquivo de ambiente a partir do exemplo

- `cp .env.example .env`

3. Subir banco Postgres com Docker

- `docker-compose up -d`

4. Configurar o banco (migrations, generate, seed)

- `npx prisma migrate dev` (cria/aplica migrations no ambiente local)
- `npx prisma db seed` (cria usuários e posts iniciais)

5. Rodar a API

- `npm run dev` (porta padrão: `3000` via `PORT` opcional)

6. Health check

- `curl http://localhost:3000/health`

Credenciais de seed (senha: `12345678`):

- Admin: `admin@pontodeaula.com`
- Teacher: `teacher@pontodeaula.com`
- Student: `student@pontodeaula.com`
- Secretary: `secretary@pontodeaula.com`

Nota sobre testes: em `NODE_ENV=test`, os repositórios "in-memory" são usados por padrão e incluem seeds com emails `@example.com` (ex.: `admin@example.com`). Em desenvolvimento/produção (Prisma), as credenciais de seed são as `@pontodeaula.com` acima.

Observações:

- Em desenvolvimento, o JWT usa um segredo de fallback interno. Em produção é obrigatório definir `JWT_SECRET`.
- O arquivo `.env` já possui variáveis padrão para Postgres local. Ajuste conforme necessário.

## Variáveis de Ambiente (.env)

- `DATABASE_URL` – URL do Postgres (já montada a partir de `DATABASE_*` no `.env`).
- `DATABASE_USER`, `DATABASE_PASSWORD`, `DATABASE_NAME`, `DATABASE_PORT` – usados pelo `docker-compose.yml`.
- `JWT_SECRET` – exigido em produção. Em desenvolvimento/teste o serviço usa um fallback interno.
- `JWT_EXPIRES_IN` – expiração do token (padrão `15m`).
- `SALT_ROUNDS` – custo do bcrypt no seed (padrão `10`).

## Scripts

- `npm run dev` – inicia com tsx (NODE_ENV=development)
- `npm run build` – gera `dist/` com tsup
- `npm start` – executa `dist/main/server.js` (NODE_ENV=production, lê `.env`)
- `npm run lint` / `npm run lint:fix` – lint
- `npm run format` / `npm run format:check` – formatação com Prettier

## Endpoints

Base: `http://localhost:3000`

Geral

- `GET /health` – health check
- `GET /` – mensagem de boas-vindas

Autenticação

- `POST /auth/login` – body: `{ email? | username?, password }`. Retorna `{ token }`.
  - Use `Authorization: Bearer <token>` nas rotas autenticadas.

Users (todas sob autenticação; autorizações por rota)

- `POST /users` – cria usuário (ADMIN, SECRETARY)
  - body: `{ name, email, username, password, role }`
  - Observação: nesta branch (Prisma), `username` é obrigatório no banco e deve ser informado na criação.
- `GET /users` – lista (ADMIN, SECRETARY)
- `GET /users/me` – dados do usuário autenticado
- `PUT /users/me/password` – troca de senha
  - body: `{ currentPassword, newPassword }` (mín. 8 chars; devem ser diferentes)
- `PATCH /users/me` – atualiza o próprio perfil (name/email)
- `GET /users/:id` – busca por id (ADMIN, SECRETARY)
- `PATCH /users/:id` – atualiza por id (ADMIN)
- `DELETE /users/:id` – remove por id (ADMIN)

Posts (todas sob autenticação; autorizações por rota)

- `POST /posts` – cria post (ADMIN, SECRETARY, TEACHER)
  - body: `{ title, content, videoUrl?, imageUrl?, tags?[] }`
- `GET /posts` – lista/busca com paginação e ordenação
  - query: `search?`, `tag?`, `authorId?`, `page=1`, `limit=20`, `sortBy=createdAt|title`, `sortOrder=asc|desc`
- `GET /posts/search` – alias de busca (mesmo handler de `/posts` com query)
- `GET /posts/mine` – posts do usuário logado (ADMIN, SECRETARY, TEACHER)
- `GET /posts/:id` – detalha por id
- `PUT /posts/:id` – atualiza post (ADMIN, SECRETARY, TEACHER)
  - body parcial: `{ title?, content?, videoUrl?|'', imageUrl?|'', tags?[] }`
  - Observação: a regra atual permite atualização apenas pelo autor do post (admin/secretaria não substituem o autor neste ponto).
- `DELETE /posts/:id` – remove post (admin ou autor do post)

## Exemplo de uso (cURL)

- Login (admin):
  - `curl -X POST http://localhost:3000/auth/login -H "Content-Type: application/json" -d '{"email":"admin@pontodeaula.com","password":"12345678"}'`

- Listar posts (com token):
  - `curl http://localhost:3000/posts -H "Authorization: Bearer <TOKEN>"`

## Banco de Dados (Prisma)

- Aplicar migrations (dev): `npx prisma migrate dev`
- Gerar client: `npx prisma generate` (já executado pelo `migrate dev`)
- Seed: `npx prisma db seed`
- Inspecionar dados: `npx prisma studio`

Produção/staging:

- Use `npx prisma migrate deploy` para aplicar migrations existentes.
- Garanta `JWT_SECRET` definido e banco acessível via `DATABASE_URL`.

## Estrutura (Clean Architecture)

- `src/domain` – Entidades e contratos do domínio.
- `src/application` – Casos de uso e mapeadores/serviços de aplicação.
- `src/infrastructure` – Prisma Client, repositórios Prisma e serviços (JWT/bcrypt).
- `src/interfaces` – HTTP controllers, middlewares, validações e rotas.
- `src/main` – Composição da aplicação (instância única de Prisma + módulos).
- `src/shared` – Erros e utilitários comuns.

Responsabilidades chave:

- Controllers validam entrada e orquestram casos de uso; sem regra de negócio.
- Use cases contêm a regra e retornam DTOs ou lançam `AppError` com status.
- Repositórios Prisma realizam persistência; esta branch utiliza Prisma por padrão.

## Arquitetura

- Estilo: Clean Architecture com Ports & Adapters (Hexagonal).
- Camadas: `src/domain` (entidades e portas), `src/application` (use cases e serviços de aplicação), `src/infrastructure` (adapters de banco/segurança), `src/interfaces` (HTTP), `src/main` (composition root).
- Portas (contracts): `UserRepository`, `PostRepository`, `PasswordHasher`, `TokenService` — os casos de uso dependem apenas dessas interfaces.
- Adaptadores: `PrismaUserRepository`, `PrismaPostRepository`, `JwtService`, `BcryptHasher` — implementam as portas na infraestrutura.
- Composição: `src/main/app.ts` instancia e injeta dependências, compartilhando singletons (Prisma Client, JWT).
- Drivers: Prisma é o driver padrão nesta branch; um driver in-memory pode ser plugado em testes (futuro `DATA_DRIVER`).
- Benefícios: baixo acoplamento, testabilidade, facilidade de trocar infraestrutura sem afetar regras de negócio.

## Observações & Dicas

- Se o `docker-compose` reportar healthcheck falho, confirme as variáveis `POSTGRES_*` do `.env`.
- Erros de unicidade do Prisma (ex.: `email`/`username` duplicados) retornam erro de negócio na criação de usuário.
- Para mudar a porta da API, defina `PORT` no ambiente.

## Execução com Docker (dois modos)

- Desenvolvimento local (hot reload + DB no Docker)
  - `docker compose up -d` (sobe apenas o Postgres)
  - Primeira vez (ou após reset do volume): `npx prisma migrate dev` e `npx prisma db seed`
  - Inicie a API local: `npm run dev`

- Stack completa (Docker: postgres + migrate + api)
  - Subir tudo com auto-migrate/seed: `docker compose --profile app up -d --build`
  - Health: `curl http://localhost:3000/health`
  - Login seed: `POST /auth/login` com `{ "email": "admin@pontodeaula.com", "password": "12345678" }`

### Dicas Docker
- Atualizar código na API em container: `docker compose up -d --build --no-deps api`
- Alterou apenas variáveis de ambiente: `docker compose up -d --force-recreate api`
- Derrubar (sem perder dados):
  - Sem profile: `docker compose down --remove-orphans`
  - Com profile: `docker compose --profile app down --remove-orphans`
- Reset total (apaga dados): `docker compose down --volumes --remove-orphans`