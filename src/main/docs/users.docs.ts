export default {
  '/users/': {
    post: {
      tags: ['Users'],
      summary: 'Create a new user',
      description:
        '**Access:** Only **ADMIN** and **SECRETARY** can create new users:contentReference[oaicite:1]{index=1}.\n\n' +
        '**Important Rules:**\n' +
        '- SECRETARY can only create users with role **STUDENT** or **TEACHER**:contentReference[oaicite:2]{index=2}.\n' +
        '- Email and username must be unique (error if already registered).\n' +
        '- The new user’s credentials are set in the request body; no email verification is needed.',
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/CreateUserRequest' },
            example: {
              name: 'John Doe',
              email: 'john.doe@school.com',
              username: 'johndoe2025',
              password: 'secret123',
              role: 'TEACHER',
            },
          },
        },
      },
      responses: {
        '201': {
          description: 'User created successfully.',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  data: { $ref: '#/components/schemas/User' },
                },
              },
              example: {
                data: {
                  id: 'd290f1ee-6c54-4b01-90e6-d701748f0851',
                  name: 'John Doe',
                  email: 'john.doe@school.com',
                  username: 'johndoe2025',
                  role: 'TEACHER',
                  registeredAt: '2025-10-12T20:25:30.000Z',
                  updatedAt: '2025-10-12T20:25:30.000Z',
                },
              },
            },
          },
        },
        '400': {
          description: 'Bad Request – invalid input or duplicate email/username',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ErrorResponse' },
              examples: {
                duplicateEmail: {
                  summary: 'Email already exists',
                  value: { error: { message: 'Email already registered' } },
                },
                invalidData: {
                  summary: 'Validation error',
                  value: {
                    error: {
                      message: 'Invalid request',
                      details: [
                        {
                          path: ['username'],
                          message: 'String must contain at least 4 character(s)',
                        },
                      ],
                    },
                  },
                },
              },
            },
          },
        },
        '403': {
          description:
            'Forbidden – role not allowed (e.g., Secretary trying to create an Admin user)',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ErrorResponse' },
              example: {
                error: { message: 'SECRETARY can only create STUDENT or TEACHER' },
              },
            },
          },
        },
        '401': {
          description: 'Unauthorized – missing or invalid JWT token',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ErrorResponse' },
              example: { error: { message: 'Authentication required' } },
            },
          },
        },
      },
      security: [{ bearerAuth: [] }],
    },
    get: {
      tags: ['Users'],
      summary: 'List all users',
      description:
        '**Access:** Only **ADMIN** and **SECRETARY** can retrieve the user list:contentReference[oaicite:3]{index=3}.\n\n' +
        '- **ADMIN:** Receives the full list of users (all roles):contentReference[oaicite:4]{index=4}.\n' +
        '- **SECRETARY:** Receives only users with role STUDENT or TEACHER:contentReference[oaicite:5]{index=5}.',
      responses: {
        '200': {
          description: 'OK. List of users returned.',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  data: {
                    type: 'array',
                    items: { $ref: '#/components/schemas/User' },
                  },
                },
              },
              example: {
                data: [
                  {
                    id: 'd290f1ee-6c54-4b01-90e6-d701748f0851',
                    name: 'Alice Student',
                    email: 'alice@student.com',
                    username: 'alice2025',
                    role: 'STUDENT',
                    registeredAt: '2025-10-01T10:00:00.000Z',
                    updatedAt: '2025-10-01T10:00:00.000Z',
                  },
                  {
                    id: '14e26d52-5c0a-4ef4-84d6-16fa2ca09942',
                    name: 'Bob Teacher',
                    email: 'bob@school.com',
                    username: 'bobteach',
                    role: 'TEACHER',
                    registeredAt: '2025-10-05T08:30:00.000Z',
                    updatedAt: '2025-10-10T09:00:00.000Z',
                  },
                ],
              },
            },
          },
        },
        '403': {
          description: 'Forbidden – only Admin/Secretary can list users',
          content: {
            'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } },
          },
        },
        '401': {
          description: 'Unauthorized – missing/invalid JWT',
          content: {
            'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } },
          },
        },
      },
      security: [{ bearerAuth: [] }],
    },
  },
  '/users/me': {
    get: {
      tags: ['Users'],
      summary: 'Get my user profile',
      description: 'Retrieves the profile of the currently authenticated user.',
      responses: {
        '200': {
          description: 'OK. Returns the user profile corresponding to the JWT.',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: { data: { $ref: '#/components/schemas/User' } },
              },
              example: {
                data: {
                  id: 'd290f1ee-6c54-4b01-90e6-d701748f0851',
                  name: 'Alice Student',
                  email: 'alice@student.com',
                  username: 'alice2025',
                  role: 'STUDENT',
                  registeredAt: '2025-10-01T10:00:00.000Z',
                  updatedAt: '2025-10-10T12:00:00.000Z',
                },
              },
            },
          },
        },
        '401': {
          description: 'Unauthorized – missing or invalid token (not logged in)',
          content: {
            'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } },
          },
        },
      },
      security: [{ bearerAuth: [] }],
    },
    patch: {
      tags: ['Users'],
      summary: 'Update my profile',
      description:
        'Allows an authenticated user to update **their own** profile information (name or email).\n\n' +
        '**Access:** Any authenticated user can update only their profile. (This route internally maps to the same update logic as `/users/{id}` for the current user.)',
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/UpdateUserRequest' },
            example: {
              name: 'Alice Wonderland',
              // email could also be updated, or both fields
            },
          },
        },
      },
      responses: {
        '200': {
          description: 'Profile updated. Returns updated user data.',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: { data: { $ref: '#/components/schemas/User' } },
              },
              example: {
                data: {
                  id: 'd290f1ee-6c54-4b01-90e6-d701748f0851',
                  name: 'Alice Wonderland',
                  email: 'alice@student.com',
                  username: 'alice2025',
                  role: 'STUDENT',
                  registeredAt: '2025-10-01T10:00:00.000Z',
                  updatedAt: '2025-10-15T15:45:00.000Z',
                },
              },
            },
          },
        },
        '400': {
          description: 'Bad Request – no fields provided or invalid data',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ErrorResponse' },
              example: {
                error: {
                  message: 'Invalid request',
                  details: [{ message: 'At least one field must be provided for update' }],
                },
              },
            },
          },
        },
        '409': {
          description: 'Conflict – email is already in use by another account',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ErrorResponse' },
              example: { error: { message: 'Email already registered' } },
            },
          },
        },
        '401': {
          description: 'Unauthorized – not logged in or token invalid',
          content: {
            'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } },
          },
        },
      },
      security: [{ bearerAuth: [] }],
    },
  },
  '/users/me/password': {
    put: {
      tags: ['Users'],
      summary: 'Change my password',
      description:
        'Allows the current authenticated user to change their password by providing the current password and a new password.',
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/ChangePasswordRequest' },
            example: {
              currentPassword: 'oldpassword123',
              newPassword: 'newStrongPassword456',
            },
          },
        },
      },
      responses: {
        '200': {
          description: 'Password changed successfully.',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  status: { type: 'string', example: 'success' },
                  message: { type: 'string', example: 'Password updated successfully' },
                },
              },
              example: {
                status: 'success',
                message: 'Password updated successfully',
              },
            },
          },
        },
        '400': {
          description: 'Bad Request – validation failed (e.g., new password same as current)',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ErrorResponse' },
              examples: {
                samePassword: {
                  summary: 'New password equals current',
                  value: {
                    error: { message: 'New password must be different from current password' },
                  },
                },
              },
            },
          },
        },
        '401': {
          description: 'Unauthorized – current password is incorrect, or user not authenticated',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ErrorResponse' },
              examples: {
                wrongCurrent: {
                  summary: 'Current password invalid',
                  value: { error: { message: 'Current password is invalid' } },
                },
                noToken: {
                  summary: 'No login',
                  value: { error: { message: 'Authentication required' } },
                },
              },
            },
          },
        },
      },
      security: [{ bearerAuth: [] }],
    },
  },
  '/users/{id}': {
    get: {
      tags: ['Users'],
      summary: 'Get user by ID',
      description:
        '**Access:** Only **ADMIN** or **SECRETARY** can retrieve another user by ID:contentReference[oaicite:6]{index=6}.\n\n' +
        '- SECRETARY can only fetch users with role STUDENT or TEACHER:contentReference[oaicite:7]{index=7} (will receive 403 if trying to access an ADMIN/SECRETARY).',
      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,
          schema: { type: 'string', format: 'uuid' },
          description: 'UUID of the user to fetch',
        },
      ],
      responses: {
        '200': {
          description: 'OK. User data returned.',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: { data: { $ref: '#/components/schemas/User' } },
              },
            },
          },
        },
        '404': {
          description: 'Not Found – no user with given ID',
          content: {
            'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } },
          },
        },
        '403': {
          description:
            'Forbidden – not allowed to access this user (Secretary trying to access an Admin/Secretary user)',
          content: {
            'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } },
          },
        },
        '401': {
          description: 'Unauthorized – missing or invalid JWT',
          content: {
            'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } },
          },
        },
      },
      security: [{ bearerAuth: [] }],
    },
    patch: {
      tags: ['Users'],
      summary: 'Update user by ID',
      description:
        'Updates another user’s profile (name or email) by ID.\n\n' +
        '**Access:** Only **ADMIN** can update other users:contentReference[oaicite:8]{index=8}. (Regular users should use `/users/me` for themselves.)\n\n' +
        'Note: Only the **name** or **email** can be changed; username and role cannot be modified via this route:contentReference[oaicite:9]{index=9}.',
      parameters: [
        { name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } },
      ],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/UpdateUserRequest' },
            example: { email: 'new.email@domain.com' },
          },
        },
      },
      responses: {
        '200': {
          description: 'User updated successfully. Returns updated user data.',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: { data: { $ref: '#/components/schemas/User' } },
              },
            },
          },
        },
        '400': {
          description: 'Bad Request – invalid data or no fields to update',
          content: {
            'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } },
          },
        },
        '409': {
          description: 'Conflict – new email already in use',
          content: {
            'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } },
          },
        },
        '404': {
          description: 'Not Found – user ID not found',
          content: {
            'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } },
          },
        },
        '403': {
          description: 'Forbidden – only Admin can update users',
          content: {
            'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } },
          },
        },
        '401': {
          description: 'Unauthorized – missing/invalid token',
          content: {
            'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } },
          },
        },
      },
      security: [{ bearerAuth: [] }],
    },
    delete: {
      tags: ['Users'],
      summary: 'Delete user by ID',
      description:
        'Deletes a user account by ID.\n\n**Access:** Only **ADMIN** can delete users:contentReference[oaicite:10]{index=10}.',
      parameters: [
        { name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } },
      ],
      responses: {
        '204': {
          description: 'User deleted successfully. No content in response.',
        },
        '404': {
          description: 'Not Found – user ID not found',
          content: {
            'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } },
          },
        },
        '403': {
          description: 'Forbidden – only Admin can delete users',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ErrorResponse' },
              example: { error: { message: 'Only ADMIN can delete users' } },
            },
          },
        },
        '401': {
          description: 'Unauthorized – missing/invalid JWT',
          content: {
            'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } },
          },
        },
      },
      security: [{ bearerAuth: [] }],
    },
  },
};
