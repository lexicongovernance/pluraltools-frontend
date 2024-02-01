import styled from 'styled-components';

const StyledHeading = styled.h1`
  font-family: var(--font-family-secondary);
  font-size: 2rem;
  font-weight: 600;
  line-height: 2.875rem;
`;

type HeadingProps = {
  children: React.ReactNode;
} & React.ComponentProps<typeof StyledHeading>;

function Heading({ children, ...props }: HeadingProps) {
  return <StyledHeading {...props}>{children}</StyledHeading>;
}

export default Heading;
