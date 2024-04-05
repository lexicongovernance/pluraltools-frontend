import styled from 'styled-components';

type BodyProps = {
  $minHeight?: string;
};

export const Body = styled.p<BodyProps>`
  color: var(--color-black);
  font-size: 1.125rem;
  line-height: 1.75rem;
  white-space: pre-wrap;
  min-height: ${(props) => props.$minHeight && props.$minHeight};
`;
