import styled from 'styled-components';

const StyledError = styled.p`
  color: #db4545;
  font-size: 0.875rem;
  line-height: 1rem;
`;

type ErrorProps = {
  children: React.ReactNode;
} & React.ComponentProps<typeof StyledError>;

function Error({ children, ...props }: ErrorProps) {
  return <StyledError {...props}>{children}</StyledError>;
}

export default Error;
