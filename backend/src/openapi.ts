import { OpenAPIHono } from '@hono/zod-openapi';
import { swaggerUI } from '@hono/swagger-ui';

export const openApiApp = new OpenAPIHono({
  defaultHook: (result, c) => {
    if (!result.success) {
      return c.json({ error: result.error }, 400);
    }
  },
});

// OpenAPI JSON
openApiApp.doc('/openapi.json', {
  openapi: '3.0.0',
  info: {
    title: 'Personalia API',
    version: '1.0.0',
    description: 'HRIS Personalia API Documentation',
  },
});

openApiApp.get('/ui', swaggerUI({ url: '/docs/openapi.json' }));
