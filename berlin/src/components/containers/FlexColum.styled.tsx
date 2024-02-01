import styled from 'styled-components';

type FlexColumnProps = {
  $gap?: string;
};

export const FlexColumn = styled.div<FlexColumnProps>`
  align-items: center;
  display: flex;
  flex-direction: column;
  justify-content: center;

  gap: ${(props) => (props.$gap && props.$gap) || '1rem'};
`;
