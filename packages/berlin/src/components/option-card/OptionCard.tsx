import {
  Affiliation,
  ArrowDownIcon,
  ArrowIcon,
  Author,
  Card,
  Container,
  Field,
  Plurality,
  PluralityIcon,
  Proposal,
  Votes,
  VotesIcon,
} from './OptionCard.styled';
import { Body } from '../typography/Body.styled';
import { Bold } from '../typography/Bold.styled';
import { FlexColumn } from '../containers/FlexColumn.styled';
import { fetchOptionUsers, GetCycleResponse } from 'api';
import { useAppStore } from '../../store';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useMemo, useState } from 'react';
import IconButton from '../icon-button';

type OptionCardProps = {
  option: GetCycleResponse['forumQuestions'][number]['questionOptions'][number];
  showFundingRequest?: boolean;
  showScore?: boolean;
  numOfVotes: number;
  onVote: () => void;
  onUnVote: () => void;
};

function OptionCard({
  option,
  numOfVotes,
  onVote,
  onUnVote,
  showFundingRequest = false,
  showScore,
}: OptionCardProps) {
  const { eventId, cycleId } = useParams();
  const theme = useAppStore((state) => state.theme);
  const navigate = useNavigate();
  const { data: optionUsers } = useQuery({
    queryKey: ['option', option.id, 'users'],
    queryFn: () => fetchOptionUsers(option.id || ''),
    enabled: !!option.id,
  });

  const formattedPluralityScore = useMemo(() => {
    const score = parseFloat(String(option.voteScore));
    return score % 1 === 0 ? score.toFixed(0) : score.toFixed(1);
  }, [option.voteScore]);

  const [expanded, setExpanded] = useState(false);

  const author = option.user ? `${option.user?.firstName} ${option.user?.lastName}` : 'Anonymous';

  const handleCommentsClick = () => {
    navigate(`/events/${eventId}/cycles/${cycleId}/options/${option.id}`);
  };

  const coauthors = useMemo(() => {
    return optionUsers?.group?.users?.filter(
      (optionUser) => optionUser.username !== option.user?.username,
    );
  }, [optionUsers, option.user?.username]);

  return (
    <Card $expanded={expanded}>
      <FlexColumn>
        <Container>
          <Proposal>
            <ArrowDownIcon>
              <IconButton
                $padding={4}
                $color="secondary"
                onClick={() => setExpanded((e) => !e)}
                icon={{ src: `/icons/arrow-down-${theme}.svg`, alt: 'Arrow down' }}
                $flipVertical={expanded}
              />
            </ArrowDownIcon>
            <Body>{option.optionTitle}</Body>
          </Proposal>
          <Author>
            <Field>Lead:</Field>
            <Body>{author}</Body>
          </Author>
          <Affiliation>
            <Field>Affiliation:</Field>
            <Body>{option.user?.groups.find((group) => group.groupCategory.required)?.name}</Body>
          </Affiliation>
          <Votes $showScore={showScore}>
            <VotesIcon $gap="-4px">
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
            </VotesIcon>
            <Body>{numOfVotes}</Body>
            {!showScore && (
              <ArrowIcon>
                <IconButton
                  $padding={4}
                  $color="secondary"
                  onClick={() => setExpanded((e) => !e)}
                  icon={{ src: `/icons/arrow-down-${theme}.svg`, alt: 'Arrow down' }}
                  $flipVertical={expanded}
                />
              </ArrowIcon>
            )}
          </Votes>
          {showScore && (
            <Plurality>
              <PluralityIcon>
                <IconButton
                  $padding={0}
                  $color="secondary"
                  icon={{ src: `/icons/plurality-score.svg`, alt: 'Plurality score' }}
                />
              </PluralityIcon>
              {formattedPluralityScore}
              <ArrowIcon>
                <IconButton
                  $padding={4}
                  $color="secondary"
                  onClick={() => setExpanded((e) => !e)}
                  icon={{ src: `/icons/arrow-down-${theme}.svg`, alt: 'Arrow down' }}
                  $flipVertical={expanded}
                />
              </ArrowIcon>
            </Plurality>
          )}
        </Container>
        <FlexColumn className="description" $gap="1.5rem">
          {coauthors && coauthors.length > 0 && (
            <Body>
              <Bold>Co-authors:</Bold>{' '}
              {coauthors.map((coauthor) => `${coauthor.firstName} ${coauthor.lastName}`).join(', ')}
            </Body>
          )}
          {showFundingRequest && option.fundingRequest && (
            <Body>
              <Bold>Funding request:</Bold> {option.fundingRequest}
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
