import { useState } from 'react';
import { Dropdown, Option, SearchInput, SelectContainer } from './Select.styled';

type SelectProps = {
  options: string[];
  placeholder: string;
};

function Select({ options, placeholder }: SelectProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOption, setSelectedOption] = useState<string | undefined>(undefined);
  const [creatableOption, setCreatableOption] = useState<string>('');

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const inputText = event.target.value;
    setSearchTerm(inputText);

    if (!options.find((option) => option.toLowerCase() === inputText.toLowerCase())) {
      setCreatableOption(inputText);
    } else {
      setCreatableOption('');
    }
  };

  const handleInputFocus = () => {
    setIsDropdownOpen(true);
  };

  const handleInputBlur = () => {
    setTimeout(() => {
      setIsDropdownOpen(false);
    }, 200);
  };

  const handleOptionClick = (option: string) => {
    setSearchTerm('');
    setCreatableOption('');
    setSelectedOption(option);
    setIsDropdownOpen(false);
  };

  return (
    <SelectContainer>
      <SearchInput
        type="text"
        placeholder={selectedOption || placeholder}
        value={searchTerm}
        onChange={handleSearchChange}
        onFocus={handleInputFocus}
        onBlur={handleInputBlur}
      />
      {isDropdownOpen && (
        <Dropdown>
          {options
            .filter((option) => option.toLowerCase().includes(searchTerm.toLowerCase()))
            .map((option, idx) => (
              <Option key={idx} onClick={() => handleOptionClick(option)}>
                {option}
              </Option>
            ))}
          {creatableOption && (
            <Option onClick={() => handleOptionClick(creatableOption)}>
              Create "{creatableOption}"
            </Option>
          )}
        </Dropdown>
      )}
    </SelectContainer>
  );
}

export default Select;
