import styled from 'styled-components';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const StyledTextarea = styled.textarea`
  background-color: #3b3b3b;
  border-radius: 0.5rem;
  border: 1px solid #ccc;
  height: 12rem;
  padding: 0.75rem 1rem;
  resize: none;
  width: 100%;

  &:disabled {
    background-color: #3b3b3b4d;
    border: 1px solid #ccc;
    cursor: not-allowed;
  }
`;

function Textarea({ ...props }: TextareaProps) {
  return <StyledTextarea {...props} />;
}

export default Textarea;
