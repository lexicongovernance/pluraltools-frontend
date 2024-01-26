import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import fetchGroups from '../api/fetchGroups';
import fetchUserAttributes from '../api/fetchUserAttributes';
import fetchUserGroups from '../api/fetchUserGroups';
import updateUserData from '../api/updateUserData';
import Button from '../components/button';
import Chip from '../components/chip';
import ErrorText from '../components/form/ErrorText';
import Input from '../components/form/Input';
import Select from '../components/form/Select';
import Label from '../components/typography/Label';
import Title from '../components/typography/Title';
import useUser from '../hooks/useUser';
import { FlexColumn, FlexRow } from '../layout/Layout.styled';
import { useAppStore } from '../store';

// const ACADEMIC_CREDENTIALS = ['Bachelors', 'Masters', 'PhD', 'JD', 'None', 'Other'];

function Account() {
  const { user } = useUser();
  const userStatus = useAppStore((state) => state.userStatus);
  const setUserStatus = useAppStore((state) => state.setUserStatus);

  const navigate = useNavigate();

  const queryClient = useQueryClient();

  const { data: groups } = useQuery({
    queryKey: ['groups'],
    queryFn: fetchGroups,
    staleTime: 10000,
    retry: false,
  });

  const { data: userGroups } = useQuery({
    queryKey: ['user', user?.id, 'groups'],
    queryFn: () => fetchUserGroups(user?.id || ''),
    enabled: !!user?.id,
    staleTime: 10000,
    retry: false,
  });

  const { data: userAttributes } = useQuery({
    queryKey: ['user', user?.id, 'attributes'],
    queryFn: () => fetchUserAttributes(user?.id || ''),
    enabled: !!user?.id,
    retry: false,
  });

  const { mutate: mutateUserData } = useMutation({
    mutationFn: updateUserData,
    onSuccess: (body) => {
      if (body) {
        queryClient.invalidateQueries({ queryKey: ['user'] });
        queryClient.invalidateQueries({ queryKey: ['user-groups'] });
      }
    },
    onError: () => {
      toast.error('There was an error, please try again.');
    },
  });

  const initialUser = {
    username: user?.username || '',
    email: user?.email || '',
    group: (userGroups && userGroups[0]?.id) || '',
    userAttributes: userAttributes?.reduce(
      (acc, curr) => {
        acc[curr.attributeKey] = curr.attributeValue;
        return acc;
      },
      {
        institution: '',
        publications: '',
        'academic-credentials': '',
      } as Record<string, string>
    ),
  };

  const {
    register,
    formState: { errors, isValid },
    getValues,
    handleSubmit,
  } = useForm({
    defaultValues: initialUser,
    mode: 'onBlur',
  });

  // const form = useForm({
  //   defaultValues: ,
  //   onSubmit: ({ value }) => {
  //     if (user && user.id) {
  //       mutateUserData({
  //         userId: user.id,
  //         username: value.username,
  //         email: value.email,
  //         groupIds: [value.group],
  //         userAttributes: value.userAttributes ?? {},
  //       });

  //       toast.success('User data updated!');

  //       if (userStatus === 'INCOMPLETE') {
  //         setUserStatus('COMPLETE');
  //         navigate('/events');
  //       }
  //     }
  //   },
  // });

  const onSubmit = (value: typeof initialUser) => {
    if (user && user.id) {
      mutateUserData({
        userId: user.id,
        username: value.username,
        email: value.email,
        groupIds: [value.group],
        userAttributes: value.userAttributes ?? {},
      });

      toast.success('User data updated!');

      if (userStatus === 'INCOMPLETE') {
        setUserStatus('COMPLETE');
        navigate('/events');
      }
    }
  };

  const userRegistered = userGroups && userGroups?.length > 0;

  const isEqual = JSON.stringify(getValues()) === JSON.stringify(initialUser);

  return (
    <FlexColumn>
      <FlexRow $justifyContent="space-between">
        <Title>{userRegistered ? 'Your Account' : 'Complete your profile'}</Title>
        {userRegistered && <Chip>Registered</Chip>}
      </FlexRow>
      <form onSubmit={handleSubmit(onSubmit)}>
        <FlexColumn>
          <FlexColumn $gap="0.5rem">
            <Label $required>Username</Label>
            <Input {...register('username')} />
            <ErrorText>{errors.username?.message}</ErrorText>
          </FlexColumn>
          <FlexColumn $gap="0.5rem">
            <Label>Email</Label>
            <Input {...register('email')} />
            <ErrorText>{errors.email?.message}</ErrorText>
          </FlexColumn>

          <FlexColumn $gap="0.5rem">
            <Label $required>Affiliation</Label>
            <Select {...register('group')} defaultValue={''}>
              <option value="" disabled>
                Please choose an affiliation
              </option>
              {groups?.map((group) => (
                <option key={group.id} value={group.id}>
                  {group.name}
                </option>
              ))}
            </Select>
            <ErrorText>{errors.group?.message}</ErrorText>
          </FlexColumn>
          <FlexRow $alignSelf="flex-end">
            <Button type="submit" disabled={isEqual || !isValid}>
              Submit
            </Button>
          </FlexRow>
        </FlexColumn>
      </form>
    </FlexColumn>
  );
}

export default Account;
