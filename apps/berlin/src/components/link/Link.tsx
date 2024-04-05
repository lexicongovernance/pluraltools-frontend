import { Link as RouterLink } from 'react-router-dom';
import { Bold } from '../typography/Bold.styled';
import { Underline } from '../typography/Underline.styled';

type LinkProps = {
  children: React.ReactNode;
  to: string;
  onClick?: () => void;
  state?: object;
};

function Link({ children, to, state, onClick }: LinkProps) {
  return (
    <RouterLink to={to} onClick={onClick} state={state}>
      <Bold>
        <Underline>{children}</Underline>
      </Bold>
    </RouterLink>
  );
}

export default Link;
