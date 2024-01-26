import { useState } from 'react';
import { FlexColumn, FlexRow } from '../../layout/Layout.styled';
import Button from '../button';
import Body from '../typography/Body';
import Title from '../typography/Title';
import { Dot, StyledOnboarding } from './Onboarding.styled';

type OnboardingProps = {
  data: {
    id: number;
    title: string;
    body: string;
  }[];
  handleSkip: () => void;
};

function Onboarding({ data, handleSkip }: OnboardingProps) {
  const [currentStep, setCurrentStep] = useState(0);

  const handleNext = () => {
    if (currentStep === data.length - 1) {
      handleSkip();
    }
    setCurrentStep((prevStep) => prevStep + 1);
  };

  return (
    <StyledOnboarding $gap="2rem" $justifyContent="space-between">
      <FlexColumn>
        <Title>{data[currentStep].title}</Title>
        <Body $align="center">{data[currentStep].body}</Body>
      </FlexColumn>
      <FlexColumn $gap="3rem">
        <FlexRow $alignSelf="center" $gap="0.5rem">
          {data.map((step) => (
            <Dot key={step.id} active={step.id === currentStep} />
          ))}
        </FlexRow>
        <FlexRow $alignSelf="center">
          <Button variant="text" onClick={handleSkip}>
            Skip
          </Button>
          <Button onClick={handleNext}>Next</Button>
        </FlexRow>
      </FlexColumn>
    </StyledOnboarding>
  );
}

export default Onboarding;
