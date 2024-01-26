import styled from 'styled-components';

const StyledButtonText = styled.p`
  font-size: 1rem;
  font-weight: 600;
  line-height: 1.25rem;
  text-transform: uppercase;
`;

type ButtonTextProps = {
  children: React.ReactNode;
} & React.ComponentProps<typeof StyledButtonText>;

function ButtonText({ children, ...props }: ButtonTextProps) {
  return <StyledButtonText {...props}>{children}</StyledButtonText>;
}

export default ButtonText;
