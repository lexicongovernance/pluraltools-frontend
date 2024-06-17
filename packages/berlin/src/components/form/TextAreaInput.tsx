import { Controller, FieldValues, Path, UseFormReturn } from 'react-hook-form';
import Textarea from '../textarea';

export function TextAreaInput<T extends FieldValues>(props: {
  form: UseFormReturn<T>;
  name: Path<T>;
  label: string;
  required: boolean | null;
  customValidation?: (value: number) => string | undefined;
}) {
  const handleChange = (
    val: string,
    onSuccess: (val: string) => void,
    onFailure: (errorMsg: string) => void,
  ) => {
    if (props.customValidation) {
      const customError = props.customValidation(Number(val));
      if (customError) {
        onFailure(customError);
        return;
      }
    }
    onSuccess(val);
  };

  return (
    <Controller
      name={props.name}
      control={props.form.control}
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
          onChange={(e) =>
            handleChange(e.target.value, field.onChange, (err) => {
              props.form.setError(props.name, { message: err });
            })
          }
        />
      )}
    />
  );
}
