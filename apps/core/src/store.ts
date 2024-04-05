import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

type COMPLETION_STATUS = 'COMPLETE' | 'INCOMPLETE';

interface AppState {
  onboardingStatus: COMPLETION_STATUS;
  userStatus: COMPLETION_STATUS;
  setUserStatus: (status: COMPLETION_STATUS) => void;
  setOnboardingStatus: (status: COMPLETION_STATUS) => void;
  reset: () => void;
}

export const useAppStore = create<AppState>()(
  devtools(
    persist(
      (set) => ({
        onboardingStatus: 'INCOMPLETE',
        userStatus: 'INCOMPLETE',
        setUserStatus: (status: COMPLETION_STATUS) => set(() => ({ userStatus: status })),
        setOnboardingStatus: (status: COMPLETION_STATUS) =>
          set(() => ({ onboardingStatus: status })),
        reset: () => set(() => ({ userStatus: 'INCOMPLETE' })),
      }),
      { name: 'lexicon-store' },
    ),
  ),
);
