import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

interface AppState {
  onboardingStatus: 'COMPLETE' | 'INCOMPLETE';
  userStatus: 'COMPLETE' | 'INCOMPLETE';
  registrationStatus: 'COMPLETE' | 'INCOMPLETE';
  setUserStatus: (status: 'COMPLETE' | 'INCOMPLETE') => void;
  setRegistrationStatus: (status: 'COMPLETE' | 'INCOMPLETE') => void;
  setOnboardingStatus: (status: 'COMPLETE' | 'INCOMPLETE') => void;
}

export const useAppStore = create<AppState>()(
  devtools(
    persist(
      (set) => ({
        onboardingStatus: 'INCOMPLETE',
        userStatus: 'INCOMPLETE',
        registrationStatus: 'INCOMPLETE',
        setUserStatus: (status: 'COMPLETE' | 'INCOMPLETE') => set(() => ({ userStatus: status })),
        setRegistrationStatus: (status: 'COMPLETE' | 'INCOMPLETE') =>
          set(() => ({ registrationStatus: status })),
        setOnboardingStatus: (status: 'COMPLETE' | 'INCOMPLETE') =>
          set(() => ({ onboardingStatus: status })),
      }),
      { name: 'lexicon-store' }
    )
  )
);
