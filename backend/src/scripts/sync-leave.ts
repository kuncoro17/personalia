import 'dotenv/config';

import { sequelize } from '../config/database';
import { syncLeave } from '../services/leaveSyncService';
import logger from '../utils/logger';

syncLeave()
  .catch(error => {
    logger.error({ error }, 'Leave sync gagal');
    process.exitCode = 1;
  })
  .finally(async () => sequelize.close());
