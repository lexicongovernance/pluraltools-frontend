// React and third-party libraries
import { Controller, useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';

// API
import { postUserToGroups } from 'api';

// Data
import publicGroups from '../data/publicGroups';

// Components
import { Body } from '../components/typography/Body.styled';
import { FlexColumn } from '../components/containers/FlexColum.styled';
import { Form } from '../components/containers/Form.styled';
import { Subtitle } from '../components/typography/Subtitle.styled';
import Button from '../components/button';
import Select from '../components/select';

const groupsData = [
  {
    id: 'polis',
    name: 'Polis',
  },
  {
    id: 'test',
    name: 'Test',
  },
];

function PublicGroupRegistration() {
  const queryClient = useQueryClient();

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

  const { mutate: postUserToGroupsMutation } = useMutation({
    mutationFn: postUserToGroups,
    onSuccess: (body) => {
      if (!body) {
        return;
      }
      queryClient.invalidateQueries({ queryKey: ['user', 'groups'] });
      toast.success(`Joined ${getValues('group')} group succesfully!`);
    },
    onError: () => {
      toast.error('Something went wrong.');
    },
  });

  const onSubmit = () => {
    if (isValid) {
      postUserToGroupsMutation({ groupId: 'id' });
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
          rules={{ required: 'Public group is required' }}
          render={({ field }) => (
            <Select
              label="Public group"
              placeholder={field.value ? field.value : 'Select a public group'}
              options={groupsData}
              value={field.value}
              errors={[errors.group?.message ?? '']}
              onBlur={field.onBlur}
              onChange={field.onChange}
              required
            />
          )}
        />
        <Button type="submit">Join public group</Button>
      </Form>
    </FlexColumn>
  );
}

export default PublicGroupRegistration;
