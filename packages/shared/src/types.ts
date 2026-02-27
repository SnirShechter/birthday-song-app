export type Language = 'he' | 'en';
export type Direction = 'rtl' | 'ltr';
export type Gender = 'male' | 'female' | 'other';
export type Tone = 'funny' | 'emotional' | 'mixed';

export type MusicStyle =
  | 'pop'
  | 'rap'
  | 'rock'
  | 'ballad'
  | 'mizrachi'
  | 'classic'
  | 'comedy';

export type LyricsModel = 'claude' | 'gpt4o' | 'gemini';

export type OrderStatus =
  | 'draft'
  | 'questionnaire_done'
  | 'lyrics_ready'
  | 'song_ready'
  | 'preview_played'
  | 'paid'
  | 'completed';

export type PaymentStatus = 'pending' | 'completed' | 'refunded';
export type VideoStatus = 'pending' | 'processing' | 'completed' | 'failed';
export type ProductType = 'song' | 'bundle' | 'premium' | 'pack_5' | 'pack_10';

export interface QuestionnaireAnswers {
  recipientName: string;
  recipientNickname?: string;
  recipientGender: Gender;
  recipientAge?: number;
  relationship?: string;
  personalityTraits?: string[];
  hobbies?: string;
  funnyStory?: string;
  occupation?: string;
  petPeeve?: string;
  importantPeople?: string;
  sharedMemory?: string;
  desiredMessage?: string;
  desiredTone: Tone;
  language: Language;
}

export interface Order {
  id: string;
  email?: string;
  recipientName: string;
  recipientNickname?: string;
  recipientGender: Gender;
  recipientAge?: number;
  relationship?: string;
  personalityTraits?: string[];
  hobbies?: string;
  funnyStory?: string;
  occupation?: string;
  petPeeve?: string;
  importantPeople?: string;
  sharedMemory?: string;
  desiredMessage?: string;
  desiredTone?: Tone;
  questionnaireRaw: QuestionnaireAnswers;
  language: Language;
  selectedStyle?: MusicStyle;
  selectedLyricsId?: number;
  selectedSongId?: number;
  socialSource?: string;
  socialData?: SocialProfile;
  status: OrderStatus;
  referralCode?: string;
  utmSource?: string;
  utmMedium?: string;
  createdAt: string;
  updatedAt: string;
}

export interface LyricsVariation {
  id: number;
  orderId: string;
  model: LyricsModel;
  styleVariant: MusicStyle;
  content: string;
  selected: boolean;
  editedContent?: string;
  createdAt: string;
}

export interface SongVariation {
  id: number;
  orderId: string;
  provider: string;
  providerId?: string;
  stylePrompt?: string;
  audioUrl?: string;
  previewUrl?: string;
  durationSeconds?: number;
  selected: boolean;
  createdAt: string;
}

export interface VideoClip {
  id: number;
  orderId: string;
  provider: string;
  providerId?: string;
  photoUrls: string[];
  videoStyle: string;
  videoUrl?: string;
  status: VideoStatus;
  createdAt: string;
  completedAt?: string;
}

export interface Payment {
  id: number;
  orderId: string;
  productType: ProductType;
  amountCents: number;
  currency: string;
  stripeSessionId?: string;
  stripePaymentIntent?: string;
  status: PaymentStatus;
  createdAt: string;
  paidAt?: string;
}

export interface SocialProfile {
  status: 'found' | 'private' | 'not_found';
  name?: string;
  estimatedAge?: number;
  personalityTraits?: string[];
  hobbies?: string[];
  humorStyle?: string;
  funnyThings?: string[];
  occupationHints?: string;
  petInfo?: string;
  favoriteFood?: string;
  travelPlaces?: string[];
  keyPhrases?: string[];
  suggestedSongTone?: Tone;
  songMaterial?: string[];
  photoUrls?: string[];
}

export interface AdminStats {
  totalOrders: number;
  totalRevenue: number;
  completedOrders: number;
  conversionRate: number;
  topStyles: { style: string; count: number }[];
  recentOrders: Order[];
}

export interface CheckoutSession {
  sessionId: string;
  checkoutUrl: string;
}

export interface ShareData {
  orderId: string;
  recipientName: string;
  audioUrl?: string;
  videoUrl?: string;
  style?: MusicStyle;
  createdAt: string;
}
