import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../../store';
import IconButton from '../icon-button';

type BackButtonProps = {
  fallbackRoute?: string;
};

function BackButton({ fallbackRoute }: BackButtonProps) {
  const navigate = useNavigate();
  const theme = useAppStore((state) => state.theme);

  const handleBackClick = () => {
    if (fallbackRoute) {
      navigate(fallbackRoute);
    } else {
      navigate(-1);
    }
  };

  return (
    <IconButton
      onClick={handleBackClick}
      $color="secondary"
      icon={{ src: `/icons/arrow-back-${theme}.svg`, alt: 'Back icon' }}
      $padding={0}
    />
  );
}

export default BackButton;
