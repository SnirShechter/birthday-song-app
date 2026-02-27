import type { SongVariation, MusicStyle } from '@birthday-song/shared';
import { v4 as uuidv4 } from 'uuid';

interface SongGenerationResult {
  provider: string;
  providerId: string;
  stylePrompt: string;
  audioUrl: string;
  previewUrl: string;
  durationSeconds: number;
  label: string;
}

const VARIATION_METADATA: { provider: string; label: string; durationRange: [number, number] }[] = [
  { provider: 'suno', label: 'Energetic', durationRange: [160, 200] },
  { provider: 'suno', label: 'Mellow', durationRange: [170, 210] },
  { provider: 'udio', label: 'Classic', durationRange: [150, 190] },
];

const STYLE_PROMPTS: Record<MusicStyle, string> = {
  pop: 'pop, upbeat, birthday, celebration, happy, catchy, major key, 120 bpm',
  rap: 'hip-hop, rap, birthday, energetic, rhythmic, 95 bpm, trap beats',
  rock: 'rock, alternative, birthday, energetic, electric guitar, 130 bpm, anthemic',
  ballad: 'emotional ballad, piano driven, heartfelt, soft vocals, string accompaniment, 85 bpm',
  mizrachi: 'israeli mizrachi pop, middle eastern celebration, darbuka, strings, joyful, warm vocals, 120 bpm',
  classic: 'jazz standard, birthday, sophisticated, piano, brass, swing feel, 100 bpm',
  comedy: 'comedy song, silly, exaggerated delivery, quirky instruments, novelty song, 110 bpm',
};

export async function generateMockSongs(
  orderId: string,
  style: MusicStyle,
  language: string,
): Promise<SongGenerationResult[]> {
  // Simulate music generation delay (3000-6000ms)
  const delay = 3000 + Math.random() * 3000;
  await new Promise((resolve) => setTimeout(resolve, delay));

  const numVariations = 2 + Math.floor(Math.random() * 2); // 2 or 3
  const results: SongGenerationResult[] = [];

  for (let i = 0; i < numVariations; i++) {
    const meta = VARIATION_METADATA[i % VARIATION_METADATA.length];
    const providerId = `${meta.provider}_${uuidv4().slice(0, 8)}`;
    const duration =
      meta.durationRange[0] + Math.floor(Math.random() * (meta.durationRange[1] - meta.durationRange[0]));

    results.push({
      provider: meta.provider,
      providerId,
      stylePrompt: `${STYLE_PROMPTS[style]}, ${language === 'he' ? 'hebrew' : 'english'}`,
      audioUrl: `/mock-assets/songs/${orderId}-v${i + 1}-full.mp3`,
      previewUrl: `/mock-assets/songs/${orderId}-v${i + 1}-preview.mp3`,
      durationSeconds: duration,
      label: meta.label,
    });
  }

  return results;
}
