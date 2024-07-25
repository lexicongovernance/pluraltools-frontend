import { Body } from '../typography/Body.styled';
import { OnboardingCard } from './Onboarding';
import { ReactNode } from 'react';
import { Subtitle } from '../typography/Subtitle.styled';

export const eventSteps = [
  createStep({
    target: 'event',
    placement: 'center',
    title: 'Welcome',
    children: (
      <>
        <Body>Welcome to our tool!</Body>
        <Body>Would you like to take a tour to see how it works?</Body>
      </>
    ),
  }),
  createStep({
    target: 'cycles',
    title: 'Open Votes',
    children: <Body>Explore current vote items, the vote deadline, and cast your vote.</Body>,
  }),
  createStep({
    target: 'tabs',
    title: 'Closed Votes',
    children: <Body>Review past votes and see the results.</Body>,
  }),
];

type StepProps = {
  target: string;
  placement?: string;
  title: string;
  children: ReactNode;
};

function createStep({ target, placement, title, children }: StepProps) {
  return {
    target: `.${target}`, // Prefix the target with a dot to use it as a className selector
    placement,
    content: (
      <OnboardingCard>
        <Subtitle>{title}</Subtitle>
        {children}
      </OnboardingCard>
    ),
  };
}
