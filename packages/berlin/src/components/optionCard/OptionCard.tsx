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

  useEffect(() => {
    setLocalOptionHearts(numOfVotes);
  }, [numOfVotes]);

  const handleVoteClick = () => {
    if (avaliableHearts) {
      setLocalOptionHearts((prevLocalOptionHearts) => prevLocalOptionHearts + 1);
      onVote();
    }
  };

  const handleUnvoteClick = () => {
    setLocalOptionHearts((prevLocalOptionHearts) => Math.max(0, prevLocalOptionHearts - 1));
    onUnvote();
  };

  return (
    <Card>
      <FlexColumn $gap="2rem">
        <Subtitle>{title}</Subtitle>
        {body && <Body>{body}</Body>}
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
          <IconButton
            onClick={handleUnvoteClick}
            disabled={localOptionHearts === 0}
            $padding={6}
            $color="secondary"
            icon={{ src: `/icons/unvote-${theme}.svg`, alt: 'Unvote icon' }}
          />
          <IconButton
            onClick={handleVoteClick}
            disabled={avaliableHearts === 0}
            $padding={6}
            $color="primary"
            icon={{ src: `/icons/vote-${theme}.svg`, alt: 'Vote icon' }}
          />
        </FlexRow>
        <IconButton
          onClick={() => {}}
          $padding={6}
          $color="secondary"
          icon={{ src: `/icons/comments-${theme}.svg`, alt: 'Comments icon' }}
        />
      </FlexRow>
    </Card>
  );
}

export default OptionCard;
