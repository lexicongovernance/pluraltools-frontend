import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import Icon from '../icon';

type BackButtonProps = {
  fallbackRoute?: string;
};

function BackButton({ fallbackRoute }: BackButtonProps) {
  const navigate = useNavigate();

  const handleBackClick = () => {
    if (fallbackRoute) {
      navigate(fallbackRoute);
    } else {
      navigate(-1);
    }
  };

  return (
    <Icon>
      <ArrowLeft onClick={handleBackClick} />
    </Icon>
  );
}

export default BackButton;
