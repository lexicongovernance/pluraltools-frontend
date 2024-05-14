// React and third-party libraries
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';

// API
import { deleteUsersToGroups, fetchUsersToGroups } from 'api';

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
import { useMemo } from 'react';

function GroupsTable({ groupCategoryName }: { groupCategoryName?: string | null }) {
  const { user } = useUser();
  const queryClient = useQueryClient();
  const theme = useAppStore((state) => state.theme);

  const { data: usersToGroups } = useQuery({
    queryFn: () => fetchUsersToGroups(user?.id || ''),
    queryKey: ['users-to-groups', user?.id],
    enabled: !!user?.id,
  });

  const { mutate } = useMutation({
    mutationFn: deleteUsersToGroups,
    onSuccess: (body) => {
      if (body) {
        queryClient.invalidateQueries({ queryKey: ['users-to-groups', user?.id] });
      }
    },
  });

  const handleCopyButtonClick = (secretCode: string) => {
    navigator.clipboard.writeText(secretCode);
    toast.success(`Secret code ${secretCode} copied to clipboard`);
  };

  const groupsInCategory = useMemo(
    () =>
      usersToGroups?.filter(
        (userToGroup) => userToGroup.group.groupCategory?.name === groupCategoryName,
      ),
    [usersToGroups, groupCategoryName],
  );

  return groupsInCategory?.map((userToGroup) => (
    <Card>
      <Group>{userToGroup.group.name}</Group>
      {userToGroup.group.secret ? (
        <FlexRow>
          <Secret>{userToGroup.group.secret}</Secret>
          <IconButton
            onClick={() => handleCopyButtonClick(userToGroup.group.secret!)}
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
        description={`This action cannot be undone. This will remove you from group ${userToGroup.group.name}.`}
        onActionClick={() => mutate({ userToGroupId: userToGroup.id })}
        actionButtonText="Leave group"
      />
    </Card>
  ));
}

export default GroupsTable;
