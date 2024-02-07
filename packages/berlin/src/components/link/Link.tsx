import { Link as RouterLink } from 'react-router-dom';
import { Bold } from '../typography/Bold.styled';
import { Underline } from '../typography/Underline.styled';

type LinkProps = {
  children: React.ReactNode;
  to: string;
  onClick?: () => void;
};

function Link({ children, to, onClick }: LinkProps) {
  return (
    <RouterLink to={to} onClick={onClick}>
      <Bold>
        <Underline>{children}</Underline>
      </Bold>
    </RouterLink>
  );
}

export default Link;
