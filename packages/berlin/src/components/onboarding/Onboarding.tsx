import { CSSProperties, ReactNode } from 'react';
import Joyride from 'react-joyride';

type OnboardingProps = {
  steps: {
    target: string;
    content: ReactNode;
  }[];
  run?: boolean;
};

const buttonBase = {
  fontFamily: 'var(--font-family-button)',
  fontWeight: '500',
  padding: '8px 16px',
  textTransform: 'uppercase',
} satisfies CSSProperties;

function Onboarding({ steps, run = true }: OnboardingProps) {
  return (
    <Joyride
      steps={steps}
      run={run}
      continuous
      showProgress
      showSkipButton
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
