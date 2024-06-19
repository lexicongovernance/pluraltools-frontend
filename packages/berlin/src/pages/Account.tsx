import { useState } from 'react';
import { AccountForm } from '../components/form/AccountForm';
import { Title } from '../components/typography/Title.styled';
import useUser from '../hooks/useUser';
import { FlexColumn } from '../components/containers/FlexColumn.styled';
import { FlexRow } from '../components/containers/FlexRow.styled';
import { TabManager } from '../components/tab-manager';
import { Edit, X } from 'lucide-react';
import { GetUserResponse } from 'api';
import { Subtitle } from '../components/typography/Subtitle.styled';
import { Separator } from '../components/separator';
import { Body } from '../components/typography/Body.styled';

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
        afterSubmit={() => {
          setTab('view');
        }}
      />
    ),
    view: <AccountHub user={user} />,
  };

  return (
    <FlexColumn>
      <FlexRow $justify="flex-end">
        {tab === 'view' ? (
          <Edit
            onClick={() => {
              setTab('edit');
            }}
          />
        ) : (
          <X
            onClick={() => {
              setTab('view');
            }}
          />
        )}
      </FlexRow>
      <TabManager tabs={tabs} tab={tab} fallback={<Title>Tab not found</Title>} />
    </FlexColumn>
  );
}

function AccountHub({ user }: { user: GetUserResponse | null | undefined }) {
  return (
    <FlexColumn>
      <Subtitle>
        {user?.firstName} {user?.lastName}
      </Subtitle>
      <Body>@{user?.username}</Body>
      <Body>{user?.email}</Body>
      <Separator />
    </FlexColumn>
  );
}

export default Account;
