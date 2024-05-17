import { Affiliation, Author, Card, Proposal, Votes } from './OptionCard.styled';
import { Body } from '../typography/Body.styled';
import { Bold } from '../typography/Bold.styled';
import { FlexColumn } from '../containers/FlexColum.styled';
import { FlexRow } from '../containers/FlexRow.styled';
import { QuestionOption, fetchOptionUsers } from 'api';
import { useAppStore } from '../../store';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import IconButton from '../icon-button';

type OptionCardProps = {
  option: QuestionOption;
  numOfVotes: number;
  onVote: () => void;
  onUnVote: () => void;
};
function OptionCard({ option, numOfVotes, onVote, onUnVote }: OptionCardProps) {
  const { eventId, cycleId } = useParams();
  const theme = useAppStore((state) => state.theme);
  const navigate = useNavigate();
  const { data: optionUsers } = useQuery({
    queryKey: ['option', option.id, 'users'],
    queryFn: () => fetchOptionUsers(option.id || ''),
    enabled: !!option.id,
  });
  // const formattedPluralityScore = useMemo(() => {
  //   const score = parseFloat(String(option.voteScore));
  //   return score % 1 === 0 ? score.toFixed(0) : score.toFixed(1);
  // }, [option.voteScore]);

  const [expanded, setExpanded] = useState(false);

  const author = `${option.user.firstName} ${option.user.lastName}`;

  const handleCommentsClick = () => {
    navigate(`/events/${eventId}/cycles/${cycleId}/options/${option.id}`);
  };

  return (
    <Card $expanded={expanded}>
      <FlexColumn>
        <FlexRow $gap="0">
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
            <Body>{author}</Body>
          </Author>
          <Affiliation>
            <Body>{option.user?.group?.name}</Body>
          </Affiliation>
          <Votes>
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
                onClick={onUnVote}
                $width={16}
                $height={16}
                disabled={numOfVotes === 0}
              />
            </FlexColumn>
            <Body>{numOfVotes}</Body>
          </Votes>
          {/* <Plurality>
            <Body>{formattedPluralityScore}</Body>
          </Plurality> */}
        </FlexRow>
        <FlexColumn className="description" $gap="1.5rem">
          {optionUsers?.group?.users && (
            <Body>
              <Bold>Co-authors:</Bold>{' '}
              {optionUsers.group.users.map((user) => `${(user.firstName, user.lastName)}`)}
            </Body>
          )}
          {option.optionSubTitle && <Body>{option.optionSubTitle}</Body>}
          <IconButton
            $padding={0}
            $color="secondary"
            icon={{ src: `/icons/comments-${theme}.svg`, alt: 'Comments icon' }}
            onClick={handleCommentsClick}
            $width={24}
            $height={24}
          />
        </FlexColumn>
      </FlexColumn>
    </Card>
  );
}

export default OptionCard;
