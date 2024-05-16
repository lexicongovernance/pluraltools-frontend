// React and third-party libraries
import { useForm } from 'react-hook-form';
import { useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';

// API
import { postUsersToGroups, fetchGroupCategories, postGroup } from 'api';

// Data
import groups from '../data/groups';

// Components
import { Body } from '../components/typography/Body.styled';
import { FlexColumn } from '../components/containers/FlexColum.styled';
import { FlexRowToColumn } from '../components/containers/FlexRowToColumn.styled';
import { Form } from '../components/containers/Form.styled';
import { Subtitle } from '../components/typography/Subtitle.styled';
import Button from '../components/button';
import Dialog from '../components/dialog';
import Divider from '../components/divider';
import Input from '../components/input';
import ResearchGroupForm from '../components/research-group-form';
import SecretCode from '../components/secret-code';
import GroupsColumns from '../components/columns/groups-columns';
import GroupsTable from '../components/tables/groups-table';
import useUser from '../hooks/useUser';

function SecretGroupRegistration() {
  const queryClient = useQueryClient();
  const { user } = useUser();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [secretCode, setSecretCode] = useState<string | null>(null);
  const [groupName, setGroupName] = useState<string | null>(null);
  const [searchParams] = useSearchParams();
  const groupCategoryNameParam = searchParams.get('groupCategory');

  const secretGroupRegistrationSchema = z.object({
    secret: z.string().refine((val) => /^(\w{3,})-(\w{3,})-(\w{3,})$/.test(val), {
      message:
        'Secret must be in the format word-word-word, with each word having at least 3 characters',
    }),
  });
  const {
    formState: { errors, isValid },
    getValues,
    handleSubmit,
    register,
    reset,
  } = useForm<z.infer<typeof secretGroupRegistrationSchema>>({
    defaultValues: { secret: '' },
    resolver: zodResolver(secretGroupRegistrationSchema),
  });

  const { data: groupCategories } = useQuery({
    queryKey: ['group-categories'],
    queryFn: fetchGroupCategories,
  });

  const { mutate: postGroupMutation } = useMutation({
    mutationFn: postGroup,
    onSuccess: (body) => {
      if (body) {
        queryClient.invalidateQueries({ queryKey: ['user', user?.id, 'users-to-groups'] });
        toast.success(`Group ${groupName} created successfully!`);
        toast.success(`Joined group ${groupName} successfully!`);
        setIsDialogOpen(false);
        setSecretCode(body.secret);
      }
    },
    onError: () => {
      toast.error(`There was an error creating the group. Please try again.`);
      setIsDialogOpen(false);
    },
  });

  const { mutate: postUsersToGroupsMutation } = useMutation({
    mutationFn: postUsersToGroups,
    onSuccess: (body) => {
      if (!body) {
        return;
      }

      if ('errors' in body) {
        toast.error(body.errors[0]);
        return;
      }

      queryClient.invalidateQueries({ queryKey: ['user', user?.id, 'users-to-groups'] });
      toast.success(`Joined ${groupName} group successfully!`);
    },
    onError: () => {
      toast.error('Secret is not valid');
    },
  });

  const groupCategoryId = useMemo(() => {
    return groupCategories?.find(
      (groupCategory) =>
        groupCategory.name?.toLowerCase() === groupCategoryNameParam?.toLowerCase(),
    )?.id;
  }, [groupCategoryNameParam, groupCategories]);

  const onSubmit = () => {
    if (isValid) {
      postUsersToGroupsMutation({ secret: getValues('secret') });
      reset();
    }
  };

  const handleCreateGroup = (name: string) => {
    postGroupMutation({ name, groupCategoryId: groupCategoryId || '' });
  };

  return (
    <FlexColumn>
      <FlexRowToColumn $gap="2rem">
        <FlexColumn>
          <Subtitle>{groups.create.subtitle}</Subtitle>
          {groups.create.body.map(({ id, text }) => (
            <Body key={id}>{text}</Body>
          ))}
          {groupName && secretCode && <SecretCode groupName={groupName} secretCode={secretCode} />}
          <Dialog
            open={isDialogOpen}
            onOpenChange={setIsDialogOpen}
            trigger={
              <Button onClick={() => setIsDialogOpen(true)}>{groups.create.buttonText}</Button>
            }
            content={
              <ResearchGroupForm
                formData={groups.create.dialog.form}
                handleCreateGroup={handleCreateGroup}
                setGroupName={setGroupName}
              />
            }
            dialogButtons={false}
          />
        </FlexColumn>
        <Divider $height={330} />
        <FlexColumn>
          <Subtitle>{groups.join.subtitle}</Subtitle>
          {groups.join.body.map(({ id, text }) => (
            <Body key={id}>{text}</Body>
          ))}
          <Form onSubmit={handleSubmit(onSubmit)}>
            <Input
              label={groups.join.input.label}
              placeholder={groups.join.input.placeholder}
              autoComplete="off"
              {...register('secret', { required: groups.join.input.requiredMessage })}
              errors={errors?.secret?.message ? [errors.secret.message] : []}
              required
            />
            <Button type="submit">{groups.join.buttonText}</Button>
          </Form>
        </FlexColumn>
      </FlexRowToColumn>
      <Subtitle>Your groups</Subtitle>
      <GroupsColumns />
      <GroupsTable groupCategoryName={groupCategoryNameParam} />
    </FlexColumn>
  );
}

export default SecretGroupRegistration;
