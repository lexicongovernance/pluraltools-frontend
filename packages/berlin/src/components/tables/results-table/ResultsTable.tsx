// React and third-party libraries
import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';

// API
import { fetchOptionUsers, fetchRegistrationData, fetchRegistrationFields } from 'api';

// Store
import { useAppStore } from '../../../store';

// Components
import { Body } from '../../typography/Body.styled';
import { Bold } from '../../typography/Bold.styled';
import { FlexColumn } from '../../containers/FlexColumn.styled';
import { FlexRow } from '../../containers/FlexRow.styled';
import IconButton from '../../icon-button';

// Styled Components
import { Card } from './ResultsTable.styled';
import { useNavigate } from 'react-router-dom';

type ResultsTableProps = {
  $expanded: boolean;
  eventId?: string;
  cycleId?: string;
  option: {
    optionTitle: string;
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

function ResultsTable({ $expanded, option, onClick, cycleId, eventId }: ResultsTableProps) {
  const theme = useAppStore((state) => state.theme);
  const navigate = useNavigate();
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
    queryFn: () => fetchOptionUsers(option.id || ''),
    enabled: !!option.id,
  });

  const { data: registrationFields } = useQuery({
    queryKey: ['event', eventId, 'registrations', 'fields'],
    queryFn: () => fetchRegistrationFields(eventId || ''),
    enabled: !!eventId,
  });

  const { data: registrationData } = useQuery({
    queryKey: ['registrations', optionUsers?.registrationId, 'registration-data'],
    queryFn: () => fetchRegistrationData(optionUsers?.registrationId || ''),
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

  const handleCommentsClick = () => {
    navigate(`/events/${eventId}/cycles/${cycleId}/options/${option.id}`);
  };

  return (
    <Card
      $expanded={$expanded}
      $showFunding={option.allocatedFunding !== null}
      onClick={onClick}
      $rowgap="2rem"
    >
      <FlexRow>
        <IconButton
          $padding={0}
          $color="secondary"
          icon={{ src: `/icons/arrow-down-${theme}.svg`, alt: '' }}
          $flipVertical={$expanded}
        />
        <Body>{option.optionTitle}</Body>
      </FlexRow>
      <Body>{option.allocatedHearts}</Body>
      <Body>{formattedQuadraticScore}</Body>
      <Body>{formattedPluralityScore}</Body>
      {option.allocatedFunding !== null && <Body>{option.allocatedFunding} ARB</Body>}
      <FlexColumn className="description">
        <Body>{option.optionSubTitle}</Body>
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
        <Body>
          <IconButton
            $padding={0}
            $color="secondary"
            icon={{ src: `/icons/comments-${theme}.svg`, alt: 'Comments icon' }}
            onClick={handleCommentsClick}
            $width={24}
            $height={24}
          />
        </Body>
      </FlexColumn>
    </Card>
  );
}

export default ResultsTable;
