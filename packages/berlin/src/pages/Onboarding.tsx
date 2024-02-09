// React and third-party libraries
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Components
import { Body } from '../components/typography/Body.styled';
import { Bold } from '../components/typography/Bold.styled';
import { FlexColumn } from '../components/containers/FlexColum.styled';
import { FlexRow } from '../components/containers/FlexRow.styled';
import { Title } from '../components/typography/Title.styled';
import Button from '../components/button';
import Dots from '../components/dots';

// Data
import onboarding from '../data/onboarding';

function Onboarding() {
  const navigate = useNavigate();

  const [step, setStep] = useState(0);
  const { data } = onboarding;

  const handleSkip = () => {
    navigate('/account');
  };

  const handleNext = () => {
    if (step === data.length - 1) {
      handleSkip();
    }
    setStep((prevStep) => prevStep + 1);
  };

  return (
    <FlexColumn $gap="3rem">
      <Title>{data[step].title}</Title>
      <BodyContent content={data[step].body} />
      <Dots dots={data.length} activeDotIndex={step} setStep={setStep} />
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
  content: string | { id: number; title?: string; text: string }[];
};

function BodyContent({ content }: BodyContentProps) {
  if (Array.isArray(content) && content[0].title) {
    return (
      <ul>
        {content.map((item) => (
          <li key={item.id}>
            <Body>
              <Bold>{item.title}</Bold>
              {item.text}
            </Body>
            <br />
          </li>
        ))}
      </ul>
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
