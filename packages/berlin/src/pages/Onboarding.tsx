// React and third-party libraries
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

// Components
import { Body } from '../components/typography/Body.styled';
import { Bold } from '../components/typography/Bold.styled';
import { FlexColumn } from '../components/containers/FlexColumn.styled';
import { FlexRow } from '../components/containers/FlexRow.styled';
import { SafeArea } from '../layout/Layout.styled';
import { Subtitle } from '../components/typography/Subtitle.styled';
import Button from '../components/button';
import Dots from '../components/dots';

// Data
import onboarding from '../data/onboarding';
import { useAppStore } from '../store';
const { data } = onboarding;

function Onboarding() {
  const navigate = useNavigate();
  const location = useLocation();
  const [previousPath, setPreviousPath] = useState<string | null>(null);
  const setOnboardingStatus = useAppStore((state) => state.setOnboardingStatus);
  const [step, setStep] = useState<number>(0);

  useEffect(() => {
    if (location && location.state) {
      setPreviousPath(location.state.previousPath);
      if (location.state.onboardingStep) {
        setStep(location.state.onboardingStep);
      }
    }
  }, [location]);

  const handleSkip = () => {
    if (previousPath) {
      navigate(previousPath);
    } else {
      navigate('/account');
      setOnboardingStatus('COMPLETE');
    }
  };

  const handleNext = () => {
    if (step < data.length - 1) {
      setStep((prevStep) => prevStep + 1);
      return;
    }

    handleSkip();
  };

  return (
    <SafeArea>
      <FlexColumn $gap="3rem">
        <Subtitle>{data[step].title}</Subtitle>
        <BodyContent content={data[step].body} />
        <Dots dots={data.length} activeDotIndex={step} handleClick={(i) => setStep(i)} />
        <FlexRow>
          <Button onClick={handleSkip} $color="secondary">
            Skip
          </Button>
          <Button onClick={handleNext}>Next</Button>
        </FlexRow>
      </FlexColumn>
    </SafeArea>
  );
}

export default Onboarding;

type BodyContentProps = {
  content: string | { id: number; title?: string; text: string }[];
};

function BodyContent({ content }: BodyContentProps) {
  if (Array.isArray(content) && content[0].title) {
    return (
      <FlexColumn $gap="1.5rem">
        {content.map((item) => (
          <Body key={item.id}>
            <Bold>{item.title}</Bold>
            {item.text}
          </Body>
        ))}
      </FlexColumn>
    );
  }

  if (Array.isArray(content)) {
    return (
      <FlexColumn $gap="1.5rem">
        {content.map((item) => (
          <Body key={item.id}>{item.text}</Body>
        ))}
      </FlexColumn>
    );
  }

  return <Body $minHeight={'7rem'}>{content}</Body>;
}
