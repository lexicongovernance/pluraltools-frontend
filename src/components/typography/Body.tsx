import styled from 'styled-components';

const StyledBody = styled.p<{ $align?: 'left' | 'center' | 'right' }>`
  font-size: 1.25rem;
  line-height: 2rem;
  text-align: ${(props) => props.$align && props.$align};
`;

type BodyProps = {
  children: React.ReactNode;
  $align?: 'left' | 'center' | 'right';
} & React.ComponentProps<typeof StyledBody>;

function Body({ children, $align = 'left', ...props }: BodyProps) {
  return (
    <StyledBody {...props} $align={$align}>
      {children}
    </StyledBody>
  );
}

export default Body;
