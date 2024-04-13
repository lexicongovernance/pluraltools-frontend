// React and third-party libraries
import { useForm } from 'react-hook-form';

// Data
import groups from '../data/groups';

// Components
import { Body } from '../components/typography/Body.styled';
import { FlexColumn } from '../components/containers/FlexColum.styled';
import { FlexRowToColumn } from '../components/containers/FlexRowToColumn.styled';
import { Form } from '../components/containers/Form.styled';
import { Subtitle } from '../components/typography/Subtitle.styled';
import Button from '../components/button';
import Divider from '../components/divider';
import Input from '../components/input';

function GroupRegistration() {
  const {
    handleSubmit,
    register,
    formState: { errors, isValid },
    getValues,
    reset,
  } = useForm({ defaultValues: { code: '' } });

  const onSubmit = () => {
    if (isValid) {
      console.log('@code:', getValues('code'));
      reset();
    }
  };

  return (
    <FlexRowToColumn $gap="2rem">
      <FlexColumn>
        <Subtitle>{groups.create.subtitle}</Subtitle>
        {groups.create.body.map(({ id, text }) => (
          <Body key={id}>{text}</Body>
        ))}
        <Button>{groups.create.buttonText}</Button>
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
            {...register('code', { required: groups.join.input.requiredMessage })}
            errors={errors?.code?.message ? [errors.code.message] : []}
            required
          />
          <Button type="submit">{groups.join.buttonText}</Button>
        </Form>
      </FlexColumn>
    </FlexRowToColumn>
  );
}

export default GroupRegistration;
