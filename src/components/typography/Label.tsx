import styled from 'styled-components';

const StyledLabel = styled.p`
  font-size: 1rem;
  font-weight: 500;
  line-height: 1.375rem;
`;

type LabelProps = {
  children: React.ReactNode;
} & React.ComponentProps<typeof StyledLabel>;

function Label({ children, ...props }: LabelProps) {
  return <StyledLabel {...props}>{children}</StyledLabel>;
}

export default Label;
