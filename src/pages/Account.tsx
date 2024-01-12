import { useForm } from '@tanstack/react-form';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { zodValidator } from '@tanstack/zod-form-adapter';
import { z } from 'zod';
import fetchGroups from '../api/fetchGroups';
import updateUserData from '../api/updateUserData';
import Button from '../components/button';
import ErrorText from '../components/form/ErrorText';
import Input from '../components/form/Input';
import Label from '../components/form/Label';
import Select from '../components/form/Select';
import useUser from '../hooks/useUser';
import { FlexColumn, FlexRow } from '../layout/Layout.styled';

function Account() {
  const queryClient = useQueryClient();
  const { user } = useUser();

  const form = useForm({
    defaultValues: {
      username: '',
      email: '',
      group: '',
    },
    onSubmit: ({ value }) => {
      if (user?.id) {
        mutateUserData({
          userId: user?.id,
          username: value.username,
          email: value.email,
          groupIds: [value.group],
        });
      }
    },
  });

  const { Provider, Field, Subscribe } = form;

  const { data: groups } = useQuery({
    queryKey: ['groups'],
    queryFn: fetchGroups,
    staleTime: 10000,
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
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    e.stopPropagation();
    void form.handleSubmit();
  };

  return (
    <FlexColumn>
      <h2>Finish your registration</h2>
      <Provider>
        <form onSubmit={(e) => handleSubmit(e)}>
          <FlexColumn>
            <Field
              name="username"
              validatorAdapter={zodValidator}
              validators={{
                onChange: z
                  .string()
                  .min(3, { message: 'Username must be 3 characters or longer.' }),
              }}
              children={(field) => (
                <FlexColumn $gap="0.5rem">
                  <Label required>Username</Label>
                  <Input
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                  />
                  <ErrorText>{field.state.meta.errors}</ErrorText>
                </FlexColumn>
              )}
            />
            <Field
              name="email"
              children={(field) => (
                <FlexColumn $gap="0.5rem">
                  <Label>Email</Label>
                  <Input
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                  />
                  <ErrorText>{field.state.meta.errors}</ErrorText>
                </FlexColumn>
              )}
            />
            <Field
              name="group"
              validatorAdapter={zodValidator}
              validators={{
                onChange: z.string().min(1, { message: 'Please select a value.' }),
              }}
              children={(field) => (
                <FlexColumn $gap="0.5rem">
                  <Label required>Group</Label>
                  <Select
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                  >
                    <option value="" disabled>
                      Please choose a group
                    </option>
                    {groups?.map((group) => (
                      <option key={group.id} value={group.id}>
                        {group.name}
                      </option>
                    ))}
                  </Select>
                  <ErrorText>{field.state.meta.errors}</ErrorText>
                </FlexColumn>
              )}
            />
            <FlexRow $alignSelf="flex-end">
              <Subscribe
                selector={(state) => [state.canSubmit]}
                children={([canSubmit]) => (
                  <Button type="submit" disabled={!canSubmit}>
                    Submit
                  </Button>
                )}
              />
            </FlexRow>
          </FlexColumn>
        </form>
      </Provider>
    </FlexColumn>
  );
}

export default Account;
