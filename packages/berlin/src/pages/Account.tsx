import { FlexColumn } from '../components/containers/FlexColum.styled';
import Input from '../components/input';

function Account() {
  return (
    <FlexColumn $align="flex-start">
      <Input label="Username" placeholder="Hola" errors={['errora', 'errorb', 'errorc']} required />
      <Input label="Username" placeholder="Hola" required />
      <Input label="Username" placeholder="Hola" required />
    </FlexColumn>
  );
}

export default Account;
