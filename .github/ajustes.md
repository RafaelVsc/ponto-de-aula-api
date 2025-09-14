**WARNING**
- Antes de proseguir, analise se realmente faz sentido, abaixo são sugestões elaboradas pelo codex no exec anterior

**TypeScript (melhores práticas)**
- Ajustes sugeridos no `tsconfig.json`:
  - `target`: `es2022` e `lib`: `["es2022"]` para APIs modernas.
  - `moduleResolution`: `node16` ou `node` (mantendo `commonjs`).
  - Habilitar: `noImplicitReturns`, `noUnusedLocals`, `noUnusedParameters` (gradual, para não travar dev).
  - Desabilitar `declaration` para app (gera `.d.ts` desnecessário em app).
  - Faça isso aqui: `baseUrl: "src"` e `paths` (se quiser alias como `@/application/...`).
- Scripts:
  - Se usar alias, adicionar `--require tsconfig-paths/register` ao `dev` (para `ts-node-dev`).
  - Manter `build` com `tsc` e `start` com `node dist/index.js`.


**Correções/Pequenos Ajustes Imediatos**
- Corrigir `GET /posts` na rota para chamar método válido.
- Implementar `update` e melhorar `create` no `InMemoryPostRepository` (definir `createdAt/updatedAt`, gerar `id` consistente).
- Adicionar `ListPostsUseCase` ao controller ou criar `PostsController` com handlers: `create`, `list`, `getById`, `search`, `update`, `delete`.
- Adicionar middleware de erro simples e mover bootstrap para `main/`.

**CODEX**
- Definir os próximos passos, seguindo a arquitetura proposta e as boas práticas com ts e express.