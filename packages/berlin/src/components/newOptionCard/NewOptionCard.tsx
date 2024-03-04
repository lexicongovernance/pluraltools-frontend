import { useMemo } from 'react';
import { Body } from '../typography/Body.styled';
import { Affiliation, Author, Card, Hearts, Plurality, Proposal } from './NewOptionCard.styled';
import { FlexColumn } from '../containers/FlexColum.styled';
import IconButton from '../iconButton';
import { useAppStore } from '../../store';

type NewOptionCardProps = {
  option: {
    id: string;
    createdAt: string;
    updatedAt: string;
    questionId: string;
    optionTitle: string;
    optionSubTitle?: string;
    accepted: boolean;
    voteScore: number;
    user: {
      username: string;
      group: {
        id: string;
        name: string;
      };
    };
  };
  numOfVotes: number;
  onVote: () => void;
  onUnvote: () => void;
};
function NewOptionCard({ option, numOfVotes, onVote, onUnvote }: NewOptionCardProps) {
  const theme = useAppStore((state) => state.theme);
  const formattedPluralityScore = useMemo(() => {
    const score = parseFloat(String(option.voteScore));
    return score % 1 === 0 ? score.toFixed(0) : score.toFixed(3);
  }, [option.voteScore]);

  return (
    <Card>
      <Proposal>
        <Body>{option.optionTitle}</Body>
      </Proposal>
      <Author>
        <Body>{option.user?.username}</Body>
      </Author>
      <Affiliation>
        <Body>{option.user?.group?.name}</Body>
      </Affiliation>
      <Hearts>
        <FlexColumn $gap="-4px">
          <IconButton
            $padding={0}
            $color="secondary"
            icon={{ src: `/icons/upvote-${theme}.svg`, alt: 'Upvote arrow' }}
            onClick={onVote}
          />
          <IconButton
            $padding={0}
            $color="secondary"
            icon={{ src: `/icons/downvote-${theme}.svg`, alt: 'Downvote arrow' }}
            onClick={onUnvote}
          />
        </FlexColumn>
        <Body>{numOfVotes}</Body>
      </Hearts>
      <Plurality>
        <Body>{formattedPluralityScore}</Body>
      </Plurality>
    </Card>
  );
}

export default NewOptionCard;
