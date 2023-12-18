import styled from 'styled-components';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {}

const StyledSelect = styled.select`
  appearance: none;
  background-image: url('/arrow_down.svg');
  background-position: right 0.75rem top 50%;
  background-repeat: no-repeat;
  background-size: 1.5rem;
  border-radius: 0.5rem;
  border: 1px solid #ccc;
  padding: 0.75rem 1rem;
  width: 100%;

  &:disabled {
    background-color: #3b3b3b4d;
    border: 1px solid #ccc;
    cursor: not-allowed;
  }
`;

function Select({ ...props }: SelectProps) {
  return <StyledSelect {...props} />;
}

export default Select;
