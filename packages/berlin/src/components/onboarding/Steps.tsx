import { Body } from '../typography/Body.styled';
import { FlexColumn } from '../containers/FlexColumn.styled';
import { FlexRow } from '../containers/FlexRow.styled';
import { Heart } from 'lucide-react';
import { OnboardingCard } from './Onboarding';
import { ReactNode } from 'react';
import { Subtitle } from '../typography/Subtitle.styled';
import Button from '../button';
import Icon from '../icon';
import IconButton from '../icon-button';

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
    target: 'step-1',
    title: 'Voting Page',
    placement: 'center',
    children: <Body>View vote items and allocate your hearts.</Body>,
  }),
  createStep({
    target: 'step-2',
    title: 'Vote',
    placement: 'center',
    children: (
      <FlexRow>
        <FlexColumn $gap="-4px" style={{ width: 16 }}>
          <IconButton
            $padding={0}
            $color="secondary"
            icon={{ src: `/icons/upvote-${`dark`}.svg`, alt: 'Upvote arrow' }}
            $width={16}
            $height={16}
          />
          <IconButton
            $padding={0}
            $color="secondary"
            icon={{ src: `/icons/downvote-${`dark`}.svg`, alt: 'Downvote arrow' }}
            $width={16}
            $height={16}
          />
        </FlexColumn>
        <Body>Upvote or downvote a vote item.</Body>
      </FlexRow>
    ),
  }),
  createStep({
    target: 'step-3',
    title: 'Save Your Votes',
    placement: 'center',
    children: (
      <Body>
        You must click the
        <Button $color="secondary" style={{ paddingInline: 4 }}>
          save all votes
        </Button>{' '}
        button or your vote will not be recorded.
      </Body>
    ),
  }),
  createStep({
    target: 'step-4',
    title: 'Information',
    placement: 'center',
    children: (
      <>
        <Body>View vote item.</Body>
        <FlexRow>
          <Icon>
            <Heart fill="#ff0000" />
          </Icon>
          <Body>Current number of hearts allocated to this vote item.</Body>
        </FlexRow>
      </>
    ),
  }),
  createStep({
    target: 'step-5',
    title: 'Voting Mechanisms',
    placement: 'center',
    children: (
      <FlexRow>
        <IconButton
          $padding={0}
          $color="secondary"
          icon={{ src: `/icons/plurality-score.svg`, alt: 'Plurality score icon' }}
          $width={24}
          $height={24}
        />
        <Body>
          Plurality score, unlike quadratic score, considers pre-existing participant relationships
        </Body>
      </FlexRow>
    ),
  }),
  createStep({
    target: 'step-6',
    title: 'Expand a vote item',
    placement: 'center',
    children: (
      <FlexRow>
        <IconButton
          $padding={0}
          $color="secondary"
          icon={{ src: `/icons/arrow-down-${`dark`}.svg`, alt: 'Arrow down icon' }}
          $width={24}
          $height={24}
        />
        <Body>Click to view the vote item description and other useful information.</Body>
      </FlexRow>
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
