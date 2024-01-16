import styled from 'styled-components';

const StyledLabel = styled.p`
  font-weight: medium;
  font-size: 1rem;
  line-height: 1.375rem;
`;

type LabelProps = {
  children: React.ReactNode;
};

function Label({ children }: LabelProps) {
  return <StyledLabel>{children}</StyledLabel>;
}

export default Label;
