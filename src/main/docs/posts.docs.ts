export default {
  '/posts/': {
    post: {
      tags: ['Posts'],
      summary: 'Create a new post',
      description:
        'Creates a new post (e.g., a class content post).\n\n' +
        '**Access:** Only **ADMIN**, **SECRETARY**, or **TEACHER** roles can create posts. Students cannot create posts.\n\n' +
        'The authenticated user becomes the author of the post automatically (authorId taken from the token).',
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/CreatePostRequest' },
            example: {
              title: 'Introduction to Node.js',
              content: 'In this post, we will learn about Node.js basics...',
              tags: ['nodejs', 'javascript'],
              imageUrl: 'https://example.com/cover.png',
              // videoUrl can also be included if applicable
            },
          },
        },
      },
      responses: {
        '201': {
          description: 'Post created successfully.',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  status: { type: 'string', example: 'success' },
                  message: { type: 'string', example: 'Post created successfully' },
                  data: {
                    type: 'object',
                    properties: {
                      id: { type: 'string', format: 'uuid', description: 'ID of the new post' },
                    },
                  },
                },
              },
              example: {
                status: 'success',
                message: 'Post created successfully',
                data: { id: '51ba1075-8e51-44a8-a334-62385c20a80f' },
              },
            },
          },
        },
        '400': {
          description: 'Bad Request – invalid post data',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ErrorResponse' },
              examples: {
                titleTooShort: {
                  summary: 'Title too short',
                  value: {
                    error: {
                      message: 'Invalid request',
                      details: [
                        { path: ['title'], message: 'String must contain at least 3 character(s)' },
                      ],
                    },
                  },
                },
              },
            },
          },
        },
        '403': {
          description: 'Forbidden – user role not allowed to create posts',
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
    get: {
      tags: ['Posts'],
      summary: 'List or search posts',
      description:
        'Retrieves a paginated list of posts, with optional filters for search, tag, or author.\n\n' +
        'Any authenticated user (including students) can view posts. Supports pagination and sorting.',
      parameters: [
        {
          name: 'search',
          in: 'query',
          schema: { type: 'string' },
          description: 'Text to search in title or content (optional)',
        },
        {
          name: 'tags',
          in: 'query',
          schema: { type: 'string' },
          description: 'Filter posts that have a specific tag (optional)',
        },
        {
          name: 'authorId',
          in: 'query',
          schema: { type: 'string', format: 'uuid' },
          description: 'Filter by author user ID (optional)',
        },
        {
          name: 'page',
          in: 'query',
          schema: { type: 'integer', minimum: 1, default: 1 },
          description: 'Page number for pagination (optional)',
        },
        {
          name: 'limit',
          in: 'query',
          schema: { type: 'integer', minimum: 1, maximum: 100, default: 20 },
          description: 'Page size for pagination (optional, max 100)',
        },
        {
          name: 'sortBy',
          in: 'query',
          schema: { type: 'string', enum: ['createdAt', 'title'], default: 'createdAt' },
          description: 'Field to sort by (optional)',
        },
        {
          name: 'sortOrder',
          in: 'query',
          schema: { type: 'string', enum: ['asc', 'desc'], default: 'desc' },
          description: 'Sort direction (optional)',
        },
      ],
      responses: {
        '200': {
          description: 'OK. List of posts (possibly filtered by query) returned.',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  data: { type: 'array', items: { $ref: '#/components/schemas/Post' } },
                  meta: {
                    type: 'object',
                    properties: {
                      page: { type: 'integer', example: 1 },
                      limit: { type: 'integer', example: 20 },
                      total: { type: 'integer', example: 42 },
                      totalPages: { type: 'integer', example: 3 },
                      hasNextPage: { type: 'boolean', example: true },
                      hasPreviousPage: { type: 'boolean', example: false },
                    },
                  },
                },
              },
              example: {
                data: [
                  {
                    id: '51ba1075-8e51-44a8-a334-62385c20a80f',
                    title: 'Introduction to Node.js',
                    content: 'In this post, we will learn about Node.js basics...',
                    authorId: 'd290f1ee-6c54-4b01-90e6-d701748f0851',
                    author: 'Alice Teacher',
                    tags: ['nodejs', 'javascript'],
                    createdAt: '2025-10-10T14:48:00.000Z',
                    updatedAt: '2025-10-10T14:48:00.000Z',
                  },
                  {
                    id: 'a2f67e9d-ff47-4a6b-b59e-c1ddec9e8613',
                    title: 'Advanced Node.js Patterns',
                    content: 'Continuing our Node.js series with advanced patterns...',
                    authorId: '14e26d52-5c0a-4ef4-84d6-16fa2ca09942',
                    author: 'Bob Teacher',
                    tags: ['nodejs'],
                    createdAt: '2025-10-12T09:00:00.000Z',
                    updatedAt: '2025-10-12T09:15:00.000Z',
                  },
                ],
                meta: {
                  page: 1,
                  limit: 20,
                  total: 2,
                  totalPages: 1,
                  hasNextPage: false,
                  hasPreviousPage: false,
                },
              },
            },
          },
        },
        '401': {
          description: 'Unauthorized – missing or invalid token',
          content: {
            'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } },
          },
        },
      },
      security: [{ bearerAuth: [] }],
    },
  },
  '/posts/search': {
    get: {
      tags: ['Posts'],
      summary: 'Search posts (alternative endpoint)',
      description:
        'Alias for **GET /posts/** with search query parameters. Provides the same functionality as listing posts with filters.',
      parameters: [
        /* (Same query parameters as /posts/) */
      ],
      responses: {
        '200': {
          description: 'OK. (Same response as GET /posts/)',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  data: { type: 'array', items: { $ref: '#/components/schemas/Post' } },
                  meta: {
                    type: 'object',
                    properties: {
                      page: { type: 'integer', example: 1 },
                      limit: { type: 'integer', example: 20 },
                      total: { type: 'integer', example: 42 },
                      totalPages: { type: 'integer', example: 3 },
                      hasNextPage: { type: 'boolean', example: true },
                      hasPreviousPage: { type: 'boolean', example: false },
                    },
                  },
                },
              },
            },
          },
        },
        '401': { $ref: '#/components/responses/UnauthorizedError' },
      },
      security: [{ bearerAuth: [] }],
    },
  },
  '/posts/authors': {
    get: {
      tags: ['Posts'],
      summary: 'List post authors',
      description:
        'Returns the distinct authors that have published posts, along with how many posts each has.',
      responses: {
        '200': {
          description: 'OK. List of authors that have at least one post.',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  data: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        id: { type: 'string', format: 'uuid' },
                        name: { type: 'string' },
                        totalPosts: { type: 'integer' },
                      },
                    },
                  },
                },
              },
              example: {
                data: [
                  {
                    id: 'd290f1ee-6c54-4b01-90e6-d701748f0851',
                    name: 'Alice Teacher',
                    totalPosts: 5,
                  },
                  {
                    id: '14e26d52-5c0a-4ef4-84d6-16fa2ca09942',
                    name: 'Bob Teacher',
                    totalPosts: 2,
                  },
                ],
              },
            },
          },
        },
        '401': { $ref: '#/components/responses/UnauthorizedError' },
      },
      security: [{ bearerAuth: [] }],
    },
  },
  '/posts/mine': {
    get: {
      tags: ['Posts'],
      summary: 'List my posts',
      description:
        'Retrieves posts authored by the current authenticated user.\n\n' +
        '**Access:** Only **ADMIN**, **SECRETARY**, or **TEACHER** can have personal posts to list (students cannot create posts, so they have none).\n\n' +
        'This endpoint supports the same query filters as GET /posts, except authorId is fixed to the current user.',
      parameters: [
        {
          name: 'search',
          in: 'query',
          schema: { type: 'string' },
          description: 'Search term (optional, filters your posts only)',
        },
        {
          name: 'tags',
          in: 'query',
          schema: { type: 'string' },
          description: 'Filter by tag (optional, within your posts)',
        },
        {
          name: 'page',
          in: 'query',
          schema: { type: 'integer', minimum: 1, default: 1 },
          description: 'Page number (optional)',
        },
        {
          name: 'limit',
          in: 'query',
          schema: { type: 'integer', minimum: 1, maximum: 100, default: 20 },
          description: 'Page size (optional)',
        },
        {
          name: 'sortBy',
          in: 'query',
          schema: { type: 'string', enum: ['createdAt', 'title'], default: 'createdAt' },
        },
        {
          name: 'sortOrder',
          in: 'query',
          schema: { type: 'string', enum: ['asc', 'desc'], default: 'desc' },
        },
      ],
      responses: {
        '200': {
          description: 'OK. List of posts by the current user.',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  data: { type: 'array', items: { $ref: '#/components/schemas/Post' } },
                  meta: {
                    type: 'object',
                    properties: {
                      page: { type: 'integer', example: 1 },
                      limit: { type: 'integer', example: 20 },
                      total: { type: 'integer', example: 5 },
                      totalPages: { type: 'integer', example: 1 },
                      hasNextPage: { type: 'boolean', example: false },
                      hasPreviousPage: { type: 'boolean', example: false },
                    },
                  },
                },
              },
            },
          },
        },
        '403': {
          description: 'Forbidden – only roles that can create posts have "mine" posts',
          content: {
            'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } },
          },
        },
        '401': { $ref: '#/components/responses/UnauthorizedError' },
      },
      security: [{ bearerAuth: [] }],
    },
  },
  '/posts/{id}': {
    get: {
      tags: ['Posts'],
      summary: 'Get post by ID',
      description:
        'Retrieve a single post by its ID.\n\n**Access:** Any authenticated user can view a post by ID (no role restriction).',
      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,
          schema: { type: 'string', format: 'uuid' },
          description: 'UUID of the post',
        },
      ],
      responses: {
        '200': {
          description: 'OK. Returns the post data.',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: { data: { $ref: '#/components/schemas/Post' } },
              },
            },
          },
        },
        '404': {
          description: 'Not Found – no post with given ID',
          content: {
            'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } },
          },
        },
        '400': {
          description: 'Bad Request – invalid UUID format',
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
    put: {
      tags: ['Posts'],
      summary: 'Update a post',
      description:
        'Updates an existing post by ID (any combination of title, content, videoUrl, imageUrl, or tags).\n\n' +
        '**Access:** **ADMIN**, **SECRETARY**, **TEACHER** can attempt to update (students cannot). However, **only the post author** is allowed to perform the update. (Even Admin cannot update someone else’s post – admin privileges do **not** override authorship for updates.)\n\n' +
        'To clear an optional field (imageUrl or videoUrl), you may send an empty string in that field.',
      parameters: [
        { name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } },
      ],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/UpdatePostRequest' },
            example: {
              title: 'Introduction to Node.js (Edited)',
              content: 'Updated content for Node.js introduction...',
              // Only include fields that need to be updated; at least one field is required
            },
          },
        },
      },
      responses: {
        '200': {
          description: 'Post updated successfully. Returns the updated post data.',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: { data: { $ref: '#/components/schemas/Post' } },
              },
            },
          },
        },
        '400': {
          description: 'Bad Request – invalid data or no fields provided',
          content: {
            'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } },
          },
        },
        '403': {
          description: 'Forbidden – user is not the author of the post (or not allowed role)',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ErrorResponse' },
              example: { error: { message: 'Forbidden: only author can update this post' } },
            },
          },
        },
        '404': {
          description: 'Not Found – post ID not found',
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
      tags: ['Posts'],
      summary: 'Delete a post',
      description:
        'Deletes a post by ID.\n\n' +
        '**Access:** **ADMIN**, **SECRETARY**, **TEACHER** can attempt deletion.\n\n' +
        '**Only the author or an Admin** can actually delete the post. (Admins can delete any post; teachers/secretaries can only delete their own posts.)',
      parameters: [
        { name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } },
      ],
      responses: {
        '204': {
          description: 'Post deleted successfully. No response body.',
        },
        '404': {
          description: 'Not Found – post ID not found',
          content: {
            'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } },
          },
        },
        '403': {
          description: 'Forbidden – not author or admin',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ErrorResponse' },
              example: {
                error: { message: 'Forbidden: only the author or admin can delete this post' },
              },
            },
          },
        },
        '400': {
          description: 'Bad Request – invalid UUID',
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
  },
};
