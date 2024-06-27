import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

type COMPLETION_STATUS = 'COMPLETE' | 'INCOMPLETE';

interface AppState {
  userStatus: COMPLETION_STATUS;
  theme: 'light' | 'dark';
  availableHearts: {
    [questionId: string]: number;
  };
  onboardingStatus: {
    event: COMPLETION_STATUS;
    cycle: COMPLETION_STATUS;
    results: COMPLETION_STATUS;
  };
  setUserStatus: (status: COMPLETION_STATUS) => void;
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
        userStatus: 'INCOMPLETE',
        eventRegistrationStatus: 'INCOMPLETE',
        onboardingStatus: {
          event: 'INCOMPLETE',
          cycle: 'INCOMPLETE',
          results: 'INCOMPLETE',
        },
        theme: 'dark', // Default theme is dark
        availableHearts: {}, // Set the initial hearts value
        setUserStatus: (status: COMPLETION_STATUS) => set(() => ({ userStatus: status })),
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
            userStatus: 'INCOMPLETE',
            eventRegistrationStatus: 'INCOMPLETE',
            availableHearts: {},
          })),
      }),
      { name: 'lexicon-store' },
    ),
  ),
);
