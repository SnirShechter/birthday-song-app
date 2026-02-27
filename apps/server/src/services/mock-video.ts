import type { VideoStatus } from '@birthday-song/shared';

interface VideoStatusResult {
  status: VideoStatus;
  videoUrl?: string;
  progress: number;
  estimatedSecondsRemaining?: number;
}

// In-memory tracker for video generation progress
const videoProgress: Map<
  string,
  {
    startedAt: number;
    totalDurationMs: number;
    status: VideoStatus;
    videoUrl?: string;
  }
> = new Map();

const VIDEO_GENERATION_DURATION_MS = 15_000; // 15 seconds simulated generation time

export function startVideoGeneration(orderId: string, videoClipId: number): void {
  const key = `${orderId}:${videoClipId}`;
  videoProgress.set(key, {
    startedAt: Date.now(),
    totalDurationMs: VIDEO_GENERATION_DURATION_MS,
    status: 'pending',
  });
}

export function getVideoGenerationStatus(orderId: string, videoClipId: number): VideoStatusResult {
  const key = `${orderId}:${videoClipId}`;
  const entry = videoProgress.get(key);

  if (!entry) {
    return {
      status: 'pending',
      progress: 0,
      estimatedSecondsRemaining: Math.ceil(VIDEO_GENERATION_DURATION_MS / 1000),
    };
  }

  // If already completed, return immediately
  if (entry.status === 'completed') {
    return {
      status: 'completed',
      videoUrl: entry.videoUrl,
      progress: 100,
    };
  }

  if (entry.status === 'failed') {
    return {
      status: 'failed',
      progress: 0,
    };
  }

  const elapsed = Date.now() - entry.startedAt;
  const progress = Math.min(100, Math.floor((elapsed / entry.totalDurationMs) * 100));

  // First 30% of time: pending
  if (progress < 30) {
    entry.status = 'pending';
    return {
      status: 'pending',
      progress,
      estimatedSecondsRemaining: Math.ceil((entry.totalDurationMs - elapsed) / 1000),
    };
  }

  // 30-99%: processing
  if (progress < 100) {
    entry.status = 'processing';
    return {
      status: 'processing',
      progress,
      estimatedSecondsRemaining: Math.ceil((entry.totalDurationMs - elapsed) / 1000),
    };
  }

  // 100%: completed
  entry.status = 'completed';
  entry.videoUrl = `/mock-assets/videos/demo-video.mp4`;
  return {
    status: 'completed',
    videoUrl: entry.videoUrl,
    progress: 100,
  };
}

export function resetVideoProgress(orderId: string, videoClipId: number): void {
  const key = `${orderId}:${videoClipId}`;
  videoProgress.delete(key);
}
