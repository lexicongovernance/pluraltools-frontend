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

  input[type='number']::-webkit-outer-spin-button,
  input[type='number']::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
  input[type='number'] {
    -moz-appearance: textfield;
  }

  input[type='number']:hover,
  input[type='number']:focus {
    -moz-appearance: textfield;
  }
`;
