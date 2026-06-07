import { RedisMemoryServer } from 'redis-memory-server';

const server = new RedisMemoryServer({
  instance: { port: 6379, ip: '127.0.0.1' },
});

await server.start();
console.log('[dev-redis] In-memory Redis listening on 127.0.0.1:6379');

process.on('SIGINT', async () => {
  await server.stop();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  await server.stop();
  process.exit(0);
});

await new Promise(() => {});
