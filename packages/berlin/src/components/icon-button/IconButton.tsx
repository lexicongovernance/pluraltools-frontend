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
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  $height?: number;
  $width?: number;
} & StyledButtonProps;

function IconButton({
  icon,
  onClick,
  disabled,
  $padding,
  $flipVertical,
  $height,
  $width,
  ...props
}: IconButtonProps) {
  return (
    <Button onClick={onClick} style={{ padding: $padding }} disabled={disabled} {...props}>
      <IconContainer $height={$height || 24} $width={$height || 24}>
        <Icon
          src={icon.src}
          alt={icon.alt}
          height={$height || 24}
          width={$height || 24}
          $flipVertical={$flipVertical}
        />
      </IconContainer>
    </Button>
  );
}

export default IconButton;
