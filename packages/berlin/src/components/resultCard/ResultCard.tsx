// React and third-party libraries
import { useMemo } from 'react';

// Store
import { useAppStore } from '../../store';

// Components
import { Body } from '../typography/Body.styled';
import { Bold } from '../typography/Bold.styled';
import { FlexColumn } from '../containers/FlexColum.styled';
import { FlexRow } from '../containers/FlexRow.styled';
import { Subtitle } from '../typography/Subtitle.styled';

// Styled Components
import { Badge, Card } from './ResultCard.styled';

type ResultCardProps = {
  $expanded: boolean;
  index: number;
  option: {
    optionTitle: string;
    pluralityScore: string;
    distinctUsers: string;
    allocatedHearts: string;
    id: string;
  };
  onClick: () => void;
};

function ResultCard({ $expanded, option, index, onClick }: ResultCardProps) {
  const theme = useAppStore((state) => state.theme);
  const formattedPluralityScore = useMemo(() => {
    const score = parseFloat(option.pluralityScore);
    return score % 1 === 0 ? score.toFixed(0) : score.toFixed(3);
  }, [option.pluralityScore]);

  return (
    <Card $expanded={$expanded} onClick={onClick}>
      <FlexColumn $gap="1rem">
        {index === 0 && <Badge $type="gold" />}
        {index === 1 && <Badge $type="silver" />}
        {index === 2 && <Badge $type="bronze" />}
        <FlexRow $justify="space-between">
          <FlexRow $gap="0.5rem">
            <Subtitle>{option.optionTitle}</Subtitle>
          </FlexRow>
          <img className="arrow" src={`/icons/arrow-down-${theme}.svg`} alt="Arrow icon" />
        </FlexRow>
        <FlexRow>
          <Body>
            <Bold>Plurality score:</Bold> {formattedPluralityScore}
          </Body>
        </FlexRow>
        <FlexColumn className="statistics">
          <FlexRow>
            <Body>
              <Bold>Distinct voters:</Bold> {option.distinctUsers}
            </Body>
          </FlexRow>
          <FlexRow>
            <Body>
              <Bold>Allocated hearts:</Bold> {option.allocatedHearts}
            </Body>
          </FlexRow>
        </FlexColumn>
        {/* // TODO: Add this: {option.description && <Body>{option.description}</Body>} */}
      </FlexColumn>
    </Card>
  );
}

export default ResultCard;
