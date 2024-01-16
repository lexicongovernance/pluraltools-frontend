import styled from 'styled-components';

const StyledBody = styled.p`
  font-size: 1.25rem;
  line-height: 2rem;
`;

type BodyProps = {
  children: React.ReactNode;
};

function Body({ children }: BodyProps) {
  return <StyledBody>{children}</StyledBody>;
}

export default Body;
