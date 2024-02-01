import { FlexColumn } from '../../layout/Layout.styled';
import { StyledCard, CardTitle, Body, Icon, BigNumber } from './Card.styled';

type CardProps = {
  icon?: string;
  title: string;
  body?: string | undefined;
  bigNumber?: number | undefined;
};

function Card({ icon, title, body, bigNumber }: CardProps) {
  return (
    <StyledCard>
      <FlexColumn $gap="1.25rem">
        {icon && (
          <Icon>
            <img src={icon} alt="Icon" />
          </Icon>
        )}
        {title && <CardTitle>{title}</CardTitle>}
        {body && <Body>{body}</Body>}
        {bigNumber && <BigNumber>{bigNumber}</BigNumber>}
      </FlexColumn>
    </StyledCard>
  );
}

export default Card;
