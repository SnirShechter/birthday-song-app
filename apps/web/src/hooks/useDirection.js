import { useUIStore } from '@/stores/ui';
export function useDirection() {
    return useUIStore((s) => s.direction);
}
