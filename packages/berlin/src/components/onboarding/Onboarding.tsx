import { CSSProperties, ReactNode } from 'react';
import Joyride, { CallBackProps } from 'react-joyride';
import { useAppStore } from '../../store';

type OnboardingProps = {
  type: 'event' | 'cycle' | 'results';
  steps: {
    target: string;
    content: ReactNode;
  }[];
};

const buttonBase: CSSProperties = {
  fontFamily: 'var(--font-family-button)',
  fontWeight: '500',
  padding: '8px 16px',
  textTransform: 'uppercase',
};

function Onboarding({ steps, type }: OnboardingProps) {
  const { onboardingStatus, setOnboardingStatus } = useAppStore((state) => ({
    onboardingStatus: state.onboardingStatus,
    setOnboardingStatus: state.setOnboardingStatus,
  }));

  const run = onboardingStatus[type] !== 'COMPLETE';

  const handleJoyrideCallback = (data: CallBackProps) => {
    if (data.status === 'finished' || data.status === 'skipped') {
      setOnboardingStatus(type, 'COMPLETE');
      console.log('Onboarding completed for', type);
    }
  };

  return (
    <Joyride
      steps={steps}
      run={run}
      continuous
      showProgress
      showSkipButton
      hideCloseButton
      callback={handleJoyrideCallback}
      styles={{
        buttonBack: {
          ...buttonBase,
          backgroundColor: 'var(--color-white)',
          color: 'var(--color-black)',
        },
        buttonNext: {
          ...buttonBase,
          backgroundColor: 'var(--color-black)',
          color: 'var(--color-white)',
        },
        buttonSkip: {
          ...buttonBase,
          backgroundColor: 'var(--color-white)',
          color: 'var(--color-black)',
        },
        buttonClose: {
          color: 'var(--color-black)',
        },
        options: {
          arrowColor: 'var(--color-white)',
          backgroundColor: 'var(--color-white)',
          primaryColor: 'var(--color-black)',
        },
      }}
    />
  );
}

export default Onboarding;
