import styled, { css } from 'styled-components';
import { StyledButtonProps } from './Button.types';

export const StyledButton = styled.button<StyledButtonProps>`
  border-radius: 0.5rem;
  border: none;
  font-family: var(--font-family-button);
  font-size: 1rem;
  font-weight: 600;
  line-height: 1.25rem;
  padding-block: 0.5rem;
  padding-inline: 1rem;
  text-transform: uppercase;

  &:disabled {
    cursor: not-allowed;
  }

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

    ${(props) =>
    props.$variant === 'link' &&
    css`
      background-color: transparent;
      color: var(--color-black);
      font-family: inherit;
      font-size: inherit;
      font-weight: inherit;
      text-decoration: underline;
      text-transform: inherit;
      padding: 0;
    `}
`;
