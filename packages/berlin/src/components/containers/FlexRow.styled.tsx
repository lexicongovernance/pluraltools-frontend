import styled from 'styled-components';

type FlexRowProps = {
  $align?: 'flex-start' | 'center' | 'flex-end';
  $gap?: string;
  $justify?: 'flex-start' | 'center' | 'flex-end' | 'space-between' | 'space-around';
  $wrap: boolean;
};

export const FlexRow = styled.div<FlexRowProps>`
  align-items: center;
  display: flex;
  flex-direction: row;
  justify-content: center;
  width: 100%;

  align-items: ${(props) => (props.$align && props.$align) || 'flex-start'};
  gap: ${(props) => props.$gap || '1rem'};
  justify-content: ${(props) => (props.$justify && props.$justify) || 'flex-start'};
  flex-wrap: ${(props) => props.$wrap && 'wrap'};
`;
