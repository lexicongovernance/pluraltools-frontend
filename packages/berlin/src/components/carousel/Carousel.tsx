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

  const handleStepComplete = async () => {
    if (!isCompletingStep) {
      // Check if not already running
      setIsCompletingStep(true); // Mark as running
      try {
        if (currentStepIndex === enabledSteps.length - 1) {
          await onComplete();
        } else {
          goToNextStep();
        }
      } finally {
        setIsCompletingStep(false); // Reset after completion
      }
    }
  };
