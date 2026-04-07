import { OpenAPIHono } from '@hono/zod-openapi';
import { logger } from 'hono/logger';
import { cors } from 'hono/cors';
import { swaggerUI } from '@hono/swagger-ui';
import { serveStatic } from '@hono/node-server/serve-static';
import 'dotenv/config';

import { errorHandler } from './middlewares/error.middleware';
import { requestLogger } from './middlewares/loggerMiddleware';
import { prsUnitKerjaRoutes } from './routes/unitKerjaRoutes';
import { prsSeksiRoutes } from './routes/seksiRoutes';
import redisRoutes from './routes/redis';
import { prsMasterAgamaRoutes } from './routes/prsMasterAgamaRoute';
import { prsPengalamanRoutes } from './routes/prsPengalamanRoute';
import { prsMasterRiwPendidikanRoutes } from './routes/prsMasterRiwPendidikanRoute';
import { PrsMasterAlamatroutes } from './routes/prsMasterAlamatRoutes';
import { prsUnitKerjaKaryawanRoutes } from './routes/prsUnitKerjaKaryawanRoutes';
import { prsStatusKaryawanRoutes } from './routes/prsStatusKaryawanRoutes';
import { PrsMasterMapelRoutes } from './routes/prsMasterMapelRoute';

import { prsMasterProvRoutes } from './routes/prsMasterProvRoutes';
import { prsMasterKotaRoutes } from './routes/prsMasterKotRoutes';
import { prsMasterKecRoutes } from './routes/prsMasterKecRoutes';
import { prsMasterKelRoutes } from './routes/prsMasterKelRoutes';
import { prsRiwPendidikanKarRoutes } from './routes/prsRiwPendidikanKar';
// import sdmcheckinoutRoutes from './routes/sdm_checkinoutRoutes';
import { LetterRoutes } from './routes/LetterRoutes';

import { PrsMasterDirekturRoute } from './routes/prsMasterDirekturRoute';
import { PrsMasterDeputiRoute } from './routes/prsMasterDeputiRoute';

import { absensiBagianRoutes } from './routes/absensiBagianRoutes';
import { bagianRoutes } from './routes/bagianRoutes';

import { docRoutes } from './routes/docsRoutes';
import { jamMengajarRoutes } from './routes/jamMengajarRoutes';
import { prsKeluargaRoutes } from './routes/keluargaRoutes';
import { prsKontakDaruratRoutes } from './routes/kontakDaruratRoutes';
import { prsDivisiRoutes } from './routes/prsDivisiRoutes';
import { prsJabatanRoutes } from './routes/prsJabatanRoute';
import { registerPrsKontrakRoutes } from './routes/prsKontrakRoute';
import { registerPrsKaryawanRoutes } from './routes/prsKaryawanRoute';
import { historyRoutes } from './routes/historyRoutes';
import { presensiRoutes } from './routes/routesphp';
// import { sdmCheckInOutRoutes } from './routes/sdmcheckinoutRoutes';

const allowedOrigins = (process.env.CORS_ALLOWED_ORIGINS ?? '')
  .split(',')
  .map(origin => origin.trim())
  .filter(Boolean);

const app = new OpenAPIHono({
  defaultHook: (result, c) => {
    if (!result.success) return c.json({ error: result.error }, 400);
  },
});

app.use(
  '*',
  cors({
    origin: allowedOrigins.length > 0 ? allowedOrigins : '*',
    allowMethods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowHeaders: ['Content-Type', 'Authorization'],
  })
);

app.use('*', logger());
app.onError(errorHandler);

app.get('/health', c => {
  return c.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    uptime: process.uptime(),
  });
});
app.openAPIRegistry.registerComponent('securitySchemes', 'bearerAuth', {
  type: 'http',
  scheme: 'bearer',
  bearerFormat: 'JWT',
});

// Endpoint OpenAPI JSON dengan argumen yang wajib
app.doc('/openapi.json', {
  openapi: '3.0.0',
  info: {
    title: 'Personalia API',
    version: '1.0.0',
    description: 'API documentation for Personalia system',
  },
  security: [
    {
      bearerAuth: [],
    },
  ],
} as Parameters<typeof app.doc>[1]);

// Serve Swagger UI static assets
app.use(
  '/swagger/*',
  serveStatic({
    root: './node_modules/swagger-ui-dist',
    rewriteRequestPath: requestPath => requestPath.replace(/^\/swagger/, ''),
  })
);

app.use(
  '/uploads/*',
  serveStatic({
    root: './uploads',
    rewriteRequestPath: requestPath => requestPath.replace(/^\/uploads/, ''),
  })
);

app.get('/docs', swaggerUI({ url: '/openapi.json' }));

app.use('*', requestLogger);

app.get('/', c => c.text('API is running'));

// app.route('/api/sas/dashboard/lemburSDM', sdmcheckinoutRoutes);
app.route('/redis', redisRoutes);

// app.get('/', c => c.text('Hello with CORS!'));

// absensiRoutes(app);
bagianRoutes(app);

// protectedRoutes(app);

docRoutes(app);
jamMengajarRoutes(app);
prsKeluargaRoutes(app);
prsKontakDaruratRoutes(app);
prsDivisiRoutes(app);
prsJabatanRoutes(app);
registerPrsKontrakRoutes(app);
registerPrsKaryawanRoutes(app);
// sdmCheckInOutRoutes(app);
prsMasterAgamaRoutes(app);
absensiBagianRoutes(app);
PrsMasterAlamatroutes(app);
PrsMasterDeputiRoute(app);
PrsMasterDirekturRoute(app);
prsMasterKecRoutes(app);
prsMasterKelRoutes(app);
prsMasterKotaRoutes(app);
PrsMasterMapelRoutes(app);
prsMasterProvRoutes(app);
prsMasterRiwPendidikanRoutes(app);
prsPengalamanRoutes(app);
prsRiwPendidikanKarRoutes(app);
prsStatusKaryawanRoutes(app);
prsUnitKerjaKaryawanRoutes(app);
prsSeksiRoutes(app);
prsUnitKerjaRoutes(app);
LetterRoutes(app);
historyRoutes(app);
presensiRoutes(app);
export default app;
