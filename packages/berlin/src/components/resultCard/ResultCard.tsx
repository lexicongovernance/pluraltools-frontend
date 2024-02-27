// React and third-party libraries
import { useMemo, useState } from 'react';

// Store
import { useAppStore } from '../../store';

// Components
import { Body } from '../typography/Body.styled';
import { Bold } from '../typography/Bold.styled';
import { FlexColumn } from '../containers/FlexColum.styled';
import { FlexRow } from '../containers/FlexRow.styled';
import { Subtitle } from '../typography/Subtitle.styled';
import IconButton from '../iconButton';

// Styled Components
import { Badge, Card } from './ResultCard.styled';
import { Separator } from '../separator';

type ResultCardProps = {
  $expanded: boolean;
  index: number;
  option: {
    optionTitle: string;
    pluralityScore: string;
    distinctUsers: string;
    allocatedHearts: string;
    optionSubTitle: string;
    distinctGroups: number;
    listOfGroupNames: string[];
    id: string;
  };
  onClick: () => void;
};

function ResultCard({ $expanded, option, index, onClick }: ResultCardProps) {
  const [groupsExpanded, setGroupsExpanded] = useState(false);
  const theme = useAppStore((state) => state.theme);
  const formattedPluralityScore = useMemo(() => {
    const score = parseFloat(option.pluralityScore);
    return score % 1 === 0 ? score.toFixed(0) : score.toFixed(3);
  }, [option.pluralityScore]);

  const handleGroupsClick = (
    e:
      | React.MouseEvent<HTMLButtonElement, MouseEvent>
      | React.MouseEvent<HTMLDivElement, MouseEvent>,
  ) => {
    e.stopPropagation();
    setGroupsExpanded(!groupsExpanded);
  };

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
          <IconButton
            $padding={0}
            $color="secondary"
            icon={{ src: `/icons/arrow-down-${theme}.svg`, alt: '' }}
            $flipVertical={$expanded}
          />
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
          <FlexRow>
            <Body>
              <Bold>Distinct groups:</Bold> {option.distinctGroups}
            </Body>
          </FlexRow>
          <FlexColumn onClick={(e) => handleGroupsClick(e)} $gap="0.5rem">
            <FlexRow>
              <Body>
                <Bold>Group names:</Bold>
              </Body>
              <IconButton
                $padding={4}
                $color="secondary"
                onClick={(e) => handleGroupsClick(e)}
                icon={{ src: `/icons/arrow-down-${theme}.svg`, alt: '' }}
                $flipVertical={groupsExpanded}
              />
            </FlexRow>
            <Body>{groupsExpanded && option.listOfGroupNames.sort().join(', ')}</Body>
          </FlexColumn>
        </FlexColumn>
        <Separator />
        {option.optionSubTitle && <Body>{option.optionSubTitle}</Body>}
      </FlexColumn>
    </Card>
  );
}

export default ResultCard;
