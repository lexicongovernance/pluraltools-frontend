import * as Dialog from '@radix-ui/react-dialog';
import styled, { keyframes } from 'styled-components';

const overlayShow = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const contentShow = keyframes`
    from {
    opacity: 0;
    transform: translate(-50%, -48%) scale(0.96);
  }
  to {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1);
  }
`;

export const DialogOverlay = styled(Dialog.Overlay)`
  animation: ${overlayShow} 150ms cubic-bezier(0.16, 1, 0.3, 1);
  background-color: rgba(0, 0, 0, 0.75);
  inset: 0;
  position: fixed;
`;

export const DialogContent = styled(Dialog.Content)`
  animation: ${contentShow} 150ms cubic-bezier(0.16, 1, 0.3, 1);
  background-color: var(--color-white);
  border-radius: 0.5rem;
  box-shadow:
    hsl(206 22% 7% / 35%) 0px 10px 38px -10px,
    hsl(206 22% 7% / 20%) 0px 10px 20px -15px;
  left: 50%;
  max-height: 85vh;
  max-width: 32rem;
  padding: 1.5rem;
  position: fixed;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 90vw;

  &:focus {
    outline: none;
  }
`;

export const DialogTitle = styled(Dialog.Title)``;

export const DialogDescription = styled(Dialog.Description).attrs({ as: 'div' })``;
