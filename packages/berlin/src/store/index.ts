import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

type COMPLETION_STATUS = 'COMPLETE' | 'INCOMPLETE';

interface AppState {
  theme: 'light' | 'dark';
  availableHearts: {
    [questionId: string]: number;
  };
  onboardingStatus: {
    event: COMPLETION_STATUS;
    cycle: COMPLETION_STATUS;
    results: COMPLETION_STATUS;
  };
  setAvailableHearts: ({ hearts, questionId }: { questionId: string; hearts: number }) => void;
  setOnboardingStatus: (
    type: keyof AppState['onboardingStatus'],
    status: COMPLETION_STATUS,
  ) => void;
  toggleTheme: () => void;
  reset: () => void;
}

export const useAppStore = create<AppState>()(
  devtools(
    persist(
      (set) => ({
        onboardingStatus: {
          event: 'INCOMPLETE',
          cycle: 'INCOMPLETE',
          results: 'INCOMPLETE',
        },
        theme: 'dark', // Default theme is dark
        availableHearts: {}, // Set the initial hearts value
        setOnboardingStatus: (type, status) =>
          set((state) => ({
            onboardingStatus: {
              ...state.onboardingStatus,
              [type]: status,
            },
          })),
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
