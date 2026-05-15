import { create } from 'zustand';

interface GenerationState {
  /** Map of generation keys (e.g. projectId, cardId) to their current status/result */
  statuses: Record<string, string | null>;
  
  /** Map of keys to boolean loading states */
  loading: Record<string, boolean>;

  setLoading: (key: string, isLoading: boolean, status?: string | null) => void;
  setStatus: (key: string, status: string | null) => void;
  
  /** Helper to check if anything is generating for a key */
  isGenerating: (key: string) => boolean;
  getStatus: (key: string) => string | null;
}

export const useGenerationStore = create<GenerationState>((set, get) => ({
  statuses: {},
  loading: {},

  setLoading: (key, isLoading, status = null) => set(state => ({
    loading: { ...state.loading, [key]: isLoading },
    statuses: { ...state.statuses, [key]: status ?? state.statuses[key] }
  })),

  setStatus: (key, status) => set(state => ({
    statuses: { ...state.statuses, [key]: status }
  })),

  isGenerating: (key) => !!get().loading[key],
  getStatus: (key) => get().statuses[key],
}));
