import React from 'react';
import styled from 'styled-components';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  // Add any additional props specific to your Textarea component
}

const StyledTextarea = styled.textarea`
  border-radius: 0.5rem;
  border: 1px solid #ccc;
  height: 12rem;
  padding: 10px;
  resize: none;
  width: 100%;
`;

function Textarea({ ...props }: TextareaProps) {
  return <StyledTextarea {...props} />;
}

export default Textarea;
