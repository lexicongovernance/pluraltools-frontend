import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

type COMPLETION_STATUS = 'COMPLETE' | 'INCOMPLETE';

interface AppState {
  onboardingStatus: COMPLETION_STATUS;
  userStatus: COMPLETION_STATUS;
  registrationStatus: COMPLETION_STATUS;
  setUserStatus: (status: COMPLETION_STATUS) => void;
  setRegistrationStatus: (status: COMPLETION_STATUS) => void;
  setOnboardingStatus: (status: COMPLETION_STATUS) => void;
}

export const useAppStore = create<AppState>()(
  devtools(
    persist(
      (set) => ({
        onboardingStatus: 'INCOMPLETE',
        userStatus: 'INCOMPLETE',
        registrationStatus: 'INCOMPLETE',
        setUserStatus: (status: COMPLETION_STATUS) => set(() => ({ userStatus: status })),
        setRegistrationStatus: (status: COMPLETION_STATUS) =>
          set(() => ({ registrationStatus: status })),
        setOnboardingStatus: (status: COMPLETION_STATUS) =>
          set(() => ({ onboardingStatus: status })),
      }),
      { name: 'lexicon-store' }
    )
  )
);
