import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

type COMPLETION_STATUS = 'COMPLETE' | 'INCOMPLETE';

interface AppState {
  onboardingStatus: COMPLETION_STATUS;
  theme: 'light' | 'dark';
  availableHearts: {
    [questionId: string]: number;
  };
  setOnboardingStatus: (status: COMPLETION_STATUS) => void;
  setAvailableHearts: ({ hearts, questionId }: { questionId: string; hearts: number }) => void;
  toggleTheme: () => void;
  reset: () => void;
}

export const useAppStore = create<AppState>()(
  devtools(
    persist(
      (set) => ({
        // Default values
        onboardingStatus: 'INCOMPLETE',
        theme: 'dark',
        availableHearts: {},
        // Actions
        setOnboardingStatus: (status: COMPLETION_STATUS) =>
          set(() => ({ onboardingStatus: status })),
        setAvailableHearts: ({ hearts, questionId }) =>
          set((state) => ({ availableHearts: { ...state.availableHearts, [questionId]: hearts } })),
        toggleTheme: () => set((state) => ({ theme: state.theme === 'light' ? 'dark' : 'light' })),
        reset: () =>
          set(() => ({
            availableHearts: {},
          })),
      }),
      {
        name: 'lexicon-store',
        // Partialize the store to only persist the required keys
        partialize: (state) => ({
          onboardingStatus: state.onboardingStatus,
          theme: state.theme,
        }),
      },
    ),
  ),
);
