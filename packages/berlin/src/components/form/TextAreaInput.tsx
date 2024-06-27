import { Controller, FieldValues, Path, UseFormReturn } from 'react-hook-form';
import Textarea from '../textarea';

export function TextAreaInput<T extends FieldValues>(props: {
  form: UseFormReturn<T>;
  name: Path<T>;
  label: string;
  required: boolean | null;
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
        <Textarea
          label={props.label}
          required={!!props.required}
          placeholder="Enter a value"
          errors={
            props.form.formState.errors[props.name]
              ? [props.form.formState.errors[props.name]?.message?.toString() ?? '']
              : []
          }
          value={field.value ?? undefined}
          onChange={field.onChange}
          onBlur={field.onBlur}
        />
      )}
    />
  );
}
