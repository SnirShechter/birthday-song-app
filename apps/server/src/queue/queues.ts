import { Queue } from 'bullmq';
import IORedis from 'ioredis';

const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379';

let connection: IORedis | null = null;
let redisAvailable = false;

try {
  connection = new IORedis(REDIS_URL, {
    maxRetriesPerRequest: null,
    enableReadyCheck: false,
    retryStrategy(times: number) {
      if (times > 3) {
        console.warn('[Queue] Redis connection failed after 3 retries, falling back to direct execution');
        return null;
      }
      return Math.min(times * 200, 1000);
    },
    lazyConnect: true,
  });

  // Attempt to connect with a timeout
  const connectPromise = connection.connect();
  const timeoutPromise = new Promise<void>((_, reject) =>
    setTimeout(() => reject(new Error('Redis connection timeout')), 3000),
  );

  await Promise.race([connectPromise, timeoutPromise])
    .then(() => {
      redisAvailable = true;
      console.log('[Queue] Redis connected successfully');
    })
    .catch((err) => {
      console.warn(`[Queue] Redis unavailable: ${(err as Error).message}. Using direct execution fallback.`);
      connection?.disconnect();
      connection = null;
    });
} catch (err) {
  console.warn(`[Queue] Redis initialization failed: ${(err as Error).message}. Using direct execution fallback.`);
  connection = null;
}

// Create queues only if Redis is available
let lyricsQueue: Queue | null = null;
let musicQueue: Queue | null = null;
let videoQueue: Queue | null = null;

if (redisAvailable && connection) {
  const queueOpts = { connection };

  lyricsQueue = new Queue('lyrics-generation', queueOpts);
  musicQueue = new Queue('music-generation', queueOpts);
  videoQueue = new Queue('video-generation', queueOpts);

  console.log('[Queue] BullMQ queues initialized: lyrics, music, video');
} else {
  console.log('[Queue] Running without queues - jobs will be executed directly');
}

export { lyricsQueue, musicQueue, videoQueue, redisAvailable, connection };

// Helper to add a job or fall back to direct execution
export async function addJob<T>(
  queue: Queue | null,
  jobName: string,
  data: T,
  fallbackFn: (data: T) => Promise<void>,
): Promise<void> {
  if (queue && redisAvailable) {
    await queue.add(jobName, data, {
      attempts: 3,
      backoff: {
        type: 'exponential',
        delay: 1000,
      },
      removeOnComplete: 100,
      removeOnFail: 50,
    });
    console.log(`[Queue] Job added: ${jobName}`);
  } else {
    console.log(`[Queue] Executing directly (no Redis): ${jobName}`);
    await fallbackFn(data);
  }
}
