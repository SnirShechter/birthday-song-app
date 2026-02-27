import { useCallback } from 'react';
import { api } from '@/lib/api';
import type {
  Order,
  LyricsVariation,
  SongVariation,
  VideoClip,
  CheckoutSession,
  SocialProfile,
  MusicStyle,
  ProductType,
} from '@birthday-song/shared';

export function useOrder() {
  const createOrder = useCallback(
    async (data: {
      recipientName: string;
      recipientNickname?: string;
      recipientGender: 'male' | 'female' | 'other';
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
      desiredTone: 'funny' | 'emotional' | 'mixed';
      language: 'he' | 'en';
    }) => {
      return api.post<Order>('/api/orders', data);
    },
    [],
  );

  const getOrder = useCallback(async (orderId: string) => {
    return api.get<Order>(`/api/orders/${orderId}`);
  }, []);

  const updateOrder = useCallback(
    async (
      orderId: string,
      data: {
        email?: string;
        selectedStyle?: MusicStyle;
        selectedLyricsId?: number;
        selectedSongId?: number;
        status?: string;
      },
    ) => {
      return api.patch<Order>(`/api/orders/${orderId}`, data);
    },
    [],
  );

  const generateLyrics = useCallback(
    async (orderId: string, style: MusicStyle) => {
      return api.post<LyricsVariation[]>(
        `/api/orders/${orderId}/generate-lyrics`,
        { style },
      );
    },
    [],
  );

  const getLyrics = useCallback(async (orderId: string) => {
    return api.get<LyricsVariation[]>(`/api/orders/${orderId}/lyrics`);
  }, []);

  const updateLyrics = useCallback(
    async (orderId: string, lyricsId: number, editedContent: string) => {
      return api.patch<LyricsVariation>(
        `/api/orders/${orderId}/lyrics/${lyricsId}`,
        { editedContent },
      );
    },
    [],
  );

  const generateSongs = useCallback(
    async (orderId: string, lyricsId: number) => {
      return api.post<SongVariation[]>(
        `/api/orders/${orderId}/generate-songs`,
        { lyricsId },
      );
    },
    [],
  );

  const getSongs = useCallback(async (orderId: string) => {
    return api.get<SongVariation[]>(`/api/orders/${orderId}/songs`);
  }, []);

  const startVideo = useCallback(
    async (
      orderId: string,
      data: { photoUrls?: string[]; videoStyle: string },
    ) => {
      return api.post<VideoClip>(`/api/orders/${orderId}/video`, data);
    },
    [],
  );

  const getVideoStatus = useCallback(async (orderId: string) => {
    return api.get<VideoClip>(`/api/orders/${orderId}/video`);
  }, []);

  const createCheckout = useCallback(
    async (orderId: string, tier: ProductType) => {
      return api.post<CheckoutSession>(`/api/orders/${orderId}/checkout`, {
        tier,
      });
    },
    [],
  );

  const getDownload = useCallback(async (orderId: string) => {
    return api.get<{ audioUrl: string; wavUrl?: string }>(
      `/api/orders/${orderId}/download`,
    );
  }, []);

  const scanSocial = useCallback(
    async (orderId: string, url: string) => {
      return api.post<SocialProfile>(`/api/orders/${orderId}/social-scan`, {
        url,
      });
    },
    [],
  );

  return {
    createOrder,
    getOrder,
    updateOrder,
    generateLyrics,
    getLyrics,
    updateLyrics,
    generateSongs,
    getSongs,
    startVideo,
    getVideoStatus,
    createCheckout,
    getDownload,
    scanSocial,
  };
}
