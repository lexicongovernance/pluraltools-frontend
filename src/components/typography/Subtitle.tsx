import styled from 'styled-components';

const StyledSubtitle = styled.h3`
  font-weight: bold;
  line-height: 1.75rem;
  font-size: 1.25rem;
`;

type SubtitleProps = {
  children: React.ReactNode;
};

function Subtitle({ children }: SubtitleProps) {
  return <StyledSubtitle>{children}</StyledSubtitle>;
}

export default Subtitle;
