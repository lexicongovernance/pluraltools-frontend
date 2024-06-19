import { AccountForm } from '../components/form/AccountForm';
import { Title } from '../components/typography/Title.styled';
import useUser from '../hooks/useUser';

function Account() {
  const { user, isLoading: userIsLoading } = useUser();

  if (userIsLoading) {
    return <Title>Loading...</Title>;
  }

  return (
    <AccountForm
      title={'Edit Account'}
      key={user?.email}
      initialUser={{
        email: user?.email ?? '',
        firstName: user?.firstName ?? '',
        lastName: user?.lastName ?? '',
        username: user?.username ?? '',
      }}
      user={user}
    />
  );
}

export default Account;
