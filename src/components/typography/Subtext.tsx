import styled from 'styled-components';

const StyledSubtext = styled.p`
  font-size: 1rem;
  line-height: 1.375rem;
`;

type SubtextProps = {
  children: React.ReactNode;
} & React.ComponentProps<typeof StyledSubtext>;

function Subtext({ children, ...props }: SubtextProps) {
  return <StyledSubtext {...props}>{children}</StyledSubtext>;
}

export default Subtext;
