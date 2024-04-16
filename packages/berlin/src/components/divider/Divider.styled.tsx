import styled from 'styled-components';

export const VerticalDivider = styled.div<{ $height: number }>`
  border-top: 1.25px solid var(--color-black);
  width: 100%;

  @media (min-width: 600px) {
    border-left: 1.25px solid var(--color-black);
    border-top: 0;
    height: ${(props) => `${props.$height}px`};
    width: 0;
  }
`;
