import React, { useState } from 'react';
import { FlexColumn } from '../containers/FlexColumn.styled';
import Dots from '../dots';

type CarouselStepProps = {
  handleStepComplete: () => Promise<void>;
  goToPreviousStep: () => void;
  isFirstStep: boolean;
  isLastStep: boolean;
};

type Step = {
  render: (props: CarouselStepProps) => React.ReactNode;
  isEnabled: boolean;
};

type CarouselProps = {
  steps: Step[];
  initialStep?: number;
  onComplete: () => Promise<void>;
};

export function Carousel({ steps, initialStep = 0, onComplete }: CarouselProps) {
  const [currentStepIndex, setCurrentStepIndex] = useState(initialStep);
  const [isCompletingStep, setIsCompletingStep] = useState(false);

  const enabledSteps = steps.filter((step) => step.isEnabled);

  const goToNextStep = () => {
    setCurrentStepIndex((prevIndex) => {
      let nextIndex = prevIndex + 1;
      while (nextIndex < steps.length && !steps[nextIndex].isEnabled) {
        nextIndex++;
      }
      return nextIndex < steps.length ? nextIndex : prevIndex;
    });
  };

  const goToPreviousStep = () => {
    setCurrentStepIndex((prevIndex) => {
      let previousIndex = prevIndex - 1;
      while (previousIndex >= 0 && !steps[previousIndex].isEnabled) {
        previousIndex--;
      }
      return previousIndex >= 0 ? previousIndex : prevIndex;
    });
  };

  const goToStep = (index: number) => {
    if (index >= 0 && index < steps.length && steps[index].isEnabled) {
      setCurrentStepIndex(index);
    }
  };

  const handleStepComplete = async () => {
    if (!isCompletingStep) {
      // Check if not already running
      setIsCompletingStep(true); // Mark as running
      if (currentStepIndex === enabledSteps.length - 1) {
        await onComplete();
      } else {
        goToNextStep();
      }
      setIsCompletingStep(false); // Reset after completion
    }
  };

  const currentStep = steps[currentStepIndex];
  const isFirstStep = currentStepIndex === 0;
  const isLastStep = currentStepIndex === enabledSteps.length - 1;

  return (
    <FlexColumn $gap="1.5rem">
      {currentStep.render({
        handleStepComplete,
        goToPreviousStep,
        isFirstStep,
        isLastStep,
      })}
      <Dots
        dots={steps.filter((step) => step.isEnabled).length}
        activeDotIndex={currentStepIndex}
        handleClick={goToStep}
      />
    </FlexColumn>
  );
}
