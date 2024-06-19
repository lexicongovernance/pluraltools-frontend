import { useState } from 'react';
import { AccountForm } from '../components/form/AccountForm';
import { Title } from '../components/typography/Title.styled';
import useUser from '../hooks/useUser';
import { FlexColumn } from '../components/containers/FlexColumn.styled';
import { FlexRow } from '../components/containers/FlexRow.styled';
import Button from '../components/button';
import { TabManager } from '../components/tab-manager';

function Account() {
  const { user, isLoading: userIsLoading } = useUser();
  const [tab, setTab] = useState<'view' | 'edit'>('view');
  if (userIsLoading) {
    return <Title>Loading...</Title>;
  }

  const tabs = {
    edit: (
      <AccountForm
        user={user}
        initialUser={{
          email: user?.email ?? '',
          firstName: user?.firstName ?? '',
          lastName: user?.lastName ?? '',
          username: user?.username ?? '',
        }}
        title="Edit Account"
      />
    ),
    view: <AccountHub />,
  };

  return (
    <FlexColumn>
      <FlexRow>
        <Button onClick={() => setTab('view')}>View</Button>
      </FlexRow>
      <TabManager tabs={tabs} tab={tab} fallback={<Title>Tab not found</Title>} />
    </FlexColumn>
  );
}

function AccountHub() {
  return (
    <FlexColumn>
      <Title>Account Hub</Title>
    </FlexColumn>
  );
}

export default Account;
