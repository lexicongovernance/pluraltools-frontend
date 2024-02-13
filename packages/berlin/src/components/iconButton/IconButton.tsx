import Button from '../button';
import { StyledButtonProps } from '../button/Button.types';
import { Icon, IconContainer } from './IconButton.styled';

type IconButtonProps = {
  icon: {
    src: string;
    alt: string;
  };
  onClick: () => void;
} & StyledButtonProps;

function IconButton({ icon, onClick, ...props }: IconButtonProps) {
  return (
    <Button onClick={onClick} style={{ padding: 0 }} {...props}>
      <IconContainer $height={24} $width={24}>
        <Icon src={icon.src} alt={icon.alt} height={24} width={24} />
      </IconContainer>
    </Button>
  );
}

export default IconButton;
