export default {
  '/auth/login': {
    post: {
      tags: ['Auth'],
      summary: 'User login (email or username)',
      description:
        'Authenticates a user using email **or** username and password, returning a JWT bearer token on success.',
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/LoginRequest',
            },
            example: {
              // Example: login with email
              email: 'admin@pontodeaula.com',
              password: '12345678',
            },
            // You can add a second example for username login if needed
          },
        },
      },
      responses: {
        '200': {
          description: 'Login successful. Returns a JWT token.',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  status: { type: 'string', example: 'success' },
                  message: { type: 'string', example: 'Login' },
                  data: {
                    type: 'object',
                    properties: {
                      token: { type: 'string', description: 'JWT access token' },
                    },
                  },
                },
              },
              example: {
                status: 'success',
                message: 'Login',
                data: {
                  token: 'eyJhbGciOiJI... (JWT token here)',
                },
              },
            },
          },
        },
        '400': {
          description: 'Bad Request – missing email/username or validation failed',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ErrorResponse' },
              example: {
                error: {
                  message: 'Email or Username is required',
                  details: [
                    { path: ['email', 'username'], message: 'Email or Username is required' },
                  ],
                },
              },
            },
          },
        },
        '401': {
          description: 'Unauthorized – invalid credentials',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ErrorResponse' },
              example: {
                error: { message: 'Invalid credentials' },
              },
            },
          },
        },
      },
    },
  },
};
