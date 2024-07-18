import { FieldValues, Path, UseFormReturn } from 'react-hook-form';
import { FormSelectInput } from './FormSelectInput';
import { FormTextAreaInput } from './FormTextAreaInput';
import { FormTextInput } from './FormTextInput';
import { FormNumberInput } from './FormNumberInput';

export function FormInput<T extends FieldValues>(props: {
  form: UseFormReturn<T>;
  name: Path<T>;
  label: string;
  options?: { name: string; value: string }[];
  required: boolean | null;
  type: string;
}) {
  switch (props.type) {
    case 'TEXT':
      return (
        <FormTextInput
          form={props.form}
          name={props.name}
          label={props.label}
          required={props.required}
        />
      );
    case 'TEXTAREA':
      return (
        <FormTextAreaInput
          form={props.form}
          name={props.name}
          label={props.label}
          required={props.required}
        />
      );
    case 'SELECT':
      return (
        <FormSelectInput
          form={props.form}
          name={props.name}
          label={props.label}
          required={props.required}
          options={props.options ?? []}
        />
      );
    case 'NUMBER':
      return (
        <FormNumberInput
          form={props.form}
          name={props.name}
          label={props.label}
          required={props.required}
        />
      );
    default:
      return <></>;
  }
}
