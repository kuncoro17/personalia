import dotenv from 'dotenv';
import { serve } from '@hono/node-server';
import logger from './utils/logger';

dotenv.config();

const PORT = Number(process.env.PORT || 3000);

const bootstrap = async () => {
  const { maybeAutoSyncModels } = await import('./bootstrap/modelSync');
  await maybeAutoSyncModels();

  // Register all Sequelize associations after model tables are ensured.
  await import('./models');

  const { default: app } = await import('./server');
  const server = serve(
    {
      fetch: app.fetch,
      port: PORT,
    },
    () => {
      logger.info(`Server listening at http://localhost:${PORT}`);
    }
  );

  server.on('error', err => {
    if ((err as NodeJS.ErrnoException).code === 'EADDRINUSE') {
      logger.error(
        `Port ${PORT} is already in use. Stop the process using this port or change PORT in backend/.env.`
      );
      process.exit(1);
    }

    logger.error({ err }, 'Failed to start HTTP server');
    process.exit(1);
  });
};

bootstrap().catch(err => {
  logger.error({ err }, 'Failed to bootstrap application');
  process.exit(1);
});
