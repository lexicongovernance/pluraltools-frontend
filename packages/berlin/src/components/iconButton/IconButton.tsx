import Button from '../button';
import { StyledButtonProps } from '../button/Button.types';
import { Icon, IconContainer } from './IconButton.styled';

type IconButtonProps = {
  icon: {
    src: string;
    alt: string;
  };
  disabled?: boolean;
  $padding?: number;
  $flipVertical?: boolean;
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
} & StyledButtonProps;

function IconButton({
  icon,
  onClick,
  disabled,
  $padding,
  $flipVertical,
  ...props
}: IconButtonProps) {
  return (
    <Button onClick={() => onClick} style={{ padding: $padding }} disabled={disabled} {...props}>
      <IconContainer $height={24} $width={24}>
        <Icon src={icon.src} alt={icon.alt} height={24} width={24} $flipVertical={$flipVertical} />
      </IconContainer>
    </Button>
  );
}

export default IconButton;
