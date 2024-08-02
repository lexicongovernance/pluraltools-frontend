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
import { cycleSteps } from '@/components/onboarding/Steps';
import { FINAL_QUESTION_TITLE, INITIAL_HEARTS } from '../utils/constants';
import { FlexColumn } from '../components/containers/FlexColumn.styled';
import { FlexRow } from '../components/containers/FlexRow.styled';
import { Heart, SlidersHorizontal } from 'lucide-react';
import { Subtitle } from '@/components/typography/Subtitle.styled';
import { Title } from '../components/typography/Title.styled';
import BackButton from '../components/back-button';
import Button from '../components/button';
import Onboarding from '@/components/onboarding';
import Option from '@/components/option';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/_components/ui/dropdown-menu';

type Order = 'asc' | 'desc';
type LocalUserVotes = { optionId: string; numOfVotes: number }[];
type QuestionOption = GetCycleResponse['questions'][number]['options'][number];

function Cycle() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { user } = useUser();
  const { eventId, cycleId } = useParams();
  const { data: cycle } = useQuery({
    queryKey: ['cycles', cycleId],
    queryFn: () =>
      fetchCycle({ cycleId: cycleId || '', serverUrl: import.meta.env.VITE_SERVER_URL }),
    enabled: !!cycleId,
    refetchInterval: 5000, // Poll every 5 seconds
  });

  const { data: userVotes } = useQuery({
    queryKey: ['votes', cycleId],
    queryFn: () =>
      fetchUserVotes({ cycleId: cycleId || '', serverUrl: import.meta.env.VITE_SERVER_URL }),
    enabled: !!user?.id && !!cycleId,
  });

  const availableHearts =
    useAppStore((state) => state.availableHearts[cycle?.questions[0].id || '']) ?? INITIAL_HEARTS;
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
      toast('Agenda has closed. Redirecting to results.');
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
    if (cycle?.questions[0].options.length) {
      setSortedOptions((prev) => ({
        ...prev,
        options: sortOptions({
          options: cycle.questions[0].options,
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
        return time === 0 ? 'Vote has ended.' : `Vote closes in: ${formattedTime}`;
      default:
        return '';
    }
  }, [cycleState, time, formattedTime]);

  const updateInitialVotesAndHearts = (votes: GetUserVotesResponse | null | undefined) => {
    const givenVotes =
      votes?.map((option) => option.numOfVotes).reduce((prev, curr) => prev + curr, 0) ?? 0;

    setAvailableHearts({
      questionId: cycle?.questions[0].id || '',
      hearts: Math.max(0, INITIAL_HEARTS - givenVotes),
    });

    setLocalUserVotes(votes ?? []);
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
    updateInitialVotesAndHearts(userVotes);
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
      questionId: cycle?.questions[0].id ?? '',
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
      questionId: cycle?.questions[0].id ?? '',
      hearts: handleAvailableHearts(availableHearts, 'unVote'),
    });
  };

  const handleSaveVotesWrapper = () => {
    if (cycle?.status === 'OPEN') {
      handleSaveVotes(userVotes, localUserVotes, ({ votes }) =>
        mutateVotes({ votes, serverUrl: import.meta.env.VITE_SERVER_URL }),
      );
    } else {
      toast.error('Cycle is not open');
    }
  };

  const currentCycle = cycle?.questions[0];

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

  return (
    <>
      <Onboarding steps={cycleSteps} type="cycle" />
      <FlexColumn $gap="2rem" className="welcome plurality">
        <FlexColumn>
          <BackButton fallbackRoute={`/events/${eventId}/cycles`} />
          <Title>{currentCycle?.title}</Title>
          <Body>{voteInfo}</Body>
          <Body>
            You have <Bold>{availableHearts}</Bold> hearts left to give away:
          </Body>
          <FlexRow $gap="0.25rem" $wrap>
            {Array.from({ length: INITIAL_HEARTS }).map((_, id) => (
              <Heart key={id} fill={id < availableHearts ? '#ff0000' : 'none'} />
            ))}
          </FlexRow>
          <Button onClick={handleSaveVotesWrapper} disabled={!votesAreDifferent} className="save">
            Save all votes
          </Button>
        </FlexColumn>
        {currentCycle?.options.length ? (
          <FlexColumn>
            <div className="flex w-full items-center justify-between">
              <Subtitle>Vote items</Subtitle>
              <div className="flex cursor-pointer items-center gap-2">
                <Body>Sort</Body>
                <DropdownMenu>
                  <DropdownMenuTrigger>
                    <SlidersHorizontal />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="bg-primary border-secondary">
                    <DropdownMenuItem onClick={() => handleColumnClick('lead')}>
                      <label>Creator</label>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleColumnClick('affiliation')}>
                      <label>Affiliation</label>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleColumnClick('numOfVotes')}>
                      <label>Votes</label>
                    </DropdownMenuItem>
                    {currentCycle.showScore && (
                      <DropdownMenuItem onClick={() => handleColumnClick('voteScore')}>
                        <label>Plurality Score</label>
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
            {sortedOptions.options.map((option) => {
              const userVote = localUserVotes.find((vote) => vote.optionId === option.id);
              const numOfVotes = userVote ? userVote.numOfVotes : 0;
              return (
                <Option
                  key={option.id}
                  option={option}
                  numOfVotes={numOfVotes}
                  showFundingRequest={currentCycle.title === FINAL_QUESTION_TITLE}
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
