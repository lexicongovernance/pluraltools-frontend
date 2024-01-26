import styled from 'styled-components';

interface ErrorTextProps {
  children: React.ReactNode;
}

const StyledErrorText = styled.div`
  color: var(--color-error);
  font-size: 0.875rem;
  &::first-letter {
    text-transform: uppercase;
  }
`;

function ErrorText({ children }: ErrorTextProps) {
  return <StyledErrorText>{children}</StyledErrorText>;
}

export default ErrorText;
