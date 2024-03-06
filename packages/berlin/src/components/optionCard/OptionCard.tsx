import { useMemo, useState } from 'react';
import { Body } from '../typography/Body.styled';
import { Affiliation, Author, Card, Hearts, Plurality, Proposal } from './OptionCard.styled';
import { FlexColumn } from '../containers/FlexColum.styled';
import IconButton from '../iconButton';
import { useAppStore } from '../../store';
import { FlexRow } from '../containers/FlexRow.styled';

type OptionCardProps = {
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
function OptionCard({ option, numOfVotes, onVote, onUnvote }: OptionCardProps) {
  const theme = useAppStore((state) => state.theme);
  const formattedPluralityScore = useMemo(() => {
    const score = parseFloat(String(option.voteScore));
    return score % 1 === 0 ? score.toFixed(0) : score.toFixed(1);
  }, [option.voteScore]);

  const [expanded, setExpanded] = useState(false);

  return (
    <Card $expanded={expanded}>
      <FlexColumn $gap="1rem">
        <FlexRow>
          <Proposal>
            <IconButton
              $padding={4}
              $color="secondary"
              onClick={() => setExpanded((e) => !e)}
              icon={{ src: `/icons/arrow-down-${theme}.svg`, alt: '' }}
              $flipVertical={expanded}
            />
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
                $width={16}
                $height={16}
              />
              <IconButton
                $padding={0}
                $color="secondary"
                icon={{ src: `/icons/downvote-${theme}.svg`, alt: 'Downvote arrow' }}
                onClick={onUnvote}
                $width={16}
                $height={16}
              />
            </FlexColumn>
            <Body>{numOfVotes}</Body>
          </Hearts>
          <Plurality>
            <Body>{formattedPluralityScore}</Body>
          </Plurality>
        </FlexRow>
        {option.optionSubTitle && (
          <FlexRow className="description">{option.optionSubTitle}</FlexRow>
        )}
      </FlexColumn>
    </Card>
  );
}

export default OptionCard;
