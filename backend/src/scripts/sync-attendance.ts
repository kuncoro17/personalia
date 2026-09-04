import 'dotenv/config';

import { sequelize } from '../config/database';
import { syncAttendance } from '../services/attendanceSyncService';
import logger from '../utils/logger';

syncAttendance()
  .catch(error => {
    logger.error({ error }, 'Attendance sync gagal');
    process.exitCode = 1;
  })
  .finally(async () => {
    await sequelize.close();
  });
