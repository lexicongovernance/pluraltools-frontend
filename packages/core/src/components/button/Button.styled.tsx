import styled from 'styled-components';
import { ButtonProps } from '../../types/ButtonType';

export const StyledButton = styled.button<ButtonProps>`
  align-self: ${(props) => (props.center ? 'center' : 'flex-start')};
  background-color: var(--color-primary);
  background-color: ${(props) => props.color === 'secondary' && 'var(--color-secondary)'};
  background: ${(props) => props.variant === 'text' && 'none'};
  border-radius: 0.5rem;
  border: none;
  padding-block: 0.5rem;
  padding-inline: 1rem;
  transition: ease 0.25s;

  &:hover {
    opacity: 0.8;
  }

  &:disabled {
    background-color: var(--color-skeleton-gray);
    cursor: not-allowed;
    &:hover {
      opacity: 1;
    }
  }
`;
