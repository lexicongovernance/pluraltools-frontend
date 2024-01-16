import styled from 'styled-components';

const StyledError = styled.p`
  color: #db4545;
  font-size: 0.875rem;
  line-height: 1rem;
`;

type ErrorProps = {
  children: React.ReactNode;
};

function Error({ children }: ErrorProps) {
  return <StyledError>{children}</StyledError>;
}

export default Error;
