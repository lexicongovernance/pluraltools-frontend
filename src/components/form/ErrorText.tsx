import styled from 'styled-components';

interface ErrorTextProps {
  children: React.ReactNode;
}

const StyledErrorText = styled.div`
  color: #db4545;
  font-size: 0.875rem;
  &::first-letter {
    text-transform: uppercase;
  }
`;

function ErrorText({ children }: ErrorTextProps) {
  return <StyledErrorText>{children}</StyledErrorText>;
}

export default ErrorText;
