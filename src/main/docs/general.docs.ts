export default {
  '/health': {
    get: {
      tags: ['System'],
      summary: 'Health check',
      description: 'Returns a simple status message to indicate that the API is running.',
      responses: {
        '200': {
          description: 'OK. API is healthy.',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: { status: { type: 'string' } },
              },
              example: { status: 'ok' },
            },
          },
        },
      },
    },
  },
  '/': {
    get: {
      tags: ['System'],
      summary: 'API welcome',
      description: 'Root endpoint with a welcome message for the API.',
      responses: {
        '200': {
          description: 'OK. Welcome message returned.',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: { message: { type: 'string' } },
              },
              example: { message: 'API Tech Challenge Fase 2 - FIAP' },
            },
          },
        },
      },
    },
  },
};
