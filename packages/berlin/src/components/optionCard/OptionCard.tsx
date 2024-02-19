import { useEffect, useState } from 'react';
import Button from '../button';
import { FlexColumn } from '../containers/FlexColum.styled';
import { FlexRow } from '../containers/FlexRow.styled';
import { Body } from '../typography/Body.styled';
import { Subtitle } from '../typography/Subtitle.styled';
import { Card } from './OptionCard.styled';
import { useNavigate, useParams } from 'react-router-dom';

type OptionProps = {
  id: string;
  title: string;
  body?: string;
  avaliableHearts: number;
  numOfVotes: number;
  onVote: () => void;
  onUnvote: () => void;
};

function OptionCard({
  id,
  title,
  body,
  avaliableHearts,
  numOfVotes,
  onVote,
  onUnvote,
}: OptionProps) {
  const navigate = useNavigate();
  const { eventId, cycleId } = useParams();
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
        <Button $color="secondary" onClick={handleUnvoteClick} disabled={localOptionHearts === 0}>
          Unvote
        </Button>
        <Button $color="primary" onClick={handleVoteClick} disabled={avaliableHearts === 0}>
          Vote
        </Button>
        <Button
          $color="primary"
          onClick={() => navigate(`/events/${eventId}/cycles/${cycleId}/options/${id}`)}
          disabled={avaliableHearts === 0}
        >
          comments
        </Button>
      </FlexRow>
    </Card>
  );
}

export default OptionCard;
