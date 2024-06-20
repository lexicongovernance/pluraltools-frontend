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
        onboardingStatus: 'INCOMPLETE',
        eventRegistrationStatus: 'INCOMPLETE',
        theme: 'dark', // Default theme is dark
        availableHearts: {}, // Set the initial hearts value
        setOnboardingStatus: (status: COMPLETION_STATUS) =>
          set(() => ({ onboardingStatus: status })),
        setAvailableHearts: ({ hearts, questionId }) =>
          set((state) => ({ availableHearts: { ...state.availableHearts, [questionId]: hearts } })),
        toggleTheme: () => set((state) => ({ theme: state.theme === 'light' ? 'dark' : 'light' })),
        reset: () =>
          set(() => ({
            userStatus: 'INCOMPLETE',
            eventRegistrationStatus: 'INCOMPLETE',
            availableHearts: {},
          })),
      }),
      { name: 'lexicon-store' },
    ),
  ),
);
