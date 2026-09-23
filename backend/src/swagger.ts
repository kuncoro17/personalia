import { OpenAPIHono } from '@hono/zod-openapi';
import { swaggerUI } from '@hono/swagger-ui';
//swagger versi
export const swaggerApp = new OpenAPIHono();

swaggerApp.doc('/openapi.json', {
  openapi: '3.0.0',
  info: {
    title: 'Personalia API',
    version: '1.0.0',
  },
});

swaggerApp.get('/', swaggerUI({ url: '/docs/openapi.json' }));
