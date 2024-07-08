// React and third-party libraries
import { useEffect, useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';

// API
import { GetCycleResponse, GetUserVotesResponse, fetchCycle, fetchUserVotes, postVotes } from 'api';

// Hooks
import useCountdown from '../hooks/useCountdown';
import useUser from '../hooks/useUser';

// Utils
import {
  handleSaveVotes,
  handleAvailableHearts,
  handleLocalUnVote,
  handleLocalVote,
} from '../utils/voting';

// Store
import { useAppStore } from '../store';

// Components
import { Body } from '../components/typography/Body.styled';
import { Bold } from '../components/typography/Bold.styled';
import { FlexColumn } from '../components/containers/FlexColumn.styled';
import { FlexRow } from '../components/containers/FlexRow.styled';
import { Title } from '../components/typography/Title.styled';
import BackButton from '../components/back-button';
import Button from '../components/button';
import CycleColumns from '../components/columns/cycle-columns';
import OptionCard from '../components/option-card';
import { FINAL_QUESTION_TITLE, FIVE_MINUTES_IN_SECONDS, INITIAL_HEARTS } from '../utils/constants';
import { OnboardingCard } from '../components/onboarding/Onboaring.styled';
import { Subtitle } from '../components/typography/Subtitle.styled';
import Onboarding from '../components/onboarding';
import IconButton from '../components/icon-button';

type Order = 'asc' | 'desc';
type LocalUserVotes = { optionId: string; numOfVotes: number }[];
type QuestionOption = GetCycleResponse['forumQuestions'][number]['questionOptions'][number];

function Cycle() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const theme = useAppStore((state) => state.theme);
  const { user } = useUser();
  const { eventId, cycleId } = useParams();
  const { data: cycle } = useQuery({
    queryKey: ['cycles', cycleId],
    queryFn: () => fetchCycle(cycleId || ''),
    enabled: !!cycleId,
    refetchInterval: 5000, // Poll every 5 seconds
  });

  const { data: userVotes } = useQuery({
    queryKey: ['votes', cycleId],
    queryFn: () => fetchUserVotes(cycleId || ''),
    enabled: !!user?.id && !!cycleId,
    retry: false,
  });

  const availableHearts =
    useAppStore((state) => state.availableHearts[cycle?.forumQuestions[0].id || '']) ??
    INITIAL_HEARTS;
  const setAvailableHearts = useAppStore((state) => state.setAvailableHearts);
  const [startAt, setStartAt] = useState<string | null>(null);
  const [endAt, setEndAt] = useState<string | null>(null);
  const [localUserVotes, setLocalUserVotes] = useState<LocalUserVotes>([]);
  const [sortedOptions, setSortedOptions] = useState<{
    options: QuestionOption[];
    column: 'lead' | 'affiliation' | 'numOfVotes';
    order: 'desc' | 'asc';
  }>({
    options: [],
    column: 'numOfVotes',
    order: 'desc',
  });

  useEffect(() => {
    if (cycle?.status === 'CLOSED') {
      toast('Vote has closed. Redirecting to results.');
      navigate(`/events/${eventId}/cycles/${cycleId}/results`);
    }
  }, [cycle?.status]);

  useEffect(() => {
    if (cycle && cycle.startAt && cycle.endAt) {
      setStartAt(cycle.startAt);
      setEndAt(cycle.endAt);
    }
  }, [cycle]);

  useEffect(() => {
    // Initial sorting
    if (cycle?.forumQuestions[0].questionOptions.length) {
      setSortedOptions((prev) => ({
        ...prev,
        options: sortOptions({
          options: cycle.forumQuestions[0].questionOptions,
          sorting: prev,
          votes: userVotes,
        }),
      }));
    }
    // no need to add sortOptions to the dependencies array
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cycle, userVotes]);

  const { formattedTime, cycleState, time } = useCountdown(startAt, endAt);

  const voteInfo = useMemo(() => {
    switch (cycleState) {
      case 'closed':
        return 'Vote has ended.';
      case 'upcoming':
        return `Vote opens in: ${formattedTime}`;
      case 'open':
        if (time && time <= FIVE_MINUTES_IN_SECONDS) {
          return `Vote closes in: ${formattedTime}`;
        } else if (time === 0) {
          return 'Vote has ended.';
        }
        return '';
      default:
        return '';
    }
  }, [cycleState, time, formattedTime]);

  const updateInitialVotesAndHearts = (votes: GetUserVotesResponse) => {
    const givenVotes = votes
      .map((option) => option.numOfVotes)
      .reduce((prev, curr) => prev + curr, 0);

    setAvailableHearts({
      questionId: cycle?.forumQuestions[0].id || '',
      hearts: Math.max(0, INITIAL_HEARTS - givenVotes),
    });

    setLocalUserVotes(votes);
  };

  const votesAreDifferent = useMemo(() => {
    return (
      JSON.stringify(
        localUserVotes.map((vote) => ({
          optionId: vote.optionId,
          numOfVotes: vote.numOfVotes,
        })),
      ) !==
      JSON.stringify(
        userVotes?.map((vote) => ({
          optionId: vote.optionId,
          numOfVotes: vote.numOfVotes,
        })),
      )
    );
  }, [localUserVotes, userVotes]);

  useEffect(() => {
    if (userVotes?.length) {
      updateInitialVotesAndHearts(userVotes);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userVotes]);

  const { mutate: mutateVotes } = useMutation({
    mutationFn: postVotes,
    onSuccess: (body) => {
      if (body?.errors?.length) {
        toast.error(`Failed to save votes, ${body?.errors[0].message}`);
      } else if (body?.data.length) {
        queryClient.invalidateQueries({ queryKey: ['votes', cycleId] });
        // this is to update the plural scores in each option
        queryClient.invalidateQueries({ queryKey: ['cycles', cycleId] });
        toast.success('Votes saved successfully!');
      }
    },
  });

  const handleVoteWrapper = (optionId: string) => {
    if (availableHearts === 0) {
      toast.error('No hearts left to give');
      return;
    }

    setLocalUserVotes((prevLocalUserVotes) => handleLocalVote(optionId, prevLocalUserVotes));
    setAvailableHearts({
      questionId: cycle?.forumQuestions[0].id ?? '',
      hearts: handleAvailableHearts(availableHearts, 'vote'),
    });
  };

  const handleUnVoteWrapper = (optionId: string) => {
    if (availableHearts === INITIAL_HEARTS) {
      toast.error('No votes to left to remove');
      return;
    }

    setLocalUserVotes((prevLocalUserVotes) => handleLocalUnVote(optionId, prevLocalUserVotes));
    setAvailableHearts({
      questionId: cycle?.forumQuestions[0].id ?? '',
      hearts: handleAvailableHearts(availableHearts, 'unVote'),
    });
  };

  const handleSaveVotesWrapper = () => {
    if (cycle?.status === 'OPEN') {
      handleSaveVotes(userVotes, localUserVotes, mutateVotes);
    } else {
      toast.error('Cycle is not open');
    }
  };

  const currentCycle = cycle?.forumQuestions[0];

  const sortId = (a: QuestionOption, b: QuestionOption, order: Order) => {
    const idA = a.id.toUpperCase();
    const idB = b.id.toUpperCase();

    return order === 'desc' ? idB.localeCompare(idA) : idA.localeCompare(idB);
  };

  const sortByLead = (a: QuestionOption, b: QuestionOption, order: Order) => {
    const leadA = (a.user?.lastName || a.user?.username || '').toUpperCase();
    const leadB = (b.user?.lastName || b.user?.username || '').toUpperCase();

    if (leadA === leadB) {
      return sortId(a, b, order);
    }

    return order === 'desc' ? leadB.localeCompare(leadA) : leadA.localeCompare(leadB);
  };

  const sortByAffiliation = (a: QuestionOption, b: QuestionOption, order: Order) => {
    const affiliationA =
      a.user?.groups?.find((group) => group.groupCategory?.required)?.name.toUpperCase() ?? '';
    const affiliationB =
      b.user?.groups?.find((group) => group.groupCategory?.required)?.name.toUpperCase() ?? '';

    if (affiliationA === affiliationB) {
      return sortId(a, b, order);
    }

    return order === 'desc'
      ? affiliationB.localeCompare(affiliationA)
      : affiliationA.localeCompare(affiliationB);
  };

  const sortByNumOfVotes = (
    a: QuestionOption,
    b: QuestionOption,
    order: Order,
    localUserVotes: LocalUserVotes | GetUserVotesResponse | null | undefined,
  ) => {
    const votesA = localUserVotes?.find((vote) => vote.optionId === a.id)?.numOfVotes || 0;
    const votesB = localUserVotes?.find((vote) => vote.optionId === b.id)?.numOfVotes || 0;

    if (votesA === votesB) {
      return sortId(a, b, order);
    }

    return order === 'desc' ? votesB - votesA : votesA - votesB;
  };

  const sortOptions = ({
    options,
    sorting,
    votes,
  }: {
    options: QuestionOption[];
    sorting: { column: string; order: Order };
    votes: LocalUserVotes | GetUserVotesResponse | null | undefined;
  }) => {
    const sorted = [...options].sort((a, b) => {
      switch (sorting.column) {
        case 'lead':
          return sortByLead(a, b, sorting.order);
        case 'affiliation':
          return sortByAffiliation(a, b, sorting.order);
        default:
          return sortByNumOfVotes(a, b, sorting.order, votes);
      }
    });
    return sorted;
  };

  const handleColumnClick = (column: string) => {
    setSortedOptions(
      (prev) =>
        ({
          options: sortOptions({
            options: prev.options,
            sorting: {
              column: column as 'lead' | 'affiliation' | 'numOfVotes',
              order: prev.column === column && prev.order === 'asc' ? 'desc' : 'asc',
            },
            votes: localUserVotes,
          }),
          column,
          order: prev.column === column && prev.order === 'asc' ? 'desc' : 'asc',
        }) as typeof sortedOptions,
    );
  };

  const steps = [
    {
      target: '.step-1',
      content: (
        <OnboardingCard>
          <Subtitle>Voting Page</Subtitle>
          <Body>View vote items and allocate your hearts.</Body>
        </OnboardingCard>
      ),
      placement: 'center',
    },
    {
      target: '.step-2',
      content: (
        <OnboardingCard>
          <Subtitle>Vote</Subtitle>
          <FlexRow>
            <FlexColumn $gap="-4px" style={{ width: 16 }}>
              <IconButton
                $padding={0}
                $color="secondary"
                icon={{ src: `/icons/upvote-${theme}.svg`, alt: 'Upvote arrow' }}
                $width={16}
                $height={16}
              />
              <IconButton
                $padding={0}
                $color="secondary"
                icon={{ src: `/icons/downvote-${theme}.svg`, alt: 'Downvote arrow' }}
                $width={16}
                $height={16}
              />
            </FlexColumn>
            <Body>Upvote or downvote a vote item.</Body>
          </FlexRow>
        </OnboardingCard>
      ),
      placement: 'center',
    },
    {
      target: '.step-3',
      content: (
        <OnboardingCard>
          <Subtitle>Save Your Votes</Subtitle>
          <Body>
            Click the{' '}
            <Button $color="secondary" style={{ paddingInline: 4 }}>
              save all votes
            </Button>{' '}
            button to save your heart allocation.
          </Body>
        </OnboardingCard>
      ),
      placement: 'center',
    },
    {
      target: '.step-4',
      content: (
        <OnboardingCard>
          <Subtitle>Information</Subtitle>
          <Body>View vote item and creator.</Body>
          <FlexRow>
            <IconButton
              $padding={0}
              $color="secondary"
              icon={{ src: `/icons/heart-full.svg`, alt: 'Heart icon' }}
              $width={24}
              $height={24}
            />
            <Body>Current number of hearts allocated to this vote item.</Body>
          </FlexRow>
        </OnboardingCard>
      ),
      placement: 'center',
    },
    {
      target: '.step-5',
      content: (
        <OnboardingCard>
          <Subtitle>Voting Mechanisms</Subtitle>
          <FlexRow>
            <IconButton
              $padding={0}
              $color="secondary"
              icon={{ src: `/icons/plurality-score.svg`, alt: 'Plurality score icon' }}
              $width={24}
              $height={24}
            />
            <Body>
              Plurality score, unlike quadratic score, considers pre-existing participant
              relationships
            </Body>
          </FlexRow>
        </OnboardingCard>
      ),
      placement: 'center',
    },
    {
      target: '.step-6',
      content: (
        <OnboardingCard>
          <Subtitle>Expand a vote item</Subtitle>
          <FlexRow>
            <IconButton
              $padding={0}
              $color="secondary"
              icon={{ src: `/icons/arrow-down-${theme}.svg`, alt: 'Arrow down icon' }}
              $width={24}
              $height={24}
            />
            <Body>Click to view the vote item description and other useful information.</Body>
          </FlexRow>
          {/* <FlexRow>
            <IconButton
              $padding={0}
              $color="secondary"
              icon={{ src: `/icons/comments-${theme}.svg`, alt: 'Comments icon' }}
              $width={24}
              $height={24}
            />
            <Body>
              Click to view the comments page and start a discussion with other participants.
            </Body>
          </FlexRow> */}
        </OnboardingCard>
      ),
      placement: 'center',
    },
  ];

  return (
    <>
      <Onboarding type="cycle" steps={steps} />
      <FlexColumn $gap="2rem" className="step-1 step-2 step-3 step-4 step-5 step-6">
        <FlexColumn>
          <BackButton fallbackRoute={`/events/${eventId}/cycles`} />
          <Title>{currentCycle?.questionTitle}</Title>
          <Body>{voteInfo}</Body>
          <Body>
            You have <Bold>{availableHearts}</Bold> hearts left to allocate:
          </Body>
          <FlexRow $gap="0.25rem" $wrap>
            {Array.from({ length: INITIAL_HEARTS }).map((_, id) => (
              <img
                key={id}
                src={id < availableHearts ? '/icons/heart-full.svg' : '/icons/heart-empty.svg'}
                height={24}
                width={24}
                alt={id < availableHearts ? 'Full Heart' : 'Empty Heart'}
              />
            ))}
          </FlexRow>
          <Button onClick={handleSaveVotesWrapper} disabled={!votesAreDifferent}>
            Save all votes
          </Button>
        </FlexColumn>
        {currentCycle?.questionOptions.length ? (
          <FlexColumn $gap="0">
            <CycleColumns onColumnClick={handleColumnClick} showScore={currentCycle.showScore} />
            {sortedOptions.options.map((option) => {
              const userVote = localUserVotes.find((vote) => vote.optionId === option.id);
              const numOfVotes = userVote ? userVote.numOfVotes : 0;
              return (
                <OptionCard
                  key={option.id}
                  option={option}
                  numOfVotes={numOfVotes}
                  showFundingRequest={currentCycle.questionTitle === FINAL_QUESTION_TITLE}
                  showScore={currentCycle.showScore}
                  onVote={() => handleVoteWrapper(option.id)}
                  onUnVote={() => handleUnVoteWrapper(option.id)}
                />
              );
            })}
          </FlexColumn>
        ) : (
          <Body>
            <i>No options to show...</i>
          </Body>
        )}
      </FlexColumn>
    </>
  );
}

export default Cycle;
