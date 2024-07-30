import { Controller, FieldValues, Path, UseFormReturn } from 'react-hook-form';
import Select from '../select';

export function FormSelectInput<T extends FieldValues>(props: {
  form: UseFormReturn<T>;
  name: Path<T>;
  label: string;
  required: boolean | null;
  options: { name: string; value: string }[];
}) {
  return (
    <Controller
      name={props.name}
      control={props.form.control}
      rules={{ required: props.required ? 'Value is required' : false }}
      render={({ field }) => (
        <Select
          label={props.label}
          placeholder="Choose a value"
          required={!!props.required}
          options={props.options.map((option) => ({ id: option.value, name: option.name }))}
          errors={
            props.form.formState.errors[props.name]?.message
              ? [props.form.formState.errors[props.name]?.message?.toString() ?? '']
              : undefined
          }
          onBlur={field.onBlur}
          onChange={(val) => field.onChange(val)}
          value={field.value ?? undefined}
        />
      )}
    />
  );
}
