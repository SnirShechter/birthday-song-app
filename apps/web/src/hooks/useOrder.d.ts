import type { Order, LyricsVariation, SongVariation, VideoClip, CheckoutSession, SocialProfile, MusicStyle, ProductType } from '@birthday-song/shared';
export declare function useOrder(): {
    createOrder: (data: {
        recipientName: string;
        recipientNickname?: string;
        recipientGender: "male" | "female" | "other";
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
        desiredTone: "funny" | "emotional" | "mixed";
        language: "he" | "en";
    }) => Promise<Order>;
    getOrder: (orderId: string) => Promise<Order>;
    updateOrder: (orderId: string, data: {
        email?: string;
        selectedStyle?: MusicStyle;
        selectedLyricsId?: number;
        selectedSongId?: number;
        status?: string;
    }) => Promise<Order>;
    generateLyrics: (orderId: string, style: MusicStyle) => Promise<LyricsVariation[]>;
    getLyrics: (orderId: string) => Promise<LyricsVariation[]>;
    updateLyrics: (orderId: string, lyricsId: number, editedContent: string) => Promise<LyricsVariation>;
    generateSongs: (orderId: string, lyricsId: number) => Promise<SongVariation[]>;
    getSongs: (orderId: string) => Promise<SongVariation[]>;
    startVideo: (orderId: string, data: {
        photoUrls?: string[];
        videoStyle: string;
    }) => Promise<VideoClip>;
    getVideoStatus: (orderId: string) => Promise<VideoClip>;
    createCheckout: (orderId: string, tier: ProductType) => Promise<CheckoutSession>;
    getDownload: (orderId: string) => Promise<{
        audioUrl: string;
        wavUrl?: string;
    }>;
    scanSocial: (orderId: string, url: string) => Promise<SocialProfile>;
};
//# sourceMappingURL=useOrder.d.ts.map