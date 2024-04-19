import { useEffect, useState } from 'react';
import {
  Dropdown,
  ErrorsContainer,
  ForwardedSearchInput,
  LabelContainer,
  Option,
  SelectContainer,
} from './Select.styled';
import Label from '../typography/Label';
import { useAppStore } from '../../store';
import { Error } from '../typography/Error.styled';

type SelectProps = {
  label?: string;
  required?: boolean;
  options: { name: string; id: string }[];
  placeholder: string;
  errors?: string[];
  onChange?: (option: string) => void;
  onBlur?: () => void;
  onOptionCreate?: (option: string) => void;
  value?: string;
  $minWidth?: string;
};

function Select({
  label,
  required,
  options,
  placeholder,
  errors,
  onChange,
  onOptionCreate,
  value,
  onBlur,
  $minWidth,
}: SelectProps) {
  const theme = useAppStore((state) => state.theme);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState(options.find((o) => o.name === value)?.name ?? '');
  const [selectedOption, setSelectedOption] = useState<string | undefined>(
    options.find((o) => o.id === value)?.name,
  );
  const [creatableOption, setCreatableOption] = useState<string>('');

  useEffect(() => {
    if (value) {
      setSelectedOption(options.find((o) => o.id === value)?.name);
    }

    return () => {
      setSelectedOption('');
      setSearchTerm('');
    };
  }, [value, options]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const inputText = event.target.value;
    setSearchTerm(inputText);

    if (!options.find((option) => option.name.toLowerCase() === inputText.toLowerCase())) {
      setCreatableOption(inputText);
    } else {
      setCreatableOption('');
    }
  };

  const handleInputFocus = () => {
    setSearchTerm('');
    setIsDropdownOpen(true);
  };

  const handleInputBlur = () => {
    setTimeout(() => {
      setIsDropdownOpen(false);
    }, 200);
    onBlur?.();
  };

  const handleOptionClick = (option: { id: string; name: string }) => {
    setSearchTerm('');
    setCreatableOption('');
    setSelectedOption(option.name);
    setIsDropdownOpen(false);
    onChange?.(option.id);
  };

  const handleOptionCreate = (option: { id: string; name: string }) => {
    setSearchTerm('');
    setCreatableOption('');
    setSelectedOption(option.name);
    setIsDropdownOpen(false);
    onOptionCreate?.(option.id);
  };

  return (
    <SelectContainer $minWidth={$minWidth}>
      {label && (
        <LabelContainer>
          <Label $required={required}>{label}</Label>{' '}
        </LabelContainer>
      )}
      <ForwardedSearchInput
        type="text"
        placeholder={selectedOption || placeholder}
        value={searchTerm}
        onFocus={handleInputFocus}
        onChange={handleSearchChange}
        onBlur={handleInputBlur}
        $theme={theme}
      />
      {isDropdownOpen && (
        <Dropdown>
          {options
            .filter((option) => option.name.toLowerCase().includes(searchTerm.toLowerCase()))
            .map((option, idx) => (
              <Option key={idx} onClick={() => handleOptionClick(option)}>
                {option.name}
              </Option>
            ))}
          {creatableOption && onOptionCreate && (
            <Option
              onClick={() => handleOptionCreate({ name: creatableOption, id: creatableOption })}
            >
              Create "{creatableOption}"
            </Option>
          )}
        </Dropdown>
      )}
      {errors && errors?.length > 0 && errors[0] !== '' && (
        <ErrorsContainer $gap="0.25rem">
          {errors.map((error, i) => (
            <Error key={i}>{error}</Error>
          ))}
        </ErrorsContainer>
      )}
    </SelectContainer>
  );
}

export default Select;
