import styled from 'styled-components';

const StyledBody = styled.p`
  font-size: 1.25rem;
  line-height: 2rem;
`;

type BodyProps = {
  children: React.ReactNode;
} & React.ComponentProps<typeof StyledBody>;

function Body({ children, ...props }: BodyProps) {
  return <StyledBody {...props}>{children}</StyledBody>;
}

export default Body;
