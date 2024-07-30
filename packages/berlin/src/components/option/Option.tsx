// React and third-party libraries
import { useLayoutEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import Markdown from 'react-markdown';

// API
import { fetchOptionUsers, GetCycleResponse } from 'api';

// Components
import { Body } from '../typography/Body.styled';
import { Bold } from '../typography/Bold.styled';
import { ChevronDown, MessageSquareText, Minus, Plus } from 'lucide-react';
import Button from '../button';
import Link from '../link';

type OptionProps = {
  option: GetCycleResponse['questions'][number]['options'][number];
  showFundingRequest?: boolean;
  showScore?: boolean;
  numOfVotes: number;
  onVote: () => void;
  onUnVote: () => void;
};

export default function Option({
  option,
  showFundingRequest,
  showScore,
  numOfVotes,
  onVote,
  onUnVote,
}: OptionProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [expandedHeight, setExpandedHeight] = useState(0);
  const expandedRef = useRef<HTMLDivElement>(null);
  const { eventId, cycleId } = useParams();
  const navigate = useNavigate();

  const { data: optionUsers } = useQuery({
    queryKey: ['option', option.id, 'users'],
    queryFn: () =>
      fetchOptionUsers({ optionId: option.id || '', serverUrl: import.meta.env.VITE_SERVER_URL }),
    enabled: !!option.id,
  });

  useLayoutEffect(() => {
    if (expandedRef.current) {
      setExpandedHeight(isExpanded ? expandedRef.current.scrollHeight : 0);
    }
  }, [isExpanded]);

  const handleChevronClick = () => {
    setIsExpanded(!isExpanded);
  };

  const handleCommentsClick = () => {
    navigate(`/events/${eventId}/cycles/${cycleId}/options/${option.id}`);
  };

  const pluralityScore = useMemo(() => {
    const score = parseFloat(String(option.voteScore));
    return score % 1 === 0 ? score.toFixed(0) : score.toFixed(1);
  }, [option.voteScore]);

  const author = useMemo(() => {
    if (option.user) {
      return `${option.user.firstName} ${option.user.lastName}`;
    }
    return null;
  }, [option.user]);

  const affiliation = useMemo(() => {
    return option.user?.groups?.find((group) => group.groupCategory?.required)?.name || null;
  }, [option.user]);

  const coauthors = useMemo(() => {
    return (
      optionUsers?.group?.users?.filter(
        (optionUser) => optionUser.username !== option.user?.username,
      ) || []
    );
  }, [optionUsers, option.user?.username]);

  const fundingRequest = useMemo(() => {
    if (showFundingRequest) {
      return option.fundingRequest;
    }
    return null;
  }, [option.fundingRequest, showFundingRequest]);

  return (
    <article className="border-secondary grid w-full grid-cols-[1fr_auto] gap-4 border p-4">
      <section className="col-span-1 flex flex-col gap-4">
        <Body>{option.title}</Body>
        {author && (
          <Body>
            <Bold>Creator: </Bold>
            {author}
          </Body>
        )}
        {affiliation && (
          <Body>
            <Bold>Affiliation: </Bold>
            {affiliation}
          </Body>
        )}
        {showScore && (
          <span className="flex items-center gap-2">
            <img src="/icons/plurality-score.svg" width={24} height={24} />
            <Body>{pluralityScore}</Body>
          </span>
        )}
      </section>
      <section className="col-start-1 col-end-3 flex flex-col justify-between md:col-start-2">
        <section className="flex gap-1">
          <Button
            style={{ padding: '4px 4px', borderRadius: 0 }}
            onClick={onUnVote}
            disabled={numOfVotes === 0}
          >
            <Minus height={16} width={16} strokeWidth={3} />
          </Button>
          <Body className="min-w-8 text-center">{numOfVotes}</Body>
          <Button style={{ padding: '4px 4px', borderRadius: 0 }} onClick={onVote}>
            <Plus height={16} width={16} strokeWidth={3} />
          </Button>
        </section>
        <section className="flex w-full justify-end" onClick={handleChevronClick}>
          <ChevronDown
            className={`cursor-pointer transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}
          />
        </section>
      </section>
      <section
        ref={expandedRef}
        style={{ maxHeight: expandedHeight }}
        className="transition-max-height col-span-2 overflow-hidden duration-300"
      >
        {coauthors.length > 0 && (
          <Body>
            <Bold>Co-authors:</Bold>{' '}
            {coauthors.map((coauthor) => `${coauthor.firstName} ${coauthor.lastName}`).join(', ')}
          </Body>
        )}
        {fundingRequest && (
          <Body>
            <Bold>Funding request: </Bold>
            {fundingRequest}
          </Body>
        )}
        {option.subTitle && (
          <Markdown
            components={{
              a: ({ node, ...props }) => <Link to={props.href ?? ''}>{props.children}</Link>,
              p: ({ node, ...props }) => <Body>{props.children}</Body>,
            }}
          >
            {option.subTitle}
          </Markdown>
        )}
        <MessageSquareText onClick={handleCommentsClick} />
      </section>
    </article>
  );
}
