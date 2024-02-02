import styled from 'styled-components';

type FlexColumnProps = {
  $align?: 'flex-start' | 'center' | 'flex-end';
  $gap?: string;
};

export const FlexColumn = styled.div<FlexColumnProps>`
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 100%;

  align-items: ${(props) => (props.$align && props.$align) || 'center'};
  gap: ${(props) => (props.$gap && props.$gap) || '1rem'};
`;
