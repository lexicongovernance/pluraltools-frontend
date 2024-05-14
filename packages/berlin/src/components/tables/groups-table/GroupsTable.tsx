// React and third-party libraries
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useMemo, useState } from 'react';
import toast from 'react-hot-toast';

// API
import {
  deleteUsersToGroups,
  fetchUsersToGroups,
  fetchGroupMembers,
  GetUsersToGroupsResponse,
} from 'api';

// Hooks
import { useAppStore } from '../../../store';
import useUser from '../../../hooks/useUser';

// Components
import { Card, Group, Secret } from './GroupsTable.styled';
import Button from '../../button';
import Dialog from '../../dialog';
import IconButton from '../../icon-button';
import { Body } from '../../typography/Body.styled';
import { FlexRow } from '../../containers/FlexRow.styled';
import { FlexColumn } from '../../containers/FlexColum.styled';
import { Bold } from '../../typography/Bold.styled';

interface GroupCardProps {
  userToGroup: GetUsersToGroupsResponse[0];
  theme: 'dark' | 'light';
  onLeaveGroup: (userToGroupId: string) => void;
}

function GroupCard({ userToGroup, theme, onLeaveGroup }: GroupCardProps) {
  const [expanded, setExpanded] = useState(false);

  const { data: groupMembers } = useQuery({
    queryKey: ['group-members', userToGroup.group.id],
    queryFn: () => fetchGroupMembers('eaee6e5e-42e8-4cfd-a5e7-4d31bd812908'),
    enabled: !!userToGroup.group.id,
  });

  const handleCopyButtonClick = (secretCode: string) => {
    navigator.clipboard.writeText(secretCode);
    toast.success(`Secret code ${secretCode} copied to clipboard`);
  };

  return (
    <Card key={userToGroup.id} $expanded={expanded}>
      <FlexRow>
        <IconButton
          $padding={4}
          $color="secondary"
          onClick={() => setExpanded((e) => !e)}
          icon={{ src: `/icons/arrow-down-${theme}.svg`, alt: '' }}
          $flipVertical={expanded}
        />
        <Group>{userToGroup.group.name}</Group>
      </FlexRow>
      {userToGroup.group.secret ? (
        <FlexRow>
          <Secret>{userToGroup.group.secret}</Secret>
          <IconButton
            onClick={() => handleCopyButtonClick(userToGroup.group.secret || '')}
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
        onActionClick={() => onLeaveGroup(userToGroup.id)}
        actionButtonText="Leave group"
      />
      <FlexColumn className="description" $gap="1.5rem">
        <Body>
          <Bold>Group members:</Bold> {groupMembers?.map((member) => member.username)}
        </Body>
        <Body>More details here...</Body>
      </FlexColumn>
    </Card>
  );
}

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

  const groupsInCategory = useMemo(
    () =>
      usersToGroups?.filter(
        (userToGroup) => userToGroup.group.groupCategory?.name === groupCategoryName,
      ),
    [usersToGroups, groupCategoryName],
  );

  return groupsInCategory?.map((userToGroup) => (
    <GroupCard
      key={userToGroup.id}
      userToGroup={userToGroup}
      theme={theme}
      onLeaveGroup={(userToGroupId) => mutate({ userToGroupId })}
    />
  ));
}

export default GroupsTable;
