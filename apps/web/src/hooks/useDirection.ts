import { useUIStore } from '@/stores/ui';
import type { Direction } from '@birthday-song/shared';

export function useDirection(): Direction {
  return useUIStore((s) => s.direction);
}
