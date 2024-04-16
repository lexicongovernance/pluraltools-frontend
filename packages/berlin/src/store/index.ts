import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

type COMPLETION_STATUS = 'COMPLETE' | 'INCOMPLETE';

interface AppState {
  onboardingStatus: COMPLETION_STATUS;
  userStatus: COMPLETION_STATUS;
  theme: 'light' | 'dark';
  availableHearts: number;
  setUserStatus: (status: COMPLETION_STATUS) => void;
  setOnboardingStatus: (status: COMPLETION_STATUS) => void;
  setAvailableHearts: (hearts: number) => void;
  toggleTheme: () => void;
  reset: () => void;
}

export const useAppStore = create<AppState>()(
  devtools(
    persist(
      (set) => ({
        onboardingStatus: 'INCOMPLETE',
        userStatus: 'INCOMPLETE',
        eventRegistrationStatus: 'INCOMPLETE',
        theme: 'dark', // Default theme is dark
        availableHearts: 20, // Set the initial hearts value
        setUserStatus: (status: COMPLETION_STATUS) => set(() => ({ userStatus: status })),
        setOnboardingStatus: (status: COMPLETION_STATUS) =>
          set(() => ({ onboardingStatus: status })),
        setAvailableHearts: (hearts: number) => set(() => ({ availableHearts: hearts })),
        toggleTheme: () => set((state) => ({ theme: state.theme === 'light' ? 'dark' : 'light' })),
        reset: () =>
          set(() => ({
            userStatus: 'INCOMPLETE',
            eventRegistrationStatus: 'INCOMPLETE',
            availableHearts: 20,
          })),
      }),
      { name: 'lexicon-store' },
    ),
  ),
);
