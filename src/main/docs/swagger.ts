import authDocs from './auth.docs';
import usersDocs from './users.docs';
import postsDocs from './posts.docs';
import generalDocs from './general.docs';

export const swaggerDocument = {
  openapi: '3.0.3',
  info: {
    title: 'API - Ponto de Aula',
    version: '1.0.0',
    description: 'Documentação da API do projeto Ponto de Aula',
    contact: {
      name: 'Equipe Ponto de Aula',
      email: 'contato@pontodeaula.com',
    },
  },
  servers: [
    {
      url: 'http://localhost:3000',
      description: 'Servidor local',
    },
  ],
  tags: [
    { name: 'Auth', description: 'Autenticação e login/logout' },
    { name: 'Users', description: 'Gerenciamento de usuários e perfis' },
    { name: 'Posts', description: 'Conteúdos e postagens' },
    { name: 'System', description: 'Saúde da API e diagnósticos' },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
    // 👇 AQUI ESTÃO OS SCHEMAS REFERENCIADOS
    schemas: {
      LoginRequest: {
        type: 'object',
        required: ['password'],
        oneOf: [{ required: ['email'] }, { required: ['username'] }],
        properties: {
          email: { type: 'string', format: 'email', example: 'admin@pontoaula.com' },
          username: { type: 'string', example: 'admin' },
          password: { type: 'string', format: 'password', example: '123456' },
        },
      },
      User: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid', example: '2ae6233a-91db-4916-9529-ab2857e18499' },
          name: { type: 'string', example: 'Seed Admin' },
          email: { type: 'string', example: 'admin@pontoaula.com' },
          username: { type: 'string', example: 'admin' },
          role: {
            type: 'string',
            enum: ['ADMIN', 'SECRETARY', 'TEACHER', 'STUDENT'],
            example: 'ADMIN',
          },
        },
      },
      Post: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid', example: 'a1b2c3d4-e5f6-7890-abcd-1234567890ab' },
          title: { type: 'string', example: 'Título do post' },
          content: { type: 'string', example: 'Conteúdo do post' },
          authorId: {
            type: 'string',
            format: 'uuid',
            example: '2ae6233a-91db-4916-9529-ab2857e18499',
          },
          author: { type: 'string', example: 'Nome do Autor' },
          tags: { type: 'array', items: { type: 'string' }, example: ['nodejs', 'javascript'] },
          createdAt: { type: 'string', format: 'date-time', example: '2025-10-12T10:00:00Z' },
          updatedAt: { type: 'string', format: 'date-time', example: '2025-10-12T12:00:00Z' },
        },
      },
      CreatePostRequest: {
        type: 'object',
        required: ['title', 'content'],
        properties: {
          title: { type: 'string', example: 'Introdução ao TypeScript' },
          content: {
            type: 'string',
            example: 'Neste post vamos explorar os fundamentos do TypeScript...',
          },
          tags: {
            type: 'array',
            items: { type: 'string' },
            example: ['typescript', 'javascript', 'backend'],
          },
          imageUrl: { type: 'string', format: 'uri', example: 'https://example.com/image.png' },
          videoUrl: { type: 'string', format: 'uri', example: 'https://youtube.com/watch?v=123' },
        },
      },
      UpdatePostRequest: {
        type: 'object',
        required: ['title', 'content'],
        properties: {
          title: { type: 'string', example: 'Novo título do post' },
          content: { type: 'string', example: 'Conteúdo atualizado do post' },
        },
      },
      CreateUserRequest: {
        type: 'object',
        required: ['name', 'email', 'password', 'role'],
        properties: {
          name: { type: 'string', example: 'João da Silva' },
          email: { type: 'string', example: 'joao@pontoaula.com' },
          username: { type: 'string', example: 'joaosilva' },
          password: { type: 'string', example: '123456' },
          role: {
            type: 'string',
            enum: ['ADMIN', 'SECRETARY', 'TEACHER', 'STUDENT'],
            example: 'STUDENT',
          },
        },
      },
      ErrorResponse: {
        type: 'object',
        properties: {
          error: {
            type: 'object',
            properties: {
              message: { type: 'string', example: 'Erro de validação' },
              details: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    path: { type: 'array', items: { type: 'string' } },
                    message: { type: 'string' },
                  },
                },
                example: [{ path: ['email'], message: 'Email inválido' }],
              },
            },
          },
        },
      },
    },
  },
  security: [{ bearerAuth: [] }],
  paths: {
    ...authDocs,
    ...usersDocs,
    ...postsDocs,
    ...generalDocs,
  },
};
