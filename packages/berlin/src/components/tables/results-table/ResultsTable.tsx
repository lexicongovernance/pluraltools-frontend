// React and third-party libraries
import { useQuery } from '@tanstack/react-query';
import { Heart, Radical } from 'lucide-react';
import { useMemo } from 'react';
import Markdown from 'react-markdown';

// API
import { fetchOptionUsers, fetchRegistrationData, fetchRegistrationFields } from 'api';

// Store
import { useAppStore } from '../../../store';

// Components
import { FlexColumn } from '../../containers/FlexColumn.styled';
import { FlexRow } from '../../containers/FlexRow.styled';
import IconButton from '../../icon-button';
import { Body } from '../../typography/Body.styled';
import { Bold } from '../../typography/Bold.styled';
import Link from '../../link';

// Styled Components
import { Card, Funding, Icon, Plurality, TitleContainer } from './ResultsTable.styled';

type ResultsTableProps = {
  $expanded: boolean;
  eventId?: string;
  cycleId?: string;
  option: {
    title: string;
    pluralityScore: string;
    distinctUsers: string;
    allocatedHearts: string;
    optionSubTitle: string;
    distinctGroups: number;
    listOfGroupNames: string[];
    quadraticScore: string;
    allocatedFunding: number | null;
    id: string;
  };
  onClick: () => void;
};

function ResultsTable({ $expanded, option, onClick, eventId }: ResultsTableProps) {
  const theme = useAppStore((state) => state.theme);
  const formattedQuadraticScore = useMemo(() => {
    const score = parseFloat(option.quadraticScore);
    return score % 1 === 0 ? score.toFixed(0) : score.toFixed(3);
  }, [option.quadraticScore]);

  const formattedPluralityScore = useMemo(() => {
    const score = parseFloat(option.pluralityScore);
    return score % 1 === 0 ? score.toFixed(0) : score.toFixed(3);
  }, [option.pluralityScore]);

  const { data: optionUsers } = useQuery({
    queryKey: ['option', option.id, 'users'],
    queryFn: () =>
      fetchOptionUsers({ optionId: option.id || '', serverUrl: import.meta.env.VITE_SERVER_URL }),
    enabled: !!option.id,
  });

  const { data: registrationFields } = useQuery({
    queryKey: ['event', eventId, 'registrations', 'fields'],
    queryFn: () =>
      fetchRegistrationFields({
        eventId: eventId || '',
        serverUrl: import.meta.env.VITE_SERVER_URL,
      }),
    enabled: !!eventId,
  });

  const { data: registrationData } = useQuery({
    queryKey: ['registrations', optionUsers?.registrationId, 'registration-data'],
    queryFn: () =>
      fetchRegistrationData({
        registrationId: optionUsers?.registrationId || '',
        serverUrl: import.meta.env.VITE_SERVER_URL,
      }),
    enabled: !!optionUsers?.registrationId,
  });

  const researchOutputField = registrationFields?.find(
    (field) => field.name === 'Select research output:',
  );

  const researchOutputValue = registrationData?.find(
    (data) => data.registrationFieldId === researchOutputField?.id,
  )?.value;

  const collaborators = optionUsers?.group?.users
    ?.filter(
      (user) =>
        user.firstName !== optionUsers?.user?.firstName ||
        user.lastName !== optionUsers?.user?.lastName,
    )
    .map((user) => `${user.firstName} ${user.lastName}`);

  return (
    <Card $expanded={$expanded} $showFunding={option.allocatedFunding !== null} $rowgap="2rem">
      <TitleContainer>
        <IconButton
          $padding={0}
          $color="secondary"
          icon={{ src: `/icons/arrow-down-${theme}.svg`, alt: '' }}
          $flipVertical={$expanded}
          onClick={onClick}
        />
        <Body>{option.title}</Body>
      </TitleContainer>
      <FlexRow>
        <Icon>
          <Heart fill="#ff0000" />
        </Icon>
        <Body>{option.allocatedHearts}</Body>
      </FlexRow>
      <FlexRow>
        <Icon>
          <Radical />
        </Icon>
        <Body>{formattedQuadraticScore}</Body>
      </FlexRow>
      <Plurality $showFunding={option.allocatedFunding !== null} onClick={onClick}>
        <Icon>
          <IconButton
            $padding={0}
            $color="secondary"
            icon={{ src: `/icons/plurality-score.svg`, alt: 'Plurality score' }}
          />
        </Icon>
        <Body>{formattedPluralityScore}</Body>
        <IconButton
          $padding={0}
          $color="secondary"
          icon={{ src: `/icons/arrow-down-${theme}.svg`, alt: '' }}
          $flipVertical={$expanded}
        />
      </Plurality>
      <Funding
        $expanded={$expanded}
        $showFunding={option.allocatedFunding !== null}
        onClick={onClick}
      >
        <Icon>
          <IconButton
            $padding={0}
            $color="secondary"
            icon={{ src: `/logos/arbitrum-${theme}.svg`, alt: 'Arbitrum' }}
          />
        </Icon>
        <Body>{option.allocatedFunding} ARB</Body>
        <IconButton
          $padding={0}
          $color="secondary"
          icon={{ src: `/icons/arrow-down-${theme}.svg`, alt: '' }}
          $flipVertical={$expanded}
        />
      </Funding>
      <FlexColumn className="description">
        {option.optionSubTitle && (
          <Markdown
            components={{
              a: ({ node, ...props }) => <Link to={props.href ?? ''}>{props.children}</Link>,
              p: ({ node, ...props }) => <Body>{props.children}</Body>,
            }}
          >
            {option.optionSubTitle}
          </Markdown>
        )}
        <Body>
          <Bold>Research Output:</Bold> {researchOutputValue}
        </Body>
        <Body>
          <Bold>Lead Author:</Bold> {optionUsers?.user?.firstName} {optionUsers?.user?.lastName}
        </Body>
        <Body>
          <Bold>Collaborators:</Bold>{' '}
          {collaborators && collaborators.length > 0 ? collaborators.join(', ') : 'None'}
        </Body>
        <Body>
          <Bold>Research Output:</Bold> {researchOutputValue}
        </Body>
        <Body>
          <Bold>Lead Author:</Bold> {optionUsers?.user?.firstName} {optionUsers?.user?.lastName}
        </Body>
        <Body>
          <Bold>Collaborators:</Bold>{' '}
          {collaborators && collaborators.length > 0 ? collaborators.join(', ') : 'None'}
        </Body>
        <Body>
          <Bold>Distinct voters:</Bold> {option.distinctUsers}
        </Body>
        <Body>
          <Bold>Voter affiliations:</Bold> {option.listOfGroupNames.join(', ')}
        </Body>
      </FlexColumn>
    </Card>
  );
}

export default ResultsTable;
