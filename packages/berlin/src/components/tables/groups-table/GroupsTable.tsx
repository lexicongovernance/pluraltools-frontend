// React and third-party libraries
import { useQuery } from '@tanstack/react-query';
import toast from 'react-hot-toast';

// API
import { fetchUserGroups } from 'api';

// Hooks
import { useAppStore } from '../../../store';
import useUser from '../../../hooks/useUser';

// Components
import { Card, Group, Secret } from './GroupsTable.styled';
import { FlexRow } from '../../containers/FlexRow.styled';
import Button from '../../button';
import Dialog from '../../dialog';
import IconButton from '../../icon-button';
import { Body } from '../../typography/Body.styled';

function GroupsTable() {
  const { user } = useUser();
  const theme = useAppStore((state) => state.theme);

  const { data: groups } = useQuery({
    queryFn: () => fetchUserGroups(user?.id || ''),
    queryKey: ['groups', user?.id],
    enabled: !!user?.id,
  });

  const handleCopyButtonClick = (secretCode: string) => {
    navigator.clipboard.writeText(secretCode);
    toast.success(`Secret code ${secretCode} copied to clipboard`);
  };

  return groups?.map((group) => (
    <Card>
      <Group>{group.name}</Group>
      {group.secret ? (
        <FlexRow>
          <Secret>{group.secret}</Secret>
          <IconButton
            onClick={() => handleCopyButtonClick(group.secret!)}
            icon={{ src: `/icons/copy-${theme}.svg`, alt: 'Copy icon' }}
            $color="secondary"
            $padding={4}
          />
        </FlexRow>
      ) : (
        <Body>No secret</Body>
      )}
      <Dialog
        trigger={<Button>Leave</Button>}
        title="Are you sure?"
        description={`This action cannot be undone. This will remove you from group ${group.name}.`}
        onActionClick={() => alert('Hello world')} // TODO
        actionButtonText="Leave group"
      />
    </Card>
  ));
}

export default GroupsTable;
