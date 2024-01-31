import styled, { css } from 'styled-components';

export const StyledButton = styled.button<{ $color: 'primary' | 'secondary' }>`
  border-radius: 0.5rem;
  border: none;
  font-family: var(--font-family-button);
  font-weight: 600;
  padding-block: 0.5rem;
  padding-inline: 1rem;
  transition: ease 0.25s;

  ${(props) =>
    props.$color === 'primary' &&
    css`
      background-color: var(--color-black);
      color: var(--color-white);
    `}

  ${(props) =>
    props.$color === 'secondary' &&
    css`
      background-color: var(--color-white);
      color: var(--color-black);
    `}

  &:hover {
    opacity: 0.8;
  }
`;
