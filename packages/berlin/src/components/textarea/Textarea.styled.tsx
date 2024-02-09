import styled from 'styled-components';

export const StyledTextarea = styled.textarea`
  background-color: var(--color-white);
  border-radius: 0.5rem;
  border: 1px solid var(--color-black);
  height: 12rem;
  padding: 0.75rem 1rem;
  resize: none;
  width: 100%;

  &:disabled {
    cursor: not-allowed;
  }
`;
