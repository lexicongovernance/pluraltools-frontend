import { useState, useCallback } from 'react';

export type CarouselStepProps = {
  onSubmit: () => void;
  isFirstStep: boolean;
  isLastStep: boolean;
  goToPreviousStep: () => void;
};

export type Step<T extends CarouselStepProps = CarouselStepProps> = {
  component: React.ComponentType<T>;
  // Omit the CarouselStepProps from the props of the component
  props: Omit<T, keyof CarouselStepProps>;
  isEnabled: boolean;
};

export function useCarousel(steps: Step[], initialStep = 0) {
  const [currentStepIndex, setCurrentStepIndex] = useState(initialStep);

  const goToNextStep = useCallback(() => {
    setCurrentStepIndex((prevIndex) => {
      let nextIndex = prevIndex + 1;
      // Skip disabled steps
      while (nextIndex < steps.length && !steps[nextIndex].isEnabled) {
        nextIndex++;
      }
      return nextIndex < steps.length ? nextIndex : prevIndex;
    });
  }, [steps]);

  const goToPreviousStep = useCallback(() => {
    setCurrentStepIndex((prevIndex) => {
      let previousIndex = prevIndex - 1;
      // Skip disabled steps
      while (previousIndex >= 0 && !steps[previousIndex].isEnabled) {
        previousIndex--;
      }
      return previousIndex >= 0 ? previousIndex : prevIndex;
    });
  }, [steps]);

  const goToStep = useCallback(
    (index: number) => {
      if (index >= 0 && index < steps.length && steps[index].isEnabled) {
        setCurrentStepIndex(index);
      }
    },
    [steps],
  );

  const currentStep = steps[currentStepIndex];

  return {
    currentStepIndex,
    currentStep,
    goToNextStep,
    goToPreviousStep,
    goToStep,
    isFirstStep: currentStepIndex === 0,
    isLastStep: currentStepIndex === steps.length - 1,
  };
}
