// React and third-party libraries
import { Controller, useForm } from 'react-hook-form';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import toast from 'react-hot-toast';

// Hooks
import useUser from '../hooks/useUser';

// API
import { fetchGroups, postUsersToGroups, fetchUsersToGroups, putUsersToGroups } from 'api';

// Components
import { FlexColumn } from '../components/containers/FlexColum.styled';
import { Form } from '../components/containers/Form.styled';
import Button from '../components/button';
import Select from '../components/select';
import { useMemo } from 'react';

function PublicGroupRegistration() {
  const { user } = useUser();
  const queryClient = useQueryClient();
  const [searchParams] = useSearchParams();
  const groupCategoryNameParam = searchParams.get('groupCategory');

  const capitalizedParam =
    groupCategoryNameParam &&
    groupCategoryNameParam?.slice(0, 1).toUpperCase() + groupCategoryNameParam?.slice(1);

  const {
    control,
    getValues,
    setValue,
    formState: { errors, isValid },
    handleSubmit,
    reset,
  } = useForm({
    defaultValues: { group: '' },
  });

  const { data: groups } = useQuery({
    queryKey: ['group-categories', groupCategoryNameParam, 'groups'],
    queryFn: () => fetchGroups({ groupCategoryName: groupCategoryNameParam || '' }),
    enabled: !!user?.id && !!groupCategoryNameParam,
  });

  const { data: usersToGroups } = useQuery({
    queryKey: ['user', user?.id, 'groups'],
    queryFn: () => fetchUsersToGroups(user?.id || ''),
    enabled: !!user?.id,
  });

  const selectData = [
    ...(groups
      ?.map((group) => ({ id: group.id, name: group.name }))
      // sort name
      .sort((a, b) => {
        // check if name is number
        if (!isNaN(a.name as unknown as number) && !isNaN(b.name as unknown as number)) {
          return (a.name as unknown as number) - (b.name as unknown as number);
        }
        // compare alphabetically
        return (a.name as string).localeCompare(b.name as string);
      }) ?? []),
  ];

  const prevUserToGroup = useMemo(
    () =>
      usersToGroups?.find(
        (userToGroup) => userToGroup.group.groupCategory?.name === groupCategoryNameParam,
      ),
    [usersToGroups, groupCategoryNameParam],
  );

  const { mutate: postUsersToGroupsMutation } = useMutation({
    mutationFn: postUsersToGroups,
    onSuccess: (body) => {
      if (!body) {
        return;
      }
      queryClient.invalidateQueries({ queryKey: ['user', user?.id, 'groups'] });
      toast.success(`Joined ${groupCategoryNameParam} group successfully!`);
    },
    onError: () => {
      toast.error('Something went wrong.');
    },
  });

  const { mutate: putUsersToGroupsMutation } = useMutation({
    mutationFn: putUsersToGroups,
    onSuccess: (body) => {
      if (!body) {
        return;
      }
      queryClient.invalidateQueries({ queryKey: ['user', user?.id, 'groups'] });
      toast.success(`Updated ${groupCategoryNameParam} group successfully!`);
    },
    onError: () => {
      toast.error('Something went wrong.');
    },
  });

  const onSubmit = () => {
    if (isValid) {
      // If the user is already in the category group, update the userToGroup
      if (prevUserToGroup) {
        putUsersToGroupsMutation({
          userToGroupId: prevUserToGroup.id,
          groupId: getValues('group'),
        });
        setValue('group', '');
        reset();
        return;
      }

      // If the user is not in the category group, create a new userToGroup
      postUsersToGroupsMutation({ groupId: getValues('group') });
      setValue('group', '');
      reset();
    }
  };

  return (
    <FlexColumn $gap="1.5rem">
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Controller
          name="group"
          control={control}
          rules={{
            required: `${capitalizedParam} group is required`,
          }}
          render={({ field }) => (
            <Select
              placeholder={
                prevUserToGroup
                  ? prevUserToGroup.group.name
                  : `Select your ${groupCategoryNameParam} group`
              }
              options={selectData}
              value={field.value}
              errors={[errors.group?.message ?? '']}
              onBlur={field.onBlur}
              onChange={field.onChange}
              required
            />
          )}
        />
        <Button type="submit">Join {groupCategoryNameParam} group</Button>
      </Form>
    </FlexColumn>
  );
}

export default PublicGroupRegistration;
