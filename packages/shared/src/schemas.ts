import { z } from 'zod';

export const createOrderSchema = z.object({
  recipientName: z.string().min(1).max(100),
  recipientNickname: z.string().max(50).optional(),
  recipientGender: z.enum(['male', 'female', 'other']),
  recipientAge: z.number().int().min(1).max(120).optional(),
  relationship: z.string().max(100).optional(),
  personalityTraits: z.array(z.string()).max(10).optional(),
  hobbies: z.string().max(500).optional(),
  funnyStory: z.string().max(1000).optional(),
  occupation: z.string().max(200).optional(),
  petPeeve: z.string().max(500).optional(),
  importantPeople: z.string().max(500).optional(),
  sharedMemory: z.string().max(1000).optional(),
  desiredMessage: z.string().max(500).optional(),
  desiredTone: z.enum(['funny', 'emotional', 'mixed']),
  language: z.enum(['he', 'en']).default('he'),
});

export const updateOrderSchema = z.object({
  email: z.string().email().optional(),
  selectedStyle: z.enum(['pop', 'rap', 'rock', 'ballad', 'mizrachi', 'classic', 'comedy']).optional(),
  selectedLyricsId: z.number().int().optional(),
  selectedSongId: z.number().int().optional(),
  status: z.string().optional(),
});

export const generateLyricsSchema = z.object({
  style: z.enum(['pop', 'rap', 'rock', 'ballad', 'mizrachi', 'classic', 'comedy']),
});

export const generateSongsSchema = z.object({
  lyricsId: z.number().int(),
});

export const videoSchema = z.object({
  photoUrls: z.array(z.string()).max(10).optional(),
  videoStyle: z.enum(['party', 'funny', 'emotional', 'music_video', 'avatar']),
});

export const checkoutSchema = z.object({
  tier: z.enum(['song', 'bundle', 'premium', 'pack_5', 'pack_10']),
});

export const socialScanSchema = z.object({
  url: z.string().min(1).max(500),
});

export const updateLyricsSchema = z.object({
  editedContent: z.string().min(1).max(5000),
});

export type CreateOrderInput = z.infer<typeof createOrderSchema>;
export type UpdateOrderInput = z.infer<typeof updateOrderSchema>;
export type GenerateLyricsInput = z.infer<typeof generateLyricsSchema>;
export type GenerateSongsInput = z.infer<typeof generateSongsSchema>;
export type VideoInput = z.infer<typeof videoSchema>;
export type CheckoutInput = z.infer<typeof checkoutSchema>;
export type SocialScanInput = z.infer<typeof socialScanSchema>;
