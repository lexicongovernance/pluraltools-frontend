import { Body } from '../typography/Body.styled';
import { ChevronDown, Heart, Minus, Plus, Radical } from 'lucide-react';
import { FlexRow } from '../containers/FlexRow.styled';
import { OnboardingCard } from './Onboarding';
import { ReactNode } from 'react';
import { Subtitle } from '../typography/Subtitle.styled';
import Button from '../button';

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

export const cycleSteps = [
  createStep({
    target: 'welcome',
    title: 'Voting Page',
    placement: 'center',
    children: <Body>View vote items and allocate your hearts.</Body>,
  }),
  createStep({
    target: 'votes',
    title: 'Vote',

    children: (
      <>
        <FlexRow>
          <Button style={{ padding: '4px 4px', borderRadius: 0 }}>
            <Minus height={16} width={16} strokeWidth={3} />
          </Button>
          <Body>0</Body>
          <Button style={{ padding: '4px 4px', borderRadius: 0 }}>
            <Plus height={16} width={16} strokeWidth={3} />
          </Button>
        </FlexRow>
        <Body>Upvote or downvote a vote item.</Body>
      </>
    ),
  }),
  createStep({
    target: 'hearts',
    title: 'Information',
    children: (
      <Body>
        <Heart className="inline align-top" fill="#ff0000" /> Current number of hearts allocated to
        this vote item.
      </Body>
    ),
  }),
  createStep({
    target: 'save',
    title: 'Save Your Votes',
    children: <Body>You must click this button or your votes will not be recorded.</Body>,
  }),
  createStep({
    target: 'plurality',
    title: 'Voting Mechanisms',
    placement: 'center',
    children: (
      <Body>
        <img src="/icons/plurality-score.svg" className="inline align-bottom" /> Plurality score,
        unlike quadratic score, considers pre-existing participant relationships.
      </Body>
    ),
  }),
  createStep({
    target: 'expand',
    title: 'Expand a vote item',

    children: (
      <Body>
        Click <ChevronDown className="inline align-middle" /> to view the vote item description and
        other useful information.
      </Body>
    ),
  }),
];

export const resultsSteps = [
  createStep({
    target: 'welcome',
    placement: 'center',
    title: 'Results Page',
    children: <Body>See community decisions.</Body>,
  }),
  createStep({
    target: 'icons',
    placement: 'center',
    title: 'Icons',
    children: (
      <>
        <Body>
          <img src="/icons/plurality-score.svg" className="inline align-bottom" /> Plurality score
        </Body>
        <Body>
          <Radical className="inline" /> Quadratic score
        </Body>
        <Body>
          <Heart className="inline" fill="#ff0000" /> Hearts received by a vote item
        </Body>
      </>
    ),
  }),
  createStep({
    target: 'expand',
    placement: 'center',
    title: 'Expand a vote item',
    children: (
      <Body>
        Click <ChevronDown className="inline align-middle" /> to view the vote item description and
        other useful information.
      </Body>
    ),
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
