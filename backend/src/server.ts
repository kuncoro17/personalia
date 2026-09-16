import { OpenAPIHono } from '@hono/zod-openapi';
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
import { prsTipeDokumenRoutes } from './routes/prsTipeDokumenRoutes';
import { PrsMasterMapelRoutes } from './routes/prsMasterMapelRoute';

import { prsMasterProvRoutes } from './routes/prsMasterProvRoutes';
import { prsMasterKotaRoutes } from './routes/prsMasterKotRoutes';
import { prsMasterKecRoutes } from './routes/prsMasterKecRoutes';
import { prsMasterKelRoutes } from './routes/prsMasterKelRoutes';
import { prsRiwPendidikanKarRoutes } from './routes/prsRiwPendidikanKar';
// import sdmcheckinoutRoutes from './routes/sdm_checkinoutRoutes';
import { LetterRoutes } from './routes/LetterRoutes';
import { prsMasterSetempatRoutes } from './routes/prsMasterSetempatRoutes';

import { PrsMasterDirekturRoute } from './routes/prsMasterDirekturRoute';
import { PrsMasterDeputiRoute } from './routes/prsMasterDeputiRoute';

import { absensiBagianRoutes } from './routes/absensiBagianRoutes';
import { attendanceSyncRoutes } from './routes/attendanceSyncRoutes';
import { leaveSyncRoutes } from './routes/leaveSyncRoutes';
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
import { keuCgSlipRoutes } from './routes/keuCgSlipRoutes';
import { masterGroupBankRoutes } from './routes/masterGroupBankRoutes';
import { masterBankGiroRoutes } from './routes/masterBankGiroRoutes';
import { userRoutes } from './routes/userRoutes';
import { clerkAuthRoutes } from './routes/clerkAuthRoutes';
import { jwtAuthRoutes } from './routes/jwtAuthRoutes';
import { sasAuthRoutes } from './routes/sasAuthRoutes';
// import { sdmCheckInOutRoutes } from './routes/sdmcheckinoutRoutes';

const app = new OpenAPIHono({
  defaultHook: (result, c) => {
    if (!result.success) return c.json({ error: result.error }, 400);
  },
});

const CORS_ALLOW_METHODS = 'GET, POST, PUT, PATCH, DELETE, OPTIONS';
const CORS_ALLOW_HEADERS = 'Content-Type, Authorization, X-API-Key';

app.use('*', async (c, next) => {
  const requestOrigin = c.req.header('origin');
  const allowOrigin = requestOrigin || '*';
  const robotsHeader = 'noindex, nofollow, noarchive';

  if (c.req.method === 'OPTIONS') {
    const headers = new Headers();
    headers.set('Access-Control-Allow-Origin', allowOrigin);
    headers.set('Access-Control-Allow-Methods', CORS_ALLOW_METHODS);
    headers.set('Access-Control-Allow-Headers', CORS_ALLOW_HEADERS);
    headers.set('X-Robots-Tag', robotsHeader);
    if (requestOrigin) headers.set('Vary', 'Origin');

    return new Response(null, {
      status: 204,
      headers,
    });
  }

  await next();

  c.header('Access-Control-Allow-Origin', allowOrigin);
  c.header('Access-Control-Allow-Methods', CORS_ALLOW_METHODS);
  c.header('Access-Control-Allow-Headers', CORS_ALLOW_HEADERS);
  c.header('X-Robots-Tag', robotsHeader);

  if (requestOrigin) {
    const vary = c.res.headers.get('Vary');
    if (!vary) {
      c.header('Vary', 'Origin');
    } else if (
      !vary
        .toLowerCase()
        .split(',')
        .some(v => v.trim() === 'origin')
    ) {
      c.header('Vary', `${vary}, Origin`);
    }
  }
});

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
app.openAPIRegistry.registerComponent('securitySchemes', 'apiKeyAuth', {
  type: 'apiKey',
  in: 'header',
  name: 'x-api-key',
});

// Endpoint OpenAPI JSON dengan argumen yang wajib
app.doc('/openapi.json', {
  openapi: '3.0.0',
  // Resolve against the spec URL, preserving reverse-proxy prefixes like /api/.
  servers: [{ url: '.' }],
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

app.get('/dok', swaggerUI({ url: './openapi.json' }));

app.use('*', requestLogger);

app.get('/', c => c.text('API is running'));

// app.route('/api/sas/dashboard/lemburSDM', sdmcheckinoutRoutes);
app.route('/redis', redisRoutes);

// app.get('/', c => c.text('Hello with CORS!'));

sasAuthRoutes(app);
absensiBagianRoutes(app);
// API-key routes must precede the global Clerk middleware on master routes.
presensiRoutes(app);
attendanceSyncRoutes(app);
leaveSyncRoutes(app);

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
PrsMasterAlamatroutes(app);
PrsMasterDeputiRoute(app);
PrsMasterDirekturRoute(app);
prsMasterKecRoutes(app);
prsMasterKelRoutes(app);
prsMasterSetempatRoutes(app);
prsMasterKotaRoutes(app);
PrsMasterMapelRoutes(app);
prsMasterProvRoutes(app);
prsMasterRiwPendidikanRoutes(app);
prsPengalamanRoutes(app);
prsRiwPendidikanKarRoutes(app);
prsStatusKaryawanRoutes(app);
prsTipeDokumenRoutes(app);
prsUnitKerjaKaryawanRoutes(app);
prsSeksiRoutes(app);
prsUnitKerjaRoutes(app);
LetterRoutes(app);
historyRoutes(app);
keuCgSlipRoutes(app);
masterGroupBankRoutes(app);
masterBankGiroRoutes(app);
userRoutes(app);
clerkAuthRoutes(app);
jwtAuthRoutes(app);
export default app;
