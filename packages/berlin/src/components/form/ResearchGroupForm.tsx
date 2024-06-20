// React and third-party libraries
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

// Components
import { Form } from '../containers/Form.styled';
import Button from '../button';
import Input from '../input';
import { FlexRow } from '../containers/FlexRow.styled';

type ResearchGroupFormProps = {
  formData: {
    input: {
      placeholder: string;
      requiredMessage: string;
    };
    buttonText: string;
  };
  handleCreateGroup: (name: string) => void;
  setGroupName: React.Dispatch<React.SetStateAction<string | null>>;
};

export function ResearchGroupForm({
  formData,
  handleCreateGroup,
  setGroupName,
}: ResearchGroupFormProps) {
  const researchGroupSchema = z.object({
    name: z.string().min(2, { message: formData.input.requiredMessage }),
  });
  const {
    formState: { errors, isValid },
    getValues,
    handleSubmit,
    register,
    reset,
  } = useForm<z.infer<typeof researchGroupSchema>>({
    defaultValues: { name: '' },
    resolver: zodResolver(researchGroupSchema),
  });

  const onSubmit = () => {
    if (isValid) {
      handleCreateGroup(getValues('name'));
      setGroupName(getValues('name'));
      reset();
    }
  };

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <Input
        placeholder={formData.input.placeholder}
        autoComplete="off"
        {...register('name', {
          required: formData.input.requiredMessage,
        })}
        errors={errors?.name?.message ? [errors.name.message] : []}
        required
      />
      <FlexRow $justify="flex-end">
        <Button type="submit">{formData.buttonText}</Button>
      </FlexRow>
    </Form>
  );
}
