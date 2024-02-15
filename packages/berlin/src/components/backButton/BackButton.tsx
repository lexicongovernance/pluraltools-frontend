import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../../store';
import IconButton from '../iconButton';

function BackButton() {
  const navigate = useNavigate();
  const theme = useAppStore((state) => state.theme);
  return (
    <IconButton
      onClick={() => navigate(-1)}
      $color="secondary"
      icon={{ src: `/icons/arrow-back-${theme}.svg`, alt: 'Trash icon' }}
    />
  );
}

export default BackButton;
