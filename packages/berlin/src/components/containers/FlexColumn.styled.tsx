import styled from 'styled-components';

type FlexColumnProps = {
  $align?: 'flex-start' | 'center' | 'flex-end';
  $gap?: string;
  $justify?: 'flex-start' | 'center' | 'flex-end' | 'space-between' | 'space-around';
  $minHeight?: string;
};

export const FlexColumn = styled.div<FlexColumnProps>`
  display: flex;
  flex-direction: column;
  width: 100%;

  align-items: ${(props) => (props.$align && props.$align) || 'flex-start'};
  gap: ${(props) => (props.$gap && props.$gap) || '1rem'};
  justify-content: ${(props) => (props.$justify && props.$justify) || 'flex-start'};
  min-height: ${(props) => props.$minHeight && props.$minHeight};
`;
