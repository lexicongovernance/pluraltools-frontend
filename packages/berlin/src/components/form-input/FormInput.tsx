import { FieldValues, Path, UseFormReturn } from 'react-hook-form';
import { SelectInput } from './FormSelectInput';
import { TextAreaInput } from './FormTextAreaInput';
import { TextInput } from './FormTextInput';
import { NumberInput } from './FormNumberInput';

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
        <TextInput
          form={props.form}
          name={props.name}
          label={props.label}
          required={props.required}
        />
      );
    case 'TEXTAREA':
      return (
        <TextAreaInput
          form={props.form}
          name={props.name}
          label={props.label}
          required={props.required}
        />
      );
    case 'SELECT':
      return (
        <SelectInput
          form={props.form}
          name={props.name}
          label={props.label}
          required={props.required}
          options={props.options ?? []}
        />
      );
    case 'NUMBER':
      return (
        <NumberInput
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
