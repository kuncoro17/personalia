import { Hono } from 'hono';
import redis from '../libs/redis';
const app = new Hono();

app.get('/set', async c => {
  await redis.set('foo', 'bar');
  return c.text('Set foo = bar');
});

app.get('/get', async c => {
  const value = await redis.get('foo');
  return c.text(`Value: ${value}`);
});

export default app;
