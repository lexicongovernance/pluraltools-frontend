// React and third-party libraries
import { Controller, useForm } from 'react-hook-form';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import toast from 'react-hot-toast';

// Hooks
import useUser from '../hooks/useUser';

// API
import { fetchGroups, postUserToGroups } from 'api';

// Data
import publicGroups from '../data/publicGroups';

// Components
import { Body } from '../components/typography/Body.styled';
import { FlexColumn } from '../components/containers/FlexColum.styled';
import { Form } from '../components/containers/Form.styled';
import { Subtitle } from '../components/typography/Subtitle.styled';
import Button from '../components/button';
import Select from '../components/select';

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

  const selectData = groups?.map((group) => ({ id: group.id, name: group.name })) ?? [];

  const { mutate: postUserToGroupsMutation } = useMutation({
    mutationFn: postUserToGroups,
    onSuccess: (body) => {
      if (!body) {
        return;
      }
      queryClient.invalidateQueries({ queryKey: ['user', 'groups'] });
      toast.success(`Joined ${groupCategoryNameParam} group succesfully!`);
    },
    onError: () => {
      toast.error('Something went wrong.');
    },
  });

  const onSubmit = () => {
    if (isValid) {
      postUserToGroupsMutation({ groupId: getValues('group') });
      setValue('group', '');
      reset();
    }
  };

  return (
    <FlexColumn $gap="1.5rem">
      <Subtitle>{publicGroups.copy.subtitle}</Subtitle>
      <Body>{publicGroups.copy.body}</Body>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Controller
          name="group"
          control={control}
          rules={{
            required: `${capitalizedParam} group is required`,
          }}
          render={({ field }) => (
            <Select
              label={`${capitalizedParam} group`}
              placeholder={field.value ? field.value : `Select a ${groupCategoryNameParam} group`}
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
