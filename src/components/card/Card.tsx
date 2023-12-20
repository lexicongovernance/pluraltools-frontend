import { FlexColumn } from '../../layout/Layout.styled';
import { StyledCard, Title, Body, Icon } from './Card.styled';

type CardProps = { icon: string; title: string; body: string };

function Card({ icon, title, body }: CardProps) {
  return (
    <StyledCard>
      <FlexColumn $gap="1.25rem">
        <Icon>
          <img src={icon} alt="Icon" />
        </Icon>
        <Title>{title}</Title>
        <Body>{body}</Body>
      </FlexColumn>
    </StyledCard>
  );
}

export default Card;
