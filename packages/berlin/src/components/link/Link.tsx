import { Link as RouterLink } from 'react-router-dom';
import { Bold } from '../typography/Bold.styled';
import { Underline } from '../typography/Underline.styled';

type LinkProps = {
  children: React.ReactNode;
  to: string;
};

function Link({ children, to }: LinkProps) {
  return (
    <RouterLink to={to}>
      <Bold>
        <Underline>{children}</Underline>
      </Bold>
    </RouterLink>
  );
}

export default Link;
