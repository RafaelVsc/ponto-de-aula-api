# Tech Challenge Fase 2 – API de Posts

API em Node.js + TypeScript com Express, organizada em Clean Architecture. Inclui CRUD de posts, filtros, paginação e ordenação. Estrutura pronta para evoluir com autenticação, RBAC, testes e CI/CD.

## Como rodar

- Requisitos: Node 18+.
- Desenvolvimento: `npm run dev` (inicia com ts-node-dev)
- Build: `npm run build` (gera `dist/`)
- Produção: `npm start` (executa `dist/main/server.js`)

Endpoints básicos:

- `GET /health` – health check
- `GET /` – mensagem de boas-vindas
- `POST /posts` – cria post
- `GET /posts` – lista ou busca (query: `search`, `tag`, `authorId`, `page`, `limit`, `sortBy=title|createdAt`, `sortOrder=asc|desc`)
- `GET /posts/:id` – detalha
- `PATCH /posts/:id` – atualiza
- `DELETE /posts/:id` – remove

## Estrutura (Clean Architecture)

- `src/domain` – Entidades e contratos do domínio (ex.: `Post`, `PostRepository`).
- `src/application` – Casos de uso (regras de negócio), orquestram repositórios e entidades.
- `src/infrastructure` – Implementações técnicas (ex.: `InMemoryPostRepository`).
- `src/interfaces` – Adaptadores de interface (HTTP controllers, rotas, middlewares).
- `src/main` – Composição da aplicação (wiring de dependências, servidor Express).
- `src/shared` – Utilitários e tipos compartilhados (ex.: `AppError`).

Responsabilidades chave:

- Controllers não possuem regra de negócio; apenas validam entrada mínima, chamam casos de uso e traduzem respostas/erros.
- Use cases contêm a regra de negócio e lidam com erros de domínio (ex.: `AppError` com `statusCode`).
- Repositórios implementam persistência. Por padrão, está usando memória (`InMemoryPostRepository`).

## Qualidade de código

ESLint + Prettier configurados (TypeScript) e scripts úteis:

- `npm run lint` – analisa o código
- `npm run lint:fix` – corrige problemas auto-fixáveis
- `npm run format` – formata com Prettier
- `npm run format:check` – verifica formatação

Observação: é necessário `npm install` para instalar ESLint/Prettier e suas dependências antes de rodar os scripts de lint/format.

## Próximos passos sugeridos

- Persistência real (SQL/NoSQL via Prisma ou outro ORM).
- Autenticação JWT e RBAC (ALUNO, PROFESSOR, SECRETARIA, ADMIN).
- Validação com Zod nos DTOs de entrada.
- Testes (Jest + Supertest) com cobertura mínima de 20%.
- Documentação Swagger/OpenAPI.
- Pipeline CI (GitHub Actions) para lint, testes e build.
