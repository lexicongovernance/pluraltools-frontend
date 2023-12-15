import styled from 'styled-components';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const StyledTextarea = styled.textarea`
  border-radius: 0.5rem;
  border: 1px solid #ccc;
  height: 12rem;
  padding: 0.75rem;
  resize: none;
  width: 100%;
`;

function Textarea({ ...props }: TextareaProps) {
  return <StyledTextarea {...props} />;
}

export default Textarea;
