import styled from 'styled-components';

const StyledSubtext = styled.p<{ $weight: 400 | 500 }>`
  font-size: 1rem;
  line-height: 1.375rem;
  font-weight: ${(props) => props.$weight && props.$weight};
`;

type SubtextProps = {
  children: React.ReactNode;
  weight: 400 | 500;
} & React.ComponentProps<typeof StyledSubtext>;

function Subtext({ children, weight = 400, ...props }: SubtextProps) {
  return (
    <StyledSubtext {...props} $weight={weight}>
      {children}
    </StyledSubtext>
  );
}

export default Subtext;
