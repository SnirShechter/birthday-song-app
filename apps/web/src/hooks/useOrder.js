import { useCallback } from 'react';
import { api } from '@/lib/api';
export function useOrder() {
    const createOrder = useCallback(async (data) => {
        return api.post('/api/orders', data);
    }, []);
    const getOrder = useCallback(async (orderId) => {
        return api.get(`/api/orders/${orderId}`);
    }, []);
    const updateOrder = useCallback(async (orderId, data) => {
        return api.patch(`/api/orders/${orderId}`, data);
    }, []);
    const generateLyrics = useCallback(async (orderId, style) => {
        return api.post(`/api/orders/${orderId}/generate-lyrics`, { style });
    }, []);
    const getLyrics = useCallback(async (orderId) => {
        return api.get(`/api/orders/${orderId}/lyrics`);
    }, []);
    const updateLyrics = useCallback(async (orderId, lyricsId, editedContent) => {
        return api.patch(`/api/orders/${orderId}/lyrics/${lyricsId}`, { editedContent });
    }, []);
    const generateSongs = useCallback(async (orderId, lyricsId) => {
        return api.post(`/api/orders/${orderId}/generate-songs`, { lyricsId });
    }, []);
    const getSongs = useCallback(async (orderId) => {
        return api.get(`/api/orders/${orderId}/songs`);
    }, []);
    const startVideo = useCallback(async (orderId, data) => {
        return api.post(`/api/orders/${orderId}/video`, data);
    }, []);
    const getVideoStatus = useCallback(async (orderId) => {
        return api.get(`/api/orders/${orderId}/video`);
    }, []);
    const createCheckout = useCallback(async (orderId, tier) => {
        return api.post(`/api/orders/${orderId}/checkout`, {
            tier,
        });
    }, []);
    const getDownload = useCallback(async (orderId) => {
        return api.get(`/api/orders/${orderId}/download`);
    }, []);
    const scanSocial = useCallback(async (orderId, url) => {
        return api.post(`/api/orders/${orderId}/social-scan`, {
            url,
        });
    }, []);
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
