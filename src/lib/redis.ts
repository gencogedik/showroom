import { Redis } from 'ioredis';

const getRedisUrl = () => {
  if (process.env.REDIS_URL) {
    return process.env.REDIS_URL;
  }
  if (process.env.KV_URL) {
    return process.env.KV_URL;
  }
  // Return a dummy URL during build if env is missing, but with a very short timeout
  console.warn("REDIS_URL is missing. Using dummy URL for build.");
  return "redis://localhost:6379";
};

// Create a singleton instance to prevent multiple connections in dev mode
const globalForRedis = global as unknown as { redis: Redis };

export const redis =
  globalForRedis.redis ||
  new Redis(getRedisUrl(), {
    tls: process.env.REDIS_URL || process.env.KV_URL ? {
      rejectUnauthorized: false
    } : undefined,
    connectTimeout: 2000, // Fail fast if it cannot connect within 2 seconds
    maxRetriesPerRequest: 0,
    retryStrategy: () => null // Do not retry connection
  });

if (process.env.NODE_ENV !== 'production') globalForRedis.redis = redis;
