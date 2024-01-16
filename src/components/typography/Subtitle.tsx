import styled from 'styled-components';

const StyledSubtitle = styled.h3`
  font-weight: bold;
  line-height: 1.75rem;
  font-size: 1.25rem;
`;

type SubtitleProps = {
  children: React.ReactNode;
} & React.ComponentProps<typeof StyledSubtitle>;

function Subtitle({ children, ...props }: SubtitleProps) {
  return <StyledSubtitle {...props}>{children}</StyledSubtitle>;
}

export default Subtitle;
