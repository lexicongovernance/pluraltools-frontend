import styled from 'styled-components';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const StyledInput = styled.input`
  border-radius: 0.5rem;
  border: 1px solid #ccc;
  padding: 0.75rem;
  width: 100%;
`;

function Input({ ...props }: InputProps) {
  return <StyledInput {...props} />;
}

export default Input;
