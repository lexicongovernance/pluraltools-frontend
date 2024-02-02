import styled from 'styled-components';

type FlexRowProps = {
  $align?: 'flex-start' | 'center' | 'flex-end';
  $gap?: string;
};

export const FlexRow = styled.div<FlexRowProps>`
  align-items: center;
  display: flex;
  flex-direction: row;
  justify-content: center;
  width: 100%;

  align-items: ${(props) => (props.$align && props.$align) || 'flex-start'};
  gap: ${(props) => props.$gap || '1rem'};
`;
