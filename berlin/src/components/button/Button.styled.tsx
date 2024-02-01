import styled, { css } from 'styled-components';

export const StyledButton = styled.button<{ $color: 'primary' | 'secondary' }>`
  border-radius: 0.5rem;
  border: none;
  font-family: var(--font-family-button);
  font-size: 1rem;
  font-weight: 600;
  line-height: 1.25rem;
  padding-block: 0.5rem;
  padding-inline: 1rem;
  text-transform: uppercase;
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
