import type { MusicStyle, ProductType } from './types.js';

export const MUSIC_STYLES: {
  id: MusicStyle;
  emoji: string;
  nameEn: string;
  nameHe: string;
  descriptionEn: string;
  descriptionHe: string;
  tags: string;
}[] = [
  {
    id: 'pop',
    emoji: '🎤',
    nameEn: 'Pop',
    nameHe: 'פופ',
    descriptionEn: 'Catchy, upbeat, happy vibes',
    descriptionHe: 'קצבי, שמח, קאצ\'י',
    tags: 'pop, upbeat, birthday, celebration, happy, catchy, major key, 120 bpm',
  },
  {
    id: 'rap',
    emoji: '🎵',
    nameEn: 'Rap / Hip-Hop',
    nameHe: 'ראפ / היפ-הופ',
    descriptionEn: 'Punchlines, flow, wordplay',
    descriptionHe: 'פאנצ\'ליינים, פלואו, משחקי מילים',
    tags: 'hip-hop, rap, birthday, energetic, rhythmic, 95 bpm, trap beats',
  },
  {
    id: 'rock',
    emoji: '🎸',
    nameEn: 'Rock',
    nameHe: 'רוק',
    descriptionEn: 'Guitars, energy, anthem',
    descriptionHe: 'גיטרות, אנרגיה, המנון',
    tags: 'rock, alternative, birthday, energetic, electric guitar, 130 bpm, anthemic',
  },
  {
    id: 'ballad',
    emoji: '🎹',
    nameEn: 'Ballad',
    nameHe: 'באלדה',
    descriptionEn: 'Emotional, piano-driven, heartfelt',
    descriptionHe: 'רגשי, פסנתר, מרגש',
    tags: 'emotional ballad, piano driven, heartfelt, soft vocals, string accompaniment, 85 bpm',
  },
  {
    id: 'mizrachi',
    emoji: '🎺',
    nameEn: 'Mizrachi',
    nameHe: 'מזרחי',
    descriptionEn: 'Israeli Mizrachi, warm and festive',
    descriptionHe: 'מזרחי ישראלי, חם וחגיגי',
    tags: 'israeli mizrachi pop, middle eastern celebration, darbuka, strings, joyful, warm vocals, 120 bpm, hebrew',
  },
  {
    id: 'classic',
    emoji: '🎻',
    nameEn: 'Classic / Jazz',
    nameHe: 'קלאסי / ג\'אז',
    descriptionEn: 'Classy, unique, sophisticated',
    descriptionHe: 'אלגנטי, ייחודי, מתוחכם',
    tags: 'jazz standard, birthday, sophisticated, piano, brass, swing feel, 100 bpm',
  },
  {
    id: 'comedy',
    emoji: '😂',
    nameEn: 'Comedy / Roast',
    nameHe: 'קומדי / רוסט',
    descriptionEn: 'Funny, sharp, with love',
    descriptionHe: 'מצחיק, חד, עם אהבה',
    tags: 'comedy song, silly, exaggerated delivery, quirky instruments, novelty song, 110 bpm',
  },
];

export const PRICING: Record<ProductType, { amountCents: number; label: string; labelHe: string; description: string; descriptionHe: string }> = {
  song: {
    amountCents: 999,
    label: 'Song Only',
    labelHe: 'שיר בלבד',
    description: 'Full song (2-3 min), MP3 + WAV, no watermark',
    descriptionHe: 'שיר מלא (2-3 דק\'), MP3 + WAV, ללא watermark',
  },
  bundle: {
    amountCents: 1999,
    label: 'Song + Video',
    labelHe: 'שיר + וידאו',
    description: 'Full song + 30s video clip + sharing page',
    descriptionHe: 'שיר מלא + וידאו קליפ 30 שניות + עמוד שיתוף',
  },
  premium: {
    amountCents: 2999,
    label: 'Premium',
    labelHe: 'פרימיום',
    description: '3 song versions + HD video + QR code',
    descriptionHe: '3 גרסאות שיר + וידאו HD + QR code',
  },
  pack_5: {
    amountCents: 3999,
    label: '5-Pack',
    labelHe: 'חבילת 5',
    description: '5 full songs (20% off)',
    descriptionHe: '5 שירים מלאים (20% הנחה)',
  },
  pack_10: {
    amountCents: 6999,
    label: '10-Pack',
    labelHe: 'חבילת 10',
    description: '10 full songs (30% off)',
    descriptionHe: '10 שירים מלאים (30% הנחה)',
  },
};

export const VIDEO_STYLES = [
  { id: 'party', emoji: '🎉', nameEn: 'Party Vibes', nameHe: 'מסיבה' },
  { id: 'funny', emoji: '😂', nameEn: 'Funny Montage', nameHe: 'מצחיק' },
  { id: 'emotional', emoji: '💕', nameEn: 'Emotional Tribute', nameHe: 'רגשי' },
  { id: 'music_video', emoji: '🎬', nameEn: 'Music Video', nameHe: 'קליפ' },
  { id: 'avatar', emoji: '🌟', nameEn: 'AI Avatar', nameHe: 'אווטאר' },
] as const;

export const PERSONALITY_TRAITS = {
  en: ['Funny', 'Responsible', 'Adventurous', 'Shy', 'Dramatic', 'Kind', 'Stubborn', 'Creative', 'Athletic', 'Nerdy', 'Romantic', 'Sarcastic'],
  he: ['מצחיק/ה', 'אחראי/ת', 'הרפתקן/ית', 'ביישן/ית', 'דרמטי/ת', 'חביב/ה', 'עקשן/ית', 'יצירתי/ת', 'ספורטיבי/ת', 'נרדי/ת', 'רומנטי/ת', 'סרקסטי/ת'],
};

export const RELATIONSHIPS = {
  en: ['Best Friend', 'Partner', 'Mom', 'Dad', 'Sister', 'Brother', 'Colleague', 'Boss', 'Grandma', 'Grandpa', 'Son', 'Daughter'],
  he: ['חבר/ה הכי טוב/ה', 'בן/בת זוג', 'אמא', 'אבא', 'אחות', 'אח', 'עמית/ה', 'בוס', 'סבתא', 'סבא', 'בן', 'בת'],
};
