import styled from 'styled-components';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const StyledInput = styled.input`
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

function Input({ ...props }: InputProps) {
  return <StyledInput {...props} />;
}

export default Input;
