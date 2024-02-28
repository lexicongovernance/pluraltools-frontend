// React and third-party libraries
import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

// Store
import { useAppStore } from '../../store';

// Components
import { Body } from '../typography/Body.styled';
import { FlexColumn } from '../containers/FlexColum.styled';
import { FlexRow } from '../containers/FlexRow.styled';
import { Subtitle } from '../typography/Subtitle.styled';
import IconButton from '../iconButton';

// Styled Components
import { Card } from './OptionCard.styled';

type OptionProps = {
  id: string;
  title: string;
  body?: string;
  avaliableHearts: number;
  numOfVotes: number;
  pluralityScore: number;
  onVote: () => void;
  onUnvote: () => void;
};

function OptionCard({
  id,
  title,
  body,
  pluralityScore,
  avaliableHearts,
  numOfVotes,
  onVote,
  onUnvote,
}: OptionProps) {
  const theme = useAppStore((state) => state.theme);
  const [localOptionHearts, setLocalOptionHearts] = useState(numOfVotes);
  const [expanded, setExpanded] = useState(false);
  const navigate = useNavigate();
  const { eventId, cycleId } = useParams();

  const formattedPluralityScore = useMemo(() => {
    const score = parseFloat(String(pluralityScore));
    return score % 1 === 0 ? score.toFixed(0) : score.toFixed(3);
  }, [pluralityScore]);

  useEffect(() => {
    setLocalOptionHearts(numOfVotes);
  }, [numOfVotes]);

  const handleVoteClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    if (avaliableHearts) {
      setLocalOptionHearts((prevLocalOptionHearts) => prevLocalOptionHearts + 1);
      onVote();
    }
  };

  const handleUnvoteClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setLocalOptionHearts((prevLocalOptionHearts) => Math.max(0, prevLocalOptionHearts - 1));
    onUnvote();
  };

  const handleCardClick = () => {
    if (body) {
      setExpanded(!expanded);
    }
  };

  return (
    <Card onClick={handleCardClick}>
      <FlexColumn>
        <Body>Plurality Score: {formattedPluralityScore}</Body>
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
          <IconButton
            onClick={() => navigate(`/events/${eventId}/cycles/${cycleId}/options/${id}`)}
            $padding={6}
            $color="secondary"
            icon={{ src: `/icons/comments-${theme}.svg`, alt: 'Comments icon' }}
          />
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
        {body && (
          <IconButton
            onClick={() => {}}
            $color="secondary"
            $flipVertical={expanded}
            icon={{ src: `/icons/arrow-down-${theme}.svg`, alt: 'Arrow icon' }}
          />
        )}
      </FlexRow>
      {expanded && body && <Body>{body}</Body>}
    </Card>
  );
}

export default OptionCard;
