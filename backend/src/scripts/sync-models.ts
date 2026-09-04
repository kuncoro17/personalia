import dotenv from 'dotenv';

dotenv.config();

async function run() {
  const { syncAllModels } = await import('../bootstrap/modelSync');
  await syncAllModels();
}

run()
  .then(() => {
    // eslint-disable-next-line no-console
    console.log('Database model sync finished.');
    process.exit(0);
  })
  .catch(err => {
    // eslint-disable-next-line no-console
    console.error('Database model sync failed:', err);
    process.exit(1);
  });
