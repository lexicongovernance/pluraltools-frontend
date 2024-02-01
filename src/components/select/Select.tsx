import { useState } from 'react';
import { Dropdown, ForwardedSearchInput, Option, SelectContainer } from './Select.styled';

type SelectProps = {
  options: { name: string; id: string }[];
  placeholder: string;
  onChange?: (option: string) => void;
  onBlur?: () => void;
  onOptionCreate?: (option: string) => void;
  // value can be either the id of the option or the name of the option
  value?: string;
};

function Select({ options, placeholder, onChange, onOptionCreate, value, onBlur }: SelectProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState(options.find((o) => o.name === value)?.name ?? '');
  const [selectedOption, setSelectedOption] = useState<string | undefined>(
    options.find((o) => o.id === value)?.name
  );
  const [creatableOption, setCreatableOption] = useState<string>('');

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
    <SelectContainer>
      <ForwardedSearchInput
        type="text"
        placeholder={selectedOption || placeholder}
        value={searchTerm}
        onFocus={handleInputFocus}
        onChange={handleSearchChange}
        onBlur={handleInputBlur}
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
    </SelectContainer>
  );
}

export default Select;
