import { useEffect, useState } from 'react';
import { FlexColumn } from '../containers/FlexColum.styled';
import { FlexRow } from '../containers/FlexRow.styled';
import { Body } from '../typography/Body.styled';
import { Subtitle } from '../typography/Subtitle.styled';
import { Card } from './OptionCard.styled';
import IconButton from '../iconButton';
import { useAppStore } from '../../store';

type OptionProps = {
  title: string;
  body?: string;
  avaliableHearts: number;
  numOfVotes: number;
  onVote: () => void;
  onUnvote: () => void;
};

function OptionCard({ title, body, avaliableHearts, numOfVotes, onVote, onUnvote }: OptionProps) {
  const theme = useAppStore((state) => state.theme);
  const [localOptionHearts, setLocalOptionHearts] = useState(numOfVotes);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    setLocalOptionHearts(numOfVotes);
  }, [numOfVotes]);

  const handleVoteClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation(); // Stop event propagation here
    if (avaliableHearts) {
      setLocalOptionHearts((prevLocalOptionHearts) => prevLocalOptionHearts + 1);
      onVote();
    }
  };

  const handleUnvoteClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation(); // Stop event propagation here
    setLocalOptionHearts((prevLocalOptionHearts) => Math.max(0, prevLocalOptionHearts - 1));
    onUnvote();
  };

  return (
    <Card onClick={() => setExpanded(!expanded)}>
      <FlexColumn $gap="2rem">
        <Subtitle>{title}</Subtitle>
        <FlexRow $gap="0.25rem" $wrap>
          {localOptionHearts > 0 ? (
            Array.from({ length: localOptionHearts }).map((_, id) => (
              <img key={id} src="/icons/heart-full.svg" height={24} width={24} alt="Full Heart" />
            ))
          ) : (
            <img src="/icons/heart-empty.svg" height={24} width={24} alt="Empty Heart" />
          )}
        </FlexRow>
      </FlexColumn>
      <FlexRow>
        <FlexRow>
          {/* <IconButton
            onClick={() => {}}
            $padding={6}
            $color="secondary"
            icon={{ src: `/icons/comments-${theme}.svg`, alt: 'Comments icon' }}
          /> */}
          <IconButton
            onClick={(e: React.MouseEvent<HTMLButtonElement>) => handleUnvoteClick(e)}
            disabled={localOptionHearts === 0}
            $padding={6}
            $color="secondary"
            icon={{ src: `/icons/unvote-${theme}.svg`, alt: 'Unvote icon' }}
          />
          <IconButton
            onClick={(e: React.MouseEvent<HTMLButtonElement>) => handleVoteClick(e)}
            disabled={avaliableHearts === 0}
            $padding={6}
            $color="primary"
            icon={{ src: `/icons/vote-${theme}.svg`, alt: 'Vote icon' }}
          />
        </FlexRow>
        <IconButton
          onClick={() => {}}
          $color="secondary"
          $flipVertical={expanded}
          icon={{ src: `/icons/arrow-down-${theme}.svg`, alt: 'Arrow icon' }}
        />
      </FlexRow>
      {expanded && body && <Body>{body}</Body>}
    </Card>
  );
}

export default OptionCard;
