// React and third-party libraries
import { useMemo } from 'react';

// Store
import { useAppStore } from '../../../store';

// Components
import { Body } from '../../typography/Body.styled';
import { Bold } from '../../typography/Bold.styled';
import { FlexColumn } from '../../containers/FlexColumn.styled';
import { FlexRow } from '../../containers/FlexRow.styled';
import IconButton from '../../icon-button';

// Styled Components
import { Card, Funding, Icon, Plurality, TitleContainer } from './ResultsTable.styled';

type ResultsTableProps = {
  $expanded: boolean;
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

function ResultsTable({ $expanded, option, onClick }: ResultsTableProps) {
  const theme = useAppStore((state) => state.theme);

  const formattedQuadraticScore = useMemo(() => {
    const score = parseFloat(option.quadraticScore);
    return score % 1 === 0 ? score.toFixed(0) : score.toFixed(3);
  }, [option.quadraticScore]);

  const formattedPluralityScore = useMemo(() => {
    const score = parseFloat(option.pluralityScore);
    return score % 1 === 0 ? score.toFixed(0) : score.toFixed(3);
  }, [option.pluralityScore]);

  return (
    <Card
      $expanded={$expanded}
      $showFunding={option.allocatedFunding !== null}
      onClick={onClick}
      $rowgap="2rem"
    >
      <TitleContainer>
        <IconButton
          $padding={0}
          $color="secondary"
          icon={{ src: `/icons/arrow-down-${theme}.svg`, alt: '' }}
          $flipVertical={$expanded}
        />
        <Body>{option.optionTitle}</Body>
      </TitleContainer>
      <FlexRow>
        <Icon>
          <IconButton
            $padding={0}
            $color="secondary"
            icon={{ src: `/icons/heart-full.svg`, alt: 'Hearts' }}
          />
        </Icon>
        <Body>{option.allocatedHearts}</Body>
      </FlexRow>
      <FlexRow>
        <Icon>
          <IconButton
            $padding={0}
            $color="secondary"
            icon={{ src: `/icons/sqrt-${theme}.svg`, alt: 'Quadratic score' }}
          />
        </Icon>
        <Body>{formattedQuadraticScore}</Body>
      </FlexRow>
      <Plurality $showFunding={option.allocatedFunding !== null}>
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
      <Funding $expanded={$expanded} $showFunding={option.allocatedFunding !== null}>
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
        <Body>{option.optionSubTitle}</Body>
        <Body>
          <Bold>Distinct voters:</Bold> {option.distinctUsers}
        </Body>
        <Body>
          <Bold>Distinct groups:</Bold> {option.distinctGroups}
        </Body>
        <Body>
          <Bold>Voter affiliations:</Bold> {option.listOfGroupNames.join(', ')}
        </Body>
      </FlexColumn>
    </Card>
  );
}

export default ResultsTable;
