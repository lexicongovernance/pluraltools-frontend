import styled from 'styled-components';
import { ButtonProps } from '../../types/ButtonType';

export const StyledButton = styled.button<ButtonProps>`
  align-self: flex-start;
  background-color: #759de9;
  background-color: ${(props) => props.color === 'secondary' && '#1F2021'};
  background: ${(props) => props.variant === 'text' && 'none'};
  border-radius: 0.5rem;
  border: none;
  font-size: 1rem;
  font-weight: 600;
  line-height: 1.25rem;
  padding-block: 0.5rem;
  padding-inline: 1rem;
  text-transform: uppercase;
  transition: ease 0.25s;

  &:hover {
    opacity: 0.8;
  }

  &:disabled {
    cursor: not-allowed;
    &:hover {
      opacity: 1;
    }
  }
`;
