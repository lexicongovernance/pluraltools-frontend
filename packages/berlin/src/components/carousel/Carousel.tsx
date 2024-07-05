import { createContext, useContext, useEffect, useState } from 'react';
import { FlexColumn } from '../containers/FlexColumn.styled';
import Dots from '../dots';

const CarouselContext = createContext<
  | {
      step: number;
      setStep: (step: number) => void;
      nextStep: () => void;
    }
  | undefined
>(undefined);

export const CarouselProvider = ({ children }: { children: React.ReactNode }) => {
  const [step, setStep] = useState(0);

  const nextStep = () => {
    setStep((prevStep) => prevStep + 1);
  };

  const value = {
    step,
    setStep,
    nextStep,
  };

  return <CarouselContext.Provider value={value}>{children}</CarouselContext.Provider>;
};

export const useCarousel = () => {
  const context = useContext(CarouselContext);
  if (context === undefined) {
    throw new Error('useCarousel must be used within a CarouselProvider');
  }
  return context;
};

export const Carousel = ({
  defaultStep,
  steps,
  onComplete,
}: {
  steps: { node: React.ReactNode; enabled: boolean }[];
  defaultStep: number;
  onComplete?: () => void;
}) => {
  const { step, setStep } = useCarousel();

  useEffect(() => {
    const enabledSteps = steps.filter((step) => step.enabled);
    const lastStep = enabledSteps.length - 1;
    if (step === lastStep) {
      onComplete?.();
    }
  }, [step, defaultStep, steps, onComplete]);

  const getStep = (
    step: number,
    defaultStep: number,
    steps: { node: React.ReactNode; enabled: boolean }[],
  ) => {
    const enabledSteps = steps.filter((step) => step.enabled);

    if (step === undefined) {
      return defaultStep;
    }

    if (step < 0) {
      return 0;
    }

    if (step >= enabledSteps.length) {
      return enabledSteps.length - 1;
    }

    return step;
  };

  if (steps.length === 0) {
    return <></>;
  }

  return (
    <FlexColumn $gap="1.5rem">
      {steps?.[getStep(step, defaultStep, steps)]?.node ?? <></>}
      <Dots
        dots={steps.filter((step) => step.enabled).length}
        activeDotIndex={getStep(step, defaultStep, steps)}
        handleClick={(i) => {
          // the user is not allowed to go out of the first step
          if (defaultStep == 0) {
            return;
          }

          setStep(i);
        }}
      />
    </FlexColumn>
  );
};
