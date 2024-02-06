import Button from '../button';
import { Icon, IconContainer } from './IconButton.styled';

type IconButtonProps = {
  $color: 'primary' | 'secondary';
  icon: {
    src: string;
    alt: string;
  };
  onClick: () => void;
};

function IconButton({ $color, icon, onClick }: IconButtonProps) {
  return (
    <Button onClick={onClick} $color={$color} style={{ padding: 0 }}>
      <IconContainer $height={24} $width={24}>
        <Icon src={icon.src} alt={icon.alt} height={24} width={24} />
      </IconContainer>
    </Button>
  );
}

export default IconButton;
