import { Worker, Job } from 'bullmq';
import { connection, redisAvailable } from './queues.js';
import { generateMockLyrics } from '../services/mock-lyrics.js';
import { generateMockSongs } from '../services/mock-music.js';
import { startVideoGeneration } from '../services/mock-video.js';
import { db } from '../db/client.js';
import type { MusicStyle, QuestionnaireAnswers } from '@birthday-song/shared';

interface LyricsJobData {
  orderId: string;
  style: MusicStyle;
  answers: QuestionnaireAnswers;
}

interface MusicJobData {
  orderId: string;
  style: MusicStyle;
  language: string;
  lyricsId: number;
}

interface VideoJobData {
  orderId: string;
  videoClipId: number;
  videoStyle: string;
  photoUrls: string[];
}

// Process lyrics generation job
async function processLyricsJob(data: LyricsJobData): Promise<void> {
  const { orderId, style, answers } = data;
  console.log(`[Worker] Processing lyrics job for order ${orderId}, style: ${style}`);

  const variations = await generateMockLyrics(style, answers);

  for (let i = 0; i < variations.length; i++) {
    const variation = variations[i];
    await db.createLyrics({
      orderId,
      model: variation.model,
      styleVariant: style,
      content: variation.content,
      selected: i === 0, // First variation is selected by default
    });
  }

  await db.updateOrder(orderId, { status: 'lyrics_ready', selectedStyle: style });
  await db.createEvent({ orderId, eventType: 'lyrics_generated', payload: { style, count: variations.length } });

  console.log(`[Worker] Lyrics job completed for order ${orderId}: ${variations.length} variations`);
}

// Process music generation job
async function processMusicJob(data: MusicJobData): Promise<void> {
  const { orderId, style, language } = data;
  console.log(`[Worker] Processing music job for order ${orderId}, style: ${style}`);

  const songs = await generateMockSongs(orderId, style, language);

  for (let i = 0; i < songs.length; i++) {
    const song = songs[i];
    await db.createSong({
      orderId,
      provider: song.provider,
      providerId: song.providerId,
      stylePrompt: song.stylePrompt,
      audioUrl: song.audioUrl,
      previewUrl: song.previewUrl,
      durationSeconds: song.durationSeconds,
      selected: i === 0,
    });
  }

  await db.updateOrder(orderId, { status: 'song_ready' });
  await db.createEvent({ orderId, eventType: 'song_generated', payload: { style, count: songs.length } });

  console.log(`[Worker] Music job completed for order ${orderId}: ${songs.length} variations`);
}

// Process video generation job
async function processVideoJob(data: VideoJobData): Promise<void> {
  const { orderId, videoClipId } = data;
  console.log(`[Worker] Processing video job for order ${orderId}, clip: ${videoClipId}`);

  // Start the mock video progress tracker
  startVideoGeneration(orderId, videoClipId);

  // Update DB status to processing
  await db.updateVideoStatus(videoClipId, 'processing');

  // Simulate video generation time (15 seconds)
  await new Promise((resolve) => setTimeout(resolve, 15000));

  // Complete the video
  const videoUrl = `/mock-assets/videos/demo-video.mp4`;
  await db.updateVideoStatus(videoClipId, 'completed', videoUrl);
  await db.createEvent({ orderId, eventType: 'video_generated', payload: { videoClipId, videoUrl } });

  console.log(`[Worker] Video job completed for order ${orderId}`);
}

// Export process functions for direct execution fallback
export { processLyricsJob, processMusicJob, processVideoJob };

// Start BullMQ workers if Redis is available
export function startWorkers(): void {
  if (!redisAvailable || !connection) {
    console.log('[Worker] Skipping BullMQ workers (Redis unavailable). Using direct execution.');
    return;
  }

  const workerOpts = { connection, concurrency: 2 };

  const lyricsWorker = new Worker<LyricsJobData>(
    'lyrics-generation',
    async (job: Job<LyricsJobData>) => {
      await processLyricsJob(job.data);
    },
    workerOpts,
  );

  lyricsWorker.on('completed', (job) => {
    console.log(`[Worker] Lyrics job ${job.id} completed`);
  });

  lyricsWorker.on('failed', (job, err) => {
    console.error(`[Worker] Lyrics job ${job?.id} failed:`, err.message);
  });

  const musicWorker = new Worker<MusicJobData>(
    'music-generation',
    async (job: Job<MusicJobData>) => {
      await processMusicJob(job.data);
    },
    workerOpts,
  );

  musicWorker.on('completed', (job) => {
    console.log(`[Worker] Music job ${job.id} completed`);
  });

  musicWorker.on('failed', (job, err) => {
    console.error(`[Worker] Music job ${job?.id} failed:`, err.message);
  });

  const videoWorker = new Worker<VideoJobData>(
    'video-generation',
    async (job: Job<VideoJobData>) => {
      await processVideoJob(job.data);
    },
    workerOpts,
  );

  videoWorker.on('completed', (job) => {
    console.log(`[Worker] Video job ${job.id} completed`);
  });

  videoWorker.on('failed', (job, err) => {
    console.error(`[Worker] Video job ${job?.id} failed:`, err.message);
  });

  console.log('[Worker] BullMQ workers started: lyrics, music, video');
}
