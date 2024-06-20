// React and third-party libraries
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import toast from 'react-hot-toast';

// API
import {
  deleteUsersToGroups,
  fetchGroupMembers,
  GetUsersToGroupsResponse,
  fetchGroupRegistrations,
} from 'api';

// Hooks
import { useAppStore } from '../../../store';
import useUser from '../../../hooks/useUser';

// Components
import { Card, Group, GroupProposal, Secret } from './GroupsTable.styled';
import Button from '../../button';
import Dialog from '../../dialog';
import IconButton from '../../icon-button';
import { Body } from '../../typography/Body.styled';
import { FlexRow } from '../../containers/FlexRow.styled';
import { FlexColumn } from '../../containers/FlexColumn.styled';
import { Bold } from '../../typography/Bold.styled';

interface GroupCardProps {
  userToGroup: GetUsersToGroupsResponse[0];
  theme: 'dark' | 'light';
  onLeaveGroup: (userToGroupId: string) => void;
}

function GroupCard({ userToGroup, theme, onLeaveGroup }: GroupCardProps) {
  const [expanded, setExpanded] = useState(false);

  const { data: groupMembers } = useQuery({
    queryKey: ['group', userToGroup.group.id, 'users-to-groups'],
    queryFn: () => fetchGroupMembers(userToGroup.group.id),
    enabled: !!userToGroup.group.id,
  });

  const { data: groupRegistrations } = useQuery({
    queryKey: ['group', userToGroup.group.id, 'group-registrations'],
    queryFn: () => fetchGroupRegistrations(userToGroup.group.id || ''),
    enabled: !!userToGroup.group.id,
  });

  const handleCopyButtonClick = (secretCode: string) => {
    navigator.clipboard.writeText(secretCode);
    toast.success(`Secret code ${secretCode} copied to clipboard`);
  };

  const flattenedRegistrations = groupRegistrations?.flatMap(
    (groupRegistration) => groupRegistration.registrations,
  );

  const proposals = flattenedRegistrations?.map((registration) => {
    const title = registration.registrationData.find(
      (item) => item.registrationField.fieldDisplayRank === 0,
    )?.value;

    const description = registration.registrationData.find(
      (item) => item.registrationField.fieldDisplayRank === 1,
    )?.value;

    return { id: registration.id, userId: registration.userId, title, description };
  });

  const getLeadAuthor = (userId: string) => {
    return groupMembers?.find((member) => member.id === userId);
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
      <FlexRow>
        <Body>
          {groupMembers?.map((member) => `${member.firstName} ${member.lastName}`).join(', ')}
        </Body>
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
        trigger={
          <Button disabled $alignSelf="flex-start">
            Leave
          </Button>
        }
        title="Are you sure?"
        description={`This action cannot be undone. This will remove you from group ${userToGroup.group.name}.`}
        onActionClick={() => onLeaveGroup(userToGroup.id)}
        actionButtonText="Leave group"
      />
      <FlexColumn className="description" $gap="1.5rem">
        {proposals && proposals.length > 0 ? (
          proposals.map(({ id, title, description, userId }) => (
            <GroupProposal key={id}>
              <Body>
                <Bold>Lead Author:</Bold>{' '}
                {getLeadAuthor(userId)
                  ? `${getLeadAuthor(userId)?.firstName} ${getLeadAuthor(userId)?.lastName}`
                  : 'Anonymous'}
              </Body>
              <Body>
                <Bold>Title:</Bold> {title}
              </Body>
              <Body>
                <Bold>Description:</Bold> {description}
              </Body>
            </GroupProposal>
          ))
        ) : (
          <Body>This group currently has no proposals</Body>
        )}
      </FlexColumn>
    </Card>
  );
}

function GroupsTable({ groupsInCategory }: { groupsInCategory?: GetUsersToGroupsResponse }) {
  const { user } = useUser();
  const queryClient = useQueryClient();
  const theme = useAppStore((state) => state.theme);

  const { mutate } = useMutation({
    mutationFn: deleteUsersToGroups,
    onSuccess: (body) => {
      if (body) {
        if ('errors' in body) {
          toast.error(body.errors[0]);
          return;
        }

        queryClient.invalidateQueries({ queryKey: ['user', user?.id, 'users-to-groups'] });
      }
    },
  });

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
