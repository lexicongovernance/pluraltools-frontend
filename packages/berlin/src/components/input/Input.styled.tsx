import styled from 'styled-components';

export const StyledInput = styled.input`
  background-color: var(--color-white);
  border-radius: 0.25rem;
  color: var(--color-black);
  border: 1px solid var(--color-black);
  padding: 0.75rem 1rem;
  width: 100%;

  &::placeholder {
    color: var(--color-gray);
  }
`;
