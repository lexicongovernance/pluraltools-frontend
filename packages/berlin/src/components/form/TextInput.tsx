import { Controller, FieldValues, Path, UseFormReturn } from 'react-hook-form';
import Input from '../input';

export function TextInput<T extends FieldValues>(props: {
  form: UseFormReturn<T>;
  name: Path<T>;
  label: string;
  required: boolean | null;
  placeholder?: string;
  customValidation?: (value: string) => string | undefined;
}) {
  return (
    <Controller
      name={props.name}
      control={props.form.control}
      rules={{
        required: props.required ? `${props.label} is required` : false,
        validate: props.customValidation,
      }}
      render={({ field }) => (
        <Input
          type="text"
          label={props.label}
          required={!!props.required}
          placeholder={props.placeholder ?? 'Please enter a value'}
          errors={
            props.form.formState.errors[props.name]
              ? [props.form.formState.errors[props.name]?.message?.toString() ?? '']
              : []
          }
          value={field.value ?? undefined}
          onBlur={field.onBlur}
          onChange={field.onChange}
        />
      )}
    />
  );
}
