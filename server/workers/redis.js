import { Redis } from 'ioredis';

const connection = new Redis({
    host: process.env.REDIS_HOST || '127.0.0.1',
    port: Number(process.env.REDIS_PORT) || 6379,
    maxRetriesPerRequest: null,
    retryStrategy: (times) => Math.min(times * 500, 5000),
});

connection.on('error', (err) => {
    console.error('[Redis] Connection error:', err.message);
});

export { connection };
