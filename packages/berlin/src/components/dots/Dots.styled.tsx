import styled from 'styled-components';

type DotProps = {
  $active: boolean;
};

export const Dot = styled.div<DotProps>`
  background-color: ${(props) => (props.$active ? 'var(--color-black)' : 'var(--color-gray)')};
  border-radius: 50%;
  height: 0.5rem;
  transition: 0.2s ease-in;
  width: 0.5rem;
`;
