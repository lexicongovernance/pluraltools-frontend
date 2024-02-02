// React and third-party libraries
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Components
import { Body } from '../components/typography/Body.styled';
import { FlexColumn } from '../components/containers/FlexColum.styled';
import { FlexRow } from '../components/containers/FlexRow.styled';
import { Title } from '../components/typography/Title.styled';
import Button from '../components/button';
import Dots from '../components/dots';

// Data
import onboarding from '../data/onboarding';
import { useAppStore } from '../store';

function Onboarding() {
  const navigate = useNavigate();
  const setOnboardingStatus = useAppStore((state) => state.setOnboardingStatus);

  const [step, setStep] = useState(0);
  const { data } = onboarding;

  const handleSkip = () => {
    setOnboardingStatus('COMPLETE');
    navigate('/account');
  };

  const handleNext = () => {
    if (step === data.length - 1) {
      handleSkip();
    }
    setStep((prevStep) => prevStep + 1);
  };

  return (
    <FlexColumn $align="flex-start" $gap="3rem">
      <Title>{data[step].title}</Title>
      <BodyContent content={data[step].body} />
      <Dots dots={data.length} activeDotIndex={step} />
      <FlexRow>
        <Button onClick={handleSkip} $color="secondary">
          Skip
        </Button>
        <Button onClick={handleNext}>Next</Button>
      </FlexRow>
    </FlexColumn>
  );
}

export default Onboarding;

type BodyContentProps = {
  content: string | string[];
};

function BodyContent({ content }: BodyContentProps) {
  if (Array.isArray(content)) {
    return (
      <ul>
        {content.map((item, index) => (
          <li key={index}>
            <Body>{item}</Body>
            <br />
          </li>
        ))}
      </ul>
    );
  }

  return <Body $minHeight={'7rem'}>{content}</Body>;
}
