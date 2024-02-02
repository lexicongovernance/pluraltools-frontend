import styled from 'styled-components';

type FlexRowProps = {
  $gap?: string;
};

export const FlexRow = styled.div<FlexRowProps>`
  align-items: center;
  display: flex;
  flex-direction: row;
  justify-content: center;
  width: 100%;

  gap: ${(props) => props.$gap || '1rem'};
`;
