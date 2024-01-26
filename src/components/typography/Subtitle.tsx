import styled from 'styled-components';

const StyledSubtitle = styled.h3<{ $align?: 'left' | 'center' | 'right' }>`
  font-weight: bold;
  line-height: 1.75rem;
  font-size: 1.25rem;
  text-align: ${(props) => props.$align && props.$align};
`;

type SubtitleProps = {
  children: React.ReactNode;
  $align?: 'left' | 'center' | 'right';
} & React.ComponentProps<typeof StyledSubtitle>;

function Subtitle({ children, $align = 'left', ...props }: SubtitleProps) {
  return (
    <StyledSubtitle {...props} $align={$align}>
      {children}
    </StyledSubtitle>
  );
}

export default Subtitle;
