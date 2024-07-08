import { StyledIcon } from './Icon.styled';

type IconProps = {
  children: React.ReactNode;
};

function Icon({ children }: IconProps) {
  return <StyledIcon>{children}</StyledIcon>;
}

export default Icon;
