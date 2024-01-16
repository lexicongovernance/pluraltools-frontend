import styled from 'styled-components';

const StyledTitle = styled.h2`
  font-family: 'Press Start 2P', sans-serif;
  font-size: 1.25rem;
  line-height: 1.75rem;
`;

type TitleProps = {
  children: React.ReactNode;
};

function Title({ children }: TitleProps) {
  return <StyledTitle>{children}</StyledTitle>;
}

export default Title;
