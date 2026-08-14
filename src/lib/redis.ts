import { Redis } from 'ioredis';

const getRedisUrl = () => {
  if (process.env.REDIS_URL) {
    return process.env.REDIS_URL;
  }
  // Return a dummy URL during build if env is missing, to prevent build crashes
  console.warn("REDIS_URL is missing. Using dummy URL for build.");
  return "redis://localhost:6379";
};

// Create a singleton instance to prevent multiple connections in dev mode
const globalForRedis = global as unknown as { redis: Redis };

export const redis =
  globalForRedis.redis ||
  new Redis(getRedisUrl(), {
    tls: {
      rejectUnauthorized: false
    }
  });

if (process.env.NODE_ENV !== 'production') globalForRedis.redis = redis;
