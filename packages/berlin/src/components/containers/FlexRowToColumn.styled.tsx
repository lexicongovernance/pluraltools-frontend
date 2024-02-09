import styled from 'styled-components';

type FlexRowToColumnProps = {
  $align?: 'flex-start' | 'center' | 'flex-end';
  $gap?: string;
  $justify?: 'flex-start' | 'center' | 'flex-end' | 'space-between' | 'space-around';
};

export const FlexRowToColumn = styled.div<FlexRowToColumnProps>`
  align-items: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 100%;

  align-items: ${(props) => (props.$align && props.$align) || 'flex-start'};
  gap: ${(props) => props.$gap || '1rem'};
  justify-content: ${(props) => (props.$justify && props.$justify) || 'flex-start'};

  @media (min-width: 640px) {
    flex-direction: row;
  }
`;
